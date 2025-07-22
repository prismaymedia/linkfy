import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/controllers/app.controller';
import { YoutubeService } from '../src/services/youtube.service';
import { ConversionService } from '../src/services/conversion.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ZodError } from 'zod';

describe('AppController', () => {
  let controller: AppController;
  let youtubeService: Partial<YoutubeService>;

  beforeEach(async () => {
    youtubeService = {
      getYoutubeInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: YoutubeService, useValue: youtubeService },
        { provide: ConversionService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should return song info for a valid body', async () => {
    (youtubeService.getYoutubeInfo as jest.Mock).mockResolvedValue({
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'url',
      originalTitle: 'Title',
    });

    const result = await controller.getYoutubeInfo({ youtubeUrl: 'https://music.youtube.com/watch?v=abc' });
    expect(result).toEqual({
      trackName: 'Track',
      artistName: 'Artist',
      thumbnailUrl: 'url',
      originalTitle: 'Title',
    });
  });

  it('should throw BadRequestException if the body is invalid', async () => {
    await expect(controller.getYoutubeInfo({ youtubeUrl: 123 }))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException if the service fails', async () => {
    (youtubeService.getYoutubeInfo as jest.Mock).mockRejectedValue(new Error('fail'));
    await expect(controller.getYoutubeInfo({ youtubeUrl: 'https://music.youtube.com/watch?v=abc' }))
      .rejects
      .toThrow(InternalServerErrorException);
  });
});
