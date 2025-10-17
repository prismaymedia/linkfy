import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import React from 'react';

// Full mock of supabaseClient
vi.mock('@/lib/supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
    },
  };
});

import { supabase } from '@/lib/supabaseClient';

// Test component that consumes the AuthContext
function TestComponent() {
  const { user, session, loading, signOut } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user?.email ?? 'no-user'}</div>
      <div data-testid="session">{session ? 'yes-session' : 'no-session'}</div>
      <button onClick={signOut}>signOut</button>
    </div>
  );
}

const mockUser = { id: '123', email: 'test@example.com' } as any;
const mockSession = { user: mockUser } as any;

let onAuthStateChangeCallback: (event: string, session: any) => void;

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock getSession to return an active session
    (
      supabase.auth.getSession as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock onAuthStateChange to provide an unsubscribe function
    (supabase.auth.onAuthStateChange as unknown as Mock).mockImplementation(
      (callback) => {
        onAuthStateChangeCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    );

    // Mock signOut to return no error
    (
      supabase.auth.signOut as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ error: null });
  });

  it('loads initial session', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('loading').textContent).toBe('loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
      expect(screen.getByTestId('session').textContent).toBe('yes-session');
    });
  });

  it('clears user on signOut', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    });

    screen.getByText('signOut').click();

    act(() => {
      onAuthStateChangeCallback('SIGNED_OUT', null);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('no-user');
      expect(screen.getByTestId('session').textContent).toBe('no-session');
    });
  });

  it('handles no session initially', async () => {
    // Mock getSession to return null session
    (
      supabase.auth.getSession as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('no-user');
      expect(screen.getByTestId('session').textContent).toBe('no-session');
    });
  });
});
