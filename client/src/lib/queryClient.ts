import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { getAuthHeaders } from './supabaseClient';
import * as Sentry from '@sentry/react';

const baseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://linkfy-production.up.railway.app');

async function throwIfResNotOk(res: Response, body?: string) {
  if (!res.ok) {
    const text = body ?? ((await res.text()) || res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  const headers: Record<string, string> = { ...(data ? { 'Content-Type': 'application/json' } : {}) };
  if (authHeaders.Authorization) headers.Authorization = authHeaders.Authorization;

  const res = await fetch(`${baseUrl}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    try {
      const text = await res.text();
      Sentry.addBreadcrumb({ category: 'api', message: `${method} ${url} -> ${res.status}`, level: 'error', data: { status: res.status, url } });
      Sentry.captureException(new Error(`API request failed: ${method} ${url} -> ${res.status}: ${text}`));
      await throwIfResNotOk(res, text);
    } catch (e) { }
  }

  return res;
}

type UnauthorizedBehavior = 'returnNull' | 'throw';

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const authHeaders = await getAuthHeaders();
      const headers: Record<string, string> = {};

      // Only add Authorization header if it exists
      if (authHeaders.Authorization) {
        headers.Authorization = authHeaders.Authorization;
      }

      const res = await fetch(`${baseUrl}${queryKey[0] as string}`, {
        headers,
        credentials: 'include',
      });

      if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
