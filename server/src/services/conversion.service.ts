import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { SpotifyTrackInfo } from '../../../shared/schema';
import { StorageService } from './storage.service';

@Injectable()
export class ConversionService {
    constructor(
        private readonly youtubeService: YoutubeService,
        private readonly storageService: StorageService,
    ) { }

    async getOrCreateConversion(youtubeUrl: string): Promise<SpotifyTrackInfo> {
        console.log('🔄 [ConversionService] Iniciando conversión para:', youtubeUrl);

        const existing = await this.storageService.getConversionByYoutubeUrl(youtubeUrl);
        if (existing?.spotifyUrl) {
            console.log('✅ [ConversionService] Conversión existente encontrada:', existing);
            return {
                spotifyUrl: existing.spotifyUrl ?? '',
                trackName: existing.trackName ?? '',
                artistName: existing.artistName ?? '',
                albumName: existing.albumName ?? '',
                thumbnailUrl: existing.thumbnailUrl ?? '',
            };
        }

        let spotifyInfo: SpotifyTrackInfo;
        try {
            console.log('➡️ [ConversionService] Llamando a youtubeService.convertToSpotify...');
            spotifyInfo = await this.youtubeService.convertToSpotify(youtubeUrl);
            console.log('✅ [ConversionService] Resultado de convertToSpotify:', spotifyInfo);
        } catch (error) {
            console.error('❌ [ConversionService] Error en convertToSpotify:', error);
            throw new InternalServerErrorException('No se pudo convertir la URL de YouTube Music');
        }

        const conversion = await this.storageService.createConversion({ youtubeUrl });
        conversion.spotifyUrl = spotifyInfo.spotifyUrl;
        conversion.trackName = spotifyInfo.trackName;
        conversion.artistName = spotifyInfo.artistName;
        conversion.albumName = spotifyInfo.albumName;
        conversion.thumbnailUrl = spotifyInfo.thumbnailUrl;

        console.log('💾 [ConversionService] Conversión guardada:', conversion);
        return spotifyInfo;
    }
}