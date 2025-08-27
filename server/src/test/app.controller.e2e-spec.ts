import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SupabaseService } from '../supabase/supabase.service';

describe('YouTube Info Endpoint (e2e)', () => {
  let app: INestApplication;
  const originalLog = console.log;
  const originalError = console.error;

  beforeAll(async () => {
    console.log = jest.fn();
    console.error = jest.fn();

    // Mock SupabaseService
    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: [], error: null }),
        limit: jest.fn().mockReturnThis(),
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SupabaseService)
      .useValue(mockSupabaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return song info for a valid URL', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/youtube-info')
      .send({ youtubeUrl: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ' });

    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty('trackName');
    expect(response.body).toHaveProperty('artistName');
    expect(response.body).toHaveProperty('thumbnailUrl');
    expect(response.body).toHaveProperty('originalTitle');
  });

  it('should return error if the parameter is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/youtube-info')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  afterAll(async () => {
    await app.close();

    console.log = originalLog;
    console.error = originalError;
  });
});
