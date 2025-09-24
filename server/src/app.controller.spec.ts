import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/controllers/app.controller';
import { YoutubeService } from '../src/services/youtube.service';
import { ConversionService } from '../src/services/conversion.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('AppController', () => {
  let controller: AppController;
  let youtubeService: jest.Mocked<Partial<YoutubeService>>;
  let conversionService: jest.Mocked<Partial<ConversionService>>;

  beforeEach(async () => {
    youtubeService = {
      getYoutubeInfo: jest.fn(),
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
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  function createResMock() {
    return {
      status: jest.fn().mockReturnThis(),
    } as any;
  }

  it('returns YouTube info with 200 when convert=false (preview)', async () => {
    (youtubeService.getYoutubeInfo as jest.Mock).mockResolvedValue({
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'thumb',
      originalTitle: 'Title',
    });

    const res = createResMock();
    const result = await controller.youtubeConvert(
      { youtubeUrl: 'https://music.youtube.com/watch?v=abc', convert: false },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(result).toEqual({
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'thumb',
      originalTitle: 'Title',
    });
  });

  it('returns merged info with 201 when convert omitted/true', async () => {
    (youtubeService.getYoutubeInfo as jest.Mock).mockResolvedValue({
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
    const result = await controller.youtubeConvert(
      { youtubeUrl: 'https://music.youtube.com/watch?v=abc' },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(result).toEqual({
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'thumb',
      originalTitle: 'Title',
      spotifyUrl: 'https://open.spotify.com/track/123',
    });
  });

  it('throws BadRequestException for invalid body', async () => {
    const res = createResMock();
    await expect(
      controller.youtubeConvert({ youtubeUrl: 123 as any }, res),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws InternalServerErrorException if youtube service fails', async () => {
    (youtubeService.getYoutubeInfo as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );

    const res = createResMock();
    await expect(
      controller.youtubeConvert(
        { youtubeUrl: 'https://music.youtube.com/watch?v=abc' },
        res,
      ),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
