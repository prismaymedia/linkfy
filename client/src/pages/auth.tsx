import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase, getSession, getRedirectUrl } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import LanguageSwitcher from '@/components/language-switcher';
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';

export default function AuthPage() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      if (currentSession) {
        setLocation(ROUTES.DASHBOARD);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          setLocation(ROUTES.DASHBOARD);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setLocation]);

  const handleSocialLogin = async (provider: 'google') => {
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Linkfy</h1>
        </div>

        <div className="mt-4 flex justify-center space-x-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="bg-white border px-4 py-2 rounded flex items-center space-x-2"
          >
            <FcGoogle className="text-xl" />
            <span className="text-gray-700">Google</span>
          </button>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </div>
    </div>
  );
}
