import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { DatabaseService } from '../database/database.service';

describe('Favorites Controller (e2e)', () => {
    let app: INestApplication;
    let databaseService: DatabaseService;

    const mockUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        user_metadata: {},
        created_at: new Date().toISOString(),
    };

    const mockFavorite = {
        id: 1,
        userId: mockUser.id,
        historyId: 100,
        alias: 'My Favorite Song',
        createdAt: new Date(),
    };

    const mockDatabaseService = {
        upsertFavorite: jest.fn(),
        recordHistoryEntry: jest.fn(),
        removeFavorite: jest.fn(),
        listFavoritesByUser: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(SupabaseAuthGuard)
            .useValue({
                canActivate: (ctx: any) => {
                    const req = ctx.switchToHttp().getRequest();
                    req.user = mockUser;
                    return true;
                },
            })
            .overrideProvider(DatabaseService)
            .useValue(mockDatabaseService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/favorites/add', () => {
        it('should add a favorite successfully (201)', async () => {
            mockDatabaseService.upsertFavorite.mockResolvedValue(mockFavorite);

            const response = await request(app.getHttpServer())
                .post('/api/favorites/add')
                .send({
                    historyId: 100,
                    alias: 'My Favorite Song',
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                success: true,
                favorite: expect.objectContaining({
                    id: mockFavorite.id,
                    alias: mockFavorite.alias,
                }),
                message: 'Added to favorites',
            });
            expect(mockDatabaseService.upsertFavorite).toHaveBeenCalledWith({
                userId: mockUser.id,
                historyId: 100,
                alias: 'My Favorite Song',
            });
        });

        it('should return 400 for invalid input', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/favorites/add')
                .send({
                    // missing historyId
                    alias: 'Invalid',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/favorites/remove', () => {
        it('should remove a favorite successfully (201)', async () => {
            mockDatabaseService.removeFavorite.mockResolvedValue(undefined);

            const response = await request(app.getHttpServer())
                .post('/api/favorites/remove')
                .send({
                    historyId: 100,
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                success: true,
                message: 'Removed from favorites',
            });
            expect(mockDatabaseService.removeFavorite).toHaveBeenCalledWith(
                mockUser.id,
                100,
            );
        });

        it('should return 400 for invalid input', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/favorites/remove')
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/favorites/list', () => {
        it('should return a list of favorites (200)', async () => {
            mockDatabaseService.listFavoritesByUser.mockResolvedValue([mockFavorite]);

            const response = await request(app.getHttpServer())
                .get('/api/favorites/list');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                favorites: expect.arrayContaining([
                    expect.objectContaining({
                        id: mockFavorite.id,
                    }),
                ]),
            });
            expect(mockDatabaseService.listFavoritesByUser).toHaveBeenCalledWith(
                mockUser.id,
            );
        });
    });
});
