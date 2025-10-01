import { pgTable, text, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  youtubeUrl: varchar('youtube_url', { length: 500 }).notNull(),
  spotifyUrl: varchar('spotify_url', { length: 500 }).notNull(),
  trackName: varchar('track_name', { length: 200 }),
  artistName: varchar('artist_name', { length: 200 }),
  albumName: varchar('album_name', { length: 200 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
});

export const insertConversionSchema = createInsertSchema(conversions).pick({
  youtubeUrl: true,
}) as unknown as z.ZodType<any, any, any>;

export const convertUrlSchema = z.object({
  youtubeUrl: z
    .string({
      required_error: 'YouTube Music URL is required',
    })
    .min(1, 'Please enter a YouTube Music URL')
    .url('Please enter a valid URL format (starting with https://)')
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === 'music.youtube.com';
        } catch {
          return false;
        }
      },
      {
        message:
          'URL must be from music.youtube.com (not youtube.com or other domains)',
      },
    )
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          if (urlObj.pathname === '/watch' && urlObj.searchParams.has('v'))
            return true;
          if (
            urlObj.pathname === '/playlist' &&
            urlObj.searchParams.has('list')
          )
            return true;
          return false;
        } catch {
          return false;
        }
      },
      {
        message:
          'URL must be a valid track (/watch?v=...) or playlist (/playlist?list=...)',
      },
    ),
});

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

export interface YouTubeTrackInfo {
  trackName: string;
  artistName: string;
  thumbnailUrl: string;
  originalTitle: string;
}
