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
    <div className="min-h-screen bg-surface p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <SiYoutubemusic className="text-youtube text-2xl sm:text-3xl mr-2 sm:mr-3" />
            <ArrowRight className="text-gray-400 mx-2 sm:mx-3" size={20} />
            <SiSpotify className="text-spotify text-2xl sm:text-3xl ml-2 sm:ml-3" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            {t('dashboard.title', 'Dashboard')}
          </h1>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            {t('dashboard.subtitle', 'Convert and manage your music links')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Conversion Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  {t('dashboard.converter', 'Music Converter')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ConversionForm />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  {t('dashboard.quickActions', 'Quick Actions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
                <button
                  onClick={() => setLocation(ROUTES.HISTORY)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors touch-target"
                >
                  <History className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base">
                      {t('dashboard.viewHistory', 'View History')}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {t(
                        'dashboard.viewHistoryDesc',
                        'See your past conversions',
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setLocation(ROUTES.PROFILE)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors touch-target"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base">
                      {t('dashboard.profile', 'Profile')}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {t('dashboard.profileDesc', 'Manage your account')}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setLocation(ROUTES.SETTINGS)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors touch-target"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base">
                      {t('dashboard.settings', 'Settings')}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {t('dashboard.settingsDesc', 'App preferences')}
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">{t('dashboard.stats', 'Your Stats')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">
                      {t('dashboard.conversions', 'Conversions')}
                    </span>
                    <span className="font-medium text-sm sm:text-base">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">
                      {t('dashboard.thisWeek', 'This Week')}
                    </span>
                    <span className="font-medium text-sm sm:text-base">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">
                      {t('dashboard.successRate', 'Success Rate')}
                    </span>
                    <span className="font-medium text-sm sm:text-base">--</span>
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
