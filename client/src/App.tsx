import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import RouteGuard from '@/components/route-guard';
import Navigation from '@/components/navigation';
import BreadcrumbNav from '@/components/breadcrumb-nav';
import Home from '@/pages/home';
import AuthPage from '@/pages/auth';
import Dashboard from '@/pages/dashboard';
import Profile from '@/pages/profile';
import Settings from '@/pages/settings';
import History from '@/pages/history';
import Help from '@/pages/help';
import NotFound from '@/pages/not-found';
import { ROUTES } from './lib/routes';

function Router() {
  return (
    <Switch>
      {/* Redirect root to /auth */}
      <Route path="/">
        <Redirect to={ROUTES.AUTH} />
      </Route>

      {/* Home route - redirects to dashboard if authenticated */}
      <Route path={ROUTES.HOME}>
        {(params) => (
          <RouteGuard path={ROUTES.HOME}>
            <Home />
          </RouteGuard>
        )}
      </Route>

      {/* Authentication route */}
      <Route path={ROUTES.AUTH}>
        {(params) => (
          <RouteGuard path={ROUTES.AUTH}>
            <AuthPage />
          </RouteGuard>
        )}
      </Route>

      {/* Protected routes */}
      <Route path={ROUTES.DASHBOARD}>
        {(params) => (
          <RouteGuard path={ROUTES.DASHBOARD}>
            <Navigation />
            <BreadcrumbNav />
            <Dashboard />
          </RouteGuard>
        )}
      </Route>

      <Route path={ROUTES.PROFILE}>
        {(params) => (
          <RouteGuard path={ROUTES.PROFILE}>
            <Navigation />
            <BreadcrumbNav />
            <Profile />
          </RouteGuard>
        )}
      </Route>

      <Route path={ROUTES.SETTINGS}>
        {(params) => (
          <RouteGuard path={ROUTES.SETTINGS}>
            <Navigation />
            <BreadcrumbNav />
            <Settings />
          </RouteGuard>
        )}
      </Route>

      <Route path={ROUTES.HISTORY}>
        {(params) => (
          <RouteGuard path={ROUTES.HISTORY}>
            <Navigation />
            <BreadcrumbNav />
            <History />
          </RouteGuard>
        )}
      </Route>

      <Route path={ROUTES.HELP}>
        {(params) => (
          <RouteGuard path={ROUTES.HELP}>
            <Navigation />
            <BreadcrumbNav />
            <Help />
          </RouteGuard>
        )}
      </Route>

      {/* 404 - Catch all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
