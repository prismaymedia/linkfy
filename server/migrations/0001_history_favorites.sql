-- Create conversion_history table
CREATE TABLE IF NOT EXISTS "conversion_history" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "source_platform" VARCHAR(32) NOT NULL,
  "source_url" VARCHAR(500) NOT NULL,
  "target_platform" VARCHAR(32),
  "target_url" VARCHAR(500),
  "status" VARCHAR(32) NOT NULL DEFAULT 'pending',
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversion history indexes
CREATE INDEX IF NOT EXISTS "conversion_history_user_created_idx"
  ON "conversion_history" ("user_id", "created_at");

CREATE INDEX IF NOT EXISTS "conversion_history_user_status_idx"
  ON "conversion_history" ("user_id", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "conversion_history_user_source_url_idx"
  ON "conversion_history" ("user_id", "source_url");

-- Create favorites table
CREATE TABLE IF NOT EXISTS "favorites" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "history_id" INTEGER NOT NULL REFERENCES "conversion_history" ("id") ON DELETE CASCADE,
  "track_name" VARCHAR(200),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Favorite indexes
CREATE INDEX IF NOT EXISTS "favorites_user_idx"
  ON "favorites" ("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_history_idx"
  ON "favorites" ("user_id", "history_id");

