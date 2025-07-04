import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { ConversionService } from '../services/conversion.service';
import { YoutubeService } from '../services/youtube.service';
import { ZodError } from 'zod';
import { convertUrlSchema } from '../../../shared/schema';

@ApiTags('Conversion')
@Controller('api')
export class AppController {
  constructor(
    private readonly conversionService: ConversionService,
    private readonly youtubeService: YoutubeService,
  ) {}

  @Post('youtube-info')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        youtubeUrl: {
          type: 'string',
          example: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'URL de YouTube Music que deseas analizar',
        },
      },
      required: ['youtubeUrl'],
    },
  })
  async getYoutubeInfo(@Body() body: any) {
    try {
      const validated = convertUrlSchema.parse(body);
      return await this.youtubeService.getYoutubeInfo(validated.youtubeUrl);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.errors[0]?.message || 'Invalid input');
      }
      throw new InternalServerErrorException('Failed to fetch track information');
    }
  }

  @Post('convert')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        youtubeUrl: {
          type: 'string',
          example: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'URL de YouTube Music que se convertirá a Spotify',
        },
      },
      required: ['youtubeUrl'],
    },
  })
  async convert(@Body() body: any) {
    console.log('🟢 [AppController] Body recibido en /api/convert:', body);
    try {
      const validated = convertUrlSchema.parse(body);
      return await this.conversionService.getOrCreateConversion(validated.youtubeUrl);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.errors[0]?.message || 'Invalid input');
      }
      throw new InternalServerErrorException('Failed to convert URL');
    }
  }
}