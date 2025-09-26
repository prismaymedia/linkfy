import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getSession, supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Home,
  LayoutDashboard,
  User,
  Settings,
  History,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES, getNavigationRoutes, type RoutePath } from '@/lib/routes';
import { Session } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './language-switcher';

const iconMap = {
  home: Home,
  dashboard: LayoutDashboard,
  user: User,
  settings: Settings,
  history: History,
  help: HelpCircle,
};

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLocation(ROUTES.AUTH);
    setMobileMenuOpen(false);
  };

  const navigateToRoute = (path: RoutePath) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  const navigationRoutes = getNavigationRoutes(!!session);

  if (!session) {
    return null; // Don't show navigation when not authenticated
  }

  return (
    <nav
      className={cn(
        'bg-white border-b border-gray-200 sticky top-0 z-50',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigateToRoute(ROUTES.DASHBOARD)}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center">
                <SiYoutubemusic className="text-youtube text-xl" />
                <span className="text-gray-400 mx-1">→</span>
                <SiSpotify className="text-spotify text-xl" />
              </div>
              <span className="font-bold text-xl text-gray-800">Linkfy</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationRoutes.map((route) => {
                  const Icon =
                    iconMap[route.icon as keyof typeof iconMap] || Home;
                  const isActive = location === route.path;

                  return (
                    <NavigationMenuItem key={route.path}>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'cursor-pointer',
                          isActive && 'bg-accent text-accent-foreground',
                        )}
                        onClick={() => navigateToRoute(route.path)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {t(
                          `navigation.${route.title.toLowerCase()}`,
                          route.title,
                        )}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <User className="h-4 w-4 mr-2" />
                    {t('navigation.account', 'Account')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[250px]">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session?.user?.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {t('navigation.signedIn', 'Signed in')}
                        </p>
                      </div>
                      <div className="border-t pt-2 space-y-1">
                        <NavigationMenuLink
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          onClick={() => navigateToRoute(ROUTES.PROFILE)}
                        >
                          <div className="text-sm font-medium leading-none">
                            {t('navigation.profile', 'Profile')}
                          </div>
                          <p className="text-xs leading-none text-muted-foreground">
                            {t('navigation.profileDesc', 'Manage your account')}
                          </p>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          onClick={() => navigateToRoute(ROUTES.SETTINGS)}
                        >
                          <div className="text-sm font-medium leading-none">
                            {t('navigation.settings', 'Settings')}
                          </div>
                          <p className="text-xs leading-none text-muted-foreground">
                            {t('navigation.settingsDesc', 'App preferences')}
                          </p>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                          onClick={handleSignOut}
                        >
                          <div className="text-sm font-medium leading-none flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            {t('navigation.signOut', 'Sign Out')}
                          </div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigationRoutes.map((route) => {
                const Icon =
                  iconMap[route.icon as keyof typeof iconMap] || Home;
                const isActive = location === route.path;

                return (
                  <button
                    key={route.path}
                    onClick={() => navigateToRoute(route.path)}
                    className={cn(
                      'w-full flex items-center px-3 py-2 text-left rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {t(`navigation.${route.title.toLowerCase()}`, route.title)}
                  </button>
                );
              })}

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('navigation.signedIn', 'Signed in')}
                  </p>
                </div>

                <button
                  onClick={() => navigateToRoute(ROUTES.PROFILE)}
                  className="w-full flex items-center px-3 py-2 text-left rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  {t('navigation.profile', 'Profile')}
                </button>

                <button
                  onClick={() => navigateToRoute(ROUTES.SETTINGS)}
                  className="w-full flex items-center px-3 py-2 text-left rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  {t('navigation.settings', 'Settings')}
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-2 text-left rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  {t('navigation.signOut', 'Sign Out')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
