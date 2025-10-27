import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { SpotifyService } from './spotify.service';
import { SpotifyTrackInfo } from '../../../shared/schema';
import { StorageService } from './storage.service';

@Injectable()
export class ConversionService {
  private readonly logger = new Logger(ConversionService.name);

  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly spotifyService: SpotifyService,
    private readonly storageService: StorageService,
  ) { }

  async getOrCreateConversion(youtubeUrl: string): Promise<SpotifyTrackInfo> {
    this.logger.log(`🔄 Starting conversion for: ${youtubeUrl}`);

    // 1️⃣ Validate YouTube URL
    if (!this.isValidYoutubeUrl(youtubeUrl)) {
      this.logger.warn(`❌ Invalid YouTube URL: ${youtubeUrl}`);
      throw new BadRequestException({
        success: false,
        error: 'CONVERSION_FAILED',
        message: 'The YouTube URL is not valid',
      });
    }

    // 2️⃣ Check if conversion already exists in storage
    const existing = await this.storageService.getConversionByYoutubeUrl(
      youtubeUrl,
    );
    if (existing?.spotifyUrl) {
      this.logger.log(`✅ Existing conversion found: ${existing.spotifyUrl}`);
      this.logger.log(`🔄 Duplicate request detected, returning existing conversion for: ${youtubeUrl}`);
      return {
        spotifyUrl: existing.spotifyUrl ?? '',
        trackName: existing.trackName ?? '',
        artistName: existing.artistName ?? '',
        albumName: existing.albumName ?? '',
        thumbnailUrl: existing.thumbnailUrl ?? '',
      };
    }

    // 3️⃣ Get YouTube info
    const youtubeInfo = await this.youtubeService.getYoutubeInfo(youtubeUrl);
    if (!youtubeInfo) {
      throw new InternalServerErrorException({
        success: false,
        error: 'YOUTUBE_INFO_FAILED',
        message:
          'Could not retrieve YouTube information. The video might be private or unavailable.',
      });
    }

    // 4️⃣ Search track on Spotify
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

    // 5️⃣ Save conversion
    const conversion = await this.storageService.createConversion({
      youtubeUrl,
      spotifyUrl: spotifyInfo.spotifyUrl,
      trackName: spotifyInfo.trackName,
      artistName: spotifyInfo.artistName,
      albumName: spotifyInfo.albumName,
      thumbnailUrl: spotifyInfo.thumbnailUrl,
    });

    this.logger.log(`💾 Conversion saved: ${conversion.spotifyUrl}`);
    return spotifyInfo;
  }

  private isValidYoutubeUrl(url: string): boolean {
    const regex =
      /^(https?:\/\/)?(music\.)?(www\.)?(youtube\.com|youtu\.be|youtu\.be\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(&[a-zA-Z0-9_=&-]+)?$/;
    return regex.test(url);
  }
}
