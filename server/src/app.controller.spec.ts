import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/controllers/app.controller';
import { YoutubeService, YouTubeLinkType } from '../src/services/youtube.service';
import { ConversionService } from '../src/services/conversion.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../src/auth/supabase-auth.guard';

describe('AppController', () => {
  let controller: AppController;
  let youtubeService: jest.Mocked<Partial<YoutubeService>>;
  let conversionService: jest.Mocked<Partial<ConversionService>>;

  beforeEach(async () => {
    youtubeService = {
      getYoutubeInfo: jest.fn(),
      getPlaylistTracks: jest.fn(),
      parseUrl: jest.fn(),
    };
    conversionService = {
      getOrCreateConversion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: YoutubeService, useValue: youtubeService },
        { provide: ConversionService, useValue: conversionService },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<AppController>(AppController);
  });

  function createResMock() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
  }

  function createUserMock() {
    return {
      id: 'user-id',
      email: 'user@example.com',
      user_metadata: {},
      created_at: new Date().toISOString(),
    } as any;
  }

  it('returns YouTube info with 200 when convert=false (preview)', async () => {
    (youtubeService.parseUrl as jest.Mock).mockReturnValue({
      id: 'abc',
      type: YouTubeLinkType.VIDEO,
    });
    (youtubeService.getYoutubeInfo as jest.Mock).mockResolvedValue({
      type: 'track',
      videoId: 'abc',
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'thumb',
      originalTitle: 'Title',
    });

    const res = createResMock();
    const result = await controller.convert(
      { url: 'https://music.youtube.com/watch?v=abc', convert: false },
      res,
      createUserMock(),
    );

    expect(res.status).toHaveBeenCalledWith(200);
    // The controller now adds success and sourcePlatform
    expect(result).toEqual(expect.objectContaining({
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'thumb',
      originalTitle: 'Title',
      success: true,
    }));
  });

  it('returns merged info with 201 when convert=true', async () => {
    (youtubeService.parseUrl as jest.Mock).mockReturnValue({
      id: 'abc',
      type: YouTubeLinkType.VIDEO,
    });
    (youtubeService.getYoutubeInfo as jest.Mock).mockResolvedValue({
      type: 'track',
      videoId: 'abc',
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'thumb',
      originalTitle: 'Title',
    });
    (conversionService.getOrCreateConversion as jest.Mock).mockResolvedValue({
      spotifyUrl: 'https://open.spotify.com/track/123',
      trackName: 'Track',
      artistName: 'Artist',
      albumName: 'Album',
      thumbnailUrl: 'thumb',
    });

    const res = createResMock();
    const result = await controller.convert(
      { url: 'https://music.youtube.com/watch?v=abc' },
      res,
      createUserMock(),
    );

    expect(res.status).toHaveBeenCalledWith(201);
    // The controller merges info differently now
    expect(result).toEqual(expect.objectContaining({
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'thumb',
      spotifyUrl: 'https://open.spotify.com/track/123',
      albumName: 'Album',
      success: true,
      targetPlatform: 'spotify',
    }));
  });

  it('throws BadRequestException for invalid body', async () => {
    const res = createResMock();
    await expect(
      controller.convert({ url: 123 as any }, res, createUserMock()),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws InternalServerErrorException if youtube service fails', async () => {
    (youtubeService.parseUrl as jest.Mock).mockReturnValue({
      id: 'abc',
      type: YouTubeLinkType.VIDEO,
    });
    (youtubeService.getYoutubeInfo as jest.Mock).mockRejectedValue(
      new InternalServerErrorException('fail'),
    );
    (conversionService.getOrCreateConversion as jest.Mock).mockRejectedValue(
      new InternalServerErrorException('fail'),
    );

    const res = createResMock();
    await expect(
      controller.convert(
        { url: 'https://music.youtube.com/watch?v=abc' },
        res,
        createUserMock(),
      ),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
