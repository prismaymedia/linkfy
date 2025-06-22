import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { convertUrlSchema, type SpotifyTrackInfo } from "@shared/schema";
import { z } from "zod";

// Mock conversion service - In production, this would integrate with Spotify API
async function convertYouTubeMusicToSpotify(youtubeUrl: string): Promise<SpotifyTrackInfo> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Extract video ID from YouTube Music URL
  const videoIdMatch = youtubeUrl.match(/[?&]v=([^&]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
  
  // Mock Spotify track data based on the video ID
  // In production, this would:
  // 1. Extract metadata from YouTube Music
  // 2. Search Spotify API for matching track
  // 3. Return actual Spotify URL and metadata
  
  const mockTracks: Record<string, SpotifyTrackInfo> = {
    'dQw4w9WgXcQ': {
      spotifyUrl: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
      trackName: 'Never Gonna Give You Up',
      artistName: 'Rick Astley',
      albumName: 'Whenever You Need Somebody',
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300'
    },
    'kJQP7kiw5Fk': {
      spotifyUrl: 'https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb',
      trackName: 'Despacito',
      artistName: 'Luis Fonsi ft. Daddy Yankee',
      albumName: 'VIDA',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300'
    }
  };
  
  // Return mock data or default track
  return mockTracks[videoId] || {
    spotifyUrl: `https://open.spotify.com/track/${generateRandomSpotifyId()}`,
    trackName: 'Unknown Track',
    artistName: 'Unknown Artist',
    albumName: 'Unknown Album',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300'
  };
}

function generateRandomSpotifyId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
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
