import { useState } from 'react';
import MusicServiceSelector from './music-service-selector';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type MusicService = 'YouTube Music' | 'Spotify' | 'SoundCloud';

export default function MusicServiceDemo() {
  const [sourceService, setSourceService] = useState<MusicService | null>(null);
  const [targetService, setTargetService] = useState<MusicService | null>(null);

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">
            Music Service Converter
          </h2>
          <p className="text-sm text-gray-600">
            Select your source and target music services
          </p>
        </CardHeader>
        <CardContent>
          <MusicServiceSelector
            sourceService={sourceService}
            targetService={targetService}
            onSourceChange={setSourceService}
            onTargetChange={setTargetService}
          />
          {(sourceService || targetService) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected:
              </h4>
              <p className="text-sm text-gray-600">
                From: {sourceService || 'Not selected'}
              </p>
              <p className="text-sm text-gray-600">
                To: {targetService || 'Not selected'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
