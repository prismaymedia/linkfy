import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    // Don't set DATABASE_URL for tests to avoid connection issues
    delete process.env.DATABASE_URL;

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    // Restore original DATABASE_URL
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should provide a database instance', () => {
    const db = service.getDb();
    expect(db).toBeDefined();
  });

  it('should initialize without throwing when DATABASE_URL is not set', async () => {
    // The onModuleInit should handle missing DATABASE_URL gracefully
    await expect(service.onModuleInit()).resolves.not.toThrow();
  });
});
