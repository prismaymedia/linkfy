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

/**
 * Zod schema for validating and sanitizing music streaming URLs.
 *
 * @throws {ZodError} If the URL doesn't meet validation requirements
 */
export const urlSchema = z
  .string({
    required_error: 'Music URL is required',
  })
  .min(1, 'Please enter a valid music URL')
  .transform((url) => {
    // Automatically correct http:// to https:// for better user experience
    if (url.toLowerCase().startsWith('http://')) {
      return 'https://' + url.substring(7);
    }
    return url;
  })
  .refine((url) => url.toLowerCase().startsWith('https://'), {
    message: 'Please enter a valid URL format (e.g., https://...)',
  })
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        const { hostname, pathname, searchParams } = parsedUrl;

        const normalizedHostname = hostname
          .toLowerCase()
          .replace(/^(www\.)+/, '');

        // Enhanced XSS detection (decode and check for multiple encodings)
        const xssPattern =
          /(<script|javascript:|vbscript:|data:|on\w+\s*=|on\w+\s*%3D|%3Cscript|&#x3c;script|&#60;script|src\s*=|src\s*%3D|src\s*&#x3d;)/i;
        function decodeMulti(str: string, times = 2): string[] {
          const results = [str];
          let last = str;
          for (let i = 0; i < times; i++) {
            try {
              last = decodeURIComponent(last);
              results.push(last);
            } catch {
              break;
            }
          }
          return results;
        }

        for (const [key, value] of searchParams.entries()) {
          for (const decodedKey of decodeMulti(key)) {
            if (xssPattern.test(decodedKey)) {
              return false;
            }
          }
          for (const decodedValue of decodeMulti(value)) {
            if (xssPattern.test(decodedValue)) {
              return false;
            }
          }
        }

        // Enhanced XSS detection in pathname
        for (const decodedPath of decodeMulti(pathname)) {
          if (xssPattern.test(decodedPath)) {
            return false;
          }
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
          if (
            normalizedHostname === 'youtu.be' &&
            /^\/[a-zA-Z0-9_-]+$/.test(pathname)
          )
            return true;
          if (pathname.startsWith('/embed/')) return true;
          if (pathname.startsWith('/shorts/')) return true;
          if (pathname.startsWith('/playlist') && searchParams.has('list'))
            return true;
          return false;
        }

        if (normalizedHostname === 'open.spotify.com') {
          // Spotify currently uses only alphanumeric (base62) IDs, but this regex allows underscores and hyphens for future compatibility.
          return /^\/(track|album|playlist)\/[a-zA-Z0-9_-]+$/.test(pathname);
        }

        if (normalizedHostname.includes('deezer.com')) {
          if (normalizedHostname === 'link.deezer.com') {
            return /^\/s\/[a-zA-Z0-9]+$/.test(pathname);
          }

          return /^\/([a-z]{2}\/)?(track|album|playlist|artist)\/[0-9]+$/.test(pathname);
        }

        if (
          normalizedHostname.includes('music.apple.com') ||
          normalizedHostname.includes('itunes.apple.com')
        ) {
          return /^\/([a-z]{2}\/)?(album|song|playlist)\//.test(pathname);
        }

        return false;
      } catch {
        return false;
      }
    },
    {
      message:
        'URL must be a valid YouTube, Spotify, Deezer, or Apple Music track, album, playlist, or artist link.',
    },
  );

/**
 * Validates a music streaming URL against security and format requirements.
 *
 * @param url - The URL string to validate
 * @returns The validated URL string if valid
 * @throws {ZodError} If the URL fails validation
 */
export const validateUrl = (url: string): string => {
  return urlSchema.parse(url);
};