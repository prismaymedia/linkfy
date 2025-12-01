import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Trash2, Copy, Check, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface FavoritesItem {
  id: number;
  historyId: number;
  trackName?: string;
  artistName?: string;
  thumbnailUrl?: string;
  spotifyUrl?: string;
  createdAt: string;
}

export function FavoritesSidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { favorites, isLoading, removeFromFavorites } = useFavorites();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!user) {
    return null;
  }

  const handleCopyUrl = async (url: string, id: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast({
        title: t('result.copiedTitle'),
        description: t('result.copiedDescription'),
        variant: 'success',
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: t('result.copyFailedTitle'),
        description: t('result.copyFailedDescription'),
        variant: 'destructive',
      });
    }
  };

  const favoritesList: FavoritesItem[] = (favorites || []).map((fav: any) => ({
    id: fav.id,
    historyId: fav.historyId,
    trackName: fav.trackInfo?.trackName || fav.alias || 'Unknown Track',
    artistName: fav.trackInfo?.artistName || 'Unknown Artist',
    thumbnailUrl: fav.trackInfo?.thumbnailUrl,
    spotifyUrl: fav.trackInfo?.spotifyUrl,
    createdAt: fav.createdAt,
  }));

  const hasEmptyState = !isLoading && favoritesList.length === 0;

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg border-l border-gray-200 z-40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t('favorites.title') || 'Favorites'}
          </h2>
          {favoritesList.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              {favoritesList.length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Music className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {hasEmptyState && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Star className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {t('favorites.empty') || 'No favorites yet'}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              {t('favorites.emptyDescription') ||
                'Click the star icon to save your favorite conversions'}
            </p>
          </div>
        )}

        {!isLoading && favoritesList.length > 0 && (
          <div className="space-y-2 p-3">
            {favoritesList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-all cursor-pointer border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.trackName}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {item.trackName}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {item.artistName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() =>
                            handleCopyUrl(item.spotifyUrl || '', item.id)
                          }
                          title="Copy URL"
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 hover:text-red-600"
                          onClick={() => removeFromFavorites(item.historyId)}
                          title="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
