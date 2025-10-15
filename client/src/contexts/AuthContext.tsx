import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import * as Sentry from '@sentry/react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session and restore user if present
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Attach non-PII user context to Sentry
      try {
        if (session?.user) {
          const u = session.user;
          Sentry.setUser({
            id: u.id,
            username: u.email ? u.email.split('@')[0] : undefined,
          });
        } else {
          Sentry.setUser(null);
        }
      } catch (e) {}
    };

    getInitialSession();

    // Listen for auth changes and handle token refresh / expired sessions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Typical events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else {
        setSession(session ?? null);
        setUser(session?.user ?? null);
      }

      // stop loading after the first auth state is processed
      setLoading(false);
      try {
        if (session?.user) {
          const u = session.user;
          Sentry.setUser({
            id: u.id,
            username: u.email ? u.email.split('@')[0] : undefined,
          });
        } else {
          Sentry.setUser(null);
        }
      } catch (e) {}
    });

    return () => {
      mounted = false;
      try {
        subscription.unsubscribe();
      } catch (e) {}
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    Sentry.setUser(null);
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
