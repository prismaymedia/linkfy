export const supabase = {
  auth: {
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: null }),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockResolvedValue({ data: [], error: null }),
};
