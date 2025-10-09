import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  Res,
  HttpStatus,
  UseGuards,
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
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { User } from '@supabase/supabase-js';

@ApiTags('Conversion')
@Controller('api')
@UseGuards(SupabaseAuthGuard)
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
    @CurrentUser() user: User,
  ) {
    try {
      // Log user information for debugging
      this.logger.log(`Processing conversion request for user: ${user.email}`);

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
    } catch (error: any) {
      try {
        if (user) Sentry.setUser({ id: user.id, username: user.email ? user.email.split('@')[0] : undefined });
        Sentry.setContext('request', { body, route: 'youtube-convert' });
      } catch (e) { }

      Sentry.captureException(error);

      try {
        if (error?.response?.error) Sentry.captureMessage(`Conversion error: ${error.response.error}`, 'error');
      } catch (e) { }

      // Validation error (invalid YouTube URL)
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: 'CONVERSION_FAILED',
          message: 'The provided URL is not a valid YouTube link.',
        });
      }

      // Errors from ConversionService
      if (error.response?.error === 'YOUTUBE_INFO_FAILED') {
        throw new InternalServerErrorException({
          success: false,
          error: 'YOUTUBE_INFO_FAILED',
          message: 'Could not retrieve YouTube information. The video might be private or unavailable.',
        });
      }

      if (error.response?.error === 'SPOTIFY_SEARCH_FAILED') {
        throw new BadRequestException({
          success: false,
          error: 'SPOTIFY_SEARCH_FAILED',
          message: 'The song could not be found on Spotify. It might not be available on the platform.',
        });
      }

      // Default fallback for unexpected errors
      throw new InternalServerErrorException({
        success: false,
        error: 'CONVERSION_FAILED',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }

  @Post('user-info')
  @ApiOperation({
    summary: 'Get current user information',
  })
  @ApiOkResponse({
    description: 'User information retrieved successfully',
    schema: {
      example: {
        id: 'user-uuid',
        email: 'user@example.com',
        full_name: 'John Doe',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    },
  })
  async getUserInfo(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      created_at: user.created_at,
    };
  }
}
