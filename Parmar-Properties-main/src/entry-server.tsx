// ============================================================
// src/entry-server.tsx — Server renderer used only at build time by
// scripts/prerender.mjs (built with `vite build --ssr`). It renders a
// route to HTML and returns the <head> tags collected from <Seo>.
// ============================================================

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "./App";
import { HeadContext, renderHeadTags, type HeadCollector } from "@/seo/Seo";
import type { InitialData } from "@/lib/initialData";

export { staticRoutes, pages } from "@/seo/pages";
export { site, absoluteUrl } from "@/seo/site";
export { mapPost } from "@/lib/types";
export { postTitle, postDescription } from "@/seo/blog";
export { servicePages } from "@/content/services";
export { faqGroups } from "@/content/faqs";

export function render(path: string, data: InitialData, basename = "") {
  globalThis.__PP_DATA__ = data;
  const head: HeadCollector = { data: null };
  const html = renderToString(
    <HeadContext.Provider value={head}>
      <StaticRouter location={basename + path} basename={basename || undefined}>
        <AppRoutes />
      </StaticRouter>
    </HeadContext.Provider>,
  );
  globalThis.__PP_DATA__ = undefined;
  return {
    html,
    title: head.data?.title ?? null,
    headTags: head.data ? renderHeadTags(head.data) : "",
    noindex: Boolean(head.data?.noindex),
  };
}
