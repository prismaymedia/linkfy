import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/language-switcher';
import { LogIn, ArrowRight, LayoutDashboard } from 'lucide-react';
import { SiYoutubemusic, SiSpotify, SiGithub } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import { useLoginModal } from '@/contexts/LoginModalContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { openModal } = useLoginModal();
  const { user } = useAuth();

  const handleLoginClick = () => {
    openModal();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm ${className || ''}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setLocation(ROUTES.HOME)}
            className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity touch-target-sm"
          >
            <div className="flex items-center">
              <SiYoutubemusic className="text-youtube text-lg sm:text-xl" />
              <ArrowRight className="text-muted-foreground mx-0.5 sm:mx-1" size={16} />
              <SiSpotify className="text-spotify text-lg sm:text-xl" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-foreground">
              Linkfy
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <div className="w-auto relative">
              <LanguageSwitcher />
            </div>
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

            {user && (
              <Button
                onClick={() => setLocation(ROUTES.DASHBOARD)}
                variant="ghost"
                size="sm"
                className="p-2 touch-target-sm"
                aria-label={t('header.dashboard', 'Dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            <Button
              onClick={handleLoginClick}
              variant="default"
              size="sm"
              className="flex items-center space-x-1 touch-target-sm text-sm sm:text-base px-2 sm:px-4"
              aria-label={t('header.login', 'Login')}
            >
              <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">
                {t('header.login', 'Login')}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
