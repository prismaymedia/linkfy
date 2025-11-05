import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  const PROTECTED_ROUTE = '/api/convert';

  describe('when not authenticated', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        // Override the guard to simulate an unauthenticated user.
        .overrideGuard(SupabaseAuthGuard)
        .useValue({
          // The mock guard's canActivate throws an UnauthorizedException to mimic real guard behavior.
          canActivate: () => {
            throw new UnauthorizedException();
          },
        })
        .compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should return 401 Unauthorized when accessing a protected route', () => {
      return request(app.getHttpServer())
        .post(PROTECTED_ROUTE)
        .send({ youtubeUrl: 'any-url' })
        .expect(401);
    });
  });

  describe('when authenticated', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        // Override the guard to simulate an authenticated user.
        .overrideGuard(SupabaseAuthGuard)
        .useValue({
          // The mock guard's canActivate returns true and attaches a mock user to the request.
          canActivate: (context: any) => {
            const request = context.switchToHttp().getRequest();
            request.user = { id: 'mock-user-id', email: 'test@example.com' };
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

    it('should allow access to a protected route and not return 401', async () => {
      const response = await request(app.getHttpServer())
        .post(PROTECTED_ROUTE)
        .send({});

      expect(response.status).not.toBe(401);
      expect(response.status).toBe(400);
    });
  });
});