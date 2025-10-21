import { convertUrlSchema } from '../../../shared/schema';

describe('convertUrlSchema', () => {
    describe('youtubeUrl validation', () => {
        const validUrls = [
            //  Standard YouTube Music URLs
            'https://music.youtube.com/watch?v=6Ejga4kJUts',
            'https://music.youtube.com/watch?v=6Ejga4kJUts&si=abc123',
            'https://music.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
            'https://music.youtube.com/browse/MPREb_UzYVnXn8q7N',

            //  Standard YouTube URLs
            'https://www.youtube.com/watch?v=6Ejga4kJUts',
            'https://youtube.com/watch?v=6Ejga4kJUts',
            'https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',

            //  Mobile YouTube URLs
            'https://m.youtube.com/watch?v=6Ejga4kJUts',
            'https://m.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',

            //  Shortened URLs
            'https://youtu.be/6Ejga4kJUts',
            'https://youtu.be/6Ejga4kJUts?si=xyz789',

            //  Edge cases
            'HTTPS://MUSIC.YOUTUBE.COM/watch?v=6Ejga4kJUts', // Uppercase hostname
            'https://music.youtube.com/watch?v=6Ejga4kJUts/', // Trailing slash
        ];

        it.each(validUrls)('should validate a valid URL: %s', (url) => {
            const result = convertUrlSchema.safeParse({ youtubeUrl: url });
            if (!result.success) {
                console.error(`Validation failed for ${url}:`, result.error.issues);
            }
            expect(result.success).toBe(true);
        });

        const invalidUrls = [
            // Invalid domain
            'https://vimeo.com/123456',
            'https://spotify.com/track/123456',

            // Malformed URLs
            'not a url',
            'https://',
            'https://music.youtube.com', // No path/params
            'https://www.youtube.com',

            // Channel URLs (explicitly blocked)
            'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ',
            'https://music.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ',
            'https://m.youtube.com/channel/UC-9-kyTW8ZkZ-NDHQJ6FgpwQ',
            'https://www.youtube.com/@metallica',
            'https://music.youtube.com/@metallica',

            // Other invalid YouTube URLs
            'https://www.youtube.com/feed/trending',
            'https://youtu.be/', // Shortened URL without ID
            'https://www.youtube.com/watch', // Missing 'v' param
            'https://www.youtube.com/playlist', // Missing 'list' param
        ];

        it.each(invalidUrls)('should invalidate an invalid URL: %s', (url) => {
            const result = convertUrlSchema.safeParse({ youtubeUrl: url });
            expect(result.success).toBe(false);
        });

        it('should return a specific error message for channel URLs', () => {
            const url = 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ';
            const result = convertUrlSchema.safeParse({ youtubeUrl: url });
            if (!result.success) {
                expect(result.error.errors[0].message).toBe(
                    'URL must be a valid track (/watch?v=...) or playlist (/playlist?list=...).',
                );
            } else {
                // Fail the test if it unexpectedly succeeds
                fail('Channel URL should have failed validation');
            }
        });

        it('should return a specific error message for non-YouTube URLs', () => {
            const url = 'https://www.google.com';
            const result = convertUrlSchema.safeParse({ youtubeUrl: url });
            if (!result.success) {
                expect(result.error.errors[0].message).toBe(
                    'URL must be a valid track (/watch?v=...) or playlist (/playlist?list=...).',
                );
            } else {
                fail('Non-YouTube URL should have failed validation');
            }
        });

        it('should return a specific error message for invalid URL format', () => {
            const url = 'not-a-valid-url';
            const result = convertUrlSchema.safeParse({ youtubeUrl: url });
            if (!result.success) {
                expect(result.error.errors[0].message).toBe(
                    'Please enter a valid URL format (starting with https://)',
                );
            } else {
                fail('Malformed URL should have failed validation');
            }
        });
    });
});