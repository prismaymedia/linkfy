import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ConversionService } from '../services/conversion.service';
import { YoutubeService } from '../services/youtube.service';
import { ZodError } from 'zod';
import { convertUrlSchema } from '../../../shared/schema';
import * as Sentry from '@sentry/nestjs';

@ApiTags('Conversion')
@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly conversionService: ConversionService,
    private readonly youtubeService: YoutubeService,
  ) { }

  @Post('youtube-info')
  @ApiOperation({ summary: 'Get information from a YouTube Music URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        youtubeUrl: {
          type: 'string',
          example: 'https://music.youtube.com/watch?v=YkgkThdzX-8',
          description: 'YouTube Music URL to analyze',
        },
      },
      required: ['youtubeUrl'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'YouTube track info successfully retrieved',
    schema: {
      example: {
        trackName:
          'John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
        artistName: 'IMAGINE. (Ultimate Mix, 2020)',
        thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
        originalTitle:
          'IMAGINE. (Ultimate Mix, 2020) - John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid YouTube Music URL',
    schema: {
      example: {
        message: 'Please enter a valid YouTube Music URL',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving the YouTube info',
    content: {
      'application/json': {
        example: {
          message: 'Failed to fetch track information',
        },
      },
    },
  })
  async getYoutubeInfo(@Body() body: any) {
    try {
      const validated = convertUrlSchema.parse(body);
      return await this.youtubeService.getYoutubeInfo(validated.youtubeUrl);
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.issues[0]?.message || 'Invalid input',
        );
      }
      throw new InternalServerErrorException(
        'Failed to fetch track information',
      );
    }
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert YouTube Music URL to Spotify' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        youtubeUrl: {
          type: 'string',
          example: 'https://music.youtube.com/watch?v=YkgkThdzX-8',
          description: 'YouTube Music URL to convert to Spotify',
        },
      },
      required: ['youtubeUrl'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Conversion completed successfully',
    schema: {
      example: {
        spotifyUrl: 'https://open.spotify.com/track/syszkzt3466rytG53xGD3M',
        trackName:
          'John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
        artistName: 'IMAGINE. (Ultimate Mix, 2020)',
        albumName: 'Unknown Album',
        thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid YouTube Music URL',
    schema: {
      example: {
        message: 'Please enter a valid YouTube Music URL',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during conversion',
    schema: {
      example: {
        message: 'Failed to convert URL',
      },
    },
  })
  async convert(@Body() body: any) {
    this.logger.log('🟢 [AppController] Body received in /api/convert:', body);
    try {
      const validated = convertUrlSchema.parse(body);
      return await this.conversionService.getOrCreateConversion(
        validated.youtubeUrl,
      );
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.issues[0]?.message || 'Invalid input',
        );
      }
      throw new InternalServerErrorException('Failed to convert URL');
    }
  }
}
