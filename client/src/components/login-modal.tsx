import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { supabase, getSession, getRedirectUrl } from '@/lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import { useLoginModal } from '@/contexts/LoginModalContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function LoginModal() {
  const { t } = useTranslation();
  const { isOpen, closeModal } = useLoginModal();
  const { session } = useAuth();
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  // Close modal when user is authenticated
  useEffect(() => {
    if (session && isOpen) {
      closeModal();

      if (window.location.pathname === ROUTES.AUTH) {
        const timeoutId = setTimeout(() => {
          setLocation(ROUTES.DASHBOARD);
        }, 200);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [session, isOpen, closeModal, setLocation]);

  // Handle OAuth callback
  const handleOAuthCallback = useCallback(async () => {
    if (window.location.pathname !== ROUTES.AUTH) return;

    setIsProcessingCallback(true);

    try {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const errorParam = hashParams.get('error');

      if (errorParam) {
        setError(t('errors.authError', 'Authentication error. Please try again.'));
        setIsProcessingCallback(false);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (accessToken) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const currentSession = await getSession();

        window.history.replaceState({}, document.title, window.location.pathname);

        if (currentSession) {
          setSuccess(t('auth.success', 'Successfully signed in!'));
          // modal closes via session effect
        } else {
          setIsProcessingCallback(false);
        }
      } else {
        setIsProcessingCallback(false);
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError(t('errors.authError', 'Authentication error. Please try again.'));
      setIsProcessingCallback(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [t]);

  // Run callback only when modal opens
  useEffect(() => {
    if (isOpen) {
      handleOAuthCallback();
    }
  }, [isOpen, handleOAuthCallback]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        setSuccess(t('auth.success', 'Successfully signed in!'));
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError(t('errors.authError', 'An error occurred. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setError(null);
    setSuccess(null);
    setIsOAuthLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getRedirectUrl(),
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsOAuthLoading(false);
      }
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      setError(t('errors.authError', 'An error occurred. Please try again.'));
      setIsOAuthLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setIsLoading(false);
    setIsOAuthLoading(false);
    setIsProcessingCallback(false);
    closeModal();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading && !isOAuthLoading && !isProcessingCallback) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 py-8 text-white">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-white text-center">
              {t('auth.title', 'Sign in to Linkfy')}
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm sm:text-base text-center">
              {t('auth.subtitle', 'Sign in to start converting music links')}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 bg-white">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm font-medium"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading || isOAuthLoading || isProcessingCallback}
            >
              {isOAuthLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <FcGoogle className="mr-2 h-5 w-5" />
              )}
              <span className="text-gray-700">
                {t('auth.signInWithGoogle', 'Sign in with Google')}
              </span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">
                {t('auth.or', 'Or')}
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                {t('auth.email', 'Email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isOAuthLoading || isProcessingCallback}
                autoComplete="email"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                {t('auth.password', 'Password')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isOAuthLoading || isProcessingCallback}
                autoComplete="current-password"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm">
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading || isOAuthLoading || isProcessingCallback}
            >
              {isLoading || isProcessingCallback ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('auth.signingIn', 'Signing in...')}
                </>
              ) : (
                t('auth.signIn', 'Sign in')
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
