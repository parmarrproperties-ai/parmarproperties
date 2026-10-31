// ============================================================
// src/lib/supabase.ts — Singleton Supabase client
// Import this wherever you need to query Supabase.
// ============================================================

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "https://placeholder-project.supabase.co";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "placeholder-anon-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "[Parmar] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env — " +
    "blog data will not load until these are set. Using placeholder values to prevent startup crash."
  );
} else {
  console.log("Supabase Anon Key loaded:", supabaseAnonKey.slice(0, 15) + "...");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

