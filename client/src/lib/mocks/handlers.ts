import { http, HttpResponse } from 'msw';

type YoutubeBody = { url: string; convert?: boolean; targetPlatform?: string };

export const handlers = [
  http.post('/api/convert', async ({ request }) => {
    const { url, convert } = (await request.json()) as YoutubeBody;

    if (!url || !url.includes('music.youtube.com')) {
      return HttpResponse.json(
        { message: 'Please enter a valid YouTube Music URL' },
        { status: 400 },
      );
    }

    // Preview mode
    if (convert === false) {
      return HttpResponse.json(
        {
          type: 'track',
          trackName:
            'John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
          artistName: 'IMAGINE. (Ultimate Mix, 2020)',
          thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
          originalTitle:
            'IMAGINE. (Ultimate Mix, 2020) - John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
        },
        { status: 200 },
      );
    }

    // Conversion mode
    return HttpResponse.json(
      {
        spotifyUrl: 'https://open.spotify.com/track/syszkzt3466rytG53xGD3M',
        trackName:
          'John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
        artistName: 'IMAGINE. (Ultimate Mix, 2020)',
        albumName: 'Unknown Album',
        thumbnailUrl: 'https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg',
        originalTitle:
          'IMAGINE. (Ultimate Mix, 2020) - John Lennon & The Plastic Ono Band (with the Flux Fiddlers) HD',
      },
      { status: 201 },
    );
  }),
];
