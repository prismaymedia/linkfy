import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { YoutubeService, YouTubeLinkType } from '../services/youtube.service';
import { ConversionService } from '../services/conversion.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

describe('YouTube Convert Endpoint (e2e)', () => {
  let app: INestApplication;
  const originalLog = console.log;
  const originalError = console.error;

  beforeAll(async () => {
    console.log = jest.fn();
    console.error = jest.fn();

    const mockYoutubeService: Partial<YoutubeService> = {
      getYoutubeInfo: jest.fn().mockResolvedValue({
        type: 'track',
        videoId: 'dQw4w9WgXcQ',
        trackName: 'Track',
        artistName: 'Artist',
        thumbnailUrl: 'thumb',
        originalTitle: 'Original',
      }),
      parseUrl: jest.fn().mockReturnValue({
        id: 'dQw4w9WgXcQ',
        type: YouTubeLinkType.VIDEO,
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
      .overrideProvider(YoutubeService)
      .useValue(mockYoutubeService)
      .overrideProvider(ConversionService)
      .useValue(mockConversionService)
      .overrideGuard(SupabaseAuthGuard)
      .useValue({
        canActivate: (ctx: any) => {
          const req = ctx.switchToHttp().getRequest();
          req.user = {
            id: 'user-id',
            email: 'user@example.com',
            user_metadata: {},
            created_at: new Date().toISOString(),
          };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return 200 with YouTube info when convert=false (preview)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/convert')
      .send({
        url: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
        convert: false,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('trackName');
    expect(response.body).toHaveProperty('artistName');
    expect(response.body).toHaveProperty('thumbnailUrl');
    expect(response.body).toHaveProperty('originalTitle');
  });

  it('should return 201 with Spotify info when convert omitted/true', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/convert')
      .send({ url: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('spotifyUrl');
    expect(response.body).toHaveProperty('trackName');
    expect(response.body).toHaveProperty('artistName');
    expect(response.body).toHaveProperty('thumbnailUrl');
  });

  it('should return 400 if the parameter is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/convert')
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
