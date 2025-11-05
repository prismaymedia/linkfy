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
import { SiYoutubemusic } from 'react-icons/si';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import ResultCard, { ResultCardSkeleton } from './result-card';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const PreviewCardSkeleton = () => {
  const { t } = useTranslation();
  return (
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
          <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 sm:h-5 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-1/2" />
            <Skeleton className="h-3 w-2/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ConversionForm() {
  const [spotifyResult, setSpotifyResult] = useState<SpotifyTrackInfo | null>(
    null,
  );
  const [youtubePreview, setYoutubePreview] = useState<YouTubeTrackInfo | null>(
    null,
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [lastProcessedUrl, setLastProcessedUrl] = useState<string>('');
  const [singleTrackResult, setSingleTrackResult] =
    useState<SpotifyTrackInfo | null>(null);
  const [convertedTracks, setConvertedTracks] = useState<string[]>([]);
  const [convertingTracks, setConvertingTracks] = useState<string[]>([]);

  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<z.input<typeof convertUrlSchema>>({
    resolver: zodResolver(convertUrlSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      url: '',
      targetPlatform: 'spotify',
    },
  });

  // Watch the URL field so we can react to its changes and refer to it elsewhere
  const watchedUrl = form.watch('url');

  const convertMutation = useMutation({
    mutationFn: async (data: ConvertUrlRequest) => {
      // The server expects `url` in the request body (see server controller).
      const response = await apiRequest('POST', '/api/convert', {
        url: data.url,
        targetPlatform: data.targetPlatform,
        convert: true,
      });
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
    if (
      !url ||
      !convertUrlSchema.safeParse({ url, targetPlatform: 'spotify' }).success
    ) {
      setYoutubePreview(null);
      return;
    }

    setIsLoadingPreview(true);
    try {
      const response = await apiRequest('POST', '/api/convert', {
        url: url,
        convert: false, // only preview YouTube data
      });
      if (!response.ok) {
        setYoutubePreview(null);
        return;
      }
      const json = await response.json();
      setYoutubePreview(json as YouTubeTrackInfo);
    } catch {
      setYoutubePreview(null);
    } finally {
      setIsLoadingPreview(false);
    }
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
    const url = data.url;

    if (!data.targetPlatform) return;

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
    convertMutation.mutate({ url, targetPlatform: data.targetPlatform });
  };

  const handleSingleTrackConversion = async (track: PlaylistTrack) => {
    const youtubeUrl = `https://music.youtube.com/watch?v=${track.videoId}`;

    if (convertingTracks.includes(track.videoId)) return;

    // Check cache first
    const cachedResult = queryClient.getQueryData(['conversion', youtubeUrl]);
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
        url: youtubeUrl,
        targetPlatform: 'spotify',
      });
      setSingleTrackResult(result);

      // Cache the result
      queryClient.setQueryData(['conversion', youtubeUrl], result);

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

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
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
                      <div className="relative">
                        <Input
                          {...field}
                          aria-invalid={!!fieldState.error}
                          aria-describedby="youtubeUrl-hint youtubeUrl-error"
                          type="url"
                          placeholder={t('form.youtubeUrlPlaceholder')}
                          disabled={
                            convertMutation.isPending || isLoadingPreview
                          }
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-spotify focus:border-spotify transition-colors duration-200 pr-10 text-sm sm:text-base ${
                            fieldState.error
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                              : isFieldValid
                                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                : 'border-gray-300'
                          }`}
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

              {/* Solo mostrar botón de conversión para tracks individuales */}
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

      {/* Preview de YouTube con AnimatePresence */}
      <AnimatePresence mode="wait">
        {isLoadingPreview && (
          <motion.div
            key="preview-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PreviewCardSkeleton />
          </motion.div>
        )}

        {!isLoadingPreview && youtubePreview && (
          <motion.div
            key="preview-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-6">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-center">
                  <SiYoutubemusic className="text-youtube text-xl mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t('preview.youtubeTrack', {
                      defaultValue: 'YouTube Preview',
                    })}
                  </h3>
                </div>
                {youtubePreview.type !== 'track' &&
                  youtubePreview.playlistTitle && (
                    <p className="text-sm text-gray-500">
                      {youtubePreview.playlistTitle}
                    </p>
                  )}
              </CardHeader>

              <CardContent className="pt-0">
                {youtubePreview.type === 'playlist' ||
                youtubePreview.type === 'album' ? (
                  <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {youtubePreview.tracks.map((track) => (
                      <div
                        key={track.videoId}
                        className="flex items-center justify-between space-x-4 border-b border-gray-100 pb-2 last:border-none"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={track.thumbnailUrl}
                            alt={track.trackName}
                            className="w-12 h-12 rounded-md object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {track.trackName}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {track.artistName}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleSingleTrackConversion(track)}
                          disabled={
                            convertingTracks.includes(track.videoId) ||
                            convertedTracks.includes(track.videoId)
                          }
                          size="sm"
                          className={`text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 ${
                            convertedTracks.includes(track.videoId)
                              ? 'bg-gray-400 opacity-70 cursor-not-allowed'
                              : convertingTracks.includes(track.videoId)
                                ? 'bg-spotify/80 cursor-wait'
                                : 'bg-spotify hover:bg-green-600'
                          }`}
                        >
                          {convertedTracks.includes(track.videoId)
                            ? t('form.converted', { defaultValue: 'Converted' })
                            : convertingTracks.includes(track.videoId)
                              ? t('form.converting', {
                                  defaultValue: 'Converting...',
                                })
                              : t('form.convertSingle', {
                                  defaultValue: 'Convert',
                                })}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : youtubePreview.type === 'track' ? (
                  <div className="flex items-center space-x-4">
                    <img
                      src={youtubePreview.thumbnailUrl ?? ''}
                      alt="YouTube thumbnail"
                      className="w-16 h-16 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {youtubePreview.trackName}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {youtubePreview.artistName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {youtubePreview.originalTitle
                          ? `${t('preview.original')}: ${youtubePreview.originalTitle}`
                          : ''}
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultado con AnimatePresence */}
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
