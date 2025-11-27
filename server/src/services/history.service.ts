import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { HistoryEntry, InsertHistoryEntry } from '../../../shared/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { conversionHistory } from '../../../shared/schema';

export interface HistorySearchParams {
  userId: string;
  query?: string;
  sourcePlatform?: string;
  targetPlatform?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(private readonly databaseService: DatabaseService) { }

  async recordHistoryEntry(entry: InsertHistoryEntry): Promise<HistoryEntry> {
    this.logger.log(`Recording history entry for user: ${entry.userId}`);
    return this.databaseService.recordHistoryEntry(entry);
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
    this.logger.log(`Updating history entry ${id} for user: ${userId}`);
    return this.databaseService.updateHistoryEntry(id, userId, updates);
  }

  async deleteHistoryEntry(id: number, userId: string): Promise<void> {
    this.logger.log(`Deleting history entry ${id} for user: ${userId}`);
    return this.databaseService.deleteHistoryEntry(id, userId);
  }

  async clearHistory(userId: string): Promise<number> {
    this.logger.log(`Clearing all history for user: ${userId}`);
    const db = this.databaseService.getDb();

    const deleted = await db
      .delete(conversionHistory)
      .where(eq(conversionHistory.userId, userId))
      .returning({ id: conversionHistory.id });

    return deleted.length;
  }

  async searchHistory(
    params: HistorySearchParams,
  ): Promise<{ entries: HistoryEntry[]; total: number }> {
    const {
      userId,
      query,
      sourcePlatform,
      targetPlatform,
      status,
      limit = 50,
      offset = 0,
    } = params;

    this.logger.log(
      `Searching history for user: ${userId}, query: ${query || 'none'}`,
    );

    const db = this.databaseService.getDb();
    const conditions = [eq(conversionHistory.userId, userId)];

    // Search query - search in sourceUrl, targetUrl, and payload
    if (query) {
      conditions.push(
        or(
          ilike(conversionHistory.sourceUrl, `%${query}%`),
          ilike(conversionHistory.targetUrl, `%${query}%`),
        )!,
      );
    }

    // Filter by source platform
    if (sourcePlatform) {
      conditions.push(eq(conversionHistory.sourcePlatform, sourcePlatform));
    }

    // Filter by target platform
    if (targetPlatform) {
      conditions.push(eq(conversionHistory.targetPlatform, targetPlatform));
    }

    // Filter by status
    if (status) {
      conditions.push(eq(conversionHistory.status, status));
    }

    const whereClause = and(...conditions);

    // Get total count - use a count query instead
    const totalResult = await db
      .select()
      .from(conversionHistory)
      .where(whereClause);

    const total = totalResult.length;

    // Get paginated results
    const entries = await db
      .select()
      .from(conversionHistory)
      .where(whereClause)
      .orderBy(desc(conversionHistory.createdAt))
      .limit(limit)
      .offset(offset);

    return { entries, total };
  }

  async listHistoryForUser(
    userId: string,
    limit = 50,
  ): Promise<HistoryEntry[]> {
    this.logger.log(`Listing history for user: ${userId}, limit: ${limit}`);
    return this.databaseService.listHistoryForUser(userId, limit);
  }
}

