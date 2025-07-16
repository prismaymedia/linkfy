import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  youtubeUrl: varchar("youtube_url", { length: 500 }).notNull(),
  spotifyUrl: varchar("spotify_url", { length: 500 }).notNull(),
  trackName: varchar("track_name", { length: 200 }),
  artistName: varchar("artist_name", { length: 200 }),
  albumName: varchar("album_name", { length: 200 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
});

export const insertConversionSchema = createInsertSchema(conversions).pick({
  youtubeUrl: true,
});

export const convertUrlSchema = z.object({
  youtubeUrl: z.string()
    .url("Please enter a valid URL")
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          if (urlObj.hostname !== 'music.youtube.com') return false;
          if (urlObj.pathname === '/watch' && urlObj.searchParams.has('v')) return true;
          if (urlObj.pathname === '/playlist' && urlObj.searchParams.has('list')) return true;
          return false;
        } catch {
          return false;
        }
      },
      "Please enter a valid YouTube Music URL"
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
