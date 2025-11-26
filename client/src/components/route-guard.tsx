import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { isProtectedRoute, ROUTES } from '@/lib/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';

interface RouteGuardProps {
  children: React.ReactNode;
  path: string;
}

export default function RouteGuard({ children, path }: RouteGuardProps) {
  const { session, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { openModal } = useLoginModal();

  const requiresAuth = isProtectedRoute(path);

  useEffect(() => {
    if (authLoading) return;

    // User is not authenticated and trying to access a protected route → open login modal
    if (requiresAuth && !session) {
      openModal();
      return;
    }

    // User is authenticated and trying to access the auth page → redirect to dashboard
    if (!requiresAuth && session && path === ROUTES.AUTH) {
      setLocation(ROUTES.DASHBOARD);
    }
  }, [authLoading, requiresAuth, session, path, openModal, setLocation]);

  // Show global loading state while auth status is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Block rendering of protected content until the user logs in (login modal is already open)
  if (requiresAuth && !session) {
    return null;
  }

  // Prevent rendering of /auth route when user is already authenticated
  if (path === ROUTES.AUTH && session) {
    return null;
  }

  return <>{children}</>;
}
