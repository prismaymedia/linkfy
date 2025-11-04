import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

describe('User endpoints (e2e)', () => {
    let app: INestApplication;

    const mockUser = {
        id: 'user-id-123',
        email: 'user@example.com',
        user_metadata: {
            full_name: 'Jane Doe',
            avatar_url: 'https://example.com/avatar.jpg',
        },
        created_at: new Date().toISOString(),
    } as any;

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
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /api/v1/users/info should return current user info (200)', async () => {
        const res = await request(app.getHttpServer()).get('/api/v1/users/info');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: mockUser.id,
            email: mockUser.email,
            full_name: mockUser.user_metadata.full_name,
            avatar_url: mockUser.user_metadata.avatar_url,
        });
    });
});
