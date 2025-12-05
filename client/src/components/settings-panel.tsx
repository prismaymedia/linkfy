import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2,
  Puzzle,
} from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import LanguageSwitcher from '@/components/language-switcher';
import ThemeSwitcher from '@/components/theme-switcher';
import HistoryRetentionSwitcher from '@/components/history-retention-switcher';
import { useToast } from '@/hooks/use-toast';
import { getSession } from '@/lib/supabaseClient';



export default function SettingsPanel() {
  const { t } = useTranslation();
  const {
    notifications,
    setNotifications,
    autoConvert,
    setAutoConvert,
    saveHistory,
    setSaveHistory,
  } = usePreferences();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleSettingChange = (key: string, value: boolean | number) => {
    switch (key) {
      case 'notifications':
        setNotifications(value as boolean);
        break;
      case 'autoConvert':
        setAutoConvert(value as boolean);
        break;
      case 'saveHistory':
        setSaveHistory(value as boolean);
        break;

    }

    toast({
      title: t('settings.saved', 'Settings saved'),
      description: t('settings.savedDesc', 'Your preferences have been updated.'),
      variant: 'success',
    });
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      const session = await getSession();
      if (session) {
        // TODO: Call API to clear history from database
        // For now, clear local storage
        localStorage.removeItem('linkfy-history');
        localStorage.removeItem('linkfy-favorites');
      }

      // Clear all local storage except preferences (which includes theme and settings)
      const preferencesValue = localStorage.getItem('linkfy-preferences');
      localStorage.clear();
      if (preferencesValue) localStorage.setItem('linkfy-preferences', preferencesValue);

      toast({
        title: t('settings.dataCleared', 'Data cleared'),
        description: t('settings.dataClearedDesc', 'All your data has been cleared successfully.'),
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast({
        title: t('settings.clearFailed', 'Failed to clear data'),
        description: t('settings.clearFailedDesc', 'An error occurred. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            {t('settings.general', 'General')}
          </CardTitle>
          <CardDescription>
            {t('settings.generalDesc', 'Configure general application settings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="auto-convert" className="text-sm font-medium">
                {t('settings.autoConvert', 'Auto Convert')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.autoConvertDesc', 'Automatically convert URLs when pasted')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Switch
                id="auto-convert"
                checked={autoConvert}
                onCheckedChange={(checked) => handleSettingChange('autoConvert', checked)}
                className="scale-110"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="save-history" className="text-sm font-medium">
                {t('settings.saveHistory', 'Save History')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.saveHistoryDesc', 'Keep a record of your conversions')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Switch
                id="save-history"
                checked={saveHistory}
                onCheckedChange={(checked) => handleSettingChange('saveHistory', checked)}
                className="scale-110"
              />
            </div>
          </div>

          {saveHistory && (
            <div className="space-y-2">
              <Label htmlFor="history-retention" className="text-sm font-medium">
                {t('settings.historyRetention', 'History Retention')}
              </Label>
              <div className="w-full max-w-xs">
                <HistoryRetentionSwitcher />
              </div>
              <p className="text-sm text-muted-foreground">
                {t(
                  'settings.historyRetentionDesc',
                  'How long to keep your conversion history',
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('settings.appearance', 'Appearance')}
          </CardTitle>
          <CardDescription>
            {t('settings.themeDesc', 'Choose your preferred color theme')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Theme Selector */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('settings.theme', 'Theme')}
            </Label>
            <ThemeSwitcher variant="settings" />
            <p className="text-sm text-muted-foreground mt-1">
              {t('settings.themeDesc2', 'Select how the application handles color mode')}
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
          <CardDescription>
            {t('settings.languageDesc', 'Choose your preferred language for the interface')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('settings.selectLanguage', 'Select Language')}
            </Label>
            <LanguageSwitcher variant="settings" />
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                'settings.languageDesc',
                'Choose your preferred language for the interface'
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
          <CardDescription>
            {t('settings.notificationsDesc', 'Manage notification preferences')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="notifications" className="text-sm font-medium">
                {t('settings.enableNotifications', 'Enable Notifications')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.enableNotificationsDesc', 'Get notified about conversion results')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                className="scale-110"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extension Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            {t('settings.extension', 'Extension Permissions')}
          </CardTitle>
          <CardDescription>
            {t('settings.extensionDesc', 'Manage browser extension permissions')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm font-medium">
                  {t('settings.clipboardAccess', 'Clipboard Access')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('settings.clipboardAccessDesc', 'Allow the extension to read clipboard content')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {t('settings.requestPermission', 'Request')}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm font-medium">
                  {t('settings.urlDetection', 'URL Detection')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('settings.urlDetectionDesc', 'Automatically detect URLs on web pages')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {t('settings.requestPermission', 'Request')}
              </Button>
            </div>
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
          <CardDescription>
            {t('settings.privacyDesc', 'Manage your data and privacy settings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <Label className="text-sm font-medium text-destructive">
                  {t('settings.clearData', 'Clear All Data')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(
                    'settings.clearDataDesc',
                    'Permanently delete all your conversion history, favorites, and local data. This action cannot be undone.',
                  )}
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isClearing}>
                  {isClearing
                    ? t('settings.clearing', 'Clearing...')
                    : t('settings.clearAllData', 'Clear All Data')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="!bg-white dark:!bg-zinc-950 !text-gray-900 dark:!text-gray-50 !border-gray-200 dark:!border-zinc-800">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('settings.confirmClearTitle', 'Clear All Data?')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      'settings.confirmClearDesc',
                      'This will permanently delete all your conversion history, favorites, and local data. This action cannot be undone. Are you sure you want to continue?',
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('settings.cancel', 'Cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {t('settings.confirmClear', 'Clear All Data')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
