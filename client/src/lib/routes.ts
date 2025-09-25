// Centralized route configuration
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HISTORY: '/history',
  HELP: '/help',
  NOT_FOUND: '/404',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

// Route metadata for enhanced navigation
export interface RouteConfig {
  path: RoutePath;
  title: string;
  description?: string;
  requiresAuth: boolean;
  showInNavigation: boolean;
  icon?: string;
  parent?: RoutePath;
}

export const ROUTE_CONFIG: Record<RoutePath, RouteConfig> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: 'Home',
    description: 'Convert YouTube Music URLs to Spotify',
    requiresAuth: false,
    showInNavigation: true,
    icon: 'home',
  },
  [ROUTES.AUTH]: {
    path: ROUTES.AUTH,
    title: 'Authentication',
    description: 'Sign in or sign up',
    requiresAuth: false,
    showInNavigation: false,
  },
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'Your conversion dashboard',
    requiresAuth: true,
    showInNavigation: true,
    icon: 'dashboard',
  },
  [ROUTES.PROFILE]: {
    path: ROUTES.PROFILE,
    title: 'Profile',
    description: 'Manage your profile',
    requiresAuth: true,
    showInNavigation: true,
    icon: 'user',
  },
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    description: 'App preferences and configuration',
    requiresAuth: true,
    showInNavigation: true,
    icon: 'settings',
  },
  [ROUTES.HISTORY]: {
    path: ROUTES.HISTORY,
    title: 'History',
    description: 'Your conversion history',
    requiresAuth: true,
    showInNavigation: true,
    icon: 'history',
  },
  [ROUTES.HELP]: {
    path: ROUTES.HELP,
    title: 'Help',
    description: 'Get help and support',
    requiresAuth: false,
    showInNavigation: true,
    icon: 'help',
  },
  [ROUTES.NOT_FOUND]: {
    path: ROUTES.NOT_FOUND,
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist',
    requiresAuth: false,
    showInNavigation: false,
  },
};

// Helper functions for route management
export const getRouteConfig = (path: RoutePath): RouteConfig => {
  return ROUTE_CONFIG[path];
};

export const getNavigationRoutes = (isAuthenticated: boolean): RouteConfig[] => {
  return Object.values(ROUTE_CONFIG).filter(
    (route) =>
      route.showInNavigation &&
      (!route.requiresAuth || isAuthenticated)
  );
};

export const isProtectedRoute = (path: string): boolean => {
  const route = Object.values(ROUTE_CONFIG).find(r => r.path === path);
  return route ? route.requiresAuth : false;
};