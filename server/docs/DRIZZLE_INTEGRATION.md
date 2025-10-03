# Drizzle ORM Integration Documentation

## Overview

This document describes the integration of Drizzle ORM into the Linkfy NestJS backend for PostgreSQL database operations with Supabase.

## Architecture

### Before Integration

```
┌─────────────────────────────────────┐
│         NestJS Backend              │
│                                     │
│  ┌────────────────────────────┐    │
│  │   StorageService           │    │
│  │   (In-Memory Map)          │    │
│  └────────────────────────────┘    │
│           ↑                         │
│           │                         │
│  ┌────────────────────────────┐    │
│  │   ConversionService        │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │   SupabaseService          │    │
│  │   (Auth + Direct Queries)  │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

### After Integration

```
┌──────────────────────────────────────────┐
│         NestJS Backend                   │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │   StorageService                │    │
│  │   (Drizzle ORM CRUD)           │    │
│  └──────────────┬──────────────────┘    │
│                 │                        │
│  ┌──────────────▼──────────────────┐    │
│  │   DatabaseService               │    │
│  │   (Drizzle ORM Connection)     │    │
│  └──────────────┬──────────────────┘    │
│                 │                        │
│                 ▼                        │
│       PostgreSQL (Supabase)             │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │   SupabaseService               │    │
│  │   (Auth Only)                   │    │
│  └─────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

## Key Components

### 1. DatabaseModule (`src/database/database.module.ts`)

- **Type**: Global NestJS Module
- **Purpose**: Provides database access across the entire application
- **Exports**: `DatabaseService`

```typescript
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

### 2. DatabaseService (`src/database/database.service.ts`)

- **Type**: Injectable NestJS Service
- **Purpose**: Manages Drizzle ORM connection lifecycle
- **Features**:
  - Initializes Neon serverless PostgreSQL connection
  - Configures WebSocket for serverless environments
  - Provides typed database instance
  - Gracefully handles missing configuration
  - Verifies connection on module initialization

```typescript
@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: ReturnType<typeof drizzle>;
  
  constructor() {
    // Initialize Neon connection with Drizzle
  }
  
  getDb() {
    return this.db;
  }
}
```

### 3. Updated StorageService (`src/services/storage.service.ts`)

- **Before**: In-memory Map storage
- **After**: Persistent PostgreSQL storage via Drizzle ORM
- **Interface**: Unchanged (maintains backwards compatibility)

#### Migration Summary

| Operation | Before | After |
|-----------|--------|-------|
| **getConversion** | `Map.get()` | `db.select().from().where()` |
| **getConversionByYoutubeUrl** | `Array.find()` | `db.select().from().where()` |
| **createConversion** | `Map.set()` | `db.insert().values().returning()` |

## Database Schema

Defined in `shared/schema.ts`:

```typescript
export const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  youtubeUrl: varchar('youtube_url', { length: 500 }).notNull(),
  spotifyUrl: varchar('spotify_url', { length: 500 }).notNull(),
  trackName: varchar('track_name', { length: 200 }),
  artistName: varchar('artist_name', { length: 200 }),
  albumName: varchar('album_name', { length: 200 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
});
```

## Configuration

### Environment Variables

```env
# Required for database operations
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Supabase pooler (recommended for production)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Supabase direct connection (for migrations)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Drizzle Configuration

Located in `server/drizzle.config.ts`:

```typescript
export default defineConfig({
  out: './migrations',
  schema: './shared/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

## Database Operations

### Query Examples

#### Select with Filter

```typescript
const db = this.databaseService.getDb();
const results = await db
  .select()
  .from(conversions)
  .where(eq(conversions.id, id))
  .limit(1);
```

#### Insert with Returning

```typescript
const results = await db
  .insert(conversions)
  .values({
    youtubeUrl: 'https://music.youtube.com/watch?v=xyz',
    spotifyUrl: 'https://open.spotify.com/track/abc',
    trackName: 'Song Name',
    artistName: 'Artist Name',
    albumName: 'Album Name',
    thumbnailUrl: 'https://example.com/thumb.jpg',
  })
  .returning();
```

#### Update

```typescript
await db
  .update(conversions)
  .set({ trackName: 'New Name' })
  .where(eq(conversions.id, id));
```

#### Delete

```typescript
await db
  .delete(conversions)
  .where(eq(conversions.id, id));
```

## Migrations

### Initial Migration

Location: `server/migrations/0000_initial_schema.sql`

```sql
CREATE TABLE IF NOT EXISTS "conversions" (
  "id" SERIAL PRIMARY KEY,
  "youtube_url" VARCHAR(500) NOT NULL,
  "spotify_url" VARCHAR(500) NOT NULL,
  "track_name" VARCHAR(200),
  "artist_name" VARCHAR(200),
  "album_name" VARCHAR(200),
  "thumbnail_url" VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS "conversions_youtube_url_idx" 
  ON "conversions" ("youtube_url");
```

### Running Migrations

```bash
# Push schema to database
cd server
yarn nest:db:push

# Generate migrations from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push
```

## Testing

### Test Coverage

- **DatabaseService**: 3 tests
  - Service initialization
  - Database instance provision
  - Module initialization without errors
  
- **StorageService**: 7 tests
  - getConversion success/not found
  - getConversionByYoutubeUrl success/not found
  - createConversion

- **Integration**: Tests use mocked database for isolation

### Running Tests

```bash
cd server
yarn nest:test           # Run all tests
yarn nest:test:watch     # Watch mode
yarn nest:test:cov       # With coverage
```

## Benefits

1. **Type Safety**: Full TypeScript type inference from schema
2. **Performance**: Lightweight ORM with minimal overhead (~7KB minified)
3. **Developer Experience**: Excellent autocomplete and type checking
4. **Serverless Ready**: Optimized for edge functions with Neon driver
5. **Migration Support**: Built-in migration generation and management
6. **SQL Access**: Direct SQL queries when needed for complex operations
7. **Flexibility**: Easy to extend with custom queries

## Comparison: Drizzle vs Supabase Client

| Feature | Drizzle ORM | Supabase Client |
|---------|-------------|-----------------|
| Type Safety | ✅ Full inference | ⚠️ Manual types |
| Performance | ✅ ~7KB | ⚠️ ~50KB+ |
| SQL Flexibility | ✅ Direct access | ❌ Limited |
| Migrations | ✅ Built-in | ⚠️ Separate tool |
| Learning Curve | ⚠️ SQL knowledge | ✅ Simple API |
| Edge Functions | ✅ Optimized | ✅ Supported |

## Separation of Concerns

- **DatabaseService**: Database operations (Drizzle ORM)
- **SupabaseService**: Authentication and user management (Supabase Client)

Both services coexist and serve different purposes. Supabase is still used for:
- User authentication (Google OAuth)
- Session management
- Auth guards and decorators

## Future Enhancements

1. **Connection Pooling**: Implement pgBouncer for production
2. **Query Optimization**: Add indexes based on query patterns
3. **Caching Layer**: Add Redis for frequently accessed data
4. **Read Replicas**: Support read/write splitting for scale
5. **Query Builder Extensions**: Custom helpers for common patterns
6. **Migration Automation**: Auto-run migrations on deployment

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Serverless Driver](https://github.com/neondatabase/serverless)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- [NestJS Providers](https://docs.nestjs.com/providers)
