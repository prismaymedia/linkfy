import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  convertUrlSchema,
  type ConvertUrlRequest,
  type SpotifyTrackInfo,
  type YouTubeTrackInfo,
  type PlaylistTrack,
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
import { Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import DynamicServiceIcon from './dynamic-service-icon';
import ResultCard, { ResultCardSkeleton } from './result-card';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { detectMusicService } from '@/components/music-service-detector';
import ConversionPreview from './conversion-preview';



interface MusicConverterProps {
  size?: 'compact' | 'full';
}

export default function MusicConverter({ size = 'full' }: MusicConverterProps) {
  const [spotifyResult, setSpotifyResult] = useState<SpotifyTrackInfo | null>(
    null,
  );
  const [youtubePreview, setYoutubePreview] = useState<YouTubeTrackInfo | null>(
    null,
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [lastProcessedUrl, setLastProcessedUrl] = useState<string>('');
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [singleTrackResult, setSingleTrackResult] =
    useState<SpotifyTrackInfo | null>(null);
  const [convertedTracks, setConvertedTracks] = useState<string[]>([]);
  const [convertingTracks, setConvertingTracks] = useState<string[]>([]);

  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Helper function to get the preview translation key
  const getPreviewTranslationKey = (
    url: string,
    contentType: 'track' | 'playlist' | 'album' = 'track',
  ) => {
    const service = detectMusicService(url);
    const contentTypeCapitalized =
      contentType.charAt(0).toUpperCase() + contentType.slice(1);
    return `preview.${service}${contentTypeCapitalized}`;
  };

  const form = useForm<z.input<typeof convertUrlSchema>>({
    resolver: zodResolver(convertUrlSchema),
    mode: 'onChange',
    defaultValues: { url: '' },
  });

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
      setSpotifyResult(result);
      setLastProcessedUrl(form.getValues('url'));

      // Cache the result for future requests
      queryClient.setQueryData(['conversion', form.getValues('url')], result);

      toast({
        title: t('conversion.successTitle'),
        description: t('conversion.successDesc'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      // Log the actual error for debugging purposes
      console.error('Conversion error:', error);

      // Attempt to localize backend error messages if possible
      let message = t('conversion.errorDesc');
      if (error?.message) {
        message =
          t(error.message) !== error.message ? t(error.message) : error.message;
      }

      toast({
        title: t('conversion.errorTitle'),
        description: message,
        variant: 'destructive',
      });
    },
  });

  const fetchYouTubePreview = async (url: string) => {
    if (!url || url.trim() === '') {
      setYoutubePreview(null);
      setPreviewError(null);
      return;
    }

    // Enhanced URL validation with specific error messages
    const urlValidation = convertUrlSchema.safeParse({
      url,
      targetPlatform: 'spotify',
    });
    if (!urlValidation.success) {
      const error = urlValidation.error.issues[0];
      let errorMessage = t('form.invalidUrl');

      if (error.message.includes('url')) {
        if (url.includes('http') && !url.startsWith('http')) {
          errorMessage = t(
            'form.urlInvalidFormat',
            'Invalid URL format. Please ensure the URL starts with http:// or https://',
          );
        } else if (detectMusicService(url) === 'unknown') {
          errorMessage = t(
            'form.unsupportedService',
            'Unsupported music service. Please use YouTube Music, Spotify, Apple Music, or Deezer URLs',
          );
        } else {
          errorMessage = t(
            'form.urlNotSupported',
            'This URL type is not supported for conversion',
          );
        }
      }

      setYoutubePreview(null);
      setPreviewError(errorMessage);
      return;
    }

    setIsLoadingPreview(true);
    setPreviewError(null);
    try {
      const response = await apiRequest('POST', '/api/convert', {
        url,
        targetPlatform: 'spotify',
        convert: false, // only preview YouTube data
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = t('conversion.errorDesc');

        if (errorData.message) {
          if (
            errorData.message.includes('not found') ||
            errorData.message.includes('404')
          ) {
            errorMessage = t(
              'form.trackNotFound',
              'Track not found. Please check the URL and try again',
            );
          } else if (
            errorData.message.includes('unsupported') ||
            errorData.message.includes('invalid')
          ) {
            errorMessage = t(
              'form.serviceError',
              'Service error. The music service may be temporarily unavailable',
            );
          } else {
            errorMessage = errorData.message;
          }
        }

        setPreviewError(errorMessage);
        setYoutubePreview(null);
        // Don't show toast for preview errors, let the preview component handle it
        return;
      }
      const json = await response.json();
      setYoutubePreview(json as YouTubeTrackInfo);
      setPreviewError(null);
    } catch (error) {
      console.error('Preview fetch error:', error);
      const errorMessage = t(
        'form.networkError',
        'Network error. Please check your connection and try again',
      );
      setPreviewError(errorMessage);
      setYoutubePreview(null);
      // Don't show toast for preview errors, let the preview component handle it
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const watchedUrl = form.watch('url');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        watchedUrl &&
        watchedUrl.trim() !== '' &&
        watchedUrl !== lastProcessedUrl
      ) {
        setSpotifyResult(null);
        setSingleTrackResult(null);
        setPreviewError(null);
        fetchYouTubePreview(watchedUrl);
        setConvertedTracks([]);
      } else if (!watchedUrl || watchedUrl.trim() === '') {
        // Clear preview when URL is empty
        setYoutubePreview(null);
        setPreviewError(null);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedUrl, lastProcessedUrl]);

  const clearForm = () => {
    form.reset();
    setSpotifyResult(null);
    setYoutubePreview(null);
    setPreviewError(null);
    setIsLoadingPreview(false);
    setLastProcessedUrl('');
    toast({
      title: t('form.inputCleared'),
      description: '',
      variant: 'info',
    });
  };

  const [cacheTick, setCacheTick] = useState(0);
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setCacheTick((tick) => tick + 1);
    });
    return unsubscribe;
  }, [queryClient]);

  const cachedResultForWatchedUrl = useMemo(() => {
    if (!watchedUrl) return undefined;
    return queryClient.getQueryData(['conversion', watchedUrl]);
  }, [queryClient, watchedUrl, cacheTick]);

  const isFormValid = form.formState.isValid;
  const fieldState = form.getFieldState('url');
  const isFieldValid =
    !fieldState.error &&
    fieldState.isDirty &&
    watchedUrl &&
    watchedUrl.trim() !== '';

  const onSubmit = (data: z.input<typeof convertUrlSchema>) => {
    const parsedData = convertUrlSchema.parse(data);
    const url = parsedData.url;

    // Check if cached result exists
    const cachedResult = queryClient.getQueryData(['conversion', url]);
    if (cachedResult) {
      setSpotifyResult(cachedResult as SpotifyTrackInfo);
      toast({
        title: t('conversion.successTitle'),
        description: t('conversion.successDesc'),
        variant: 'success',
      });
      return; // Don't submit if cached
    }

    convertMutation.mutate(parsedData);
  };

  const handleSingleTrackConversion = async (track: PlaylistTrack) => {
    const url = `https://music.youtube.com/watch?v=${track.videoId}`;

    if (convertingTracks.includes(track.videoId)) return;

    // Check cache first
    const cachedResult = queryClient.getQueryData(['conversion', url]);
    if (cachedResult) {
      setSingleTrackResult(cachedResult as SpotifyTrackInfo);
      setConvertedTracks((prev) => [...prev, track.videoId]);
      toast({
        title: t('conversion.successTitle'),
        description: t('conversion.successDesc'),
        variant: 'success',
      });
      return;
    }

    setConvertingTracks((prev) => [...prev, track.videoId]);

    try {
      const result = await convertMutation.mutateAsync({
        url,
        targetPlatform: 'spotify',
      });
      setSingleTrackResult(result);

      // Cache the result
      queryClient.setQueryData(['conversion', url], result);

      toast({
        title: t('conversion.successTitle'),
        description: t('conversion.successDesc'),
        variant: 'success',
      });
      setConvertedTracks((prev) => [...prev, track.videoId]);
    } catch (error) {
      console.error('Error converting track:', error);
    } finally {
      setConvertingTracks((prev) => prev.filter((id) => id !== track.videoId));
    }
  };

  const isCompact = size === 'compact';

  return (
    <>
      <Card
        className={`bg-white rounded-2xl shadow-lg ${isCompact ? 'mb-4' : 'mb-4 sm:mb-6'}`}
      >
        <CardContent className={isCompact ? 'p-4' : 'p-4 sm:p-6'}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={isCompact ? 'space-y-4' : 'space-y-4 sm:space-y-6'}
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t('form.youtubeUrlLabel')}
                    </FormLabel>
                    <FormControl>
                      <div
                        className="relative"
                        onMouseEnter={() => setIsInputHovered(true)}
                        onMouseLeave={() => setIsInputHovered(false)}
                        onTouchStart={() => setIsInputHovered(true)}
                        onTouchEnd={(e) => {
                          const target = e.target as HTMLElement;
                          if (!target.closest('button[type="button"]')) {
                            setTimeout(() => setIsInputHovered(false), 100);
                          }
                        }}
                      >
                        <Input
                          {...field}
                          aria-invalid={!!fieldState.error}
                          aria-describedby="url-hint url-error"
                          type="url"
                          placeholder={t('form.youtubeUrlPlaceholder')}
                          disabled={
                            convertMutation.isPending || isLoadingPreview
                          }
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-spotify focus:border-spotify transition-colors duration-200 pr-10 text-sm sm:text-base ${fieldState.error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500 pr-10'
                            : isFieldValid
                              ? 'border-green-500 focus:ring-green-500 focus:border-green-500 pr-10'
                              : isInputHovered && fieldState.isDirty
                                ? 'border-gray-300 pr-[52px]'
                                : 'border-gray-300 pr-10'
                            }`}
                        />
                        {!isLoadingPreview &&
                          isInputHovered &&
                          fieldState.isDirty ? (
                          <AnimatePresence>
                            <motion.button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                clearForm();
                              }}
                              onMouseDown={(e) => e.preventDefault()}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus:ring-gray-500 min-w-[40px] min-h-[40px] touch-manipulation select-none"
                              aria-label={t('form.clearInput')}
                              title={t('form.clearInput')}
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          </AnimatePresence>
                        ) : isLoadingPreview ? (
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
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50">
                            <DynamicServiceIcon
                              url={field.value || ''}
                              className="w-4 sm:w-5 h-4 sm:h-5"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription
                      id="url-hint"
                      className={`text-xs text-gray-500 ${isCompact ? 'sr-only' : ''}`}
                    >
                      {t('form.youtubeUrlHint')}
                    </FormDescription>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />

              {!!cachedResultForWatchedUrl && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-700">
                    {t('form.duplicateUrlWarning')}
                  </span>
                </div>
              )}

              {/* Only show conversion button for individual tracks */}
              {youtubePreview?.type === 'track' && (
                <Button
                  type="submit"
                  disabled={
                    convertMutation.isPending ||
                    !isFormValid ||
                    !!cachedResultForWatchedUrl
                  }
                  className="w-full bg-spotify hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {convertMutation.isPending ? (
                    <>
                      {t('form.converting')}
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : !!cachedResultForWatchedUrl ? (
                    t('form.urlAlreadyConverted')
                  ) : (
                    t('form.convertButton')
                  )}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview de YouTube */}
      <ConversionPreview
        previewData={youtubePreview}
        isLoading={isLoadingPreview}
        url={watchedUrl}
        size={size}
        onConvertTrack={handleSingleTrackConversion}
        convertingTracks={convertingTracks}
        convertedTracks={convertedTracks}
        error={previewError}
      />

      {/* Result with AnimatePresence */}
      <AnimatePresence mode="wait">
        {convertMutation.isPending && (
          <motion.div
            key="result-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultCardSkeleton />
          </motion.div>
        )}

        {(spotifyResult || singleTrackResult) && !convertMutation.isPending && (
          <motion.div
            key="result-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultCard result={(singleTrackResult || spotifyResult)!} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
