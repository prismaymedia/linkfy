import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

// When running tests with Vitest, provide a minimal mock so env vars are not required
const isRunningTests = typeof process !== 'undefined' && !!process.env.VITEST;

const mockSupabase = {
  auth: {
    getSession: async () => ({
      data: { session: null as Session | null },
      error: null,
    }),
    getUser: async () => ({ data: { user: null as User | null }, error: null }),
    signOut: async () => ({ error: null as unknown as Error | null }),
  },
} as unknown as ReturnType<typeof createClient>;

export const supabase = isRunningTests
  ? mockSupabase
  : createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

// Session management helpers
export const getSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }
  return data.session;
};

export const getUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return data.user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getAuthHeaders = async () => {
  const session = await getSession();
  if (!session?.access_token) {
    return {};
  }
  return {
    Authorization: `Bearer ${session.access_token}`,
  };
};
