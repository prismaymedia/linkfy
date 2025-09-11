import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Session management helper
export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error fetching session:', error);
        return null;
    }
    return data.session;
};

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
});
