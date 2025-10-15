import { describe, it, expect, vi, afterEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { apiRequest, getQueryFn, queryClient } from '../queryClient';

describe('apiRequest', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends a POST request with JSON body', async () => {
    const mockFetch = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response('ok', { status: 200 }));

    await apiRequest('POST', '/test', { foo: 'bar' });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foo: 'bar' }),
        credentials: 'include',
      }),
    );
  });

  it('returns a response with ok=false when the fetch response is not ok', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response('Bad Request', { status: 400 }),
    );

    const response = await apiRequest('GET', '/fail');
    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
  });
});

describe('getQueryFn', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on successful response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const queryFn = getQueryFn<{ message: string }>({ on401: 'throw' });
    const data = await queryFn({
      client: queryClient,
      queryKey: ['/api/test'],
      signal: new AbortController().signal,
      meta: undefined,
    });

    expect(data).toEqual({ message: 'ok' });
  });

  it('returns null on 401 if configured to returnNull', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    const queryFn = getQueryFn<{ message: string }>({ on401: 'returnNull' });
    const data = await queryFn({
      client: queryClient,
      queryKey: ['/api/test'],
      signal: new AbortController().signal,
      meta: undefined,
    });

    expect(data).toBeNull();
  });

  it('throws error on 401 if configured to throw', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    const queryFn = getQueryFn<{ message: string }>({ on401: 'throw' });

    await expect(
      queryFn({
        client: queryClient,
        queryKey: ['/api/test'],
        signal: new AbortController().signal,
        meta: undefined,
      }),
    ).rejects.toThrow(/401/);
  });
});

describe('queryClient', () => {
  it('creates a QueryClient instance with default configuration', () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(false);
    expect(defaults.queries?.staleTime).toBe(Infinity);
  });
});
