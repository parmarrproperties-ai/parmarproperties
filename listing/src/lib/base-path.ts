/**
 * The site is served under parmarproperties.in/listing (see next.config.ts).
 * Next.js adds this prefix to <Link>, router and redirects by itself, but not to
 * plain strings such as image paths ("/hero/x.jpg") or fetch("/api/..."), so
 * those go through withBasePath().
 */
export const BASE_PATH = "/listing";

/** "/hero/x.jpg" -> "/listing/hero/x.jpg". Full URLs, blob:/data: and "#..." are left alone. */
export function withBasePath<T extends string | null | undefined>(path: T): T {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}` as T;
}
