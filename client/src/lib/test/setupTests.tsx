import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from '../mocks/server';
import React from 'react';

// Make React available globally for JSX
(globalThis as any).React = React;

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

// Start MSW before all tests
beforeAll(() => server.listen());

// Clean up between tests and reset handlers
afterEach(() => {
  cleanup();
  server.resetHandlers();
  // Clear all toasts between tests
  const toasts = document.querySelectorAll('[data-radix-collection-item]');
  toasts.forEach(toast => toast.remove());
});

// Close MSW after all tests
afterAll(() => server.close());
