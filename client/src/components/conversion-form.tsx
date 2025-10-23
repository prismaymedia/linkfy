import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
  const [singleTrackResult, setSingleTrackResult] =
    useState<SpotifyTrackInfo | null>(null);

  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<ConvertUrlRequest>({
    resolver: zodResolver(convertUrlSchema),
    mode: 'onChange',
    defaultValues: { youtubeUrl: '' },
  });

  const [convertedTracks, setConvertedTracks] = useState<string[]>([]);
  const [convertingTracks, setConvertingTracks] = useState<string[]>([]);

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
    onError: () => {
      toast({
        title: t('conversion.errorTitle'),
        description: t('conversion.errorDesc'),
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
      setYoutubePreview(json);
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
        setSpotifyResult(null);
        setSingleTrackResult(null);
        fetchYouTubePreview(watchedUrl);
        setConvertedTracks([]);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedUrl, lastProcessedUrl]);

  const isDuplicateUrl = lastProcessedUrl && watchedUrl === lastProcessedUrl;
  const isFormValid = form.formState.isValid;
  const fieldState = form.getFieldState('youtubeUrl');
  const isFieldValid =
    !fieldState.error &&
    fieldState.isDirty &&
    watchedUrl &&
    watchedUrl.trim() !== '';

  const onSubmit = (data: ConvertUrlRequest) => {
    if (isDuplicateUrl) {
      toast({
        title: t('form.duplicateUrlWarning'),
        variant: 'warning',
      });
      return;
    }
    convertMutation.mutate(data);
  };

  const handleSingleTrackConversion = async (track: PlaylistTrack) => {
    const youtubeUrl = `https://music.youtube.com/watch?v=${track.videoId}`;

    if (convertingTracks.includes(track.videoId)) return;

    setConvertingTracks((prev) => [...prev, track.videoId]);

    try {
      const result = await convertMutation.mutateAsync({ youtubeUrl });
      setSingleTrackResult(result);
      toast({
        title: t('conversion.successTitle'),
        description: t('conversion.successDesc'),
        variant: 'success',
      });
      setConvertedTracks((prev) => [...prev, track.videoId]);
    } catch (error) {
      console.error('Error converting track:', error);
    }
  };

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-lg mb-6">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          aria-invalid={!!fieldState.error}
                          aria-describedby="youtubeUrl-hint youtubeUrl-error"
                          type="url"
                          placeholder={t('form.youtubeUrlPlaceholder')}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-spotify focus:border-spotify transition-colors duration-200 pr-10 ${
                            fieldState.error
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                              : isFieldValid
                                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                : 'border-gray-300'
                          }`}
                        />
                        {isLoadingPreview ? (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
                        ) : isFieldValid ? (
                          <CheckCircle2
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500"
                            aria-label={t('form.validUrl')}
                          />
                        ) : fieldState.error && fieldState.isDirty ? (
                          <AlertCircle
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500"
                            aria-label={t('form.invalidUrl')}
                          />
                        ) : (
                          <SiYoutubemusic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-youtube opacity-50" />
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

              {isDuplicateUrl && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    {t('form.duplicateUrlWarning')}
                  </span>
                </div>
              )}

              {youtubePreview?.type === 'album' ||
              youtubePreview?.type === 'playlist' ? null : (
                <Button
                  type="submit"
                  disabled={
                    !!convertMutation.isPending ||
                    !isFormValid ||
                    !!isDuplicateUrl ||
                    (spotifyResult !== null && watchedUrl === lastProcessedUrl)
                  }
                  className={`w-full text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 ${
                    convertMutation.isPending
                      ? 'bg-spotify cursor-wait'
                      : spotifyResult && watchedUrl === lastProcessedUrl
                        ? 'bg-gray-400 opacity-70 cursor-not-allowed'
                        : 'bg-spotify hover:bg-green-600'
                  }`}
                >
                  {convertMutation.isPending ? (
                    <>
                      Converting...
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : spotifyResult && watchedUrl === lastProcessedUrl ? (
                    'Converted'
                  ) : (
                    'Convert to Spotify'
                  )}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {youtubePreview && (
        <Card className="bg-white rounded-2xl shadow-lg mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <SiYoutubemusic className="text-youtube text-xl mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                {t('preview.youtubeTrack', { defaultValue: 'YouTube Preview' })}
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
                      disabled={convertingTracks.includes(track.videoId)}
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
            ) : (
              <p>No preview available.</p>
            )}
          </CardContent>
        </Card>
      )}

      {(spotifyResult || singleTrackResult) && (
        <ResultCard result={(singleTrackResult || spotifyResult)!} />
      )}
    </>
  );
}
