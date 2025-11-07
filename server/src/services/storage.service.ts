import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  Conversion,
  InsertConversion,
  conversions,
} from '../../../shared/schema';
import { DatabaseService } from '../database/database.service';

export interface IStorage {
  getConversion(id: number): Promise<Conversion | undefined>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getConversionByYoutubeUrl(
    youtubeUrl: string,
  ): Promise<Conversion | undefined>;
}

@Injectable()
export class StorageService implements IStorage {
  constructor(private readonly databaseService: DatabaseService) {}

  async getConversion(id: number): Promise<Conversion | undefined> {
    const db = this.databaseService.getDb();
    const results = await db
      .select()
      .from(conversions)
      .where(eq(conversions.id, id))
      .limit(1);
    return results[0];
  }

  async getConversionByYoutubeUrl(
    youtubeUrl: string,
  ): Promise<Conversion | undefined> {
    const db = this.databaseService.getDb();
    const results = await db
      .select()
      .from(conversions)
      .where(eq(conversions.youtubeUrl, youtubeUrl))
      .limit(1);
    return results[0];
  }

  async createConversion(
    insertConversion: InsertConversion,
  ): Promise<Conversion> {
    const db = this.databaseService.getDb();
    const payload = insertConversion as Record<string, any>;
    const results = await db
      .insert(conversions)
      .values({
        youtubeUrl: payload['youtubeUrl'] as string,
        spotifyUrl: (payload['spotifyUrl'] as string | undefined) ?? '',
        deezerUrl: (payload['deezerUrl'] as string | undefined) ?? '',
        appleUrl: (payload['appleUrl'] as string | undefined) ?? '',
        trackName: (payload['trackName'] as string | null | undefined) ?? null,
        artistName:
          (payload['artistName'] as string | null | undefined) ?? null,
        albumName: (payload['albumName'] as string | null | undefined) ?? null,
        thumbnailUrl:
          (payload['thumbnailUrl'] as string | null | undefined) ?? null,
      })
      .returning();
    return results[0];
  }
}
