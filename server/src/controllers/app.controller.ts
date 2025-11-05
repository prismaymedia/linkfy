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
import { YoutubeService, YouTubeLinkType } from '../services/youtube.service';
import { ZodError, z } from 'zod';
import { convertUrlSchema, detectPlatform } from '../../../shared/schema';
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

  @Post('convert')
  @ApiOperation({
    summary: 'Universal convert endpoint: detect source platform and convert metadata/audio',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://music.youtube.com/watch?v=YkgkThdzX-8',
          description: 'Music URL (YouTube, Spotify, Deezer, etc.) to process',
        },
        targetPlatform: {
          type: 'string',
          enum: ['spotify', 'deezer', 'apple'],
          description: 'Target platform for conversion / lookup (default: spotify)',
          default: 'spotify',
        },
        convert: {
          type: 'boolean',
          description:
            'If true (default), perform conversion (create or return converted resource). If false, only return preview info.',
          default: true,
        },
        format: {
          type: 'string',
          enum: ['mp3', 'wav', 'flac'],
          description: 'Desired audio output format (if audio conversion is supported).',
          default: 'mp3',
        },
      },
      required: ['url'],
    },
  })
  @ApiOkResponse({
    description: 'Preview info retrieved (convert=false)',
    schema: {
      example: {
        success: true,
        sourcePlatform: 'youtube',
        trackName: 'Imagine',
        artistName: 'John Lennon',
        thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
        originalTitle: 'John Lennon - Imagine (Remastered)',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Conversion completed successfully (convert=true)',
    schema: {
      example: {
        success: true,
        sourcePlatform: 'youtube',
        targetPlatform: 'spotify',
        trackName: 'Imagine',
        artistName: 'John Lennon',
        thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
        spotifyUrl: 'https://open.spotify.com/track/12345',
        format: 'mp3',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid URL or unsupported format/platform',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred during processing',
  })
  async convert(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ) {
    try {
      this.logger.log(`Processing conversion request for user: ${user?.email ?? 'anonymous'}`);

      const RequestSchema = z.object({
        url: convertUrlSchema.shape.url,
        targetPlatform: convertUrlSchema.shape.targetPlatform.optional(),
        convert: z.coerce.boolean().default(true).optional(),
        format: z.enum(['mp3', 'wav', 'flac']).default('mp3'),
      });

      const { url, targetPlatform, convert, format } = RequestSchema.parse(body);

      const sourcePlatform = detectPlatform(url);

      this.logger.log(`Detected source platform: ${sourcePlatform} for url: ${url}`);

      if (convert === false) {
        if (sourcePlatform === 'youtube') {
          const parsedUrl = this.youtubeService.parseUrl(url);

          if (parsedUrl.type === YouTubeLinkType.PLAYLIST) {
            const playlistInfo = await this.youtubeService.getPlaylistTracks(url);
            res.status(HttpStatus.OK);
            return {
              success: true,
              sourcePlatform,
              type: 'playlist',
              ...playlistInfo,
            };
          }

          const ytInfo = await this.youtubeService.getYoutubeInfo(url);
          res.status(HttpStatus.OK);
          return {
            success: true,
            sourcePlatform,
            ...ytInfo,
          };
        } else {
          res.status(HttpStatus.OK);
          return {
            success: true,
            sourcePlatform,
            url,
          };
        }
      }

      const conversionResult = await this.conversionService.getOrCreateConversion({
        url,
        targetPlatform: targetPlatform ?? 'spotify',
      }, sourcePlatform);

      res.status(HttpStatus.CREATED);
      return {
        success: true,
        sourcePlatform,
        targetPlatform: targetPlatform ?? 'spotify',
        format,
        ...conversionResult,
      };
    } catch (error: any) {
      try {
        if (user)
          Sentry.setUser({
            id: user.id,
            username: user.email ? user.email.split('@')[0] : undefined,
          });
        Sentry.setContext('request', { body, route: 'convert' });
      } catch (e) { }

      Sentry.captureException(error);

      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: 'INVALID_INPUT',
          message: 'Invalid input. Please check `url`, `targetPlatform` and `format`.',
          details: error.flatten?.() ?? undefined,
        });
      }

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

      // Fallback
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
