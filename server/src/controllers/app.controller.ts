import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ConversionService } from '../services/conversion.service';
import { YoutubeService } from '../services/youtube.service';
import { ZodError, z } from 'zod';
import { convertUrlSchema } from '../../../shared/schema';
import * as Sentry from '@sentry/nestjs';
import { Response } from 'express';

@ApiTags('Conversion')
@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly conversionService: ConversionService,
    private readonly youtubeService: YoutubeService,
  ) { }

  @Post('youtube-convert')
  @ApiOperation({
    summary: 'Get information from YouTube and convert it to Spotify',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        youtubeUrl: {
          type: 'string',
          example: 'https://music.youtube.com/watch?v=YkgkThdzX-8',
          description: 'YouTube Music URL to process',
        },
        convert: {
          type: 'boolean',
          description:
            'If true (default), also convert to Spotify. If false, only return YouTube info.',
          default: true,
        },
      },
      required: ['youtubeUrl'],
    },
  })
  @ApiOkResponse({
    description: 'YouTube info retrieved (preview mode, convert=false)',
    schema: {
      example: {
        trackName: 'Imagine',
        artistName: 'John Lennon',
        thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
        originalTitle: 'John Lennon - Imagine (Remastered)',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Conversion completed successfully (convert=true or omitted)',
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
  async youtubeConvert(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // Validate and coerce input with Zod schema for consistent error messaging
      const RequestSchema = z.object({
        youtubeUrl: convertUrlSchema.shape.youtubeUrl,
        convert: z.coerce.boolean().default(true).optional(),
      });
      const { youtubeUrl, convert } = RequestSchema.parse(body);

      const youtubeInfo = await this.youtubeService.getYoutubeInfo(youtubeUrl);

      if (convert === false) {
        res.status(HttpStatus.OK);
        return youtubeInfo;
      }

      const spotifyInfo =
        await this.conversionService.getOrCreateConversion(youtubeUrl);

      res.status(HttpStatus.CREATED);
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
