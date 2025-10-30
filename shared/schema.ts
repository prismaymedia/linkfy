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

          // Block YouTube channel URLs
          if (
            (normalizedHostname.includes('youtube') ||
              normalizedHostname.includes('youtu.be')) &&
            (pathname.startsWith('/@') || pathname.startsWith('/channel/'))
          ) {
            return false;
          }

          // Normalize pathname by removing trailing slash if it exists
          if (pathname.length > 1 && pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
          }

          // For YouTube URLs, check for valid patterns
          if (normalizedHostname.includes('youtube') || normalizedHostname.includes('youtu.be')) {
            // Video URLs: watch?v=, youtu.be/, embed/, shorts/
            if (pathname === '/watch' && searchParams.has('v')) return true;
            if (normalizedHostname === 'youtu.be' && pathname.length > 1 && pathname.match(/^\/[a-zA-Z0-9_-]+$/)) return true;
            if (pathname.startsWith('/embed/')) return true;
            if (pathname.startsWith('/shorts/')) return true;

            // Playlist URLs
            if (pathname.startsWith('/playlist') && searchParams.has('list')) return true;
            if (pathname === '/watch' && searchParams.has('v') && searchParams.has('list')) return true;

            // Browse URLs (albums)
            if (pathname.startsWith('/browse/')) return true;

            return false;
          }

          // For Spotify URLs
          if (normalizedHostname === 'open.spotify.com') {
            return pathname.match(/^\/(track|album|playlist)\/[a-zA-Z0-9]+$/) !== null;
          }

          return false;
        } catch {
          return false;
        }
      },
      {
        message:
          'URL must be a valid YouTube Music or Spotify track, album, or playlist link.',
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