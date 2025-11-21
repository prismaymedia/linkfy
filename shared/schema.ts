import {
  pgTable,
  serial,
  varchar,
  uuid,
  timestamp,
  jsonb,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
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

export const conversionHistory = pgTable(
  'conversion_history',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    sourcePlatform: varchar('source_platform', { length: 32 }).notNull(),
    sourceUrl: varchar('source_url', { length: 500 }).notNull(),
    targetPlatform: varchar('target_platform', { length: 32 }),
    targetUrl: varchar('target_url', { length: 500 }),
    status: varchar('status', { length: 32 }).notNull().default('pending'),
    payload: jsonb('payload')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userCreatedAtIdx: index('conversion_history_user_created_idx').on(
      table.userId,
      table.createdAt,
    ),
    userStatusIdx: index('conversion_history_user_status_idx').on(
      table.userId,
      table.status,
    ),
    userSourceUrlUnique: uniqueIndex(
      'conversion_history_user_source_url_idx',
    ).on(table.userId, table.sourceUrl),
  }),
);

export const favorites = pgTable(
  'favorites',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    historyId: integer('history_id')
      .notNull()
      .references(() => conversionHistory.id, { onDelete: 'cascade' }),
    alias: varchar('track_name', { length: 200 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdx: index('favorites_user_idx').on(table.userId),
    userHistoryUnique: uniqueIndex('favorites_user_history_idx').on(
      table.userId,
      table.historyId,
    ),
  }),
);

export const insertConversionSchema = createInsertSchema(conversions).pick({
  youtubeUrl: true,
  spotifyUrl: true,
  deezerUrl: true,
  appleUrl: true,
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

          if (
            ![
              'music.youtube.com',
              'youtube.com',
              'youtu.be',
              'm.youtube.com',
              'open.spotify.com',
              'deezer.com',
              'link.deezer.com',
              'music.apple.com',
              'itunes.apple.com',
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
            if (pathname === '/watch' && searchParams.has('v')) return true;
            if (normalizedHostname === 'youtu.be' && /^\/[a-zA-Z0-9_-]+$/.test(pathname)) return true;
            if (pathname.startsWith('/embed/')) return true;
            if (pathname.startsWith('/shorts/')) return true;
            if (pathname.startsWith('/playlist') && searchParams.has('list')) return true;
            return false;
          }

          if (normalizedHostname === 'open.spotify.com') {
            return /^\/(track|album|playlist)\/[a-zA-Z0-9]+$/.test(pathname);
          }

          if (normalizedHostname.includes('deezer.com')) {
            if (normalizedHostname === 'link.deezer.com') {
              return /^\/s\/[a-zA-Z0-9]+$/.test(pathname);
            }
            return /^\/(track|album|playlist|artist)\/[0-9]+$/.test(pathname);
          }

          if (normalizedHostname.includes('music.apple.com') || normalizedHostname.includes('itunes.apple.com')) {
            return /^\/([a-z]{2}\/)?(album|song|playlist)\//.test(pathname);
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
export type HistoryEntry = typeof conversionHistory.$inferSelect;
export type InsertHistoryEntry = typeof conversionHistory.$inferInsert;
export type UpdateHistoryEntry = Partial<InsertHistoryEntry>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

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