import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History as HistoryIcon, Calendar } from 'lucide-react';
import { SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import HistoryTimeline from '@/components/history-timeline';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { HistoryEntry } from '../../../shared/schema';
import { z } from 'zod';

const historyStatsSchema = z.object({
  total: z.number(),
  successful: z.number(),
  failed: z.number(),
  pending: z.number(),
});

type HistoryStats = z.infer<typeof historyStatsSchema>;

const HistorySkeleton = () => (
  <div className="min-h-screen bg-background p-4">
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
  const { user, loading: authLoading } = useAuth();

  // Fetch history stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<HistoryStats>({
    queryKey: ['history', 'stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/history/stats');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch stats: ${response.status} ${errorText}`,
        );
      }
      const data = await response.json();
      return historyStatsSchema.parse(data);
    },
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation(ROUTES.AUTH);
    }
  }, [authLoading, user, setLocation]);

  const successRate =
    stats && stats.total > 0
      ? Math.round((stats.successful / stats.total) * 100)
      : 0;

  if (authLoading || statsLoading) {
    return <HistorySkeleton />;
  }

  if (!user) {
    return null;
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500 mb-4">
                {t('history.loadError', 'Failed to load history')}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {statsError instanceof Error
                  ? statsError.message
                  : 'Unknown error'}
              </p>
              <Button onClick={() => window.location.reload()}>
                {t('history.retry', 'Retry')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background p-3 sm:p-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t('history.title', 'Conversion History')}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('history.subtitle', 'View and manage your past conversions')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <HistoryIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold">
                    {stats?.total || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('history.totalConversions', 'Total Conversions')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <SiSpotify className="h-6 w-6 sm:h-8 sm:w-8 text-spotify" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold">
                    {stats?.successful || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('history.successful', 'Successful')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold">
                    {successRate}%
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('history.successRate', 'Success Rate')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Timeline Component */}
        <HistoryTimeline userId={user.id} />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Button
            onClick={() => setLocation(ROUTES.DASHBOARD)}
            variant="outline"
            className="touch-target text-sm sm:text-base"
          >
            {t('history.backToDashboard', 'Back to Dashboard')}
          </Button>
          <Button
            onClick={() => setLocation(ROUTES.SETTINGS)}
            variant="outline"
            className="touch-target text-sm sm:text-base"
          >
            {t('history.settings', 'Settings')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
