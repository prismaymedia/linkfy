import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SpotifyTrackInfo } from '../../../shared/schema';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);

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
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error('Spotify token error:', response.status, errorText);
      throw new InternalServerErrorException(
        'Failed to get Spotify access token',
      );
    }

    const data = await response.json();
    return data.access_token;
  }

  async searchSpotifyTrack(
    trackName: string,
    artistName: string,
  ): Promise<SpotifyTrackInfo | null> {
    try {
      this.logger.log(
        `🔍 Searching Spotify for: "${trackName}" by "${artistName}"`,
      );
      const accessToken = await this.getSpotifyAccessToken();

      const searchQueries = [
        `"${trackName}" "${artistName}"`,
        `track:"${trackName}" artist:"${artistName}"`,
        `${trackName} ${artistName}`,
        trackName,
      ];

      for (const query of searchQueries) {
        this.logger.log(`🔍 Trying query: "${query}"`);
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;
        const response = await fetch(searchUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          this.logger.error(
            'Spotify search failed:',
            response.status,
            response.statusText,
          );
          continue;
        }

        const data = await response.json();
        const items = data.tracks?.items || [];
        if (items.length === 0) {
          this.logger.log(`❌ No results for query: "${query}"`);
          continue;
        }

        this.logger.log(
          `📋 Found ${items.length} results for query: "${query}"`,
        );

        for (const track of items) {
          const spotifyTrackName = track.name.toLowerCase();
          const spotifyArtistNames = track.artists.map((a: any) =>
            a.name.toLowerCase(),
          );

          this.logger.log(
            `🔍 Checking: "${track.name}" by ${track.artists.map((a: any) => a.name).join(', ')}`,
          );

          const trackNameSimilar = this.calculateTrackNameSimilarity(
            trackName.toLowerCase(),
            spotifyTrackName,
          );

          const artistNameSimilar = spotifyArtistNames.some(
            (artist: string) =>
              artist.includes(artistName.toLowerCase()) ||
              artistName.toLowerCase().includes(artist) ||
              this.calculateArtistNameSimilarity(
                artistName.toLowerCase(),
                artist,
              ),
          );

          if (trackNameSimilar && artistNameSimilar) {
            this.logger.log(
              `✅ Match found: "${track.name}" by ${track.artists.map((a: any) => a.name).join(', ')}`,
            );
            return this.mapSpotifyTrack(track);
          }
        }

        this.logger.log(`❌ No match found for query: "${query}"`);
      }

      this.logger.log(
        `❌ No Spotify tracks found for "${trackName}" by "${artistName}"`,
      );
      return null;
    } catch (error) {
      this.logger.error('Spotify API error:', error);
      return null;
    }
  }

  private calculateTrackNameSimilarity(
    youtubeTitle: string,
    spotifyTitle: string,
  ): boolean {
    const cleanYoutube = this.cleanTitle(youtubeTitle);
    const cleanSpotify = this.cleanTitle(spotifyTitle);

    if (cleanYoutube === cleanSpotify) return true;

    if (
      cleanYoutube.includes(cleanSpotify) ||
      cleanSpotify.includes(cleanYoutube)
    ) {
      const lengthDiff = Math.abs(cleanYoutube.length - cleanSpotify.length);
      const maxLength = Math.max(cleanYoutube.length, cleanSpotify.length);
      if (lengthDiff / maxLength > 0.3) return false;
    }

    const youtubeWords = cleanYoutube
      .split(/\s+/)
      .filter((word) => word.length > 2);
    const spotifyWords = cleanSpotify
      .split(/\s+/)
      .filter((word) => word.length > 2);

    if (youtubeWords.length === 0 || spotifyWords.length === 0) return false;

    const significantWords = [
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
    ];
    const filteredYoutubeWords = youtubeWords.filter(
      (word) => !significantWords.includes(word),
    );
    const filteredSpotifyWords = spotifyWords.filter(
      (word) => !significantWords.includes(word),
    );

    if (
      filteredYoutubeWords.length === 0 ||
      filteredSpotifyWords.length === 0
    ) {
      const commonWords = youtubeWords.filter((word) =>
        spotifyWords.some(
          (spotifyWord) => this.levenshteinDistance(word, spotifyWord) <= 1,
        ),
      );

      const similarity =
        commonWords.length / Math.max(youtubeWords.length, spotifyWords.length);
      return similarity >= 0.6;
    }

    const commonWords = filteredYoutubeWords.filter((word) =>
      filteredSpotifyWords.some(
        (spotifyWord) => this.levenshteinDistance(word, spotifyWord) <= 1,
      ),
    );

    const similarity =
      commonWords.length /
      Math.max(filteredYoutubeWords.length, filteredSpotifyWords.length);
    return similarity >= 0.6;
  }

  private calculateArtistNameSimilarity(
    youtubeArtist: string,
    spotifyArtist: string,
  ): boolean {
    const cleanYoutube = this.cleanArtistName(youtubeArtist);
    const cleanSpotify = this.cleanArtistName(spotifyArtist);

    if (cleanYoutube === cleanSpotify) return true;

    if (
      cleanYoutube.includes(cleanSpotify) ||
      cleanSpotify.includes(cleanYoutube)
    )
      return true;

    return this.levenshteinDistance(cleanYoutube, cleanSpotify) <= 2;
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(
        /\b(official|audio|lyric|hd|remix|cover|live|acoustic|instrumental)\b/gi,
        '',
      )
      .trim()
      .toLowerCase();
  }

  private cleanArtistName(artist: string): string {
    return artist
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b(topic|vevo|official|channel)\b/gi, '')
      .trim()
      .toLowerCase();
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private mapSpotifyTrack(track: any): SpotifyTrackInfo {
    return {
      spotifyUrl: track.external_urls.spotify,
      trackName: track.name,
      artistName: track.artists.map((a: any) => a.name).join(', '),
      albumName: track.album.name,
      thumbnailUrl:
        track.album.images?.[0]?.url || track.album.images?.[1]?.url || '',
    };
  }

  private parseTrackInfo(
    title: string,
    channelTitle: string,
  ): { trackName: string; artistName: string } {
    let trackName = title;
    let artistName = channelTitle;
    // Common patterns: "Artist - Track", "Track by Artist", "Track (Artist)"
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
    // Clean the track name (remove common suffixes)
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

  private generateSpotifyStyleId(
    trackName: string,
    artistName: string,
  ): string {
    const input = `${trackName.toLowerCase()}-${artistName.toLowerCase()}`;
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 22; i++) {
      const charIndex = (input.charCodeAt(i % input.length) + i) % chars.length;
      result += chars[charIndex];
    }
    return result;
  }
}
