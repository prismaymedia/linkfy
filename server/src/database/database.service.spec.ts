import { Test, TestingModule } from '@nestjs/testing';
import {
  conversionHistory,
  favorites as favoritesTable,
} from '../../../shared/schema';
import { DatabaseOperationError, DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockDb: ReturnType<typeof createMockDb>;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    delete process.env.DATABASE_URL;

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    mockDb = createMockDb();
    (service as any).db = mockDb;
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
  });

  it('should record a history entry', async () => {
    const historyRecord = {
      id: 1,
      userId: 'user-1',
      sourcePlatform: 'youtube',
      sourceUrl: 'https://example.com/youtube',
      status: 'pending',
      payload: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const insertBuilder = createInsertBuilder([historyRecord]);
    mockDb.insert.mockReturnValue(insertBuilder);

    const result = await service.recordHistoryEntry({
      userId: historyRecord.userId,
      sourcePlatform: historyRecord.sourcePlatform,
      sourceUrl: historyRecord.sourceUrl,
      status: historyRecord.status,
      payload: historyRecord.payload,
    });

    expect(mockDb.insert).toHaveBeenCalledWith(conversionHistory);
    expect(insertBuilder.values).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: historyRecord.userId,
      }),
    );
    expect(result).toEqual(historyRecord);
  });

  it('should throw error when updating non-existent history', async () => {
    const updateBuilder = createUpdateBuilder([]);
    mockDb.update.mockReturnValue(updateBuilder);

    await expect(
      service.updateHistoryEntry(99, 'user-2', { status: 'failed' }),
    ).rejects.toBeInstanceOf(DatabaseOperationError);
  });

  it('should sync history ensuring transactional upsert', async () => {
    const firstResult = {
      id: 1,
      userId: 'user-3',
      sourcePlatform: 'youtube',
      sourceUrl: 'https://example.com/1',
      status: 'success',
      payload: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const secondResult = {
      ...firstResult,
      id: 2,
      sourceUrl: 'https://example.com/2',
    };

    mockDb.insert
      .mockReturnValueOnce(createInsertBuilder([firstResult]))
      .mockReturnValueOnce(createInsertBuilder([secondResult]));

    const entries = [
      {
        userId: 'user-3',
        sourcePlatform: 'youtube',
        sourceUrl: 'https://example.com/1',
        status: 'success',
        payload: {},
      },
      {
        userId: 'user-3',
        sourcePlatform: 'youtube',
        sourceUrl: 'https://example.com/2',
        status: 'pending',
        payload: {},
      },
    ];

    const synced = await service.syncHistorySnapshot('user-3', entries);

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalledTimes(2);
    expect(synced).toEqual([firstResult, secondResult]);
  });

  it('should sync favorites by adding and removing entries', async () => {
    const existingFavorites = [
      { id: 10, historyId: 1 },
      { id: 11, historyId: 2 },
    ];
    const syncedFavorites = [
      {
        id: 12,
        userId: 'user-4',
        historyId: 2,
        createdAt: new Date(),
      },
      {
        id: 13,
        userId: 'user-4',
        historyId: 3,
        createdAt: new Date(),
      },
    ];

    mockDb.select
      .mockReturnValueOnce(createSelectBuilder(existingFavorites))
      .mockReturnValueOnce(createSelectBuilder(syncedFavorites));

    const insertBuilder = createInsertBuilder(syncedFavorites);
    mockDb.insert.mockReturnValue(insertBuilder);
    const deleteBuilder = createDeleteBuilder();
    mockDb.delete.mockReturnValue(deleteBuilder);

    const result = await service.syncFavorites('user-4', [2, 3]);

    expect(mockDb.insert).toHaveBeenCalledWith(favoritesTable);
    expect(mockDb.delete).toHaveBeenCalledWith(favoritesTable);
    expect(result).toEqual(syncedFavorites);
  });

  it('should wrap errors in DatabaseOperationError', async () => {
    mockDb.select.mockImplementation(() => {
      throw new Error('boom');
    });

    await expect(service.listHistoryForUser('user-5')).rejects.toBeInstanceOf(
      DatabaseOperationError,
    );
  });
});

function createInsertBuilder(result: any[]) {
  return {
    values: jest.fn().mockReturnThis(),
    onConflictDoUpdate: jest.fn().mockReturnThis(),
    onConflictDoNothing: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(result),
  };
}

function createUpdateBuilder(result: any[]) {
  return {
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(result),
  };
}

function createDeleteBuilder() {
  return {
    where: jest.fn().mockResolvedValue(undefined),
  };
}

function createSelectBuilder(result: any[]) {
  const builder: any = Promise.resolve(result);
  builder.from = jest.fn().mockReturnValue(builder);
  builder.where = jest.fn().mockReturnValue(builder);
  builder.orderBy = jest.fn().mockReturnValue(builder);
  builder.limit = jest.fn().mockReturnValue(Promise.resolve(result));
  return builder;
}

function createMockDb() {
  const db: any = {
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
  };
  db.transaction = jest.fn().mockImplementation(async (cb: any) => cb(db));
  return db;
}
