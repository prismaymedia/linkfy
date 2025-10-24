import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SiSpotify } from 'react-icons/si';
import { Copy, Check } from 'lucide-react';
import type { SpotifyTrackInfo } from '../../../shared/schema';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';

interface ResultCardProps {
  result: SpotifyTrackInfo;
}

export function ResultCardSkeleton() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white rounded-2xl shadow-md">
        <CardContent className="p-5 md:p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <SiSpotify className="text-spotify text-xl" />
            <h3 className="text-base md:text-lg font-semibold text-gray-800">
              {t('result.trackFound')}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-2/4" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </CardContent>
      </Card>
    </motion.div>
  );
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
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast({
        title: t('result.copyFailedTitle'),
        description: t('result.copyFailedDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
        <CardContent className="p-5 md:p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <SiSpotify className="text-spotify text-xl" />
            <h3 className="text-base md:text-lg font-semibold text-gray-800">
              {t('result.trackFound')}
            </h3>
          </div>

          {/* Track Preview */}
          <div className="flex items-center gap-4">
            <img
              src={result.thumbnailUrl}
              alt={t('result.trackThumbnail')}
              className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-sm"
            />
            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                {result.trackName}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {result.artistName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {result.albumName}
              </p>
            </div>
          </div>

          {/* Spotify URL */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="spotify-url"
              className="text-xs font-medium text-gray-600"
            >
              {t('result.spotifyUrl')}
            </label>
            <Input
              value={result.spotifyUrl}
              readOnly
              className="w-full bg-gray-50 border-gray-200 text-sm text-gray-700 cursor-default"
            />
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyToClipboard}
            className="w-full bg-spotify hover:bg-spotify-dark text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                {t('result.copiedButton')}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t('result.copyButton')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
