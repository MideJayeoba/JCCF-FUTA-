import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both standard Vite (VITE_) and Next.js / Node (NEXT_PUBLIC_ / SUPABASE_) naming conventions
export const getSupabaseConfig = () => {
  const supabaseUrl =
    (typeof import.meta !== 'undefined' && import.meta.env && ((import.meta.env as any).SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || (import.meta.env as any).NEXT_PUBLIC_SUPABASE_URL)) ||
    (typeof process !== 'undefined' && (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)) ||
    'https://xvtdtlyjuvethmmfudgx.supabase.co';

  const supabaseAnonKey =
    (typeof import.meta !== 'undefined' && import.meta.env && ((import.meta.env as any).SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env as any).NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || (import.meta.env as any).SUPABASE_PUBLISHABLE_KEY)) ||
    (typeof process !== 'undefined' && (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY)) ||
    'sb_publishable_bm-jy_caAP0un6_crO8Eqg_-TlSjhI-';

  return { supabaseUrl, supabaseAnonKey };
};

let supabaseClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
};

export const supabase = getSupabase();
