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
import { SiYoutubemusic, SiSpotify, SiGithub } from 'react-icons/si';
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

  const handleSignOut = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await supabase.auth.signOut();
      setMobileMenuOpen(false);
      setLocation(ROUTES.AUTH);
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
        'border-b border-gray-200 sticky top-0 z-50',
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
                <ArrowRight
                  className="text-gray-400 mx-0.5 sm:mx-1"
                  size={16}
                />
                <SiSpotify className="text-spotify text-lg sm:text-xl" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-gray-800">
                Linkfy
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
            <NavigationMenu>
              <NavigationMenuList className="justify-end">
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
                    <div className="grid gap-3 p-4 w-[280px] sm:w-[320px] bg-white">
                      <div className="space-y-1 bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium leading-none text-gray-900 truncate">
                          {session?.user?.email}
                        </p>
                        <p className="text-xs leading-none text-gray-500">
                          {t('navigation.signedIn', 'Signed in')}
                        </p>
                      </div>
                      <div className="border-t pt-2 space-y-1">
                        <NavigationMenuLink asChild>
                          <Link
                            href={ROUTES.PROFILE}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 cursor-pointer group"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              {t('navigation.profile', 'Profile')}
                            </div>
                            <p className="text-xs leading-none text-gray-500 mt-1">
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
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 cursor-pointer group"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <Settings className="h-4 w-4 mr-2 " />
                              {t('navigation.settings', 'Settings')}
                            </div>
                            <p className="text-xs leading-none text-gray-500 mt-1">
                              {t('navigation.settingsDesc', 'App preferences')}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                          onClick={handleSignOut}
                        >
                          <div className="text-sm font-medium leading-none flex items-center text-red-600">
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

          {/* Language Switcher, GitHub & Mobile Menu Button */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="p-2 touch-target-sm"
              aria-label="GitHub repository"
            >
              <a
                href="https://github.com/prismaymedia/linkfy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiGithub className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </Button>
            <LanguageSwitcher />
            <div className="xl:hidden">
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
                className="fixed inset-0 bg-black/60 z-40 xl:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                ref={menuRef}
                variants={panelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 right-0 h-full max-h-screen w-4/5 max-w-xs sm:max-w-sm md:max-w-md bg-white z-50 xl:hidden flex flex-col overflow-y-auto"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                  <span className="font-bold text-base sm:text-lg">Menu</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="touch-target-sm p-2"
                      aria-label="GitHub repository"
                    >
                      <a
                        href="https://github.com/prismaymedia/linkfy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiGithub className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileMenuOpen(false)}
                      className="touch-target-sm p-2"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <nav className="flex flex-col flex-1 overflow-y-auto p-4 sm:p-6">
                  {/* Main Navigation Routes - Include all routes */}
                  <div className="flex flex-col space-y-1">
                    {navigationRoutes.map((route) => {
                      const Icon =
                        iconMap[route.icon as keyof typeof iconMap] || Home;
                      const isActive = location === route.path;

                      return (
                        <button
                          key={route.path}
                          onClick={() => navigateToRoute(route.path)}
                          className={cn(
                            'w-full flex items-center px-3 py-3 text-left rounded-md text-sm sm:text-base font-medium transition-colors min-h-[44px]',
                            isActive
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          )}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                          <span>{t(
                            `navigation.${route.title.toLowerCase()}`,
                            route.title,
                          )}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 my-3" />

                  {/* User Info Section - Informational Only */}
                  <div className="px-3 py-3 bg-gray-50 rounded-md mb-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session?.user?.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('navigation.signedIn', 'Signed in')}
                    </p>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 my-3" />

                  {/* Sign Out Action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSignOut(e);
                    }}
                    className="w-full flex items-center px-3 py-3 text-left rounded-md text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100 transition-colors min-h-[44px] touch-target cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                    <span>{t('navigation.signOut', 'Sign Out')}</span>
                  </button>
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
