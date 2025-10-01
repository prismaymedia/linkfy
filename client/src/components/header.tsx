import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/language-switcher';
import { LogIn, ArrowRight } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const handleLoginClick = () => {
    setLocation(ROUTES.AUTH);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setLocation(ROUTES.HOME)}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center">
              <SiYoutubemusic className="text-youtube text-xl" />
              <ArrowRight className="text-gray-400 mx-1" size={20} />
              <SiSpotify className="text-spotify text-xl" />
            </div>
            <span className="font-bold text-xl text-gray-800">Linkfy</span>
          </button>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button
              onClick={handleLoginClick}
              variant="default"
              size="sm"
              className="flex items-center space-x-1"
            >
              <LogIn className="h-4 w-4" />
              <span>{t('header.login', 'Login')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
