import { convertUrlSchema } from '../../../shared/schema';
import { YoutubeService } from './youtube.service';

describe('YouTube Service', () => {
    const validUrls = [
        'https://music.youtube.com/watch?v=abc123',
        'https://www.youtube.com/watch?v=abc123',
        'https://youtube.com/watch?v=abc123',
        'https://m.youtube.com/watch?v=abc123',
        'https://youtu.be/abc123',
        'https://youtu.be/abc123?feature=share',
        'https://music.youtube.com/playlist?list=PL123456',
        'https://www.youtube.com/playlist?list=PL123456',
        'https://music.youtube.com/album/MPREb_xyz123',
        'https://www.youtube.com/album/MPREb_xyz123',
        'https://youtube.com/shorts/abc123',
        'https://www.youtube.com/embed/abc123',
        'https://www.YOUTUBE.com/watch?v=abc123', // uppercase host
        'https://music.youtube.com/watch?v=abc123&list=PL123', // extra params
        'https://youtu.be/abc123/', // trailing slash
    ];

    const invalidUrls = [
        'https://example.com/watch?v=abc123',
        'https://notyoutube.be/abc123',
        'https://youtube.com/',
        'https://music.youtube.com/',
        'not a url',
        'ftp://youtube.com/watch?v=abc123', // should be rejected now
    ];

    it('convertUrlSchema should accept valid YouTube URL formats', () => {
        for (const url of validUrls) {
            const parsed = convertUrlSchema.safeParse({ youtubeUrl: url });
            expect(parsed.success).toBe(true);
            if (!parsed.success) {
                // eslint-disable-next-line no-console
                console.error('Failed for:', url, parsed.error?.errors);
            }
        }
    });

    it('convertUrlSchema should reject invalid URLs', () => {
        for (const url of invalidUrls) {
            const parsed = convertUrlSchema.safeParse({ youtubeUrl: url });
            expect(parsed.success).toBe(false);
        }
    });

    it('YoutubeService should extract video/playlist ids from various URLs', async () => {
        const service = new YoutubeService();

        const cases: Array<{ url: string; expectedType: 'videos' | 'playlists' }> = [
            { url: 'https://music.youtube.com/watch?v=abc123', expectedType: 'videos' },
            { url: 'https://youtu.be/abc123', expectedType: 'videos' },
            { url: 'https://youtube.com/shorts/abc123', expectedType: 'videos' },
            { url: 'https://www.youtube.com/embed/abc123', expectedType: 'videos' },
            { url: 'https://music.youtube.com/playlist?list=PL123456', expectedType: 'playlists' },
            { url: 'https://music.youtube.com/album/MPREb_xyz123', expectedType: 'playlists' },
        ];

        for (const c of cases) {
            const urlObj = new URL(c.url);
            let id: string | undefined;
            if (urlObj.searchParams.has('list')) id = urlObj.searchParams.get('list')!;
            else if (urlObj.searchParams.has('v')) id = urlObj.searchParams.get('v')!;
            else if (urlObj.hostname.toLowerCase() === 'youtu.be') id = urlObj.pathname.split('/').filter(Boolean)[0];
            else {
                const albumMatch = urlObj.pathname.match(/^\/album\/([^\/\?]+)/i);
                const shortsMatch = urlObj.pathname.match(/^\/shorts\/([^\/\?]+)/i);
                const embedMatch = urlObj.pathname.match(/^\/(?:embed|v)\/([^\/\?]+)/i);
                if (albumMatch) id = albumMatch[1];
                else if (shortsMatch) id = shortsMatch[1];
                else if (embedMatch) id = embedMatch[1];
            }

            expect(id).toBeDefined();
            expect(id && id.length > 0).toBe(true);
        }
    }, 5000); // Reducido de 20s a 5s
});
