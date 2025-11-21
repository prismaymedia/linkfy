import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DynamicServiceIcon from './dynamic-service-icon';
import { detectMusicService } from './music-service-detector';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { convertUrlSchema, type ConvertUrlRequest, type SpotifyTrackInfo } from '../../../shared/schema';
import { Loader2, X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ResultCard from './result-card';

declare const chrome: any;

interface DetectedUrlData {
  urls: string[];
  pageUrl: string;
  pageTitle: string;
}

export default function UrlSuggestionPopup() {
  const [detectedUrls, setDetectedUrls] = useState<DetectedUrlData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<SpotifyTrackInfo | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDetectedUrls = async () => {
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await new Promise<any>((resolve) => {
          chrome.runtime.sendMessage(
            { action: 'GET_DETECTED_URLS' },
            (response: any) => {
              if (chrome.runtime.lastError) {
                resolve({ success: false });
              } else {
                resolve(response);
              }
            }
          );
        });

        if (response.success && response.data.urls.length > 0) {
          setDetectedUrls(response.data);
        }
      } catch (error) {
        console.error('[UrlSuggestion] Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetectedUrls();
  }, []);

  const convertMutation = useMutation({
    mutationKey: ['conversion'],
    mutationFn: async (data: ConvertUrlRequest) => {
      const response = await apiRequest('POST', '/api/convert', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Conversion failed');
      }
      return response.json();
    },
    onSuccess: (result) => {
      setConversionResult(result);
      toast({
        title: t('conversion.successTitle'),
        description: t('conversion.successDesc'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || t('conversion.errorDesc');
      const isAuthError = errorMessage.includes('token') || errorMessage.includes('401') || errorMessage.includes('Unauthorized');
      
      toast({
        title: t('conversion.errorTitle'),
        description: isAuthError 
          ? t('conversion.authRequired', 'Please sign in to convert URLs')
          : errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleConvert = async (url: string) => {
    setSelectedUrl(url);
    setConversionResult(null);
    
    try {
      const parsedData = convertUrlSchema.parse({
        url,
        targetPlatform: 'spotify',
      });
      await convertMutation.mutateAsync(parsedData);
    } catch (error: any) {
      const errorMessage = error?.message || t('conversion.errorDesc');
      const isAuthError = errorMessage.includes('token') || errorMessage.includes('401') || errorMessage.includes('Unauthorized');
      
      toast({
        title: t('conversion.errorTitle'),
        description: isAuthError 
          ? t('conversion.authRequired', 'Please sign in to convert URLs')
          : errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleClear = async () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'CLEAR_DETECTED_URLS' }, () => {
        setDetectedUrls(null);
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!detectedUrls || detectedUrls.urls.length === 0) {
    return null;
  }

  if (conversionResult) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t('conversion.successTitle', 'Conversion Complete')}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setConversionResult(null);
                setSelectedUrl(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResultCard result={conversionResult} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {detectedUrls.urls.length}
            </Badge>
            {t('suggestion.title', 'Music URLs Detected')}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {detectedUrls.pageTitle && (
          <p className="text-sm text-gray-600 truncate" title={detectedUrls.pageTitle}>
            {detectedUrls.pageTitle}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {detectedUrls.urls.map((url, index) => {
          const service = detectMusicService(url);
          const isConverting = selectedUrl === url && convertMutation.isPending;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <DynamicServiceIcon url={url} className="text-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={url}>
                    {url}
                  </p>
                  <p className="text-xs text-gray-500">
                    {service !== 'unknown' ? service.charAt(0).toUpperCase() + service.slice(1) : 'Music Service'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleConvert(url)}
                  disabled={isConverting || convertMutation.isPending}
                  className="bg-spotify hover:bg-green-600 text-white"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      {t('form.converting', 'Converting...')}
                    </>
                  ) : (
                    t('suggestion.convert', 'Convert')
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                  title={t('suggestion.openLink', 'Open in new tab')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

