import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../../../shared/schema';
import {
  conversionHistory,
  favorites as favoritesTable,
  type Favorite,
  type HistoryEntry,
  type InsertFavorite,
  type InsertHistoryEntry,
} from '../../../shared/schema';

export class DatabaseOperationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DatabaseOperationError';
  }
}

type DrizzleDb = ReturnType<typeof drizzle>;

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db?: DrizzleDb;

  constructor() {
    this.logger.log('🔹 Initializing DatabaseService...');

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      this.logger.warn(
        '⚠️ DATABASE_URL not configured in environment variables',
      );
      this.logger.warn('⚠️ Drizzle ORM will not be available');
      return;
    }

    this.logger.log(`🔹 Database URL found`);

    // Configure WebSocket for Neon serverless
    neonConfig.webSocketConstructor = ws;

    try {
      const pool = new Pool({ connectionString: databaseUrl });
      this.db = drizzle(pool, { schema });
      this.logger.log('✅ Drizzle database client initialized');
    } catch (error) {
      this.logger.error('❌ Failed to initialize Drizzle client', error);
      this.db = undefined;
    }
  }

  async onModuleInit() {
    this.logger.log(
      '🔹 DatabaseService module initialized, verifying connection...',
    );

    if (!this.db) {
      this.logger.warn(
        '⚠️ Skipping database connection test (database client unavailable)',
      );
      return;
    }

    try {
      // Test the connection by querying the conversions table
      const result = await this.db
        .select()
        .from(schema.conversions)
        .limit(1);
      this.logger.log(
        `🎯 Connection to database successful, test query returned ${result.length} records`,
      );
    } catch (err) {
      this.logger.error('❌ Error connecting to database', err);
    }
  }

  private ensureDb(): DrizzleDb {
    if (!this.db) {
      throw new DatabaseOperationError(
        'Database client is not initialized. Check DATABASE_URL.',
      );
    }
    return this.db;
  }

  private async runQuery<T>(
    operation: string,
    handler: (db: DrizzleDb) => Promise<T>,
  ): Promise<T> {
    try {
      const db = this.ensureDb();
      return await handler(db);
    } catch (error) {
      this.logger.error(`❌ ${operation}`, error);
      if (error instanceof DatabaseOperationError) {
        throw error;
      }
      throw new DatabaseOperationError(operation, error);
    }
  }

  getDb() {
    return this.ensureDb();
  }

  async recordHistoryEntry(entry: InsertHistoryEntry): Promise<HistoryEntry> {
    return this.runQuery('Failed to record history entry', async (db) => {
      const [created] = await db
        .insert(conversionHistory)
        .values({
          ...entry,
          payload: entry.payload ?? {},
        })
        .returning();
      return created;
    });
  }

  async updateHistoryEntry(
    id: number,
    userId: string,
    updates: Partial<
      Pick<
        InsertHistoryEntry,
        'targetPlatform' | 'targetUrl' | 'status' | 'payload'
      >
    >,
  ): Promise<HistoryEntry> {
    return this.runQuery('Failed to update history', async (db) => {
      const updateData = { ...updates, updatedAt: new Date() };
      if (updates.payload === undefined) {
        delete updateData.payload;
      }

      const [updated] = await db
        .update(conversionHistory)
        .set(updateData)
        .where(
          and(
            eq(conversionHistory.id, id),
            eq(conversionHistory.userId, userId),
          ),
        )
        .returning();

      if (!updated) {
        throw new DatabaseOperationError(
          `No history entry found with id ${id} for the user`,
        );
      }

      return updated;
    });
  }

  async deleteHistoryEntry(id: number, userId: string): Promise<void> {
    await this.runQuery('Failed to delete history entry', async (db) => {
      await db
        .delete(conversionHistory)
        .where(
          and(
            eq(conversionHistory.id, id),
            eq(conversionHistory.userId, userId),
          ),
        );
    });
  }

  async listHistoryForUser(
    userId: string,
    limit = 50,
  ): Promise<HistoryEntry[]> {
    return this.runQuery('Failed to list history', async (db) => {
      return await db
        .select()
        .from(conversionHistory)
        .where(eq(conversionHistory.userId, userId))
        .orderBy(desc(conversionHistory.createdAt))
        .limit(limit);
    });
  }

  async syncHistorySnapshot(
    userId: string,
    entries: InsertHistoryEntry[],
  ): Promise<HistoryEntry[]> {
    return this.runQuery('Failed to sync history', async (db) => {
      return db.transaction(async (tx) => {
        const synced: HistoryEntry[] = [];

        for (const entry of entries) {
          const normalizedEntry: InsertHistoryEntry = {
            ...entry,
            userId,
            payload: entry.payload ?? {},
          };

          const [result] = await tx
            .insert(conversionHistory)
            .values(normalizedEntry)
            .onConflictDoUpdate({
              target: [
                conversionHistory.userId,
                conversionHistory.sourceUrl,
              ],
              set: {
                targetPlatform: normalizedEntry.targetPlatform,
                targetUrl: normalizedEntry.targetUrl,
                status: normalizedEntry.status ?? 'pending',
                payload: normalizedEntry.payload ?? {},
                updatedAt: new Date(),
              },
            })
            .returning();

          if (result) {
            synced.push(result);
          }
        }

        return synced;
      });
    });
  }

  async upsertFavorite(
    favorite: InsertFavorite,
  ): Promise<Favorite | undefined> {
    return this.runQuery('Failed to save favorite', async (db) => {
      const [record] = await db
        .insert(favoritesTable)
        .values(favorite)
        .onConflictDoUpdate({
          target: [favoritesTable.userId, favoritesTable.historyId],
          set: {
            alias: favorite.alias,
          },
        })
        .returning();
      return record;
    });
  }

  async removeFavorite(userId: string, historyId: number): Promise<void> {
    await this.runQuery('Failed to delete favorite', async (db) => {
      await db
        .delete(favoritesTable)
        .where(
          and(
            eq(favoritesTable.userId, userId),
            eq(favoritesTable.historyId, historyId),
          ),
        );
    });
  }

  async listFavoritesByUser(userId: string): Promise<Favorite[]> {
    return this.runQuery('Failed to list favorites', async (db) => {
      return await db
        .select()
        .from(favoritesTable)
        .where(eq(favoritesTable.userId, userId))
        .orderBy(desc(favoritesTable.createdAt));
    });
  }

  async syncFavorites(
    userId: string,
    historyIds: number[],
  ): Promise<Favorite[]> {
    return this.runQuery('Failed to sync favorites', async (db) => {
      return db.transaction(async (tx) => {
        const existing = await tx
          .select({
            id: favoritesTable.id,
            historyId: favoritesTable.historyId,
          })
          .from(favoritesTable)
          .where(eq(favoritesTable.userId, userId));

        const desiredSet = new Set(historyIds);
        const existingSet = new Set(existing.map((fav) => fav.historyId));

        const toInsert = historyIds.filter((id) => !existingSet.has(id));
        const toDelete = existing
          .filter((fav) => !desiredSet.has(fav.historyId))
          .map((fav) => fav.historyId);

        if (toInsert.length) {
          await tx
            .insert(favoritesTable)
            .values(
              toInsert.map((historyId) => ({
                userId,
                historyId,
              })),
            )
            .onConflictDoNothing();
        }

        if (toDelete.length) {
          await tx
            .delete(favoritesTable)
            .where(
              and(
                eq(favoritesTable.userId, userId),
                inArray(favoritesTable.historyId, toDelete),
              ),
            );
        }

        return tx
          .select()
          .from(favoritesTable)
          .where(eq(favoritesTable.userId, userId))
          .orderBy(desc(favoritesTable.createdAt));
      });
    });
  }
}
