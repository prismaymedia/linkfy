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
  url: z
    .string({
      required_error: 'Music URL is required',
    })
    .min(1, 'Please enter a valid music URL')
    .url('Please enter a valid URL format (starting with https://)')
    .refine(
      (url) => {
        try {
          let { hostname, pathname, searchParams } = new URL(url);
          const normalizedHostname = hostname.toLowerCase().replace(/^www\./, '');

          // Check if it's a supported domain
          if (
            ![
              'music.youtube.com',
              'youtube.com',
              'youtu.be',
              'm.youtube.com',
              'open.spotify.com',
            ].includes(normalizedHostname)
          ) {
            return false;
          }

          if (
            normalizedHostname.includes('youtube') &&
            (pathname.startsWith('/@') || pathname.startsWith('/channel/'))
          ) {
            return false;
          }

          if (
            normalizedHostname.includes('youtube.com') ||
            normalizedHostname === 'youtu.be'
          ) {
            if (pathname === '/watch' && searchParams.has('v')) return true; // watch?v=
            if (normalizedHostname === 'youtu.be' && /^\/[a-zA-Z0-9_-]+$/.test(pathname)) return true;
            if (pathname.startsWith('/embed/')) return true;
            if (pathname.startsWith('/shorts/')) return true;
            if (pathname.startsWith('/playlist') && searchParams.has('list')) return true;
            return false;
          }

          if (normalizedHostname === 'open.spotify.com') {
            return /^\/(track|album|playlist)\/[a-zA-Z0-9]+$/.test(pathname);
          }

          if (normalizedHostname === 'deezer.com') {
            return /^\/(track|album|playlist)\/[0-9]+$/.test(pathname);
          }

          return false;
        } catch {
          return false;
        }
      },
      {
        message:
          'URL must be a valid YouTube, Spotify, or Deezer track, album, or playlist link.',
      },
    ),

  targetPlatform: z.enum(['spotify', 'deezer', 'apple']),
});

export const detectPlatform = (
  url: string,
): 'youtube' | 'spotify' | 'deezer' | 'unknown' => {
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

export interface YouTubeTrackInfo {
  trackName: string;
  artistName: string;
  thumbnailUrl: string;
  originalTitle: string;
}
