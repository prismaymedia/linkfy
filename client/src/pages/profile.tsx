import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getSession, supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import { Session } from '@supabase/supabase-js';

export default function Profile() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = await getSession();
      if (!currentSession) {
        setLocation(ROUTES.AUTH);
      } else {
        setSession(currentSession);
        setLoading(false);
      }
    };
    checkSession();
  }, [setLocation]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLocation(ROUTES.AUTH);
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('profile.title', 'Profile')}
          </h1>
          <p className="text-gray-600">
            {t('profile.subtitle', 'Manage your account information')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('profile.accountInfo', 'Account Information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm">
                    {t('profile.email', 'Email')}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <Input
                      id="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="bg-gray-50 min-w-0 text-xs xs:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="created" className="text-sm">
                    {t('profile.memberSince', 'Member Since')}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <Input
                      id="created"
                      value={
                        session?.user?.created_at
                          ? new Date(
                            session.user.created_at,
                          ).toLocaleDateString()
                          : ''
                      }
                      disabled
                      className="bg-gray-50 min-w-0 text-xs xs:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="id" className="text-sm">
                    {t('profile.userId', 'User ID')}
                  </Label>
                  <Input
                    id="id"
                    value={session?.user?.id || ''}
                    disabled
                    className="bg-gray-50 font-mono text-[10px] xs:text-xs min-w-0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.preferences', 'Preferences')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">
                  {t(
                    'profile.preferencesDesc',
                    'User preferences will be available in a future update.',
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.actions', 'Actions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setLocation(ROUTES.DASHBOARD)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {t('profile.backToDashboard', 'Back to Dashboard')}
                </Button>

                <Button
                  onClick={() => setLocation(ROUTES.SETTINGS)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {t('profile.settings', 'Settings')}
                </Button>

                <Button
                  onClick={() => setLocation(ROUTES.HISTORY)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {t('profile.history', 'View History')}
                </Button>

                <hr className="my-4" />

                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('profile.signOut', 'Sign Out')}
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('profile.accountStats', 'Account Stats')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t('profile.totalConversions', 'Total Conversions')}
                    </span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t('profile.successfulConversions', 'Successful')}
                    </span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t('profile.lastActivity', 'Last Activity')}
                    </span>
                    <span className="font-medium text-sm">Today</span>
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
