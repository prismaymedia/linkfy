import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SiSpotify } from 'react-icons/si';
import { Copy, Check } from 'lucide-react';
import type { SpotifyTrackInfo } from '../../../shared/schema';

interface ResultCardProps {
  result: SpotifyTrackInfo;
}

export default function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.spotifyUrl);
      setCopied(true);
      toast({
        title: t('result.copiedTitle'),
        description: t('result.copiedDescription'),
        variant: 'success',
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast({
        title: t('result.copyFailedTitle'),
        description: t('result.copyFailedDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <SiSpotify className="text-spotify text-xl mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            {t('result.trackFound')}
          </h3>
        </div>

        {/* Track Preview */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={result.thumbnailUrl}
            alt={t('result.trackThumbnail')}
            className="w-16 h-16 rounded-lg object-cover shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">
              {result.trackName}
            </h4>
            <p className="text-sm text-gray-600 truncate">
              {result.artistName}
            </p>
            <p className="text-xs text-gray-500 truncate">{result.albumName}</p>
          </div>
        </div>

        {/* Spotify URL */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {t('result.spotifyUrl')}
          </label>
          <Input
            value={result.spotifyUrl}
            readOnly
            className="text-sm text-gray-700 bg-transparent border-none focus:ring-0 p-0"
          />
        </div>

        {/* Copy Button */}
        <Button
          onClick={handleCopyToClipboard}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {t('result.copiedButton')}
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              {t('result.copyButton')}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
