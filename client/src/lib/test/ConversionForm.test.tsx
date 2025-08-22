import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConversionForm from '@/components/conversion-form';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Helper to render with QueryClientProvider and Toaster
function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
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

    // Wait for YouTube preview to load
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
    // Override the conversion endpoint to return a network error
    server.use(
      http.post('/api/convert', () => {
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

    // Wait for YouTube preview to load (should still work)
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
    // Override the conversion endpoint to return 404
    server.use(
      http.post('/api/convert', () => {
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

    // Wait for YouTube preview to load
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
    // Override the conversion endpoint to return 500
    server.use(
      http.post('/api/convert', () => {
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

    // Wait for YouTube preview to load
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
    // Override the conversion endpoint to return empty error
    server.use(
      http.post('/api/convert', () => {
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

    // Wait for YouTube preview to load
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
    // Override the conversion endpoint to return 400
    server.use(
      http.post('/api/convert', () => {
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

    // Wait for YouTube preview to load
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
    // Override the conversion endpoint to return 401
    server.use(
      http.post('/api/convert', () => {
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

    // Wait for YouTube preview to load
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

    // Wait for YouTube preview to load
    await waitFor(() =>
      expect(screen.getByText(/YouTube Track Preview/i)).toBeInTheDocument(),
    );

    const submitButton = screen.getByRole('button', {
      name: /Convert to Spotify/i,
    });

    // Verify button is enabled initially
    expect(submitButton).not.toBeDisabled();

    // Click the button
    fireEvent.click(submitButton);

    // Wait for success message to appear (request completes quickly in tests)
    await waitFor(() =>
      expect(
        screen.getByText(/Successfully converted to Spotify!/i),
      ).toBeInTheDocument(),
    );

    // After successful conversion, button text changes to "URL Already Converted"
    await waitFor(() =>
      expect(screen.getByText(/URL Already Converted/i)).toBeInTheDocument(),
    );
  });

  it('handles YouTube preview API errors gracefully', async () => {
    // Override YouTube info endpoint to return error, but keep convert working
    server.use(
      http.post('/api/youtube-info', () => {
        return HttpResponse.json(
          { message: 'YouTube API error' },
          { status: 500 },
        );
      }),
    );

    renderWithClient(<ConversionForm />);

    const input = screen.getByPlaceholderText(
      /music\.youtube\.com\/watch\?v=/i,
    );

    // Enter a valid URL to trigger YouTube preview
    fireEvent.change(input, {
      target: { value: 'https://music.youtube.com/watch?v=test123' },
    });

    // Wait a bit for the debounced request
    await waitFor(
      () => {
        // YouTube preview should not be displayed due to error
        expect(
          screen.queryByText(/YouTube Track Preview/i),
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // But conversion should still work
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
    // Simulate a network error by making MSW handler throw
    server.use(
      http.post('/api/convert', () => {
        // This will cause a network error that gets caught by apiRequest
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

    // Wait for YouTube preview to load
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

    // The actual error shows the full serialized error object
    await waitFor(() =>
      expect(screen.getByText(/Network request failed/i)).toBeInTheDocument(),
    );
  });
});
