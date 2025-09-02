import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SiSpotify, SiYoutubemusic, SiSoundcloud } from 'react-icons/si';

type MusicService = 'YouTube Music' | 'Spotify' | 'SoundCloud';

interface MusicServiceSelectorProps {
  sourceService: MusicService | null;
  targetService: MusicService | null;
  onSourceChange: (service: MusicService | null) => void;
  onTargetChange: (service: MusicService | null) => void;
}

const services: {
  name: MusicService;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { name: 'YouTube Music', icon: SiYoutubemusic, color: 'text-red-600' },
  { name: 'Spotify', icon: SiSpotify, color: 'text-green-600' },
  { name: 'SoundCloud', icon: SiSoundcloud, color: 'text-orange-500' },
];

const getServiceInfo = (serviceName: MusicService | null) => {
  return services.find((s) => s.name === serviceName) || null;
};

export default function MusicServiceSelector({
  sourceService,
  targetService,
  onSourceChange,
  onTargetChange,
}: MusicServiceSelectorProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!sourceService) onSourceChange('YouTube Music');
    if (!targetService) onTargetChange('Spotify');
  }, [sourceService, targetService, onSourceChange, onTargetChange]);

  const handleSourceChange = (value: string) => {
    const newSource = value === 'select' ? null : (value as MusicService);
    onSourceChange(newSource);

    if (targetService === newSource) {
      onTargetChange(null);
    }
  };

  const handleTargetChange = (value: string) => {
    const newTarget = value === 'select' ? null : (value as MusicService);
    onTargetChange(newTarget);

    if (sourceService === newTarget) {
      onSourceChange(null);
    }
  };

  const getAvailableServices = (excludeService: MusicService | null) => {
    return services.filter((service) => service.name !== excludeService);
  };

  const sourceInfo = getServiceInfo(sourceService);
  const targetInfo = getServiceInfo(targetService);

  return (
    <div className="space-y-6">
      {/* Source Service */}
      <div className="space-y-2">
        <Label htmlFor="source-service">{t('demo.from')}</Label>
        <Select value={sourceService ?? ''} onValueChange={handleSourceChange}>
          <SelectTrigger id="source-service" className="flex items-center">
            {sourceInfo ? (
              <div className="flex items-center gap-2">
                <sourceInfo.icon className={`w-4 h-4 ${sourceInfo.color}`} />
                <span>{sourceInfo.name}</span>
              </div>
            ) : (
              <SelectValue placeholder={t('demo.notSelected')} />
            )}
          </SelectTrigger>

          <SelectContent className="z-50 bg-white shadow-md rounded-md">
            {getAvailableServices(targetService).map((service) => {
              const IconComponent = service.icon;
              return (
                <SelectItem key={service.name} value={service.name}>
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`w-4 h-4 ${service.color}`} />
                    <span>{service.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Target Service */}
      <div className="space-y-2">
        <Label htmlFor="target-service">{t('demo.to')}</Label>
        <Select value={targetService ?? ''} onValueChange={handleTargetChange}>
          <SelectTrigger id="target-service" className="flex items-center">
            {targetInfo ? (
              <div className="flex items-center gap-2">
                <targetInfo.icon className={`w-4 h-4 ${targetInfo.color}`} />
                <span>{targetInfo.name}</span>
              </div>
            ) : (
              <SelectValue placeholder={t('demo.notSelected')} />
            )}
          </SelectTrigger>

          <SelectContent className="z-50 bg-white shadow-md rounded-md">
            {getAvailableServices(sourceService).map((service) => {
              const IconComponent = service.icon;
              return (
                <SelectItem key={service.name} value={service.name}>
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`w-4 h-4 ${service.color}`} />
                    <span>{service.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
