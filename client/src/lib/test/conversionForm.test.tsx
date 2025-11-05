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
        'form.youtubeUrlHint':
          'Paste a track or playlist URL from YouTube Music',
        'form.validUrl': 'Valid URL',
        'form.invalidUrl': 'Invalid URL',
        'form.convertButton': 'Convert to Spotify',
        'form.converting': 'Converting...',
        'form.duplicateUrlWarning': 'This URL has already been converted.',
        'preview.youtubeTrack': 'YouTube Track Preview',
        'conversion.successTitle': 'Successfully converted to Spotify!',
        'conversion.successDesc': 'Your track is now on Spotify.',
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
  beforeEach(() => {
    server.resetHandlers();
  });

  it('renders input field with correct placeholder', () => {
    renderWithClient(<ConversionForm />);
    expect(
      screen.getByPlaceholderText(/music\.youtube\.com\/watch\?v=/i),
    ).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.json()) as any;

        if (body?.convert === false) {
          return HttpResponse.json({
            type: 'track',
            trackName: 'Preview Track',
            artistName: 'Preview Artist',
            thumbnailUrl: 'https://i.ytimg.com/vi/test/mqdefault.jpg',
          });
        }

        return HttpResponse.json(
          {
            type: 'track',
            spotifyUrl: 'https://open.spotify.com/track/xyz',
            trackName: 'Test Track',
            artistName: 'Test Artist',
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

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = await screen.findByRole('button', {
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
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
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

    const submitButton = await screen.findByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const title = screen.getByText(/Conversion Failed/i);
      expect(title).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('disables submit button and shows loading state during API request', async () => {
    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json({
            type: 'track',
            trackName: 'Preview Track',
            artistName: 'Preview Artist',
            thumbnailUrl: 'https://i.ytimg.com/vi/test/mqdefault.jpg',
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json(
          {
            type: 'track',
            spotifyUrl: 'https://open.spotify.com/track/xyz',
            trackName: 'Test Track',
            artistName: 'Test Artist',
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

    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = await screen.findByRole('button', {
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
      expect(
        screen.getByText(/This URL has already been converted./i),
      ).toBeInTheDocument(),
    );
  });

  it('handles YouTube preview API errors gracefully', async () => {
    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.json()) as any;

        if (body?.convert === false) {
          return HttpResponse.json({
            type: 'track',
            trackName: 'Preview Track',
            artistName: 'Preview Artist',
            thumbnailUrl: 'https://i.ytimg.com/vi/test/mqdefault.jpg',
          });
        }
        return HttpResponse.json(
          {
            type: 'track',
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

    const submitButton = await screen.findByRole('button', {
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
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.json()) as any;
        if (body?.convert === false) {
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

    const submitButton = await screen.findByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const title = screen.getByText(/Conversion Failed/i);
      expect(title).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('displays hint text for URL input', () => {
    renderWithClient(<ConversionForm />);
    expect(
      screen.getByText(/Paste a track or playlist URL from YouTube Music/i),
    ).toBeInTheDocument();
  });

  it('shows success indicator icon when URL is valid', async () => {
    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.json()) as any;

        if (body?.convert === false) {
          return HttpResponse.json({
            type: 'track',
            trackName: 'Preview Track',
            artistName: 'Preview Artist',
            thumbnailUrl: 'https://i.ytimg.com/vi/test/mqdefault.jpg',
          });
        }

        return HttpResponse.json(
          {
            type: 'track',
            spotifyUrl: 'https://open.spotify.com/track/xyz',
            trackName: 'Test Track',
            artistName: 'Test Artist',
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
    });
  });
});
