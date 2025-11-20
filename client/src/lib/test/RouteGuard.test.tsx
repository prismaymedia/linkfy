import { render, screen, waitFor } from '@testing-library/react';
import {
  describe,
  it,
  vi,
  expect,
  beforeEach,
  Mock,
  MockInstance,
} from 'vitest';
import RouteGuard from '@/components/route-guard';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';
import { useLocation } from 'wouter';
import * as routes from '@/lib/routes';
import React from 'react';

// Mock hooks and helpers
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/contexts/LoginModalContext', () => ({
  useLoginModal: vi.fn(),
}));

vi.mock('wouter', () => {
  const setLocation = vi.fn();
  return {
    useLocation: vi.fn(() => ['/', setLocation]),
  };
});

vi.mock('@/lib/routes', () => ({
  isProtectedRoute: vi.fn(),
  ROUTES: {
    AUTH: '/login',
    DASHBOARD: '/dashboard',
  },
}));

const mockUseAuth = useAuth as unknown as Mock;
const mockUseLocation = useLocation as unknown as Mock;
const mockUseLoginModal = useLoginModal as unknown as Mock;
const mockIsProtectedRoute = routes.isProtectedRoute as Mock;

describe('RouteGuard', () => {
  let setLocation: MockInstance<any>;
  let openModal: MockInstance<any>;

  beforeEach(() => {
    setLocation = vi.fn();
    openModal = vi.fn();
    mockUseLocation.mockReturnValue(['/', setLocation]);
    mockUseLoginModal.mockReturnValue({ openModal, closeModal: vi.fn() });
  });

  it('renders loading spinner while auth is loading', () => {
    mockUseAuth.mockReturnValue({ session: null, loading: true });
    mockIsProtectedRoute.mockReturnValue(true);

    render(
      <RouteGuard path="/dashboard">
        <div>Protected Content</div>
      </RouteGuard>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('opens login modal for unauthenticated user on protected route', async () => {
    mockUseAuth.mockReturnValue({ session: null, loading: false });
    mockIsProtectedRoute.mockReturnValue(true);

    render(
      <RouteGuard path="/dashboard">
        <div>Protected Content</div>
      </RouteGuard>,
    );

    await waitFor(() => {
      expect(openModal).toHaveBeenCalled();
    });
  });

  it('renders protected content if authenticated', async () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: '123' } },
      loading: false,
    });
    mockIsProtectedRoute.mockReturnValue(true);

    render(
      <RouteGuard path="/dashboard">
        <div>Protected Content</div>
      </RouteGuard>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects authenticated user away from auth route to dashboard', async () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: '123' } },
      loading: false,
    });
    mockIsProtectedRoute.mockReturnValue(false);

    render(
      <RouteGuard path={routes.ROUTES.AUTH}>
        <div>Login Page</div>
      </RouteGuard>,
    );

    await waitFor(() => {
      expect(setLocation).toHaveBeenCalledWith(routes.ROUTES.DASHBOARD);
    });
  });

  it('renders children on non-protected route when unauthenticated', async () => {
    mockUseAuth.mockReturnValue({ session: null, loading: false });
    mockIsProtectedRoute.mockReturnValue(false);

    render(
      <RouteGuard path="/public">
        <div>Public Page</div>
      </RouteGuard>,
    );

    expect(screen.getByText('Public Page')).toBeInTheDocument();
  });
});
