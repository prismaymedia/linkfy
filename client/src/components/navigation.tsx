import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
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
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES, getNavigationRoutes, type RoutePath } from '@/lib/routes';
import { Session } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigateToRoute(ROUTES.DASHBOARD)}
              className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity touch-target-sm"
            >
              <div className="flex items-center">
                <SiYoutubemusic className="text-youtube text-lg sm:text-xl" />
                <ArrowRight className="text-gray-400 mx-0.5 sm:mx-1" size={16} />
                <SiSpotify className="text-spotify text-lg sm:text-xl" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-gray-800">Linkfy</span>
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
                      <NavigationMenuLink asChild active={isActive}>
                        <Link
                          href={route.path}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            'cursor-pointer',
                          )}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {t(
                            `navigation.${route.title.toLowerCase()}`,
                            route.title,
                          )}
                        </Link>
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
                        <NavigationMenuLink asChild>
                          <Link
                            href={ROUTES.PROFILE}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            <div className="text-sm font-medium leading-none">
                              {t('navigation.profile', 'Profile')}
                            </div>
                            <p className="text-xs leading-none text-muted-foreground">
                              {t(
                                'navigation.profileDesc',
                                'Manage your account',
                              )}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href={ROUTES.SETTINGS}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            <div className="text-sm font-medium leading-none">
                              {t('navigation.settings', 'Settings')}
                            </div>
                            <p className="text-xs leading-none text-muted-foreground">
                              {t('navigation.settingsDesc', 'App preferences')}
                            </p>
                          </Link>
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
          <div className="flex items-center space-x-1 sm:space-x-2">
            <LanguageSwitcher />
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="touch-target-sm p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                ref={menuRef}
                variants={panelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-50 md:hidden p-4 sm:p-6"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="font-bold text-base sm:text-lg">Menu</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="touch-target-sm p-2"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>

                <nav className="flex flex-col space-y-1 sm:space-y-2">
                  {navigationRoutes.map((route) => {
                    const Icon =
                      iconMap[route.icon as keyof typeof iconMap] || Home;
                    const isActive = location === route.path;

                    return (
                      <button
                        key={route.path}
                        onClick={() => navigateToRoute(route.path)}
                        className={cn(
                          'w-full flex items-center px-3 py-3 text-left rounded-md text-sm sm:text-base font-medium transition-colors touch-target',
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        )}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                        {t(
                          `navigation.${route.title.toLowerCase()}`,
                          route.title,
                        )}
                      </button>
                    );
                  })}

                  <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {session?.user?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('navigation.signedIn', 'Signed in')}
                      </p>
                    </div>

                    <button
                      onClick={() => navigateToRoute(ROUTES.PROFILE)}
                      className="w-full flex items-center px-3 py-3 text-left rounded-md text-sm sm:text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors touch-target"
                    >
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                      {t('navigation.profile', 'Profile')}
                    </button>

                    <button
                      onClick={() => navigateToRoute(ROUTES.SETTINGS)}
                      className="w-full flex items-center px-3 py-3 text-left rounded-md text-sm sm:text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors touch-target"
                    >
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                      {t('navigation.settings', 'Settings')}
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-3 py-3 text-left rounded-md text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors touch-target"
                    >
                      <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                      {t('navigation.signOut', 'Sign Out')}
                    </button>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

const panelVariants: Variants = {
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    x: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};
