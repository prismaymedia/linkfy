import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Home from '@/pages/home';
import UrlSuggestionPopup from '@/components/url-suggestion-popup';

function AppExtension() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <UrlSuggestionPopup />
        <Home />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default AppExtension;
