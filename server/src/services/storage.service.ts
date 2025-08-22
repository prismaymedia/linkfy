import { Injectable } from '@nestjs/common';
import { Conversion, InsertConversion } from '../../../shared/schema';

export interface IStorage {
  getConversion(id: number): Promise<Conversion | undefined>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getConversionByYoutubeUrl(
    youtubeUrl: string,
  ): Promise<Conversion | undefined>;
}

@Injectable()
export class StorageService implements IStorage {
  private conversions: Map<number, Conversion> = new Map();
  private currentId = 1;

  async getConversion(id: number): Promise<Conversion | undefined> {
    return this.conversions.get(id);
  }

  async getConversionByYoutubeUrl(
    youtubeUrl: string,
  ): Promise<Conversion | undefined> {
    return Array.from(this.conversions.values()).find(
      (conversion) => conversion.youtubeUrl === youtubeUrl,
    );
  }

  async createConversion(
    insertConversion: InsertConversion,
  ): Promise<Conversion> {
    const id = this.currentId++;
    const payload = insertConversion as any;
    const conversion: Conversion = {
      id,
      youtubeUrl: payload.youtubeUrl,
      spotifyUrl: payload.spotifyUrl ?? '',
      trackName: payload.trackName ?? null,
      artistName: payload.artistName ?? null,
      albumName: payload.albumName ?? null,
      thumbnailUrl: payload.thumbnailUrl ?? null,
    };
    this.conversions.set(id, conversion);
    return conversion;
  }
}
