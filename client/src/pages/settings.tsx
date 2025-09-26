import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import LanguageSwitcher from '@/components/language-switcher';

export default function Settings() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    autoConvert: false,
    saveHistory: true,
    darkMode: false,
  });

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

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
            {t('settings.title', 'Settings')}
          </h1>
          <p className="text-gray-600">
            {t('settings.subtitle', 'Customize your Linkfy experience')}
          </p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                {t('settings.general', 'General')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-convert" className="text-sm font-medium">
                    {t('settings.autoConvert', 'Auto Convert')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t(
                      'settings.autoConvertDesc',
                      'Automatically convert URLs when pasted',
                    )}
                  </p>
                </div>
                <Switch
                  id="auto-convert"
                  checked={settings.autoConvert}
                  onCheckedChange={(checked) =>
                    handleSettingChange('autoConvert', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="save-history" className="text-sm font-medium">
                    {t('settings.saveHistory', 'Save History')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t(
                      'settings.saveHistoryDesc',
                      'Keep a record of your conversions',
                    )}
                  </p>
                </div>
                <Switch
                  id="save-history"
                  checked={settings.saveHistory}
                  onCheckedChange={(checked) =>
                    handleSettingChange('saveHistory', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t('settings.appearance', 'Appearance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    {t('settings.darkMode', 'Dark Mode')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t('settings.darkModeDesc', 'Use dark theme (coming soon)')}
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    handleSettingChange('darkMode', checked)
                  }
                  disabled
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t('settings.theme', 'Theme')}
                </Label>
                <Select defaultValue="light" disabled>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      {t('settings.light', 'Light')}
                    </SelectItem>
                    <SelectItem value="dark">
                      {t('settings.dark', 'Dark')}
                    </SelectItem>
                    <SelectItem value="system">
                      {t('settings.system', 'System')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  {t(
                    'settings.themeDesc',
                    'Theme customization coming in future updates',
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('settings.language', 'Language')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t('settings.selectLanguage', 'Select Language')}
                </Label>
                <LanguageSwitcher />
                <p className="text-sm text-gray-500 mt-2">
                  {t(
                    'settings.languageDesc',
                    'Choose your preferred language for the interface',
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings.notifications', 'Notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="notifications"
                    className="text-sm font-medium"
                  >
                    {t('settings.enableNotifications', 'Enable Notifications')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {t(
                      'settings.notificationsDesc',
                      'Get notified about conversion results',
                    )}
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange('notifications', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('settings.privacy', 'Privacy & Security')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {t(
                  'settings.privacyDesc',
                  'Privacy and security settings will be available in future updates.',
                )}
              </p>
            </CardContent>
          </Card>

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
    </div>
  );
}
