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

// Create a function to generate the schema with custom validation messages
export const createConvertUrlSchema = (t: (key: string) => string) => z.object({
  youtubeUrl: z
    .string({
      required_error: t('validation.youtubeUrlRequired'),
    })
    .min(1, t('validation.youtubeUrlRequired'))
    .url(t('validation.urlFormat'))
    .refine(
      (url) => {
        // Only allow http and https schemes. Reject ftp, file, etc.
        try {
          const urlObj = new URL(url);
          const protocol = urlObj.protocol.toLowerCase();
          return protocol === 'http:' || protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: t('validation.urlMustStart') },
    )
    .refine(
      (url) => {
        // Accept music.youtube.com, youtube.com, m.youtube.com, www.youtube.com, youtu.be (case-insensitive)
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname.toLowerCase();
          // Allow subdomains like music., m., www.
          const ytHostRegex = /^(?:((?:www|m|music)\.)?youtube\.com|youtu\.be)$/i;
          return ytHostRegex.test(hostname);
        } catch {
          return false;
        }
      },
      {
        message: t('validation.youtubeHost'),
      },
    )
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname || '';
          const hostname = urlObj.hostname.toLowerCase();

          // video by query param: /watch?v=...
          if (urlObj.searchParams.has('v')) return true;

          // playlist or album by list param: /playlist?list=...
          if (urlObj.searchParams.has('list')) return true;

          // youtu.be short URLs: https://youtu.be/{id}
          if (hostname === 'youtu.be' && pathname.replace(/\/*$/, '').length > 1)
            return true;

          // shorts: /shorts/{id}
          if (/^\/shorts\/.+/i.test(pathname)) return true;

          // embed or /v/{id}
          if (/^\/(?:embed|v)\/.+/i.test(pathname)) return true;

          return false;
        } catch {
          return false;
        }
      },
      {
        message: t('validation.youtubePath'),
      },
    ),
});

// Keep the original schema for backward compatibility (with English messages)
export const convertUrlSchema = z.object({
  youtubeUrl: z
    .string({
      required_error: 'YouTube Music URL is required',
    })
    .min(1, 'Please enter a YouTube Music URL')
    .url('Please enter a valid URL format (starting with https://)')
    .refine(
      (url) => {
        // Only allow http and https schemes. Reject ftp, file, etc.
        try {
          const urlObj = new URL(url);
          const protocol = urlObj.protocol.toLowerCase();
          return protocol === 'http:' || protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'URL must start with http:// or https://' },
    )
    .refine(
      (url) => {
        // Accept music.youtube.com, youtube.com, m.youtube.com, www.youtube.com, youtu.be 
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname.toLowerCase();
          // Allow subdomains like music., m., www.
          const ytHostRegex = /^(?:((?:www|m|music)\.)?youtube\.com|youtu\.be)$/i;
          return ytHostRegex.test(hostname);
        } catch {
          return false;
        }
      },
      {
        message:
          'URL must be from YouTube / YouTube Music (music.youtube.com, youtube.com, m.youtube.com or youtu.be)',
      },
    )
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname || '';
          const hostname = urlObj.hostname.toLowerCase();

          // video by query param: /watch?v=...
          if (urlObj.searchParams.has('v')) return true;

          // playlist or album by list param: /playlist?list=...
          if (urlObj.searchParams.has('list')) return true;

          // youtu.be short URLs: https://youtu.be/{id}
          if (hostname === 'youtu.be' && pathname.replace(/\/*$/, '').length > 1)
            return true;

          // shorts: /shorts/{id}
          if (/^\/shorts\/.+/i.test(pathname)) return true;

          // embed or /v/{id}
          if (/^\/(?:embed|v)\/.+/i.test(pathname)) return true;

          return false;
        } catch {
          return false;
        }
      },
      {
        message:
          'URL must point to a valid YouTube video (/watch?v=..., youtu.be/{id}, /shorts/{id}, /embed/{id}) or playlist (/playlist?list=...)',
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
