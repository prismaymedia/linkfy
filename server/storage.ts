import { conversions, type Conversion, type InsertConversion } from "@shared/schema";

export interface IStorage {
  getConversion(id: number): Promise<Conversion | undefined>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getConversionByYoutubeUrl(youtubeUrl: string): Promise<Conversion | undefined>;
}

export class MemStorage implements IStorage {
  private conversions: Map<number, Conversion>;
  currentId: number;

  constructor() {
    this.conversions = new Map();
    this.currentId = 1;
  }

  async getConversion(id: number): Promise<Conversion | undefined> {
    return this.conversions.get(id);
  }

  async getConversionByYoutubeUrl(youtubeUrl: string): Promise<Conversion | undefined> {
    return Array.from(this.conversions.values()).find(
      (conversion) => conversion.youtubeUrl === youtubeUrl,
    );
  }

  async createConversion(insertConversion: InsertConversion): Promise<Conversion> {
    const id = this.currentId++;
    const conversion: Conversion = { 
      ...insertConversion, 
      id,
      spotifyUrl: "",
      trackName: null,
      artistName: null,
      albumName: null,
      thumbnailUrl: null
    };
    this.conversions.set(id, conversion);
    return conversion;
  }
}

export const storage = new MemStorage();
