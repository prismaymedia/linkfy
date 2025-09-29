import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getSession, getUser, signOut } from '@/lib/supabaseClient';
import ConversionForm from '@/components/conversion-form';
import MusicServiceSelector from '@/components/music-service-selector';
import { ArrowRight, LogOut, User } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { User as SupabaseUser } from '@supabase/supabase-js';

type MusicService = 'YouTube Music' | 'Spotify' | 'SoundCloud';

export default function Home() {
  const [sourceService, setSourceService] = useState<MusicService | null>(null);
  const [targetService, setTargetService] = useState<MusicService | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        setLocation('/auth');
      } else {
        const userData = await getUser();
        setUser(userData);
        setLoading(false);
      }
    };
    checkSession();
  }, [setLocation]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setLocation('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Language Switcher and User Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {user?.user_metadata?.full_name || user?.email || 'User'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <SiYoutubemusic className="text-youtube text-2xl mr-2" />
            <ArrowRight className="text-gray-400 mx-2" size={20} />
            <SiSpotify className="text-spotify text-2xl ml-2" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Linkfy</h1>
          <p className="text-gray-600 text-sm">{t('home.description')}</p>
        </div>

        {/* Music Service Selector */}
        <div className="mb-6">
          <MusicServiceSelector
            sourceService={sourceService}
            targetService={targetService}
            onSourceChange={setSourceService}
            onTargetChange={setTargetService}
          />
        </div>

        {/* Conversion Form */}
        <ConversionForm />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">{t('home.footer')}</p>
        </div>
      </div>
    </div>
  );
}
