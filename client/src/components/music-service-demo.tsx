import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MusicServiceSelector from './music-service-selector';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type MusicService = 'YouTube Music' | 'Spotify' | 'SoundCloud';

export default function MusicServiceDemo() {
  const { t } = useTranslation();
  const [sourceService, setSourceService] = useState<MusicService | null>(
    'YouTube Music',
  );
  const [targetService, setTargetService] = useState<MusicService | null>(
    'Spotify',
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">
            {t('demo.title')}
          </h2>
          <p className="text-sm text-gray-600">{t('demo.description')}</p>
        </CardHeader>
        <CardContent>
          <MusicServiceSelector
            sourceService={sourceService}
            targetService={targetService}
            onSourceChange={setSourceService}
            onTargetChange={setTargetService}
          />

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {t('demo.selected')}
            </h4>
            <p className="text-sm text-gray-600">
              {t('demo.from')}: {sourceService || t('demo.notSelected')}
            </p>
            <p className="text-sm text-gray-600">
              {t('demo.to')}: {targetService || t('demo.notSelected')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
