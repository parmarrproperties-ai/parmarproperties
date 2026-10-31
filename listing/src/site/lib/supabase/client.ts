import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let warnedMissingConfig = false;

export function isSupabaseConfigured(): boolean {
  const configured = Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl !== 'https://your-project-id.supabase.co' &&
      supabaseAnonKey !== 'your-supabase-anon-key'
  );

  if (!configured && !warnedMissingConfig) {
    warnedMissingConfig = true;
    console.error(
      '[supabase] Missing or placeholder NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Copy .env.example to .env.local and restart the Next.js dev server.'
    );
  }

  return configured;
}

const SITE_AUTH = { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } as const;

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      // The public site only reads published data and inserts leads as anon. It never signs anyone in, and it now
      // shares a domain with the admin (/admin), so it must not touch the admin's session storage.
      auth: SITE_AUTH,
    });
  }
  return clientInstance;
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, { auth: SITE_AUTH })
  : null;
