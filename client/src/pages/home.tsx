import ConversionForm from '@/components/conversion-form';
import MusicServiceSelector from '@/components/music-service-selector';
import { ArrowRight } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useState } from 'react';

type MusicService = 'YouTube Music' | 'Spotify' | 'SoundCloud';

export default function Home() {
  const [sourceService, setSourceService] = useState<MusicService | null>(null);
  const [targetService, setTargetService] = useState<MusicService | null>(null);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <SiYoutubemusic className="text-youtube text-2xl mr-2" />
            <ArrowRight className="text-gray-400 mx-2" size={20} />
            <SiSpotify className="text-spotify text-2xl ml-2" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Linkfy</h1>
          <p className="text-gray-600 text-sm">
            Convert YouTube Music links to Spotify instantly
          </p>
        </div>

        <div className="mb-6">
          <MusicServiceSelector
            sourceService={sourceService}
            targetService={targetService}
            onSourceChange={setSourceService}
            onTargetChange={setTargetService}
          />
        </div>

        <ConversionForm />

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Perfect for Chrome extension • Privacy-focused • No data stored
          </p>
        </div>
      </div>
    </div>
  );
}
