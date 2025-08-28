import ConversionForm from '@/components/conversion-form';
import MusicServiceSelector from '@/components/music-service-selector';
import { ArrowRight } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useState } from 'react';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';

type MusicService = 'YouTube Music' | 'Spotify' | 'SoundCloud';

export default function Home() {
  const [sourceService, setSourceService] = useState<MusicService | null>(null);
  const [targetService, setTargetService] = useState<MusicService | null>(null);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
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
