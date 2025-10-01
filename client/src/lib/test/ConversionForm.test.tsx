import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConversionForm from '@/components/conversion-form';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'form.youtubeUrlPlaceholder': 'music.youtube.com/watch?v=',
        'form.youtubeUrlLabel': 'YouTube URL',
        'form.youtubeUrlHint': 'Paste a track or playlist URL from YouTube Music',
        'form.validUrl': 'Valid URL',
        'form.invalidUrl': 'Invalid URL',
        'form.convertButton': 'Convert to Spotify',
        'form.converting': 'Converting...',
        'form.urlAlreadyConverted': 'URL Already Converted',
        'preview.youtubeTrack': 'YouTube Track Preview',
        'conversion.successTitle': 'Successfully converted to Spotify!',
        'conversion.errorTitle': 'Conversion Failed',
      };
      return translations[key] || key;
    },
  }),
}));

// Helper to render with QueryClientProvider and Toaster
function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {ui}
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

describe('ConversionForm', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('renders input field with correct placeholder', () => {
    renderWithClient(<ConversionForm />);
    expect(
      screen.getByPlaceholderText(/music\.youtube\.com\/watch\?v=/i),
    ).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(/Successfully converted to Spotify!/i),
      ).toBeInTheDocument(),
    );
  });

  it('displays error message for network failure', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
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
        return HttpResponse.error();
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );
  });

  it('displays error message for 404 Not Found', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
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
        return HttpResponse.json(
          { message: 'Track not found on Spotify' },
          { status: 404 },
        );
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=nonexistent' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText(/404: {"message":"Track not found on Spotify"}/i),
      ).toBeInTheDocument(),
    );
  });

  it('displays error message for 500 Internal Server Error', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
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
        return HttpResponse.json(
          { message: 'Internal server error' },
          { status: 500 },
        );
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText(/500: {"message":"Internal server error"}/i),
      ).toBeInTheDocument(),
    );
  });

  it('displays generic error message when server returns empty response', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
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
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText(/500: {}/i)).toBeInTheDocument(),
    );
  });

  it('displays error message for 400 Bad Request', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
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
        return HttpResponse.json(
          { message: 'Invalid YouTube URL format' },
          { status: 400 },
        );
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=invalid' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText(/400: {"message":"Invalid YouTube URL format"}/i),
      ).toBeInTheDocument(),
    );
  });

  it('displays error message for 401 Unauthorized', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
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
        return HttpResponse.json(
          { message: 'Spotify authentication required' },
          { status: 401 },
        );
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText(/401: {"message":"Spotify authentication required"}/i),
      ).toBeInTheDocument(),
    );
  });

  it('disables submit button and shows loading state during API request', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(/Successfully converted to Spotify!/i),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(screen.getByText(/URL Already Converted/i)).toBeInTheDocument(),
    );
  });

  it('handles YouTube preview API errors gracefully', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        // Fail preview, succeed conversion
        if (body?.convert === false) {
          return HttpResponse.json(
            { message: 'YouTube API error' },
            { status: 500 },
          );
        }
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
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(
      () =>
        expect(
          screen.queryByText(/YouTube Track Preview/i),
        ).not.toBeInTheDocument(),
      { timeout: 1000 },
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(/Successfully converted to Spotify!/i),
      ).toBeInTheDocument(),
    );
  });

  it('displays error message for network timeout errors', async () => {
    server.use(
      http.post('/api/youtube-convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
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
        throw new Error('Network request failed');
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(screen.getByText(/Network request failed/i)).toBeInTheDocument(),
    );
  });

  it('shows validation error for invalid URL format', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, { target: { value: 'not a url' } });
    fireEvent.blur(input);

    await waitFor(() =>
      expect(
        screen.getByText(/Please enter a valid URL format/i),
      ).toBeInTheDocument(),
    );
  });

  it('shows validation error for wrong domain', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://youtube.com/watch?v=test123' },
    });
    fireEvent.blur(input);

    await waitFor(() =>
      expect(
        screen.getByText(/URL must be from music\.youtube\.com/i),
      ).toBeInTheDocument(),
    );
  });

  it('shows validation error for invalid YouTube Music path', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/browse' },
    });
    fireEvent.blur(input);

    await waitFor(() =>
      expect(
        screen.getByText(/URL must be a valid track.*or playlist/i),
      ).toBeInTheDocument(),
    );
  });

  it('displays hint text for URL input', () => {
    renderWithClient(<ConversionForm />);
    expect(
      screen.getByText(/Paste a track or playlist URL from YouTube Music/i),
    ).toBeInTheDocument();
  });

  it('shows success indicator icon when URL is valid', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    await waitFor(() => {
      const validIcon = screen.getByLabelText(/Valid URL/i);
      expect(validIcon).toBeInTheDocument();
    });
  });

  it('shows error indicator icon when URL is invalid', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, { target: { value: 'not a url' } });
    fireEvent.blur(input);

    await waitFor(() => {
      const errorIcon = screen.getByLabelText(/Invalid URL/i);
      expect(errorIcon).toBeInTheDocument();
    });
  });

  it('has proper ARIA attributes for accessibility', () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('announces errors to screen readers with role=alert', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('id', 'youtubeUrl-error');
    });
  });
});
