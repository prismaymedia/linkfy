import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

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
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('supabase: getSession error', error);
        }

        if (!mounted) return;
        setSession(session ?? null);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error getting initial session', err);
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
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
    });

    return () => {
      mounted = false;
      try {
        subscription.unsubscribe();
      } catch (e) {}
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out', err);
    } finally {
      // Ensure local session state cleared to avoid stale tokens
      setSession(null);
      setUser(null);
      setLoading(false);
    }
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
