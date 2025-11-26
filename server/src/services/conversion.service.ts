import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { YoutubeService, YouTubeLinkType } from './youtube.service';
import { SpotifyService } from './spotify.service';
import { ConvertUrlRequest, SpotifyTrackInfo } from '../../../shared/schema';
import { StorageService } from './storage.service';

@Injectable()
export class ConversionService {
  private readonly logger = new Logger(ConversionService.name);

  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly spotifyService: SpotifyService,
    private readonly storageService: StorageService,
  ) { }

  async getOrCreateConversion(
    request: ConvertUrlRequest,
    sourcePlatform: 'youtube' | 'spotify' | 'deezer' | 'apple' | 'unknown',
  ): Promise<SpotifyTrackInfo> {
    try {
      const { url, targetPlatform } = request;

      this.logger.log(
        `🔄 Starting conversion for: ${url} from ${sourcePlatform} to ${targetPlatform}`,
      );

      if (sourcePlatform === 'youtube') {
        if (targetPlatform === 'spotify') {
          // 1️⃣ Validate YouTube URL
          if (!this.isValidYoutubeUrl(url)) {
            this.logger.warn(`❌ Invalid YouTube URL: ${url}`);
            throw new BadRequestException({
              success: false,
              error: 'CONVERSION_FAILED',
              message: 'The YouTube URL is not valid',
            });
          }

          // 2️⃣ Check if conversion already exists in storage
          this.logger.log('🔍 Checking for existing conversion...');
          const existing = await this.storageService.getConversionByYoutubeUrl(url);

          if (existing?.spotifyUrl) {
            this.logger.log(`✅ Existing conversion found: ${existing.spotifyUrl}`);
            return {
              spotifyUrl: existing.spotifyUrl ?? '',
              trackName: existing.trackName ?? '',
              artistName: existing.artistName ?? '',
              albumName: existing.albumName ?? '',
              thumbnailUrl: existing.thumbnailUrl ?? '',
            };
          }

          this.logger.log('🤔 No existing conversion found.');

          // 3️⃣ Get YouTube info
          this.logger.log('ℹ️ Getting YouTube info...');
          const youtubeInfo = await this.youtubeService.getYoutubeInfo(url);

          if (!youtubeInfo) {
            throw new InternalServerErrorException({
              success: false,
              error: 'YOUTUBE_INFO_FAILED',
              message:
                'Could not retrieve YouTube information. The video might be private or unavailable.',
            });
          }

          if (youtubeInfo.type !== 'track') {
            this.logger.warn(
              'Playlist and album conversions are not yet supported.',
            );
            throw new BadRequestException({
              success: false,
              error: 'UNSUPPORTED_CONVERSION',
              message: 'Playlist and album conversions are not yet supported.',
            });
          }

          this.logger.log(`📺 YouTube info found: ${youtubeInfo.originalTitle}`);

          // 4️⃣ Search track on Spotify
          this.logger.log('🎶 Searching track on Spotify...');
          const spotifyInfo = await this.spotifyService.searchSpotifyTrack(
            youtubeInfo.trackName,
            youtubeInfo.artistName,
          );

          if (!spotifyInfo) {
            throw new BadRequestException({
              success: false,
              error: 'SPOTIFY_SEARCH_FAILED',
              message: `Could not find the song on Spotify: "${youtubeInfo.trackName}" by "${youtubeInfo.artistName}"`,
            });
          }

          this.logger.log(`🎤 Spotify track found: ${spotifyInfo.spotifyUrl}`);

          // 5️⃣ Save conversion
          this.logger.log('💾 Saving conversion...');
          const conversion = await this.storageService.createConversion({
            youtubeUrl: url,
            spotifyUrl: spotifyInfo.spotifyUrl,
            trackName: spotifyInfo.trackName,
            artistName: spotifyInfo.artistName,
            albumName: spotifyInfo.albumName,
            thumbnailUrl: spotifyInfo.thumbnailUrl,
          });

          this.logger.log(`💾 Conversion saved: ${conversion.spotifyUrl}`);
          return spotifyInfo;
        } else {
          // YouTube to other platforms (Deezer, Apple) - Not yet supported
          this.logger.warn(
            `Conversion from YouTube to ${targetPlatform} is not yet supported.`,
          );
          throw new BadRequestException({
            success: false,
            error: 'UNSUPPORTED_CONVERSION',
            message: `Conversion from 'youtube' to '${targetPlatform}' is not yet supported.`,
          });
        }
      } else if (sourcePlatform === 'spotify') {
        this.logger.warn(
          `Conversion from Spotify to ${targetPlatform} is not yet supported.`,
        );
        throw new BadRequestException({
          success: false,
          error: 'UNSUPPORTED_CONVERSION',
          message: `Conversion from 'spotify' to '${targetPlatform}' is not yet supported.`,
        });
      } else if (sourcePlatform === 'deezer') {
        this.logger.warn(
          `Conversion from Deezer to ${targetPlatform} is not yet supported.`,
        );
        throw new BadRequestException({
          success: false,
          error: 'UNSUPPORTED_CONVERSION',
          message: `Conversion from 'deezer' to '${targetPlatform}' is not yet supported.`,
        });
      } else if (sourcePlatform === 'unknown') {
        this.logger.warn(`Unknown source platform for URL: ${url}`);
        throw new BadRequestException({
          success: false,
          error: 'UNKNOWN_SOURCE_PLATFORM',
          message: 'Could not detect source platform from the provided URL.',
        });
      }

      throw new BadRequestException({
        success: false,
        error: 'UNSUPPORTED_CONVERSION',
        message: `Conversion from ${sourcePlatform} to ${targetPlatform} is not yet supported.`,
      });
    } catch (error) {
      this.logger.error('🔥 UNHANDLED ERROR IN CONVERSION:', error);
      throw error;
    }
  }

  private isValidYoutubeUrl(url: string): boolean {
    try {
      const parsed = this.youtubeService.parseUrl(url);
      // We consider it valid if the parser can identify it as a video, playlist, or album.
      return parsed.type !== YouTubeLinkType.UNKNOWN;
    } catch (error) {
      // If URL parsing fails, it's not a valid URL.
      this.logger.debug(`URL parsing failed for ${url}`, error);
      return false;
    }
  }
}
