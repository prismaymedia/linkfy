import { http, HttpResponse } from 'msw';

type YoutubeBody = { youtubeUrl: string };

export const handlers = [
  http.post('/api/youtube-info', async ({ request }) => {
    const { youtubeUrl } = (await request.json()) as YoutubeBody;

    if (!youtubeUrl || !youtubeUrl.includes('music.youtube.com')) {
      return HttpResponse.json(
        { message: 'Please enter a valid YouTube Music URL' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      trackName:
        'John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
      artistName: 'IMAGINE. (Ultimate Mix, 2020)',
      thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
      originalTitle:
        'IMAGINE. (Ultimate Mix, 2020) - John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
    });
  }),

  http.post('/api/convert', async ({ request }) => {
    const { youtubeUrl } = (await request.json()) as YoutubeBody;

    if (!youtubeUrl || !youtubeUrl.includes('music.youtube.com')) {
      return HttpResponse.json(
        { message: 'Please enter a valid YouTube Music URL' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      spotifyUrl: 'https://open.spotify.com/track/syszkzt3466rytG53xGD3M',
      trackName:
        'John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
      artistName: 'IMAGINE. (Ultimate Mix, 2020)',
      albumName: 'Unknown Album',
      thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
    });
  }),
];
