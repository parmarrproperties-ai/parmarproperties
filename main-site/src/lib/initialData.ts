// ============================================================
// src/lib/initialData.ts — Data embedded into pre-rendered pages.
//
// scripts/prerender.mjs sets globalThis.__PP_DATA__ before rendering a
// route on the server, and writes the same object into the page as
// window.__PP_DATA__. Hooks read it so the first render already has
// content (no loading skeleton for crawlers or for visitors).
// ============================================================

import type { BlogPost } from "./types";

export type InitialData = {
  /** Published posts (content may be omitted for list views). */
  posts?: BlogPost[];
  /** Full post for /blog/:slug pages, keyed by slug. */
  post?: BlogPost;
  /** "More Articles" for the post above. */
  moreArticles?: BlogPost[];
};

declare global {
  // eslint-disable-next-line no-var
  var __PP_DATA__: InitialData | undefined;
}

export function getInitialData(): InitialData {
  return globalThis.__PP_DATA__ ?? {};
}
