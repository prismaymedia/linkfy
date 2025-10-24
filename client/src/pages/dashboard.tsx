import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import ConversionForm from '@/components/conversion-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, History, Settings, User } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-surface p-4">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20 mx-3" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-9 w-1/3 mx-auto mb-2" />
        <Skeleton className="h-5 w-1/2 mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        setLocation(ROUTES.AUTH);
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [setLocation]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <SiYoutubemusic className="text-youtube text-3xl mr-3" />
            <ArrowRight className="text-gray-400 mx-3" size={24} />
            <SiSpotify className="text-spotify text-3xl ml-3" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {t('dashboard.title', 'Dashboard')}
          </h1>
          <p className="text-center text-gray-600">
            {t('dashboard.subtitle', 'Convert and manage your music links')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conversion Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('dashboard.converter', 'Music Converter')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConversionForm />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('dashboard.quickActions', 'Quick Actions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setLocation(ROUTES.HISTORY)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <History className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {t('dashboard.viewHistory', 'View History')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t(
                        'dashboard.viewHistoryDesc',
                        'See your past conversions',
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setLocation(ROUTES.PROFILE)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {t('dashboard.profile', 'Profile')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t('dashboard.profileDesc', 'Manage your account')}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setLocation(ROUTES.SETTINGS)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {t('dashboard.settings', 'Settings')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t('dashboard.settingsDesc', 'App preferences')}
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.stats', 'Your Stats')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t('dashboard.conversions', 'Conversions')}
                    </span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t('dashboard.thisWeek', 'This Week')}
                    </span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t('dashboard.successRate', 'Success Rate')}
                    </span>
                    <span className="font-medium">--</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
