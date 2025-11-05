import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
} from '@testing-library/react';
import ConversionForm from '@/components/conversion-form';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import type {
  SpotifyTrackInfo,
  YouTubeTrackInfo,
} from '../../../../shared/schema';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (
      key: string,
      options?: string | Record<string, any>,
      defaultValue?: string,
    ) => {
      const translations: Record<string, string> = {
        'form.youtubeUrlPlaceholder': 'music.youtube.com/watch?v=',
        'form.youtubeUrlLabel': 'YouTube URL',
        'form.youtubeUrlHint':
          'Paste a track or playlist URL from YouTube Music',
        'form.loadingPreview': 'Loading preview...',
        'form.validUrl': 'Valid URL',
        'form.invalidUrl': 'Invalid URL',
        'form.convertButton': 'Convert to Spotify',
        'form.converting': 'Converting...',
        'form.duplicateUrlWarning':
          'This URL already converted. Enter a different YouTube Music URL to convert.',
        'form.urlAlreadyConverted': 'URL Already Converted',
        'preview.youtubeTrack': 'YouTube Track Preview',
        'conversion.successTitle': 'Successfully converted to Spotify!',
        'conversion.successDesc': 'Your track is now on Spotify.',
        'conversion.errorTitle': 'Conversion Failed',
      };

      if (translations[key]) {
        return translations[key];
      }
      if (typeof options === 'string') {
        return options;
      }
      if (options && typeof options === 'object' && options.defaultValue) {
        return options.defaultValue;
      }
      if (defaultValue) {
        return defaultValue;
      }
      return key;
    },
  }),
}));

// Helper to render with QueryClientProvider and Toaster
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderWithClient(ui: React.ReactNode) {
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
    cleanup();
    queryClient.clear(); // Clear cache before each test
    server.resetHandlers();
    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.clone().json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
              type: 'track',
              trackName: 'Test Track Preview',
              artistName: 'Test Artist',
              thumbnailUrl: 'http://example.com/thumb.jpg',
              originalTitle: 'Original Test Title',
            },
            { status: 200 },
          );
        } else {
          return HttpResponse.json(
            {
              spotifyUrl: 'https://open.spotify.com/track/testspotify',
              trackName: 'Converted Track',
              artistName: 'Converted Artist',
              albumName: 'Converted Album',
              thumbnailUrl: 'http://example.com/converted_thumb.jpg',
            },
            { status: 201 },
          );
        }
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders input field with correct placeholder', () => {
    renderWithClient(<ConversionForm />);
    expect(
      screen.getByPlaceholderText(/music\.youtube\.com\/watch\?v=/i),
    ).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
    vi.useFakeTimers();
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    vi.useRealTimers();

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Convert to Spotify/i }),
      ).not.toBeDisabled(),
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

  it('displays error message for conversion network failure', async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.clone().json()) as any;
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

    act(() => {
      vi.advanceTimersByTime(500);
    });
    vi.useRealTimers();

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Convert to Spotify/i }),
      ).not.toBeDisabled(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const title = screen.getByText(/Conversion Failed/i);
      expect(title).toBeInTheDocument();
    });

    spy.mockRestore();
  });

  it('shows loading state and disables button during conversion', async () => {
    vi.useFakeTimers();
    let resolveConversion: (response: HttpResponse<SpotifyTrackInfo>) => void;

    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.clone().json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            {
              type: 'track',
              trackName: 'Test Track Preview',
              artistName: 'Test Artist',
              thumbnailUrl: 'http://example.com/thumb.jpg',
              originalTitle: 'Original Test Title',
            },
            { status: 200 },
          );
        } else {
          return new Promise((resolve) => {
            resolveConversion = resolve;
          });
        }
      }),
    );

    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    vi.useRealTimers();

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Convert to Spotify/i }),
      ).not.toBeDisabled(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent(/Convert to Spotify/i);

    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(submitButton).toHaveTextContent(/Converting.../i);

    await act(async () => {
      resolveConversion(
        HttpResponse.json(
          {
            spotifyUrl: 'https://open.spotify.com/track/testspotify',
            trackName: 'Converted Track',
            artistName: 'Converted Artist',
            albumName: 'Converted Album',
            thumbnailUrl: 'http://example.com/converted_thumb.jpg',
          },
          { status: 201 },
        ),
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Successfully converted to Spotify!/i),
      ).toBeInTheDocument();
      // After conversion, the URL is now a duplicate, so the button reflects this
      expect(submitButton).toHaveTextContent(/URL Already Converted/i);
      expect(submitButton).toBeDisabled();
    });
  });

  it('shows duplicate URL warning and disables button if URL was already converted', async () => {
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    // First conversion
    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=first-conversion' },
    });

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Convert to Spotify/i }),
      ).not.toBeDisabled(),
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Convert to Spotify/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText(/Successfully converted to Spotify!/i),
      ).toBeInTheDocument(),
    );

    // Try same URL again
    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=first-conversion' },
    });

    await waitFor(() => {
      const buttonWithWarningText = screen.getByRole('button', {
        name: /URL Already Converted/i,
      });
      expect(buttonWithWarningText).toBeInTheDocument();
      expect(buttonWithWarningText).toBeDisabled();
      expect(
        screen.getByText(
          /This URL already converted\. Enter a different YouTube Music URL to convert\./i,
        ),
      ).toBeInTheDocument();
    });

    // Change to new URL
    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=second-conversion' },
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/URL Already Converted/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          /This URL already converted\. Enter a different YouTube Music URL to convert\./i,
        ),
      ).not.toBeInTheDocument();
      const submitButton = screen.getByRole('button', {
        name: /Convert to Spotify/i,
      });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('handles YouTube preview API errors gracefully', async () => {
    vi.useFakeTimers();
    server.use(
      http.post('/api/convert', async ({ request }) => {
        const body = (await request.clone().json()) as any;
        if (body?.convert === false) {
          return HttpResponse.json(
            { message: 'YouTube API error' },
            { status: 500 },
          );
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

    act(() => {
      vi.advanceTimersByTime(500);
    });
    vi.useRealTimers();

    // Wait for loading to finish and preview to appear (even on error, for graceful handling)
    await waitFor(() => {
      expect(screen.queryByText(/Loading preview.../i)).not.toBeInTheDocument();
    });

    // After the loading is done and the API has failed, the youtubePreview state
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /Convert to Spotify/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('displays error message for conversion network timeout errors', async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

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

    act(() => {
      vi.advanceTimersByTime(500);
    });
    vi.useRealTimers();

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Convert to Spotify/i }),
      ).not.toBeDisabled(),
    );

    const submitButton = await screen.findByRole('button', {
      name: /Convert to Spotify/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Conversion Failed/i)).toBeInTheDocument(),
    );

    spy.mockRestore();
  });

  it('displays hint text for URL input', () => {
    renderWithClient(<ConversionForm />);
    expect(
      screen.getByText(/Paste a track or playlist URL from YouTube Music/i),
    ).toBeInTheDocument();
  });

  it('shows success indicator icon when URL is valid', async () => {
    vi.useFakeTimers();
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    vi.useRealTimers();

    await waitFor(() => {
      const validIcon = screen.getByLabelText(/Valid URL/i);
      expect(validIcon).toBeInTheDocument();
    });
  });

  it('shows error indicator icon when URL is invalid', async () => {
    vi.useFakeTimers();
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, { target: { value: 'not a url' } });
    fireEvent.blur(input);
    vi.useRealTimers();

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
    vi.useFakeTimers();
    renderWithClient(<ConversionForm />);
    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);
    vi.useRealTimers();

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
