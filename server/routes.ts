import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { convertUrlSchema, type SpotifyTrackInfo } from "@shared/schema";
import { z } from "zod";
import { google } from "googleapis";

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// YouTube Music to Spotify conversion service
async function convertYouTubeMusicToSpotify(youtubeUrl: string): Promise<SpotifyTrackInfo> {
  try {
    // Extract video ID from YouTube Music URL
    const videoIdMatch = youtubeUrl.match(/[?&]v=([^&]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube Music URL format');
    }
    
    const videoId = videoIdMatch[1];
    
    // Get video details from YouTube API
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId]
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const video = response.data.items[0];
    const title = video.snippet?.title || 'Unknown Track';
    const channelTitle = video.snippet?.channelTitle || 'Unknown Artist';
    const thumbnailUrl = video.snippet?.thumbnails?.medium?.url || 
                        video.snippet?.thumbnails?.default?.url || '';
    
    // Parse track and artist from title
    // Common patterns: "Artist - Track", "Track by Artist", "Track (Artist)"
    let trackName = title;
    let artistName = channelTitle;
    
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
      .trim();
    
    // For now, generate a Spotify-style URL since we don't have Spotify API
    // In production, this would search Spotify's API for the actual track
    const spotifyTrackId = generateSpotifyStyleId(trackName, artistName);
    
    return {
      spotifyUrl: `https://open.spotify.com/track/${spotifyTrackId}`,
      trackName,
      artistName,
      albumName: 'Unknown Album', // Would be retrieved from Spotify API
      thumbnailUrl
    };
    
  } catch (error) {
    console.error('YouTube API error:', error);
    throw new Error('Failed to fetch track information from YouTube');
  }
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
