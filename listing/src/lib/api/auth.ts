import type { Profile } from "@/types";

import { getSupabase, throwOnError } from "./client";

export async function signIn(email: string, password: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      throw new Error("Incorrect email or password.");
    }
    throw new Error(error.message);
  }
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Loads the admin profile row for the signed-in user.
 * Returns null when there is no session, so callers can redirect to login.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  throwOnError(error, "Loading your profile");

  if (!data) {
    // Signed in, but the profile trigger has not run (or the row was removed).
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: null,
      role: "admin",
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return data as unknown as Profile;
}

/**
 * Active admins, for pickers such as the lead assignment dropdown.
 */
export async function listAdminProfiles(): Promise<Profile[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .order("full_name", { ascending: true, nullsFirst: false });

  throwOnError(error, "Loading advisors");
  return (data ?? []) as unknown as Profile[];
}

export async function updateProfileName(
  id: string,
  fullName: string
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", id);

  throwOnError(error, "Updating your name");
}

export async function updatePassword(newPassword: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function sendPasswordReset(email: string): Promise<void> {
  const supabase = getSupabase();
  const redirectTo =
    typeof window === "undefined"
      ? undefined
      : `${window.location.origin}/admin/login`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw new Error(error.message);
}
