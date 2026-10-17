import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let revalidateTimer: ReturnType<typeof setTimeout> | undefined;

/** Debounced: a save touches several tables, but the site only needs one refresh. */
function schedulePublicSiteRevalidate() {
  if (typeof window === "undefined") return;
  clearTimeout(revalidateTimer);
  revalidateTimer = setTimeout(() => {
    void fetch("/api/revalidate", { method: "POST" }).catch(() => undefined);
  }, 1500);
}

/**
 * Admin writes (database rows or storage files) refresh the public site right
 * away instead of waiting for the 60-second ISR window.
 */
const revalidatingFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  const url = input instanceof Request ? input.url : String(input);
  const isWrite = method !== "GET" && method !== "HEAD";
  const isDataWrite = /\/(rest|storage)\/v1\//.test(url) && !url.includes("/rest/v1/rpc/");
  if (response.ok && isWrite && isDataWrite) schedulePublicSiteRevalidate();
  return response;
};

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createBrowserClient<Database>(url, key, {
    global: { fetch: revalidatingFetch },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
