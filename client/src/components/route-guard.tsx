import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { isProtectedRoute, ROUTES } from '@/lib/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';

interface RouteGuardProps {
  children: ReactNode;
  path: string;
}

export default function RouteGuard({ children, path }: RouteGuardProps) {
  const { session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { openModal } = useLoginModal();
  const [showBlockedScreen, setShowBlockedScreen] = useState(false);

  useEffect(() => {
    // Mirror auth loading state into local loading to allow small delay before redirects
    setLoading(authLoading);

    if (!authLoading) {
      const requiresAuth = isProtectedRoute(path);

      if (requiresAuth && !session) {
        setShowBlockedScreen(true);
        // Open modal instead of redirecting
        openModal();
      } else if (!requiresAuth && session && path === ROUTES.AUTH) {
        setLocation(ROUTES.DASHBOARD);
      }
    }
    // only react to auth changes and path
  }, [authLoading, session, path, setLocation, openModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For protected routes, only render if authenticated
  if (isProtectedRoute(path) && !session) {
    return null;
  }

  // For auth route, only render if not authenticated
  if (path === ROUTES.AUTH && session) {
    return null;
  }

  return <>{children}</>;
}
