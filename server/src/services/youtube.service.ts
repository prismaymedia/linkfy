import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { parseTrackInfo } from '../utils/track-utils';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly youtube: any;

  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
  }

  async getYoutubeInfo(youtubeUrl: string): Promise<{
    trackName: string;
    artistName: string;
    thumbnailUrl: string;
    originalTitle: string;
  }> {
    this.logger.log('➡️ getYoutubeInfo(): ' + youtubeUrl);

    try {
      const url = new URL(youtubeUrl);
      let id: string | undefined;
      let apiMethod: 'videos' | 'playlists' | undefined;

      const hostname = url.hostname.toLowerCase();
      const pathname = url.pathname || '';

      // Playlist by list param
      if (url.searchParams.has('list')) {
        id = url.searchParams.get('list')!;
        apiMethod = 'playlists';
      }

      // Album URLs: /album/{id}
      if (!id) {
        const albumMatch = pathname.match(/^\/album\/([^\/\?]+)/i);
        if (albumMatch) {
          id = albumMatch[1];
          apiMethod = 'playlists'; // Albums are treated as playlists in YouTube API
        }
      }

      // Video by v param
      if (!id && url.searchParams.has('v')) {
        id = url.searchParams.get('v')!;
        apiMethod = 'videos';
      }

      // youtu.be short links: https://youtu.be/{id}
      if (!id && hostname === 'youtu.be') {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length >= 1) {
          id = parts[0];
          apiMethod = 'videos';
        }
      }

      // /shorts/{id} or /embed/{id} or /v/{id}
      if (!id) {
        const shortsMatch = pathname.match(/^\/shorts\/([^\/\?]+)/i);
        const embedMatch = pathname.match(/^\/(?:embed|v)\/([^\/\?]+)/i);
        if (shortsMatch) {
          id = shortsMatch[1];
          apiMethod = 'videos';
        } else if (embedMatch) {
          id = embedMatch[1];
          apiMethod = 'videos';
        }
      }

      if (!id || !apiMethod) {
        throw new Error('Invalid YouTube Music URL format');
      }

      this.logger.log(
        `🎥 ${apiMethod === 'videos' ? 'Video' : 'Playlist'} ID extracted: ` +
        id,
      );

      const response = await this.youtube[apiMethod].list({
        part: ['snippet'],
        id: [id],
      });
      this.logger.log('📦 YouTube API response: ' + response.data);

      if (response.data.items && response.data.items.length > 0) {
        const item = response.data.items[0];
        const title = item.snippet?.title || 'Unknown Track';
        const channelTitle = item.snippet?.channelTitle || 'Unknown Artist';
        const thumbnailUrl =
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          '';

        this.logger.log('🎵 Title: ' + title);
        this.logger.log('👤 Channel: ' + channelTitle);

        const { trackName, artistName } = parseTrackInfo(title, channelTitle);
        this.logger.log(
          '🎶 Parsed track: ' + trackName + ' | Artist: ' + artistName,
        );
        this.logger.log('🔍 DEBUG - Raw title from YouTube: "' + title + '"');
        this.logger.log(
          '🔍 DEBUG - Raw channel from YouTube: "' + channelTitle + '"',
        );
        this.logger.log(
          '🔍 DEBUG - After parsing - Track: "' +
          trackName +
          '" | Artist: "' +
          artistName +
          '"',
        );

        return {
          trackName,
          artistName,
          thumbnailUrl,
          originalTitle: title,
        };
      } else {
        this.logger.warn('⚠️ No items found for ID');
      }
    } catch (error) {
      console.error('❌ Error in YouTube API:', error);
    }

    // fallback to oEmbed
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${youtubeUrl}&format=json`;
      this.logger.log('📡 Fallback oEmbed URL: ' + oembedUrl);

      const response = await fetch(oembedUrl);

      if (response.ok) {
        const data = await response.json();
        const title = data.title || 'Unknown Track';
        const channelTitle = data.author_name || 'Unknown Artist';
        const thumbnailUrl = data.thumbnail_url || '';

        this.logger.log('📨 oEmbed Title: ' + title);
        this.logger.log('📨 oEmbed Channel: ' + channelTitle);

        const { trackName, artistName } = parseTrackInfo(title, channelTitle);

        return {
          trackName,
          artistName,
          thumbnailUrl,
          originalTitle: title,
        };
      } else {
        this.logger.warn('⚠️ oEmbed response not OK: ' + response.status);
      }
    } catch (error) {
      console.error('❌ Error in oEmbed fallback:', error);
    }

    throw new Error('Could not fetch track information');
  }
}
