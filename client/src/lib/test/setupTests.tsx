import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from '../mocks/server';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Supabase client
vi.mock('../lib/supabaseClient', () => {
  return {
    supabase: {
      auth: {
        signInWithOAuth: vi.fn(),
        getSession: vi.fn().mockResolvedValue({ data: null, error: null }),
        signOut: vi.fn(),
      },
    },
  };
});

// Start MSW before all tests
beforeAll(() => server.listen());

// Clean up between tests and reset handlers
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Close MSW after all tests
afterAll(() => server.close());
