# Drizzle ORM Quick Start Guide

Quick reference for using Drizzle ORM in the Linkfy backend.

## Setup

### 1. Configure Database URL

Add to `server/.env`:

```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### 2. Run Migrations

```bash
cd server
yarn nest:db:push
```

## Using in Services

### Inject DatabaseService

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { conversions } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class YourService {
  constructor(private readonly databaseService: DatabaseService) {}
  
  async yourMethod() {
    const db = this.databaseService.getDb();
    // Use db here
  }
}
```

## Common Operations

### Select All

```typescript
const db = this.databaseService.getDb();
const results = await db.select().from(conversions);
```

### Select by ID

```typescript
const results = await db
  .select()
  .from(conversions)
  .where(eq(conversions.id, id))
  .limit(1);
  
const conversion = results[0]; // or undefined
```

### Select with Multiple Conditions

```typescript
import { and, eq } from 'drizzle-orm';

const results = await db
  .select()
  .from(conversions)
  .where(
    and(
      eq(conversions.youtubeUrl, url),
      eq(conversions.spotifyUrl, spotifyUrl)
    )
  );
```

### Insert

```typescript
const results = await db
  .insert(conversions)
  .values({
    youtubeUrl: 'https://music.youtube.com/watch?v=xyz',
    spotifyUrl: 'https://open.spotify.com/track/abc',
    trackName: 'Song Name',
    artistName: 'Artist Name',
    albumName: null,
    thumbnailUrl: null,
  })
  .returning();

const newConversion = results[0];
```

### Update

```typescript
const results = await db
  .update(conversions)
  .set({ 
    trackName: 'New Name',
    artistName: 'New Artist',
  })
  .where(eq(conversions.id, id))
  .returning();
```

### Delete

```typescript
await db
  .delete(conversions)
  .where(eq(conversions.id, id));
```

## Query Operators

```typescript
import { 
  eq,      // equals
  ne,      // not equals
  gt,      // greater than
  gte,     // greater than or equal
  lt,      // less than
  lte,     // less than or equal
  isNull,  // is null
  isNotNull, // is not null
  like,    // SQL LIKE
  ilike,   // case-insensitive LIKE
  and,     // AND condition
  or,      // OR condition
  not,     // NOT condition
} from 'drizzle-orm';
```

### Examples

```typescript
// WHERE track_name LIKE '%love%'
await db
  .select()
  .from(conversions)
  .where(like(conversions.trackName, '%love%'));

// WHERE artist_name IS NOT NULL
await db
  .select()
  .from(conversions)
  .where(isNotNull(conversions.artistName));

// WHERE id > 100 AND track_name IS NOT NULL
await db
  .select()
  .from(conversions)
  .where(
    and(
      gt(conversions.id, 100),
      isNotNull(conversions.trackName)
    )
  );
```

## Pagination

```typescript
const page = 1;
const perPage = 10;

const results = await db
  .select()
  .from(conversions)
  .limit(perPage)
  .offset((page - 1) * perPage);
```

## Sorting

```typescript
import { desc, asc } from 'drizzle-orm';

// ORDER BY id DESC
const results = await db
  .select()
  .from(conversions)
  .orderBy(desc(conversions.id));

// ORDER BY track_name ASC, id DESC
const results = await db
  .select()
  .from(conversions)
  .orderBy(asc(conversions.trackName), desc(conversions.id));
```

## Counting

```typescript
import { count } from 'drizzle-orm';

const result = await db
  .select({ count: count() })
  .from(conversions);

const total = result[0].count;
```

## Transactions

```typescript
await db.transaction(async (tx) => {
  // Insert
  const [conversion] = await tx
    .insert(conversions)
    .values({ ... })
    .returning();
  
  // Update related data
  await tx
    .update(someOtherTable)
    .set({ conversionId: conversion.id })
    .where(...);
  
  // If any operation throws, entire transaction rolls back
});
```

## Raw SQL (when needed)

```typescript
import { sql } from 'drizzle-orm';

const results = await db.execute(
  sql`SELECT * FROM conversions WHERE youtube_url = ${url}`
);
```

## Type Safety

Drizzle provides full type inference:

```typescript
// ✅ TypeScript knows the shape
const results = await db.select().from(conversions);
// results: { id: number, youtubeUrl: string, ... }[]

// ✅ Autocomplete works
results[0].trackName; // string | null

// ❌ TypeScript error - property doesn't exist
results[0].nonExistentField; // Error!
```

## Schema Updates

### 1. Update Schema

Edit `shared/schema.ts`:

```typescript
export const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  // ... existing fields
  newField: varchar('new_field', { length: 100 }), // Add new field
});
```

### 2. Generate Migration

```bash
cd server
npx drizzle-kit generate
```

### 3. Apply Migration

```bash
yarn nest:db:push
```

## Best Practices

1. **Always use returning()** for inserts/updates when you need the result
2. **Use limit(1)** when selecting a single record
3. **Use transactions** for multiple related operations
4. **Use indexes** for frequently queried fields
5. **Handle undefined** - results[0] might be undefined
6. **Type cast carefully** - use proper TypeScript types

## Testing

Mock the DatabaseService in tests:

```typescript
const mockDb = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([mockData]),
};

const mockDatabaseService = {
  getDb: jest.fn().mockReturnValue(mockDb),
};

// Use in test module
providers: [
  YourService,
  { provide: DatabaseService, useValue: mockDatabaseService },
]
```

## Debugging

### Enable Query Logging

```typescript
// In database.service.ts (during development)
this.db = drizzle(pool, { 
  schema,
  logger: true, // Enable query logging
});
```

### Check Connection

```typescript
try {
  await db.select().from(conversions).limit(1);
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Database error:', error);
}
```

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle PostgreSQL Docs](https://orm.drizzle.team/docs/get-started-postgresql)
- [Full Integration Guide](./DRIZZLE_INTEGRATION.md)
- [Database Module README](../src/database/README.md)
