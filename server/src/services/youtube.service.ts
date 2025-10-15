import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { google } from 'googleapis';
import { parseTrackInfo } from '../utils/track-utils';

enum YouTubeLinkType {
  VIDEO = 'videos',
  ALBUM = 'albums',
  PLAYLIST = 'playlists',
  UNKNOWN = 'unknown',
}

interface ParsedYouTubeLink {
  id: string;
  type: YouTubeLinkType;
}

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
    this.logger.log(`➡️ Getting info for URL: ${youtubeUrl}`);

    try {
      const parsedLink = this._parseUrl(youtubeUrl);
      if (parsedLink.type === YouTubeLinkType.UNKNOWN) {
        this.logger.warn(`⚠️ Could not determine API method for URL.`);
      } else {
        const response = await this.youtube[parsedLink.type].list({
          part: ['snippet'],
          id: [parsedLink.id],
        });
        this.logger.log('📦 YouTube API response received.');

        if (response.data.items && response.data.items.length > 0) {
          const item = response.data.items[0];
          const title = item.snippet?.title || 'Unknown Track';
          const channelTitle = item.snippet?.channelTitle || 'Unknown Artist';
          const thumbnailUrl =
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            '';

          this.logger.log(`🎵 Title: ${title}, 👤 Channel: ${channelTitle}`);

          const { trackName, artistName } = parseTrackInfo(title, channelTitle);
          this.logger.log(
            `🎶 Parsed track: "${trackName}" | Artist: "${artistName}"`,
          );

          return {
            trackName,
            artistName,
            thumbnailUrl,
            originalTitle: title,
          };
        } else {
          this.logger.warn(`⚠️ No items found for ID: ${parsedLink.id}`);
        }
      }
    } catch (error) {
      this.logger.error('❌ Error in YouTube Data API call:', error);
    }

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
      this.logger.log('📡 Fallback oEmbed URL: ' + oembedUrl);

      const response = await fetch(oembedUrl);

      if (response.ok) {
        const data = await response.json();
        const title = data.title || 'Unknown Track';
        const channelTitle = data.author_name || 'Unknown Artist';
        const thumbnailUrl = data.thumbnail_url || '';

        this.logger.log(`📨 oEmbed Title: ${title}`);
        this.logger.log(`📨 oEmbed Channel: ${channelTitle}`);

        const { trackName, artistName } = parseTrackInfo(title, channelTitle);

        return {
          trackName,
          artistName,
          thumbnailUrl,
          originalTitle: title,
        };
      } else {
        this.logger.warn(`⚠️ oEmbed response not OK: ${response.status}`);
      }
    } catch (error) {
      this.logger.error('❌ Error in oEmbed fallback:', error);
    }

    throw new NotFoundException('Could not fetch track information from YouTube.');
  }

  private _parseUrl(youtubeUrl: string): ParsedYouTubeLink {
    const url = new URL(youtubeUrl);
    const params = url.searchParams;

    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.slice(1);
      if (videoId) {
        return { id: videoId, type: YouTubeLinkType.VIDEO };
      }
    }

    if (url.pathname === '/watch' && params.has('v')) {
      return { id: params.get('v')!, type: YouTubeLinkType.VIDEO };
    }

    if (url.pathname.startsWith('/playlist') && params.has('list')) {
      return { id: params.get('list')!, type: YouTubeLinkType.PLAYLIST };
    }

    if (url.pathname.startsWith('/browse/')) {
      const albumId = url.pathname.split('/browse/')[1];
      if (albumId) {
        return { id: albumId, type: YouTubeLinkType.ALBUM };
      }
    }

    // Fallback for URLs that might not have a clear API mapping (like albums)
    // but can be handled by oEmbed.
    const videoId = params.get('v');
    if (videoId) return { id: videoId, type: YouTubeLinkType.VIDEO };

    return { id: '', type: YouTubeLinkType.UNKNOWN };
  }
}
