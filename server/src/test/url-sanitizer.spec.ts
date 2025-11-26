import { urlSchema } from '../utils/url-sanitizer';

describe('urlSchema', () => {
  describe('Valid URLs', () => {
    const validUrls = [
      'http://music.youtube.com/watch?v=6Ejga4kJUts',
      'https://music.youtube.com/watch?v=6Ejga4kJUts',
      'https://www.youtube.com/watch?v=6Ejga4kJUts',
      'https://youtu.be/6Ejga4kJUts',
      'https://open.spotify.com/track/0sNnt52in8k0g96pU16F58',
      'https://deezer.com/track/123456',
      'https://music.apple.com/us/album/rehab/1440821343?i=1440821348',
    ];

    it.each(validUrls)('should validate a valid URL: %s', (url) => {
      const result = urlSchema.safeParse(url);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid URLs', () => {
    const invalidUrls = [
      'https://vimeo.com/123456',
      'not a url',
      'https://',
      'https://music.youtube.com',
      'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ',
      'https://www.youtube.com/@metallica',
    ];

    it.each(invalidUrls)('should invalidate an invalid URL: %s', (url) => {
      const result = urlSchema.safeParse(url);
      expect(result.success).toBe(false);
    });
  });

  describe('XSS Attack Vectors', () => {
    const xssVectors = [
      'javascript:alert("XSS")',
      'https://example.com?"><script>alert("XSS")</script>',
      'https://music.youtube.com/watch?v=6Ejga4kJUts&p=<script>alert("XSS")</script>',
      '"><img src=x onerror=alert("XSS")>',
    ];

    it.each(xssVectors)('should invalidate an XSS attack vector: %s', (url) => {
      const result = urlSchema.safeParse(url);
      expect(result.success).toBe(false);
    });
  });
});
