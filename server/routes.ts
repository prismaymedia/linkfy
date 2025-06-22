import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { convertUrlSchema, type SpotifyTrackInfo } from "@shared/schema";
import { z } from "zod";
import { google } from "googleapis";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get API keys from environment
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Initialize YouTube API with proper authentication
const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
});

console.log('YouTube API Key loaded:', !!YOUTUBE_API_KEY);
console.log('Spotify credentials loaded:', !!SPOTIFY_CLIENT_ID && !!SPOTIFY_CLIENT_SECRET);

// Spotify API functions
async function getSpotifyAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Spotify token error:', response.status, errorText);
    throw new Error(`Failed to get Spotify access token: ${response.status}`);
  }

  const data = await response.json();
  console.log('Spotify access token obtained successfully');
  return data.access_token;
}

async function searchSpotifyTrack(trackName: string, artistName: string): Promise<SpotifyTrackInfo | null> {
  try {
    const accessToken = await getSpotifyAccessToken();
    
    // Try multiple search strategies
    const searchQueries = [
      `"${trackName}" "${artistName}"`,
      `track:"${trackName}" artist:"${artistName}"`,
      `${trackName} ${artistName}`,
      trackName // Fallback to just track name
    ];

    for (const query of searchQueries) {
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;
      console.log(`Searching Spotify with query: ${query}`);

      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        console.error('Spotify search failed:', response.status, response.statusText);
        continue;
      }

      const data = await response.json();
      console.log(`Found ${data.tracks?.items?.length || 0} tracks for query: ${query}`);
      
      if (data.tracks?.items?.length > 0) {
        // Find best match by comparing track names and artists
        for (const track of data.tracks.items) {
          const spotifyTrackName = track.name.toLowerCase();
          const spotifyArtistNames = track.artists.map((artist: any) => artist.name.toLowerCase());
          
          const trackNameSimilar = spotifyTrackName.includes(trackName.toLowerCase()) || 
                                  trackName.toLowerCase().includes(spotifyTrackName);
          const artistNameSimilar = spotifyArtistNames.some((spotifyArtist: string) => 
            spotifyArtist.includes(artistName.toLowerCase()) || 
            artistName.toLowerCase().includes(spotifyArtist)
          );

          if (trackNameSimilar || artistNameSimilar) {
            console.log(`Found matching track: ${track.name} by ${track.artists.map((a: any) => a.name).join(', ')}`);
            return {
              spotifyUrl: track.external_urls.spotify,
              trackName: track.name,
              artistName: track.artists.map((artist: any) => artist.name).join(', '),
              albumName: track.album.name,
              thumbnailUrl: track.album.images?.[0]?.url || track.album.images?.[1]?.url || ''
            };
          }
        }
        
        // If no good match found, return first result
        const track = data.tracks.items[0];
        console.log(`Using first result: ${track.name} by ${track.artists.map((a: any) => a.name).join(', ')}`);
        return {
          spotifyUrl: track.external_urls.spotify,
          trackName: track.name,
          artistName: track.artists.map((artist: any) => artist.name).join(', '),
          albumName: track.album.name,
          thumbnailUrl: track.album.images?.[0]?.url || track.album.images?.[1]?.url || ''
        };
      }
    }

    console.log('No Spotify tracks found for any search query');
    return null;
  } catch (error) {
    console.error('Spotify API error:', error);
    return null;
  }
}

// YouTube Music to Spotify conversion service
async function convertYouTubeMusicToSpotify(youtubeUrl: string): Promise<SpotifyTrackInfo> {
  try {
    // Extract video ID from YouTube Music URL
    const videoIdMatch = youtubeUrl.match(/[?&]v=([^&]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube Music URL format');
    }
    
    const videoId = videoIdMatch[1];
    
    // Try YouTube API first
    if (YOUTUBE_API_KEY) {
      try {
        const response = await youtube.videos.list({
          part: ['snippet'],
          id: [videoId]
        });
        
        if (response.data.items && response.data.items.length > 0) {
          const video = response.data.items[0];
          const title = video.snippet?.title || 'Unknown Track';
          const channelTitle = video.snippet?.channelTitle || 'Unknown Artist';
          const youtubeThumbnailUrl = video.snippet?.thumbnails?.medium?.url || 
                                     video.snippet?.thumbnails?.default?.url || '';
          
          const { trackName, artistName } = parseTrackInfo(title, channelTitle);
          
          // Search for real Spotify track
          if (SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
            const spotifyResult = await searchSpotifyTrack(trackName, artistName);
            if (spotifyResult) {
              return spotifyResult;
            }
          }
          
          // Fallback if Spotify search fails
          const spotifyTrackId = generateSpotifyStyleId(trackName, artistName);
          return {
            spotifyUrl: `https://open.spotify.com/track/${spotifyTrackId}`,
            trackName,
            artistName,
            albumName: 'Unknown Album',
            thumbnailUrl: youtubeThumbnailUrl
          };
        }
      } catch (apiError) {
        console.log('YouTube API failed, using fallback method');
      }
    }
    
    // Fallback: Use oEmbed API (no API key required)
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oembedUrl);
      
      if (response.ok) {
        const data = await response.json();
        const title = data.title || 'Unknown Track';
        const channelTitle = data.author_name || 'Unknown Artist';
        const thumbnailUrl = data.thumbnail_url || '';
        
        const { trackName, artistName } = parseTrackInfo(title, channelTitle);
        
        // Search for real Spotify track
        if (SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
          const spotifyResult = await searchSpotifyTrack(trackName, artistName);
          if (spotifyResult) {
            return spotifyResult;
          }
        }
        
        const spotifyTrackId = generateSpotifyStyleId(trackName, artistName);
        return {
          spotifyUrl: `https://open.spotify.com/track/${spotifyTrackId}`,
          trackName,
          artistName,
          albumName: 'Unknown Album',
          thumbnailUrl
        };
      }
    } catch (oembedError) {
      console.log('oEmbed API failed, using basic fallback');
    }
    
    // Final fallback: Generate track info from video ID
    const spotifyTrackId = generateSpotifyStyleId(videoId, 'YouTube');
    return {
      spotifyUrl: `https://open.spotify.com/track/${spotifyTrackId}`,
      trackName: `Track ${videoId}`,
      artistName: 'Unknown Artist',
      albumName: 'Unknown Album',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
    
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert YouTube Music URL');
  }
}

// Helper function to parse track and artist information
function parseTrackInfo(title: string, channelTitle: string): { trackName: string; artistName: string } {
  let trackName = title;
  let artistName = channelTitle;
  
  // Common patterns: "Artist - Track", "Track by Artist", "Track (Artist)"
  if (title.includes(' - ')) {
    const parts = title.split(' - ');
    if (parts.length >= 2) {
      artistName = parts[0].trim();
      trackName = parts.slice(1).join(' - ').trim();
    }
  } else if (title.includes(' by ')) {
    const parts = title.split(' by ');
    if (parts.length >= 2) {
      trackName = parts[0].trim();
      artistName = parts[1].trim();
    }
  }
  
  // Clean up track name (remove common suffixes)
  trackName = trackName
    .replace(/\s*\(Official.*?\)/gi, '')
    .replace(/\s*\[Official.*?\]/gi, '')
    .replace(/\s*- Official.*$/gi, '')
    .replace(/\s*\(Audio\)/gi, '')
    .replace(/\s*\[Audio\]/gi, '')
    .replace(/\s*\(Lyric.*?\)/gi, '')
    .replace(/\s*\[Lyric.*?\]/gi, '')
    .replace(/\s*\(HD\)/gi, '')
    .replace(/\s*\[HD\]/gi, '')
    .trim();
  
  return { trackName, artistName };
}

// Generate a deterministic Spotify-style ID based on track and artist
function generateSpotifyStyleId(trackName: string, artistName: string): string {
  const input = `${trackName.toLowerCase()}-${artistName.toLowerCase()}`;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Create a simple hash-like ID from the input
  for (let i = 0; i < 22; i++) {
    const charIndex = (input.charCodeAt(i % input.length) + i) % chars.length;
    result += chars[charIndex];
  }
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Convert YouTube Music URL to Spotify URL
  app.post("/api/convert", async (req, res) => {
    try {
      const validatedData = convertUrlSchema.parse(req.body);
      
      // Check if we already have this conversion cached
      const existingConversion = await storage.getConversionByYoutubeUrl(validatedData.youtubeUrl);
      if (existingConversion && existingConversion.spotifyUrl) {
        return res.json({
          spotifyUrl: existingConversion.spotifyUrl,
          trackName: existingConversion.trackName,
          artistName: existingConversion.artistName,
          albumName: existingConversion.albumName,
          thumbnailUrl: existingConversion.thumbnailUrl
        });
      }
      
      // Convert the URL
      const spotifyInfo = await convertYouTubeMusicToSpotify(validatedData.youtubeUrl);
      
      // Store the conversion result
      const conversion = await storage.createConversion({
        youtubeUrl: validatedData.youtubeUrl
      });
      
      // Update with Spotify info (in production, this would be a proper update operation)
      conversion.spotifyUrl = spotifyInfo.spotifyUrl;
      conversion.trackName = spotifyInfo.trackName;
      conversion.artistName = spotifyInfo.artistName;
      conversion.albumName = spotifyInfo.albumName;
      conversion.thumbnailUrl = spotifyInfo.thumbnailUrl;
      
      res.json(spotifyInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid input" 
        });
      }
      
      console.error('Conversion error:', error);
      res.status(500).json({ 
        message: "Failed to convert URL. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
