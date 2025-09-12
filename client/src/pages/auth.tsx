import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AuthForm from '@/components/authForm';
import { supabase, getSession } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import LanguageSwitcher from '@/components/language-switcher';
import { SiFacebook } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from 'react-i18next';

export default function AuthPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [, setLocation] = useLocation();

  useEffect(() => {
    // Fetch session on load
    const fetchSession = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
    };

    fetchSession();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (email: string, password: string) => {
    setError(null);
    setSuccess(null);

    if (mode === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('✅ Signed in successfully!');
      console.log('User session:', data.session);
      setLocation('/');
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('✅ Account created! Please check your email to confirm.');
      console.log('New user:', data.user);
      setLocation('/'); // Redirect to the home page
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Linkfy</h1>
        </div>

        {/* Auth Form */}
        <AuthForm onSubmit={handleAuth} />

        <div className="mt-4 text-center">
          {mode === 'signin' ? (
            <p>
              {t('auth.noAccount')}{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-blue-600 underline"
              >
                {t('auth.signUp')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.alreadyHaveAccount')}{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-blue-600 underline"
              >
                {t('auth.signIn')}
              </button>
            </p>
          )}
        </div>

        {/* Social Login */}
        <div className="mt-4 flex justify-center space-x-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="bg-white border px-4 py-2 rounded flex items-center space-x-2"
          >
            <FcGoogle className="text-xl" />
            <span className="text-gray-700">Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('facebook')}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
          >
            <SiFacebook className="text-white" />
            <span>Facebook</span>
          </button>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </div>
    </div>
  );
}
