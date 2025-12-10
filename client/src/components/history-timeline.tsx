import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import {
  History as HistoryIcon,
  ExternalLink,
  Copy,
  Trash2,
  Search,
  X,
  Clock,
} from 'lucide-react';
import { SiYoutubemusic, SiSpotify, SiApplemusic } from 'react-icons/si';
import { FaDeezer } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import type { HistoryEntry } from '../../../shared/schema';
import DynamicServiceIcon from './dynamic-service-icon';

interface HistoryTimelineProps {
  userId?: string;
}

interface HistoryResponse {
  entries: HistoryEntry[];
  total: number;
}

interface TrackPayload {
  thumbnailUrl?: string;
  trackName?: string;
  artistName?: string;
  albumName?: string;
}

const getTrackPayload = (entry: HistoryEntry): TrackPayload | undefined => {
  const payload = entry.payload;
  if (!payload || typeof payload !== 'object') return undefined;

  // Check if it looks like a track payload (has at least one relevant field)
  const p = payload as Record<string, unknown>;
  if (
    typeof p.trackName === 'string' ||
    typeof p.artistName === 'string' ||
    typeof p.thumbnailUrl === 'string'
  ) {
    return payload as unknown as TrackPayload;
  }
  return undefined;
};

const HistoryTimelineSkeleton = () => (
  <div className="space-y-3 sm:space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function HistoryTimeline({ userId }: HistoryTimelineProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState<string>('');
  const [targetPlatform, setTargetPlatform] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // Build query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (sourcePlatform) params.set('sourcePlatform', sourcePlatform);
    if (targetPlatform) params.set('targetPlatform', targetPlatform);
    if (status) params.set('status', status);
    return params.toString();
  }, [searchQuery, sourcePlatform, targetPlatform, status]);

  // Fetch history
  const {
    data: historyData,
    isLoading,
    error,
  } = useQuery<HistoryResponse>({
    queryKey: ['history', queryParams],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/history?${queryParams}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch history: ${response.status} ${errorText}`,
        );
      }
      return response.json();
    },
    enabled: !!userId,
    retry: false,
  });

  // Delete single entry mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/history/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete history entry');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      toast({
        title: t('history.deleted', 'Deleted'),
        description: t('history.deletedDesc', 'History entry removed.'),
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: t('history.deleteFailed', 'Delete Failed'),
        description: t(
          'history.deleteFailedDesc',
          'Failed to delete history entry.',
        ),
        variant: 'destructive',
      });
    },
  });

  // Clear all history mutation
  const clearMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/history');
      if (!response.ok) {
        throw new Error('Failed to clear history');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      toast({
        title: t('history.cleared', 'History Cleared'),
        description: t(
          'history.clearedDesc',
          `Removed ${data.deletedCount || 0} entries.`,
        ),
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: t('history.clearFailed', 'Clear Failed'),
        description: t('history.clearFailedDesc', 'Failed to clear history.'),
        variant: 'destructive',
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('history.copied', 'Copied!'),
        description: t('history.copiedDesc', 'URL copied to clipboard.'),
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: t('history.copyFailed', 'Failed to copy'),
        description: t('history.copyFailedDesc', 'Please try again later.'),
        variant: 'destructive',
      });
    }
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const getStatusBadge = (entryStatus: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      completed: 'default',
      failed: 'destructive',
      pending: 'secondary',
    };

    const labels: Record<string, string> = {
      completed: t('history.success', 'Success'),
      failed: t('history.failed', 'Failed'),
      pending: t('history.pending', 'Pending'),
    };

    return (
      <Badge variant={variants[entryStatus] || 'default'}>
        {labels[entryStatus] || entryStatus}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('history.justNow', 'Just now');
    if (diffMins < 60)
      return t('history.minutesAgo', '{{count}}m ago', { count: diffMins });
    if (diffHours < 24)
      return t('history.hoursAgo', '{{count}}h ago', {
        count: diffHours,
      });
    if (diffDays < 7)
      return t('history.daysAgo', '{{count}}d ago', { count: diffDays });
    return date.toLocaleDateString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'spotify':
        return <SiSpotify className="h-4 w-4 sm:h-5 sm:w-5 text-spotify" />;
      case 'youtube':
        return (
          <SiYoutubemusic className="h-4 w-4 sm:h-5 sm:w-5 text-youtube" />
        );
      case 'deezer':
        return <FaDeezer className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />;
      case 'apple':
        return <SiApplemusic className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />;
      default:
        return (
          <DynamicServiceIcon
            url={platform}
            className="h-4 w-4 sm:h-5 sm:w-5"
          />
        );
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSourcePlatform('');
    setTargetPlatform('');
    setStatus('');
  };

  const hasActiveFilters =
    searchQuery || sourcePlatform || targetPlatform || status;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-2">
            {t('history.loadError', 'Failed to load history')}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['history'] })
            }
          >
            {t('history.retry', 'Retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const entries = historyData?.entries || [];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('history.searchAndFilter', 'Search & Filter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('history.searchPlaceholder', 'Search by URL...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={sourcePlatform}
              onChange={(e) => setSourcePlatform(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">{t('history.allSources', 'All Sources')}</option>
              <option value="youtube">YouTube</option>
              <option value="spotify">Spotify</option>
              <option value="deezer">Deezer</option>
              <option value="apple">Apple Music</option>
            </select>

            <select
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">{t('history.allTargets', 'All Targets')}</option>
              <option value="spotify">Spotify</option>
              <option value="deezer">Deezer</option>
              <option value="apple">Apple Music</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">
                {t('history.allStatuses', 'All Statuses')}
              </option>
              <option value="completed">
                {t('history.success', 'Success')}
              </option>
              <option value="failed">{t('history.failed', 'Failed')}</option>
              <option value="pending">{t('history.pending', 'Pending')}</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              {t('history.clearFilters', 'Clear Filters')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Clear All Button */}
      {entries.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => clearMutation.mutate()}
            disabled={clearMutation.isPending}
          >
            {clearMutation.isPending ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {t('history.clearing', 'Clearing...')}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('history.clearAll', 'Clear All History')}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <HistoryTimelineSkeleton />
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <HistoryIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base">
              {hasActiveFilters
                ? t('history.noResults', 'No results found')
                : t('history.noHistory', 'No conversion history yet')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence>
            {entries.map((entry) => {
              const payload = getTrackPayload(entry);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        {/* Thumbnail Image */}
                        {payload?.thumbnailUrl ? (
                          <img
                            src={payload.thumbnailUrl}
                            alt={payload.trackName || 'Track thumbnail'}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                            <HistoryIcon className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Platform Icons */}
                          <div className="flex items-center gap-1 sm:gap-2 mb-1">
                            {getPlatformIcon(entry.sourcePlatform)}
                            <span className="text-muted-foreground text-sm">→</span>
                            {entry.targetPlatform &&
                              getPlatformIcon(entry.targetPlatform)}
                          </div>

                          {/* Track Name */}
                          <h3 className="font-medium text-sm sm:text-base truncate mb-1">
                            {payload?.trackName || entry.sourceUrl}
                          </h3>

                          {/* Artist Name */}
                          {payload?.artistName && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {payload.artistName}
                            </p>
                          )}

                          {/* Album Name */}
                          {payload?.albumName && (
                            <p className="text-xs text-muted-foreground truncate">
                              {payload.albumName}
                            </p>
                          )}

                          {/* Timestamp */}
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {formatDate(
                                typeof entry.createdAt === 'string'
                                  ? entry.createdAt
                                  : entry.createdAt.toISOString(),
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Right Side: Status Badge and Action Icons */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {getStatusBadge(entry.status)}
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openUrl(entry.sourceUrl)}
                              title={t('history.openSource', 'Open Source URL')}
                              className="touch-target-sm p-2"
                            >
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>

                            {entry.targetUrl && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    openUrl(entry.targetUrl!)
                                  }
                                  title={t(
                                    'history.openTarget',
                                    'Open Target URL',
                                  )}
                                  className="touch-target-sm p-2"
                                >
                                  {getPlatformIcon(entry.targetPlatform || '')}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(entry.targetUrl!)
                                  }
                                  title={t('history.copyUrl', 'Copy URL')}
                                  className="touch-target-sm p-2"
                                >
                                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMutation.mutate(entry.id)}
                              disabled={deleteMutation.isPending}
                              title={t('history.delete', 'Delete')}
                              className="text-red-500 hover:text-red-700 touch-target-sm p-2"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Total Count */}
      {historyData && historyData.total > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {t('history.showing', 'Showing')} {entries.length}{' '}
          {t('history.of', 'of')} {historyData.total}{' '}
          {t('history.entries', 'entries')}
        </div>
      )}
    </div>
  );
}
