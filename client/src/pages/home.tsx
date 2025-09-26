import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import ConversionForm from '@/components/conversion-form';
import MusicServiceSelector from '@/components/music-service-selector';
import { ArrowRight } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';

type MusicService = 'YouTube Music' | 'Spotify' | 'SoundCloud';

export default function Home() {
  const [sourceService, setSourceService] = useState<MusicService | null>(null);
  const [targetService, setTargetService] = useState<MusicService | null>(null);
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        // If authenticated, redirect to dashboard
        setLocation(ROUTES.DASHBOARD);
      } else {
        // If not authenticated, redirect to auth
        setLocation(ROUTES.AUTH);
      }
    };
    checkSession();
  }, [setLocation]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // This component now serves as a redirect handler
  // Actual home content is moved to dashboard
  return null;
}
