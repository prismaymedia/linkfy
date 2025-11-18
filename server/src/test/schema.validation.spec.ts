import { detectPlatform, insertConversionSchema } from '../../../shared/schema';

describe('schema', () => {
  describe('detectPlatform', () => {
    it('should detect youtube platform', () => {
      expect(detectPlatform('https://www.youtube.com/watch?v=12345')).toBe('youtube');
      expect(detectPlatform('https://music.youtube.com/watch?v=12345')).toBe('youtube');
      expect(detectPlatform('https://youtu.be/12345')).toBe('youtube');
    });

    it('should detect spotify platform', () => {
      expect(detectPlatform('https://open.spotify.com/track/12345')).toBe('spotify');
      expect(detectPlatform('spotify:track:12345')).toBe('spotify');
    });

    it('should detect deezer platform', () => {
      expect(detectPlatform('https://www.deezer.com/track/12345')).toBe('deezer');
    });

    it('should detect apple platform', () => {
      expect(detectPlatform('https://music.apple.com/us/album/rehab/12345')).toBe('apple');
    });

    it('should return unknown for other platforms', () => {
      expect(detectPlatform('https://www.google.com')).toBe('unknown');
      expect(detectPlatform('not a url')).toBe('unknown');
    });
  });

  describe('insertConversionSchema', () => {
    it('should validate a correct conversion object', () => {
      const conversion = {
        youtubeUrl: 'https://www.youtube.com/watch?v=12345',
        spotifyUrl: 'https://open.spotify.com/track/12345',
        deezerUrl: 'https://www.deezer.com/track/12345',
        appleUrl: 'https://music.apple.com/us/album/rehab/12345',
      };
      const result = insertConversionSchema.safeParse(conversion);
      expect(result.success).toBe(true);
    });

    it('should not validate an object with missing properties', () => {
      const conversion = {
        youtubeUrl: 'https://www.youtube.com/watch?v=12345',
      };
      const result = insertConversionSchema.safeParse(conversion);
      expect(result.success).toBe(false);
    });

    it('should not validate an object with wrong types', () => {
      const conversion = {
        youtubeUrl: 123,
        spotifyUrl: 'https://open.spotify.com/track/12345',
        deezerUrl: 'https://www.deezer.com/track/12345',
        appleUrl: 'https://music.apple.com/us/album/rehab/12345',
      };
      const result = insertConversionSchema.safeParse(conversion);
      expect(result.success).toBe(false);
    });
  });
});
