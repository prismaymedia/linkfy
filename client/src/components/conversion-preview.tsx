import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { YouTubeTrackInfo, PlaylistTrack } from '../../../shared/schema';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, Music2, Clock, User } from 'lucide-react';
import DynamicServiceIcon from './dynamic-service-icon';
import { detectMusicService } from './music-service-detector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConversionPreviewProps {
    previewData: YouTubeTrackInfo | null;
    isLoading: boolean;
    url: string;
    size?: 'compact' | 'full';
    onConvertTrack?: (track: PlaylistTrack) => void;
    convertingTracks?: string[];
    convertedTracks?: string[];
    error?: string | null;
}

const PreviewCardSkeleton = ({
    url,
    getPreviewTranslationKey,
}: {
    url?: string;
    getPreviewTranslationKey: (
        url: string,
        contentType?: 'track' | 'playlist' | 'album',
    ) => string;
}) => {
    const { t } = useTranslation();
    return (
        <Card className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-6">
            <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-center">
                    <DynamicServiceIcon
                        url={url || ''}
                        className="text-lg sm:text-xl mr-2"
                    />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {t(getPreviewTranslationKey(url || '', 'track'), {
                            defaultValue: t('preview.unknownTrack'),
                        })}
                    </h3>
                </div>
            </CardHeader>
            <CardContent className="pt-0 p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg flex-shrink-0" />
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

const ErrorState = ({ error, url }: { error: string; url: string }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-6 border-red-100">
                <CardContent className="p-4 sm:p-6">
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-sm font-semibold">
                            {t('preview.errorTitle', 'Preview Error')}
                        </AlertTitle>
                        <AlertDescription className="text-sm mt-1">
                            {error || t('preview.errorGeneric', 'Unable to load preview. Please check the URL and try again.')}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function ConversionPreview({
    previewData,
    isLoading,
    url,
    size = 'full',
    onConvertTrack,
    convertingTracks = [],
    convertedTracks = [],
    error = null,
}: ConversionPreviewProps) {
    const { t } = useTranslation();
    const isCompact = size === 'compact';
    const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

    // Helper function to get the preview translation key
    const getPreviewTranslationKey = (
        urlString: string,
        contentType: 'track' | 'playlist' | 'album' = 'track',
    ) => {
        const service = detectMusicService(urlString);
        const contentTypeCapitalized =
            contentType.charAt(0).toUpperCase() + contentType.slice(1);
        return `preview.${service}${contentTypeCapitalized}`;
    };

    const handleImageError = (key: string) => {
        setImageError((prev) => ({ ...prev, [key]: true }));
    };

    const formatDuration = (duration?: string) => {
        if (!duration) return null;
        // Duration is already formatted from the API (e.g., "3:45")
        return duration;
    };

    // Show error state if error exists and not loading
    if (!isLoading && error && !previewData) {
        return <ErrorState error={error} url={url} />;
    }

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preview-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PreviewCardSkeleton
                        url={url}
                        getPreviewTranslationKey={getPreviewTranslationKey}
                    />
                </motion.div>
            )}

            {!isLoading && previewData && (
                <motion.div
                    key="preview-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card
                        className={`bg-white rounded-2xl shadow-lg ${isCompact ? 'mb-4' : 'mb-4 sm:mb-6'}`}
                    >
                        <CardHeader
                            className={`pb-3 ${isCompact ? 'p-4' : 'p-4 sm:p-6'}`}
                        >
                            <div className="flex items-center">
                                <DynamicServiceIcon
                                    url={url || ''}
                                    className="text-xl mr-2"
                                />
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {t('preview.youtubeTrack', {
                                        defaultValue: 'YouTube Preview',
                                    })}
                                </h3>
                            </div>
                            {previewData.type !== 'track' &&
                                previewData.playlistTitle && (
                                    <p className="text-sm text-gray-500">
                                        {previewData.playlistTitle}
                                    </p>
                                )}
                        </CardHeader>

                        <CardContent className="pt-0 p-4 sm:p-6">
                            {previewData.type === 'playlist' ||
                                previewData.type === 'album' ? (
                                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                    {previewData.tracks.map((track) => (
                                        <div
                                            key={track.videoId}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-3 sm:pb-2 last:border-none"
                                        >
                                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                                {imageError[track.videoId] ? (
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <Music2 className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={track.thumbnailUrl}
                                                        alt={track.trackName}
                                                        onError={() => handleImageError(track.videoId)}
                                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover shadow-sm flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                                        {track.trackName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                            {track.artistName}
                                                        </p>
                                                    </div>
                                                    {track.duration && (
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                            <p className="text-xs text-gray-500">
                                                                {formatDuration(track.duration)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {onConvertTrack && (
                                                <Button
                                                    onClick={() => onConvertTrack(track)}
                                                    disabled={
                                                        convertingTracks.includes(track.videoId) ||
                                                        convertedTracks.includes(track.videoId)
                                                    }
                                                    size="sm"
                                                    className={`text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 w-full sm:w-auto flex-shrink-0 ${convertedTracks.includes(track.videoId)
                                                        ? 'bg-gray-400 opacity-70 cursor-not-allowed'
                                                        : convertingTracks.includes(track.videoId)
                                                            ? 'bg-spotify/90 cursor-wait'
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
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : previewData.type === 'track' ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    {imageError['track'] ? (
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                                            <Music2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                                        </div>
                                    ) : (
                                        <img
                                            src={previewData.thumbnailUrl ?? ''}
                                            alt={previewData.trackName || 'Track thumbnail'}
                                            onError={() => handleImageError('track')}
                                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg object-cover shadow-md flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Music2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <h4 className="font-semibold text-gray-900 truncate text-base sm:text-lg">
                                                    {previewData.trackName}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                <p className="text-sm sm:text-base text-gray-600 truncate">
                                                    {previewData.artistName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                                            {previewData.duration && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span>{formatDuration(previewData.duration)}</span>
                                                </div>
                                            )}
                                            {previewData.originalTitle && previewData.originalTitle !== previewData.trackName && (
                                                <div className="flex items-start gap-1.5">
                                                    <span className="text-gray-400">•</span>
                                                    <span className="truncate max-w-xs">
                                                        {t('preview.original', 'Original')}: {previewData.originalTitle}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
