# Database Module - Drizzle ORM Integration

This module provides database access layer using Drizzle ORM for the Linkfy NestJS backend.

## Overview

The DatabaseModule integrates Drizzle ORM with NestJS to provide type-safe database operations against a PostgreSQL database hosted on Supabase.

## Components

### DatabaseService

The `DatabaseService` is a NestJS service that:
- Initializes the Drizzle database connection using the Neon serverless driver
- Provides access to the Drizzle database instance
- Verifies database connectivity on module initialization
- Handles connection errors gracefully

### DatabaseModule

A global NestJS module that:
- Exports `DatabaseService` for use across the application
- Is imported in `AppModule` to make database access available everywhere

## Usage

### Basic Query Example

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { conversions } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MyService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getConversionById(id: number) {
    const db = this.databaseService.getDb();
    const results = await db
      .select()
      .from(conversions)
      .where(eq(conversions.id, id))
      .limit(1);
    return results[0];
  }
}
```

### Insert Example

```typescript
async createConversion(data: InsertConversion) {
  const db = this.databaseService.getDb();
  const results = await db
    .insert(conversions)
    .values(data)
    .returning();
  return results[0];
}
```

## Configuration

The module requires the following environment variable:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Example for Supabase:
```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

## Schema

Database schemas are defined in `shared/schema.ts` using Drizzle ORM's table definitions. The shared location ensures:
- Type safety across frontend and backend
- Single source of truth for data models
- Automatic TypeScript type inference

## Migration

Initial database migration is provided in `server/migrations/0000_initial_schema.sql`.

To apply migrations manually:
```bash
# Using Drizzle Kit
cd server
yarn nest:db:push
```

## Testing

The `DatabaseService` includes tests that:
- Verify the service initializes correctly
- Ensure database instance is available
- Handle missing DATABASE_URL gracefully

See `database.service.spec.ts` for test examples.

## Integration with Existing Services

The `StorageService` has been migrated to use Drizzle ORM:
- Before: Used in-memory Map for storage
- After: Uses Drizzle ORM for persistent PostgreSQL storage
- Interface remains unchanged for backwards compatibility

## Benefits

1. **Type Safety**: Full TypeScript support with inferred types
2. **Performance**: Lightweight ORM with minimal overhead
3. **Flexibility**: Direct SQL access when needed
4. **Developer Experience**: Excellent autocomplete and type checking
5. **Serverless Ready**: Uses Neon serverless driver optimized for edge functions
