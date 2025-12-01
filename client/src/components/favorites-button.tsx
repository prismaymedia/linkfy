import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FavoritesButtonProps {
  historyId: number;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoritesButton({
  historyId,
  className,
  showText = false,
  size = 'md',
}: FavoritesButtonProps) {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite, isAdding, isRemoving } = useFavorites();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const isFav = isFavorited(historyId);

  const handleClick = async () => {
    if (!user) {
      toast({
        title: t('favorites.notAuthenticatedTitle'),
        description: t('favorites.notAuthenticatedDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await toggleFavorite(historyId);
    } finally {
      setIsLoading(false);
    }
  };

  const isProcessing = isLoading || isAdding || isRemoving;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isProcessing || !user}
      variant="outline"
      className={cn(
        'transition-all duration-200',
        isFav && 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100',
        !isFav && 'hover:bg-gray-100',
        size === 'sm' && 'p-1',
        size === 'md' && 'px-2 py-2',
        size === 'lg' && 'px-3 py-2',
        className,
      )}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isFav && 'fill-yellow-400 text-yellow-400',
          !isFav && 'text-gray-600',
        )}
      />
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isFav ? 'Favorited' : 'Add to favorites'}
        </span>
      )}
    </Button>
  );
}
