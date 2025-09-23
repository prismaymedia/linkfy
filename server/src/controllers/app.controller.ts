import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  BadRequestException,
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

  @Post('youtube-convert')
  @ApiOperation({ summary: 'Get information from YouTube and convert it to Spotify' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        youtubeUrl: {
          type: 'string',
          example: 'https://music.youtube.com/watch?v=YkgkThdzX-8',
          description: 'YouTube Music URL to process',
        },
      },
      required: ['youtubeUrl'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'YouTube info retrieved and optionally converted to Spotify',
    schema: {
      example: {
        trackName: 'Imagine',
        artistName: 'John Lennon',
        thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
        originalTitle: 'John Lennon - Imagine (Remastered)',
        spotifyUrl: 'https://open.spotify.com/track/12345',
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
    description: 'An error occurred during processing',
    content: {
      'application/json': {
        example: {
          message: 'Failed to process the request',
        },
      },
    },
  })
  async youtubeConvert(@Body() body: { youtubeUrl: string; convert?: boolean }) {
    const { youtubeUrl, convert } = body;

    try {
      // Validate input with Zod schema for consistent error messaging
      convertUrlSchema.parse({ youtubeUrl });

      const youtubeInfo = await this.youtubeService.getYoutubeInfo(youtubeUrl);

      if (convert === false) {
        return youtubeInfo;
      }

      const spotifyInfo =
        await this.conversionService.getOrCreateConversion(youtubeUrl);

      return { ...youtubeInfo, spotifyUrl: spotifyInfo.spotifyUrl };
    } catch (error) {
      Sentry.captureException(error);

      if (error instanceof ZodError) {
        Sentry.captureMessage('Validation error: Invalid YouTube URL');
        throw new BadRequestException(
          error.issues[0]?.message || 'Invalid input',
        );
      }

      Sentry.captureMessage('Internal server error during YouTube conversion');
      throw new InternalServerErrorException('Failed to process the request');
    }
  }
}
