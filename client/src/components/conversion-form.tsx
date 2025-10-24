import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  convertUrlSchema,
  type ConvertUrlRequest,
  type SpotifyTrackInfo,
  type YouTubeTrackInfo,
} from '../../../shared/schema';
import { apiRequest } from '@/lib/queryClient';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SiYoutubemusic } from 'react-icons/si';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import ResultCard from './result-card';
import { useTranslation } from 'react-i18next';

export default function ConversionForm() {
  const [spotifyResult, setSpotifyResult] = useState<SpotifyTrackInfo | null>(
    null,
  );
  const [youtubePreview, setYoutubePreview] = useState<YouTubeTrackInfo | null>(
    null,
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [lastProcessedUrl, setLastProcessedUrl] = useState<string>('');

  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<ConvertUrlRequest>({
    resolver: zodResolver(convertUrlSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      youtubeUrl: '',
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (data: { youtubeUrl: string }) => {
      const response = await apiRequest('POST', '/api/youtube-convert', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Conversion failed');
      }
      return response.json();
    },
    onSuccess: (result) => {
      setSpotifyResult(result);
      setLastProcessedUrl(form.getValues('youtubeUrl'));

      toast({
        title: t('conversion.successTitle'),
        description: t('conversion.successDesc'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = t('conversion.errorDesc');
      toast({
        title: t('conversion.errorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const fetchYouTubePreview = async (url: string) => {
    if (!url || !convertUrlSchema.safeParse({ youtubeUrl: url }).success) {
      setYoutubePreview(null);
      return;
    }

    setIsLoadingPreview(true);
    try {
      const response = await apiRequest('POST', '/api/youtube-convert', {
        youtubeUrl: url,
        convert: false, // only preview YouTube data
      });
      const json = await response.json();

      setYoutubePreview(json as YouTubeTrackInfo);
    } catch {
      setYoutubePreview(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const watchedUrl = form.watch('youtubeUrl');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        watchedUrl &&
        watchedUrl.trim() !== '' &&
        watchedUrl !== lastProcessedUrl
      ) {
        fetchYouTubePreview(watchedUrl);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedUrl, lastProcessedUrl]);

  const onSubmit = (data: ConvertUrlRequest) => {
    // Check if this is a duplicate URL before submitting
    if (isDuplicateUrl) {
      toast({
        title: t('form.duplicateUrlWarning'),
        variant: 'warning',
      });
      return; // Don't submit if it's a duplicate
    }
    convertMutation.mutate(data);
  };

  const isDuplicateUrl = lastProcessedUrl && watchedUrl === lastProcessedUrl;
  const isFormValid = form.formState.isValid;
  const fieldState = form.getFieldState('youtubeUrl');
  const isFieldValid =
    !fieldState.error &&
    fieldState.isDirty &&
    watchedUrl &&
    watchedUrl.trim() !== '';

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t('form.youtubeUrlLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="url"
                          placeholder={t('form.youtubeUrlPlaceholder')}
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-spotify focus:border-spotify transition-colors duration-200 pr-10 text-sm sm:text-base ${
                            fieldState.error
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                              : isFieldValid
                                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                : 'border-gray-300'
                          }`}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={
                            fieldState.error
                              ? 'youtubeUrl-error'
                              : 'youtubeUrl-hint'
                          }
                        />
                        {isLoadingPreview ? (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 animate-spin text-gray-400" />
                        ) : isFieldValid ? (
                          <CheckCircle2
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-green-500"
                            aria-label={t('form.validUrl')}
                          />
                        ) : fieldState.error && fieldState.isDirty ? (
                          <AlertCircle
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-red-500"
                            aria-label={t('form.invalidUrl')}
                          />
                        ) : (
                          <SiYoutubemusic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-youtube opacity-50 h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription
                      id="youtubeUrl-hint"
                      className="text-xs text-gray-500"
                    >
                      {t('form.youtubeUrlHint')}
                    </FormDescription>
                    <FormMessage id="youtubeUrl-error" role="alert" />
                  </FormItem>
                )}
              />

              {isDuplicateUrl && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-700">
                    {t('form.duplicateUrlWarning')}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={convertMutation.isPending || !isFormValid}
                className="w-full bg-spotify hover:bg-green-600 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed touch-target text-sm sm:text-base"
              >
                {convertMutation.isPending ? (
                  <>
                    {t('form.converting')}
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : isDuplicateUrl ? (
                  t('form.urlAlreadyConverted')
                ) : (
                  t('form.convertButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {youtubePreview && (
        <Card className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-6">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <div className="flex items-center">
              <SiYoutubemusic className="text-youtube text-lg sm:text-xl mr-2" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {t('preview.youtubeTrack')}
              </h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0 p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src={youtubePreview.thumbnailUrl}
                alt="YouTube thumbnail"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                  {youtubePreview.trackName}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {youtubePreview.artistName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {t('preview.original')}: {youtubePreview.originalTitle}
                </p>
              </div>
              {isLoadingPreview && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400 flex-shrink-0" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {spotifyResult && <ResultCard result={spotifyResult} />}
    </>
  );
}
