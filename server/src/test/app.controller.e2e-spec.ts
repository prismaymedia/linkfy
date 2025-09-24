import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SupabaseService } from '../supabase/supabase.service';
import { YoutubeService } from '../services/youtube.service';
import { ConversionService } from '../services/conversion.service';

describe('YouTube Convert Endpoint (e2e)', () => {
  let app: INestApplication;
  const originalLog = console.log;
  const originalError = console.error;

  beforeAll(async () => {
    console.log = jest.fn();
    console.error = jest.fn();

    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: [], error: null }),
        limit: jest.fn().mockReturnThis(),
      }),
    };

    const mockYoutubeService: Partial<YoutubeService> = {
      getYoutubeInfo: jest.fn().mockResolvedValue({
        trackName: 'Track',
        artistName: 'Artist',
        thumbnailUrl: 'thumb',
        originalTitle: 'Original',
      }),
    };

    const mockConversionService: Partial<ConversionService> = {
      getOrCreateConversion: jest.fn().mockResolvedValue({
        spotifyUrl: 'https://open.spotify.com/track/123',
        trackName: 'Track',
        artistName: 'Artist',
        albumName: 'Album',
        thumbnailUrl: 'thumb',
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SupabaseService)
      .useValue(mockSupabaseService)
      .overrideProvider(YoutubeService)
      .useValue(mockYoutubeService)
      .overrideProvider(ConversionService)
      .useValue(mockConversionService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return 200 with YouTube info when convert=false (preview)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/youtube-convert')
      .send({
        youtubeUrl: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
        convert: false,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('trackName');
    expect(response.body).toHaveProperty('artistName');
    expect(response.body).toHaveProperty('thumbnailUrl');
    expect(response.body).toHaveProperty('originalTitle');
    expect(response.body).not.toHaveProperty('spotifyUrl');
  });

  it('should return 201 with Spotify info when convert omitted/true', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/youtube-convert')
      .send({ youtubeUrl: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('spotifyUrl');
    expect(response.body).toHaveProperty('trackName');
    expect(response.body).toHaveProperty('artistName');
    expect(response.body).toHaveProperty('thumbnailUrl');
    expect(response.body).toHaveProperty('originalTitle');
  });

  it('should return 400 if the parameter is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/youtube-convert')
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
