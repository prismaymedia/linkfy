import React from 'react';
import {
  SiYoutubemusic,
  SiSpotify,
  SiApplemusic
} from 'react-icons/si';

import { FaDeezer } from "react-icons/fa";

export type MusicService = 'youtube' | 'spotify' | 'apple' | 'deezer' | 'unknown';

export interface ServiceIconInfo {
  service: MusicService;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
}

/**
 * Detects the music service from a URL
 *  Optimized for fast updates (< 100ms)
 */
export function detectMusicService(url: string): MusicService {
  if (!url || url.trim() === '') {
    return 'unknown';
  }

  try {
    // Attempt to parse the URL
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');

    // Fast detection by hostname
    if (host.includes('youtube') || host === 'youtu.be') {
      return 'youtube';
    }
    if (host.includes('spotify') || url.startsWith('spotify:')) {
      return 'spotify';
    }
    if (host.includes('music.apple.com') || host.includes('itunes.apple.com')) {
      return 'apple';
    }
    if (host.includes('deezer.com') || host === 'link.deezer.com') {
      return 'deezer';
    }

    return 'unknown';
  } catch {
    // If not a valid URL, attempt to detect by simple patterns
    if (url.includes('youtube') || url.includes('youtu.be')) {
      return 'youtube';
    }
    if (url.includes('spotify')) {
      return 'spotify';
    }
    if (url.includes('music.apple') || url.includes('itunes.apple')) {
      return 'apple';
    }
    if (url.includes('deezer') || url.includes('link.deezer')) {
      return 'deezer';
    }

    return 'unknown';
  }
}

/**
 *  Gets the icon information for a music service
 */
export function getServiceIconInfo(service: MusicService): ServiceIconInfo {
  const serviceMap: Record<MusicService, Omit<ServiceIconInfo, 'service'>> = {
    youtube: {
      Icon: SiYoutubemusic,
      color: 'text-red-600',
      label: 'YouTube Music',
    },
    spotify: {
      Icon: SiSpotify,
      color: 'text-green-600',
      label: 'Spotify',
    },
    apple: {
      Icon: SiApplemusic,
      color: 'text-pink-600',
      label: 'Apple Music',
    },
    deezer: {
      Icon: FaDeezer,
      color: 'text-purple-600',
      label: 'Deezer',
    },
    unknown: {
      Icon: SiYoutubemusic,
      color: 'text-gray-400',
      label: 'Music Service',
    },
  };

  return {
    service,
    ...serviceMap[service],
  };
}

/**
 * Hook to retrieve the music service icon based on a URL.
 * Updates in real time as the user types.
 */
export function useMusicServiceIcon(url: string): ServiceIconInfo {
  const service = React.useMemo(() => detectMusicService(url), [url]);
  return React.useMemo(() => getServiceIconInfo(service), [service]);
}

