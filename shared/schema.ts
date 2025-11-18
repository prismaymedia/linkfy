import { pgTable, text, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  youtubeUrl: varchar('youtube_url', { length: 500 }).notNull(),
  spotifyUrl: varchar('spotify_url', { length: 500 }).notNull(),
  deezerUrl: varchar('deezer_url', { length: 500 }).notNull(),
  appleUrl: varchar('apple_url', { length: 500 }).notNull(),
  trackName: varchar('track_name', { length: 200 }),
  artistName: varchar('artist_name', { length: 200 }),
  albumName: varchar('album_name', { length: 200 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
});

export const insertConversionSchema = createInsertSchema(conversions).pick({
  youtubeUrl: true,
  spotifyUrl: true,
  deezerUrl: true,
  appleUrl: true,
}) as unknown as z.ZodType<any, any, any>;

import { urlSchema } from '../server/src/utils/url-sanitizer';

export const convertUrlSchema = z.object({
  url: urlSchema,
  targetPlatform: z.enum(['spotify', 'deezer', 'apple']).default('spotify'),
});

export const detectPlatform = (
  url: string,
): 'youtube' | 'spotify' | 'deezer' | 'apple' | 'unknown' => {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');

    if (host.includes('youtube') || host === 'youtu.be') {
      return 'youtube';
    }
    if (host.includes('spotify') || url.startsWith('spotify:')) {
      return 'spotify';
    }
    if (host.includes('deezer')) {
      return 'deezer';
    }
    if (host.includes('apple') || host.includes('itunes')) {
      return 'apple';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
};

export type InsertConversion = z.infer<typeof insertConversionSchema>;
export type Conversion = typeof conversions.$inferSelect;
export type ConvertUrlRequest = z.infer<typeof convertUrlSchema>;

export interface SpotifyTrackInfo {
  spotifyUrl: string;
  trackName: string;
  artistName: string;
  albumName: string;
  thumbnailUrl: string;
}

type YouTubeTrack = Omit<PlaylistTrack, 'position'>;

export type YouTubeTrackInfo =
  | ({ type: 'track' } & YouTubeTrack)
  | ({
    type: 'playlist' | 'album';
    playlistTitle: string;
    tracks: PlaylistTrack[];
  });

export interface PlaylistTrack {
  videoId: string;
  trackName: string;
  artistName: string;
  thumbnailUrl: string;
  originalTitle: string;
  position: number;
}

export interface PlaylistTrackConverted extends PlaylistTrack {
  spotifyUrl: string | null;
  converted: boolean;
  error?: string;
}

export interface PlaylistInfo {
  playlistTitle: string;
  playlistDescription: string;
  tracks: PlaylistTrack[];
  totalTracks: number;
}

export interface PlaylistConversionResult {
  type: 'playlist';
  playlistTitle: string;
  playlistDescription: string;
  totalTracks: number;
  convertedTracks: number;
  failedTracks: number;
  tracks: PlaylistTrackConverted[];
}