// ============================================================
// src/lib/supabase.ts — Singleton Supabase client
// Import this wherever you need to query Supabase.
// ============================================================

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Parmar] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env — " +
    "blog data will not load until these are set."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
