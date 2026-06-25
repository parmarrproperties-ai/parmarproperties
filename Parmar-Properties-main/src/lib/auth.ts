// ============================================================
// src/lib/auth.ts — Thin Supabase Auth wrappers
// ============================================================

import { supabase } from "./supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

/** Sign in with email + password. Throws on failure. */
export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Sign out the current session. */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get the current active session (null if not logged in). */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Subscribe to auth state changes. Returns the unsubscribe function. */
export function onAuthChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
}
