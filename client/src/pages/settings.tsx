import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import SettingsPanel from '@/components/settings-panel';

export default function Settings() {
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
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mt-20">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('settings.title', 'Settings')}
          </h1>
          <p className="text-muted-foreground">
            {t('settings.subtitle', 'Customize your Linkfy experience')}
          </p>
        </div>

        <SettingsPanel />

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <Button
            onClick={() => setLocation(ROUTES.DASHBOARD)}
            variant="outline"
          >
            {t('settings.backToDashboard', 'Back to Dashboard')}
          </Button>
          <Button
            onClick={() => setLocation(ROUTES.PROFILE)}
            variant="outline"
          >
            {t('settings.profile', 'Profile')}
          </Button>
        </div>
      </div>
    </div>
  );
}
