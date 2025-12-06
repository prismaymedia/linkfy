import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { useTranslation } from 'react-i18next';
import type { SpotifyTrackInfo } from '../../../shared/schema';

const SpotifyTrackInfoSchema = z.object({
  spotifyUrl: z.string(),
  trackName: z.string(),
  artistName: z.string(),
  albumName: z.string(),
  thumbnailUrl: z.string(),
});

const FavoriteSchema = z.object({
  id: z.number(),
  userId: z.string(),
  historyId: z.number(),
  alias: z.string().nullable().optional(),
  createdAt: z.string(),
  trackInfo: SpotifyTrackInfoSchema.optional(),
});

const FavoriteResponseSchema = z.object({
  success: z.boolean(),
  favorite: FavoriteSchema.optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

const FavoritesListResponseSchema = z.object({
  success: z.boolean(),
  favorites: z.array(FavoriteSchema),
});

type Favorite = z.infer<typeof FavoriteSchema>;


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useFavorites() {
    const { session } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    // Fetch all favorites for the current user
    const { data: favorites = [], isLoading, error } = useQuery({
        queryKey: ['favorites', session?.user?.id],
        queryFn: async (): Promise<Favorite[]> => {
            if (!session) {
                return [];
            }

            const response = await fetch(`${API_BASE}/api/favorites/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch favorites: ${response.statusText}`);
            }
            
            const data = await response.json();
            const parsedData = FavoritesListResponseSchema.parse(data);
            return parsedData.favorites || [];
        },
        enabled: !!session,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Check if a specific history entry is favorited
    const isFavorited = (historyId: number): boolean => {
        return favorites.some((fav) => fav.historyId === historyId);
    };

    // Add to favorites mutation
    const addToFavoritesMutation = useMutation({
        mutationFn: async (historyId: number) => {
            if (!session) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`${API_BASE}/api/favorites/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    historyId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to add favorite: ${response.statusText}`);
            }

            const data = await response.json();
            return FavoriteResponseSchema.parse(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', session?.user?.id] });
            toast({
                title: t('favorites.addedTitle'),
                description: t('favorites.addedDescription'),
                variant: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: t('favorites.errorTitle'),
                description: error.message || t('favorites.addErrorDescription'),
                variant: 'destructive',
            });
        },
    });

    // Remove from favorites mutation
    const removeFromFavoritesMutation = useMutation({
        mutationFn: async (historyId: number) => {
            if (!session) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`${API_BASE}/api/favorites/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    historyId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to remove favorite: ${response.statusText}`);
            }

            const data = await response.json();
            return FavoriteResponseSchema.parse(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', session?.user?.id] });
            toast({
                title: t('favorites.removedTitle'),
                description: t('favorites.removedDescription'),
                variant: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: t('favorites.errorTitle'),
                description: error.message || t('favorites.removeErrorDescription'),
                variant: 'destructive',
            });
        },
    });

    const toggleFavorite = async (historyId: number) => {
        if (!session) {
            toast({
                title: t('favorites.notAuthenticatedTitle'),
                description: t('favorites.notAuthenticatedDescription'),
                variant: 'destructive',
            });
            return;
        }

        if (isFavorited(historyId)) {
            await removeFromFavoritesMutation.mutateAsync(historyId);
        } else {
            await addToFavoritesMutation.mutateAsync(historyId);
        }
    };

    return {
        favorites,
        isLoading,
        error,
        isFavorited,
        addToFavorites: addToFavoritesMutation.mutateAsync,
        removeFromFavorites: removeFromFavoritesMutation.mutateAsync,
        toggleFavorite,
        isAdding: addToFavoritesMutation.isPending,
        isRemoving: removeFromFavoritesMutation.isPending,
    };
}