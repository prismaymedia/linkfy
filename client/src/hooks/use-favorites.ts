import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import type { SpotifyTrackInfo } from '../../../shared/schema';

interface Favorite {
    id: number;
    userId: string;
    historyId: number;
    alias?: string;
    createdAt: string;
    trackInfo?: SpotifyTrackInfo;
}

interface FavoriteResponse {
    success: boolean;
    favorite?: Favorite;
    message?: string;
    error?: string;
}

interface FavoritesListResponse {
    success: boolean;
    favorites: Favorite[];
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useFavorites() {
    const { user, session } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

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

            const data: FavoritesListResponse = await response.json();
            return data.favorites || [];
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

            return response.json() as Promise<FavoriteResponse>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', session?.user?.id] });
            toast({
                title: 'Added to favorites',
                description: 'This conversion has been saved.',
                variant: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add to favorites',
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

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', session?.user?.id] });
            toast({
                title: 'Removed from favorites',
                description: 'This conversion has been removed.',
                variant: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to remove from favorites',
                variant: 'destructive',
            });
        },
    });

    const toggleFavorite = async (historyId: number) => {
        if (!session) {
            toast({
                title: 'Not authenticated',
                description: 'Please log in to use favorites.',
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