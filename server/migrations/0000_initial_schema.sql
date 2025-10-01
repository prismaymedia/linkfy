-- Create conversions table
CREATE TABLE IF NOT EXISTS "conversions" (
  "id" SERIAL PRIMARY KEY,
  "youtube_url" VARCHAR(500) NOT NULL,
  "spotify_url" VARCHAR(500) NOT NULL,
  "track_name" VARCHAR(200),
  "artist_name" VARCHAR(200),
  "album_name" VARCHAR(200),
  "thumbnail_url" VARCHAR(500)
);

-- Create index on youtube_url for faster lookups
CREATE INDEX IF NOT EXISTS "conversions_youtube_url_idx" ON "conversions" ("youtube_url");
