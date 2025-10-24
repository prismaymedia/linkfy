import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  History as HistoryIcon,
  ExternalLink,
  Copy,
  Trash2,
  Calendar,
} from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversionRecord {
  id: string;
  youtubeUrl: string;
  spotifyUrl: string;
  title: string;
  artist: string;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
}

// Mock data - in a real app this would come from an API
const mockHistory: ConversionRecord[] = [
  {
    id: '1',
    youtubeUrl: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
    spotifyUrl: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    status: 'success',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    youtubeUrl: 'https://music.youtube.com/watch?v=9bZkp7q19f0',
    spotifyUrl: '',
    title: 'Gangnam Style',
    artist: 'PSY',
    status: 'failed',
    createdAt: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    youtubeUrl: 'https://music.youtube.com/watch?v=kffacxfA7G4',
    spotifyUrl: 'https://open.spotify.com/track/1mea3bSkSGXuIRvnydlB5b',
    title: 'Baby Shark',
    artist: 'Pinkfong',
    status: 'success',
    createdAt: '2024-01-13T09:15:00Z',
  },
];

const HistorySkeleton = () => (
  <div className="min-h-screen bg-surface p-4">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-9 w-1/3 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8" />
                <div>
                  <Skeleton className="h-7 w-12 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-5 w-16" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/5" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function History() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ConversionRecord[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        setLocation(ROUTES.AUTH);
      } else {
        // In a real app, fetch history from API
        setHistory(mockHistory);
        setLoading(false);
      }
    };
    checkSession();
  }, [setLocation]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // In a real app, show a toast notification
      toast({
        title: t('history.copied', 'Copied!'),
        description: t(
          'history.copiedDesc',
          'Spotify URL copied to clipboard.',
        ),
        variant: 'success',
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: t('history.copyFailed', 'Failed to copy'),
        description: t('history.copyFailedDesc', 'Please try again later.'),
        variant: 'destructive',
      });
    }
  };

  const deleteRecord = (id: string) => {
    setHistory((prev) => prev.filter((record) => record.id !== id));
    toast({
      title: t('history.deleted', 'Deleted'),
      description: t('history.deletedDesc', 'Conversion record removed.'),
      variant: 'success',
    });
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const getStatusBadge = (status: ConversionRecord['status']) => {
    const variants = {
      success: 'default',
      failed: 'destructive',
      pending: 'secondary',
    } as const;

    const labels = {
      success: t('history.success', 'Success'),
      failed: t('history.failed', 'Failed'),
      pending: t('history.pending', 'Pending'),
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  if (loading) {
    return <HistorySkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-surface p-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('history.title', 'Conversion History')}
          </h1>
          <p className="text-gray-600">
            {t('history.subtitle', 'View and manage your past conversions')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HistoryIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{history.length}</p>
                  <p className="text-sm text-gray-600">
                    {t('history.totalConversions', 'Total Conversions')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <SiSpotify className="h-8 w-8 text-spotify" />
                <div>
                  <p className="text-2xl font-bold">
                    {history.filter((h) => h.status === 'success').length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('history.successful', 'Successful')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (history.filter((h) => h.status === 'success').length /
                        history.length) *
                        100,
                    ) || 0}
                    %
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('history.successRate', 'Success Rate')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('history.recentConversions', 'Recent Conversions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8">
                <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {t('history.noHistory', 'No conversion history yet')}
                </p>
                <Button
                  onClick={() => setLocation(ROUTES.DASHBOARD)}
                  className="mt-4"
                >
                  {t('history.startConverting', 'Start Converting')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {history.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <SiYoutubemusic className="h-5 w-5 text-youtube" />
                          <span className="text-gray-400">→</span>
                          <SiSpotify className="h-5 w-5 text-spotify" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium">{record.title}</h3>
                          <p className="text-sm text-gray-600">
                            {record.artist}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusBadge(record.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUrl(record.youtubeUrl)}
                          title={t('history.openYoutube', 'Open YouTube')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>

                        {record.status === 'success' && record.spotifyUrl && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openUrl(record.spotifyUrl)}
                              title={t('history.openSpotify', 'Open Spotify')}
                            >
                              <SiSpotify className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(record.spotifyUrl)}
                              title={t(
                                'history.copySpotifyUrl',
                                'Copy Spotify URL',
                              )}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecord(record.id)}
                          title={t('history.delete', 'Delete')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => setLocation(ROUTES.DASHBOARD)}
            variant="outline"
          >
            {t('history.backToDashboard', 'Back to Dashboard')}
          </Button>
          <Button
            onClick={() => setLocation(ROUTES.SETTINGS)}
            variant="outline"
          >
            {t('history.settings', 'Settings')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
