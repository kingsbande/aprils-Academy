import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserRole = async (): Promise<'admin' | 'teacher' | 'parent' | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  
  return (user.app_metadata?.role as 'admin' | 'teacher' | 'parent') || null;
};