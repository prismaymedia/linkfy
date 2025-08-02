import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { SpotifyService } from './spotify.service';
import { SpotifyTrackInfo } from '../../../shared/schema';
import { StorageService } from './storage.service';

@Injectable()
export class ConversionService {
    constructor(
        private readonly youtubeService: YoutubeService,
        private readonly spotifyService: SpotifyService,
        private readonly storageService: StorageService,
    ) { }

    async getOrCreateConversion(youtubeUrl: string): Promise<SpotifyTrackInfo> {
        console.log('🔄 [ConversionService] Iniciando conversión para:', youtubeUrl);

        if (!this.isValidYoutubeUrl(youtubeUrl)) {
            console.warn('❌ [ConversionService] URL inválida:', youtubeUrl);
            throw new BadRequestException('La URL de YouTube no es válida');
        }

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

        const youtubeInfo = await this.youtubeService.getYoutubeInfo(youtubeUrl);
        if (!youtubeInfo) {
            throw new InternalServerErrorException('No se pudo obtener la información de YouTube');
        }

        const spotifyInfo = await this.spotifyService.searchSpotifyTrack(youtubeInfo.trackName, youtubeInfo.artistName);
        if (!spotifyInfo) {
            throw new InternalServerErrorException('No se pudo encontrar la canción en Spotify');
        }

        const conversion = await this.storageService.createConversion({
            youtubeUrl,
            spotifyUrl: spotifyInfo.spotifyUrl,
            trackName: spotifyInfo.trackName,
            artistName: spotifyInfo.artistName,
            albumName: spotifyInfo.albumName,
            thumbnailUrl: spotifyInfo.thumbnailUrl,
        });

        console.log('💾 [ConversionService] Conversión guardada:', conversion);
        return spotifyInfo;
    }

    private isValidYoutubeUrl(url: string): boolean {
        const regex = /^(https?:\/\/)?(music\.)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/)?[a-zA-Z0-9_-]{11}$/;
        return regex.test(url);
    }
}
