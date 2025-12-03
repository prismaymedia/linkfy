import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginModalProvider } from '@/contexts/LoginModalContext';
import LoginModal from '@/components/login-modal';
import Home from '@/pages/home';
import UrlSuggestionPopup from '@/components/url-suggestion-popup';

function AppExtension() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoginModalProvider>
          <TooltipProvider>
            <Toaster />
            <LoginModal />
            <UrlSuggestionPopup />
            <Home />
          </TooltipProvider>
        </LoginModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppExtension;
