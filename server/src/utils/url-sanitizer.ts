import { z } from 'zod';

export const ALLOWED_HOSTNAMES = [
  'music.youtube.com',
  'youtube.com',
  'youtu.be',
  'm.youtube.com',
  'open.spotify.com',
  'deezer.com',
  'link.deezer.com',
  'music.apple.com',
  'itunes.apple.com',
];

export const urlSchema = z
  .string({
    required_error: 'Music URL is required',
  })
  .min(1, 'Please enter a valid music URL')
  .refine(
    (url) => {
      if (!url.toLowerCase().startsWith('https://')) {
        return false;
      }
      return true;
    },
    'Please enter a valid URL format (starting with https://)',
  )
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        const { hostname, pathname, searchParams } = parsedUrl;
        const normalizedHostname = hostname.toLowerCase().replace(/^www\./, '');

        // Check for XSS patterns in query parameters
        for (const [key, value] of searchParams.entries()) {
          if (/<script|javascript:|on\w+=/i.test(key) || /<script|javascript:|on\w+=/i.test(value)) {
            return false;
          }
        }

        // Check for XSS patterns in pathname
        if (/<script|javascript:|on\w+=/i.test(pathname)) {
          return false;
        }

        if (!ALLOWED_HOSTNAMES.includes(normalizedHostname)) {
          return false;
        }

        if (
          normalizedHostname.includes('youtube') &&
          (pathname.startsWith('/@') || pathname.startsWith('/channel/'))
        ) {
          return false;
        }

        if (
          normalizedHostname.includes('youtube.com') ||
          normalizedHostname === 'youtu.be'
        ) {
          if (pathname === '/watch' && searchParams.has('v')) return true;
          if (normalizedHostname === 'youtu.be' && /^\/[a-zA-Z0-9_-]+$/.test(pathname)) return true;
          if (pathname.startsWith('/embed/')) return true;
          if (pathname.startsWith('/shorts/')) return true;
          if (pathname.startsWith('/playlist') && searchParams.has('list')) return true;
          return false;
        }

        if (normalizedHostname === 'open.spotify.com') {
          return /^\/(track|album|playlist)\/[a-zA-Z0-9]+$/.test(pathname);
        }

        if (normalizedHostname.includes('deezer.com')) {
          if (normalizedHostname === 'link.deezer.com') {
            return /^\/s\/[a-zA-Z0-9]+$/.test(pathname);
          }
          return /^\/(track|album|playlist|artist)\/[0-9]+$/.test(pathname);
        }

        if (normalizedHostname.includes('music.apple.com') || normalizedHostname.includes('itunes.apple.com')) {
          return /^\/([a-z]{2}\/)?(album|song|playlist)\//.test(pathname);
        }

        return false;
      } catch {
        return false;
      }
    },
    {
      message:
        'URL must be a valid YouTube, Spotify, Deezer, or Apple Music track, album, or playlist link.',
    },
  );

export const sanitizeUrl = (url: string): string => {
  const result = urlSchema.safeParse(url);
  if (result.success) {
    return result.data;
  }
  throw new Error('Invalid URL');
};