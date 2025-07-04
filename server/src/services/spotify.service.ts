import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SpotifyTrackInfo } from '../../../shared/schema';

@Injectable()
export class SpotifyService {
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID ?? '';
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';
    }

    async getSpotifyAccessToken(): Promise<string> {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Spotify token error:', response.status, errorText);
            throw new InternalServerErrorException('Failed to get Spotify access token');
        }

        const data = await response.json();
        return data.access_token;
    }

    async searchSpotifyTrack(trackName: string, artistName: string): Promise<SpotifyTrackInfo | null> {
        try {
            const accessToken = await this.getSpotifyAccessToken();

            const searchQueries = [
                `"${trackName}" "${artistName}"`,
                `track:"${trackName}" artist:"${artistName}"`,
                `${trackName} ${artistName}`,
                trackName,
            ];

            for (const query of searchQueries) {
                const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;
                const response = await fetch(searchUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    console.error('Spotify search failed:', response.status, response.statusText);
                    continue;
                }

                const data = await response.json();
                const items = data.tracks?.items || [];
                if (items.length === 0) continue;

                for (const track of items) {
                    const spotifyTrackName = track.name.toLowerCase();
                    const spotifyArtistNames = track.artists.map((a: any) => a.name.toLowerCase());

                    const trackNameSimilar =
                        spotifyTrackName.includes(trackName.toLowerCase()) ||
                        trackName.toLowerCase().includes(spotifyTrackName);

                    const artistNameSimilar = spotifyArtistNames.some(
                        (artist: string) =>
                            artist.includes(artistName.toLowerCase()) ||
                            artistName.toLowerCase().includes(artist),
                    );

                    if (trackNameSimilar || artistNameSimilar) {
                        return this.mapSpotifyTrack(track);
                    }
                }

                return this.mapSpotifyTrack(items[0]);
            }

            console.log('No Spotify tracks found for any search query');
            return null;
        } catch (error) {
            console.error('Spotify API error:', error);
            return null;
        }
    }

    private mapSpotifyTrack(track: any): SpotifyTrackInfo {
        return {
            spotifyUrl: track.external_urls.spotify,
            trackName: track.name,
            artistName: track.artists.map((a: any) => a.name).join(', '),
            albumName: track.album.name,
            thumbnailUrl: track.album.images?.[0]?.url || track.album.images?.[1]?.url || '',
        };
    }

    async convertYouTubeMusicToSpotify(youtubeUrl: string): Promise<SpotifyTrackInfo> {
        // Extraer el ID del video de la URL de YouTube Music
        const videoIdMatch = youtubeUrl.match(/[?&]v=([^&]+)/);
        if (!videoIdMatch) {
            throw new InternalServerErrorException('Invalid YouTube Music URL format');
        }
        const videoId = videoIdMatch[1];

        // Intentar con la API de YouTube primero (si tienes la clave configurada)
        const youtubeApiKey = process.env.YOUTUBE_API_KEY;
        if (youtubeApiKey) {
            try {
                const { google } = await import('googleapis');
                const youtube = google.youtube({
                    version: 'v3',
                    auth: youtubeApiKey,
                });
                const response = await youtube.videos.list({
                    part: ['snippet'],
                    id: [videoId],
                });
                if (response.data.items && response.data.items.length > 0) {
                    const video = response.data.items[0];
                    const title = video.snippet?.title || 'Unknown Track';
                    const channelTitle = video.snippet?.channelTitle || 'Unknown Artist';
                    const youtubeThumbnailUrl = video.snippet?.thumbnails?.medium?.url ||
                        video.snippet?.thumbnails?.default?.url || '';
                    const { trackName, artistName } = this.parseTrackInfo(title, channelTitle);
                    // Buscar el track real en Spotify
                    if (this.clientId && this.clientSecret) {
                        const spotifyResult = await this.searchSpotifyTrack(trackName, artistName);
                        if (spotifyResult) {
                            return spotifyResult;
                        }
                    }
                    // Fallback si falla la búsqueda en Spotify
                    const spotifyTrackId = this.generateSpotifyStyleId(trackName, artistName);
                    return {
                        spotifyUrl: `https://open.spotify.com/track/${spotifyTrackId}`,
                        trackName,
                        artistName,
                        albumName: 'Unknown Album',
                        thumbnailUrl: youtubeThumbnailUrl,
                    };
                }
            } catch (apiError) {
                // Continuar con el siguiente método
            }
        }
        // Fallback: Usar oEmbed API (no requiere API key)
        try {
            const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            const response = await fetch(oembedUrl);
            if (response.ok) {
                const data = await response.json();
                const title = data.title || 'Unknown Track';
                const channelTitle = data.author_name || 'Unknown Artist';
                const thumbnailUrl = data.thumbnail_url || '';
                const { trackName, artistName } = this.parseTrackInfo(title, channelTitle);
                if (this.clientId && this.clientSecret) {
                    const spotifyResult = await this.searchSpotifyTrack(trackName, artistName);
                    if (spotifyResult) {
                        return spotifyResult;
                    }
                }
                const spotifyTrackId = this.generateSpotifyStyleId(trackName, artistName);
                return {
                    spotifyUrl: `https://open.spotify.com/track/${spotifyTrackId}`,
                    trackName,
                    artistName,
                    albumName: 'Unknown Album',
                    thumbnailUrl,
                };
            }
        } catch (oembedError) {
            // Continuar con el siguiente método
        }
        // Fallback final: Generar info básica a partir del videoId
        const spotifyTrackId = this.generateSpotifyStyleId(videoId, 'YouTube');
        return {
            spotifyUrl: `https://open.spotify.com/track/${spotifyTrackId}`,
            trackName: `Track ${videoId}`,
            artistName: 'Unknown Artist',
            albumName: 'Unknown Album',
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        };
    }

    private parseTrackInfo(title: string, channelTitle: string): { trackName: string; artistName: string } {
        let trackName = title;
        let artistName = channelTitle;
        // Patrones comunes: "Artist - Track", "Track by Artist", "Track (Artist)"
        if (title.includes(' - ')) {
            const parts = title.split(' - ');
            if (parts.length >= 2) {
                artistName = parts[0].trim();
                trackName = parts.slice(1).join(' - ').trim();
            }
        } else if (title.includes(' by ')) {
            const parts = title.split(' by ');
            if (parts.length >= 2) {
                trackName = parts[0].trim();
                artistName = parts[1].trim();
            }
        }
        // Limpiar el nombre del track (quitar sufijos comunes)
        trackName = trackName
            .replace(/\s*\(Official.*?\)/gi, '')
            .replace(/\s*\[Official.*?\]/gi, '')
            .replace(/\s*- Official.*$/gi, '')
            .replace(/\s*\(Audio\)/gi, '')
            .replace(/\s*\[Audio\]/gi, '')
            .replace(/\s*\(Lyric.*?\)/gi, '')
            .replace(/\s*\[Lyric.*?\]/gi, '')
            .replace(/\s*\(HD\)/gi, '')
            .replace(/\s*\[HD\]/gi, '')
            .trim();
        return { trackName, artistName };
    }

    private generateSpotifyStyleId(trackName: string, artistName: string): string {
        const input = `${trackName.toLowerCase()}-${artistName.toLowerCase()}`;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 22; i++) {
            const charIndex = (input.charCodeAt(i % input.length) + i) % chars.length;
            result += chars[charIndex];
        }
        return result;
    }
}
