import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { DatabaseService } from '../database/database.service';

describe('StorageService', () => {
  let service: StorageService;
  let mockDatabaseService: Partial<DatabaseService>;
  let mockDb: any;

  beforeEach(async () => {
    // Create mock database with Drizzle-like API
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue(Promise.resolve([])),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnValue(
        Promise.resolve([
          {
            id: 1,
            youtubeUrl: 'https://music.youtube.com/watch?v=test',
            spotifyUrl: 'https://open.spotify.com/track/test',
            trackName: 'Test Track',
            artistName: 'Test Artist',
            albumName: 'Test Album',
            thumbnailUrl: 'https://example.com/thumb.jpg',
          },
        ]),
      ),
    };

    mockDatabaseService = {
      getDb: jest.fn().mockReturnValue(mockDb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConversion', () => {
    it('should return a conversion by id', async () => {
      const mockConversion = {
        id: 1,
        youtubeUrl: 'https://music.youtube.com/watch?v=test',
        spotifyUrl: 'https://open.spotify.com/track/test',
        trackName: 'Test Track',
        artistName: 'Test Artist',
        albumName: 'Test Album',
        thumbnailUrl: 'https://example.com/thumb.jpg',
      };

      mockDb.limit.mockReturnValue(Promise.resolve([mockConversion]));

      const result = await service.getConversion(1);
      expect(result).toEqual(mockConversion);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should return undefined if conversion not found', async () => {
      mockDb.limit.mockReturnValue(Promise.resolve([]));

      const result = await service.getConversion(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getConversionByYoutubeUrl', () => {
    it('should return a conversion by youtube URL', async () => {
      const mockConversion = {
        id: 1,
        youtubeUrl: 'https://music.youtube.com/watch?v=test',
        spotifyUrl: 'https://open.spotify.com/track/test',
        trackName: 'Test Track',
        artistName: 'Test Artist',
        albumName: 'Test Album',
        thumbnailUrl: 'https://example.com/thumb.jpg',
      };

      mockDb.limit.mockReturnValue(Promise.resolve([mockConversion]));

      const result = await service.getConversionByYoutubeUrl(
        'https://music.youtube.com/watch?v=test',
      );
      expect(result).toEqual(mockConversion);
    });

    it('should return undefined if conversion not found', async () => {
      mockDb.limit.mockReturnValue(Promise.resolve([]));

      const result = await service.getConversionByYoutubeUrl(
        'https://music.youtube.com/watch?v=notfound',
      );
      expect(result).toBeUndefined();
    });
  });

  describe('createConversion', () => {
    it('should create a new conversion', async () => {
      const insertData = {
        youtubeUrl: 'https://music.youtube.com/watch?v=new',
        spotifyUrl: 'https://open.spotify.com/track/new',
        trackName: 'New Track',
        artistName: 'New Artist',
        albumName: 'New Album',
        thumbnailUrl: 'https://example.com/new.jpg',
      };

      const result = await service.createConversion(insertData);

      expect(result).toBeDefined();
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalled();
      expect(mockDb.returning).toHaveBeenCalled();
    });
  });
});
