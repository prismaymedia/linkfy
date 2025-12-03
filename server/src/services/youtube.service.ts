import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { google } from 'googleapis';
import { parseTrackInfo } from '../utils/track-utils';
import type { PlaylistInfo, YouTubeTrackInfo, PlaylistTrack } from '../../../shared/schema';

export enum YouTubeLinkType {
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

  public normalizeYoutubeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      const paramsToRemove = ['si', 'feature', 'index', 't'];
      paramsToRemove.forEach((param) => parsed.searchParams.delete(param));

      if (parsed.hostname === 'youtu.be' && parsed.pathname) {
        const id = parsed.pathname.split('/')[1];
        if (id) {
          return `https://www.youtube.com/watch?v=${id}`;
        }
      }

      if (parsed.hostname === 'music.youtube.com') {
        parsed.hostname = 'www.youtube.com';
      }

      return parsed.toString();
    } catch {
      return url;
    }
  }

  async getYoutubeInfo(youtubeUrl: string): Promise<YouTubeTrackInfo> {
    const normalizedUrl = this.normalizeYoutubeUrl(youtubeUrl);
    this.logger.log(`➡️ Normalized YouTube URL: ${normalizedUrl}`);

    try {
      const parsedLink = this.parseUrl(normalizedUrl);

      if (
        parsedLink.type === YouTubeLinkType.UNKNOWN ||
        parsedLink.type === YouTubeLinkType.ALBUM
      ) {
        this.logger.warn(
          `⚠️ Unsupported or unknown link type: ${parsedLink.type}. Falling back to oEmbed.`,
        );
      } else if (parsedLink.type === YouTubeLinkType.PLAYLIST) {
        this.logger.warn(
          `⚠️ Playlist URL detected in getYoutubeInfo. Use getPlaylistTracks instead.`,
        );
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
            type: 'track',
            videoId: parsedLink.id,
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

    // Fallback with oEmbed
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        normalizedUrl,
      )}&format=json`;
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
          type: 'track',
          videoId: this.parseUrl(normalizedUrl).id,
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

  async getPlaylistTracks(playlistUrl: string): Promise<PlaylistInfo> {
    this.logger.log(`📋 Getting playlist or album tracks for URL: ${playlistUrl}`);

    const parsedLink = this.parseUrl(playlistUrl);

    if (
      parsedLink.type !== YouTubeLinkType.PLAYLIST &&
      parsedLink.type !== YouTubeLinkType.ALBUM
    ) {
      throw new NotFoundException('The provided URL is not a valid YouTube playlist or album');
    }

    try {
      const playlistResponse = await this.youtube.playlists.list({
        part: ['snippet'],
        id: [parsedLink.id],
      });

      if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
        throw new NotFoundException('Playlist or album not found');
      }

      const playlistInfo = playlistResponse.data.items[0];
      const playlistTitle =
        playlistInfo.snippet?.title ||
        (parsedLink.type === YouTubeLinkType.ALBUM ? 'Unknown Album' : 'Unknown Playlist');
      const playlistDescription = playlistInfo.snippet?.description || '';

      this.logger.log(
        parsedLink.type === YouTubeLinkType.ALBUM
          ? `💿 Album: ${playlistTitle}`
          : `📋 Playlist: ${playlistTitle}`,
      );

      const tracks: PlaylistTrack[] = [];
      let nextPageToken: string | undefined = undefined;
      let position = 0;

      do {
        const playlistItemsResponse: any = await this.youtube.playlistItems.list({
          part: ['snippet', 'contentDetails'],
          playlistId: parsedLink.id,
          maxResults: 50,
          pageToken: nextPageToken,
        });

        if (playlistItemsResponse.data.items) {
          for (const item of playlistItemsResponse.data.items) {
            const videoId = item.contentDetails?.videoId;
            const title = item.snippet?.title || 'Unknown Track';
            const channelTitle =
              item.snippet?.videoOwnerChannelTitle ||
              item.snippet?.channelTitle ||
              'Unknown Artist';
            const thumbnailUrl =
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.default?.url ||
              '';

            if (title === 'Deleted video' || title === 'Private video') {
              this.logger.warn(`⚠️ Skipping unavailable video at position ${position}`);
              position++;
              continue;
            }

            const { trackName, artistName } = parseTrackInfo(title, channelTitle);

            tracks.push({
              videoId,
              trackName,
              artistName,
              thumbnailUrl,
              originalTitle: title,
              position: position++,
            });
          }
        }

        nextPageToken = playlistItemsResponse.data.nextPageToken;
        this.logger.log(`📄 Processed page, total tracks so far: ${tracks.length}`);
      } while (nextPageToken);

      this.logger.log(`✅ Total tracks extracted: ${tracks.length}`);

      return {
        playlistTitle,
        playlistDescription,
        tracks,
        totalTracks: tracks.length,
      };
    } catch (error) {
      this.logger.error('❌ Error extracting playlist/album tracks:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException('Could not fetch playlist or album information from YouTube');
    }
  }

  public parseUrl(youtubeUrl: string): ParsedYouTubeLink {
    const url = new URL(youtubeUrl);
    const params = url.searchParams;

    // youtu.be short URLs
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.slice(1);
      if (videoId) return { id: videoId, type: YouTubeLinkType.VIDEO };
    }

    if (url.pathname === '/watch' && params.has('v')) {
      const videoId = params.get('v')!;
      const listId = params.get('list');

      if (listId && listId.startsWith('RD')) {
        return { id: videoId, type: YouTubeLinkType.VIDEO };
      }

      if (listId && listId.startsWith('OLAK5uy_')) {
        return { id: listId, type: YouTubeLinkType.ALBUM };
      }

      if (listId) {
        return { id: listId, type: YouTubeLinkType.PLAYLIST };
      }

      return { id: videoId, type: YouTubeLinkType.VIDEO };
    }

    // playlist URLs
    if (url.pathname.startsWith('/playlist') && params.has('list')) {
      const listId = params.get('list')!;
      if (listId.startsWith('OLAK5uy_')) {
        return { id: listId, type: YouTubeLinkType.ALBUM };
      }
      return { id: listId, type: YouTubeLinkType.PLAYLIST };
    }

    // browse/album URLs
    if (url.pathname.startsWith('/browse/')) {
      const albumId = url.pathname.split('/browse/')[1];
      if (albumId) return { id: albumId, type: YouTubeLinkType.ALBUM };
    }

    // but can be handled by oEmbed.
    const videoId = params.get('v');
    if (videoId) return { id: videoId, type: YouTubeLinkType.VIDEO };

    return { id: '', type: YouTubeLinkType.UNKNOWN };
  }
}
