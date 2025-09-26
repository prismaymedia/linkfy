import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import { isProtectedRoute, ROUTES } from '@/lib/routes';
import { Session } from '@supabase/supabase-js';

interface RouteGuardProps {
  children: ReactNode;
  path: string;
}

export default function RouteGuard({ children, path }: RouteGuardProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      setLoading(false);

      // Check if the route requires authentication
      const requiresAuth = isProtectedRoute(path);

      if (requiresAuth && !currentSession) {
        // Redirect to auth if route is protected and user is not authenticated
        setLocation(ROUTES.AUTH);
      } else if (!requiresAuth && currentSession && path === ROUTES.AUTH) {
        // Redirect to dashboard if user is authenticated and trying to access auth page
        setLocation(ROUTES.DASHBOARD);
      }
    };

    checkAuth();
  }, [path, setLocation]);

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
