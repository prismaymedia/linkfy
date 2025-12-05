import { useLocation } from 'wouter';
import { User, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function UserMenu() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setLocation(ROUTES.HOME);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const userInitials = user?.email
    ? user.email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase()
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full touch-target-sm focus:ring-2 focus:ring-offset-2"
          aria-label={t('header.userMenu', 'User menu')}
        >
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 sm:w-64 max-w-[calc(100vw-1rem)]"
        align="end"
        alignOffset={-4}
        sideOffset={8}
        collisionPadding={{ top: 8, right: 8, bottom: 8, left: 8 }}
        side="bottom"
        avoidCollisions={true}
        sticky="partial"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground truncate">
              {user?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {t('navigation.signedIn', 'Signed in')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setLocation(ROUTES.DASHBOARD)}
          className="cursor-pointer min-h-[44px] sm:min-h-[36px] py-2 sm:py-1.5"
        >
          <LayoutDashboard className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{t('header.dashboard', 'Dashboard')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocation(ROUTES.PROFILE)}
          className="cursor-pointer min-h-[44px] sm:min-h-[36px] py-2 sm:py-1.5"
        >
          <User className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{t('navigation.profile', 'Profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocation(ROUTES.SETTINGS)}
          className="cursor-pointer min-h-[44px] sm:min-h-[36px] py-2 sm:py-1.5"
        >
          <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{t('navigation.settings', 'Settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 min-h-[44px] sm:min-h-[36px] py-2 sm:py-1.5"
        >
          <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{t('navigation.signOut', 'Sign Out')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
