// ============================================================
// src/seo/Seo.tsx — Per-page <head> management.
//
// Render <Seo .../> once per page. During the build-time prerender
// (scripts/prerender.mjs) the props are collected through HeadContext
// and written into the static HTML. In the browser, the same tags are
// applied to document.head so client-side navigation stays correct.
// ============================================================

import { createContext, useContext, useEffect } from "react";
import { site, absoluteUrl } from "./site";
import type { JsonLd } from "./schema";

export type SeoProps = {
  /** Full <title> text (50–60 characters is ideal). */
  title: string;
  /** Meta description (140–160 characters is ideal). */
  description: string;
  /** Path of the canonical URL, e.g. "/about". */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: JsonLd[];
  article?: { publishedTime?: string; modifiedTime?: string; section?: string; author?: string };
};

export type HeadCollector = { data: SeoProps | null };
export const HeadContext = createContext<HeadCollector | null>(null);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Serialises JSON-LD safely for embedding inside a <script> tag. */
const jsonForScript = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

/** All managed head tags except <title>, as an HTML string. Every tag carries data-seo. */
export function renderHeadTags(p: SeoProps): string {
  const url = absoluteUrl(p.path);
  const image = absoluteUrl(p.image || site.defaultOgImagePath);
  const meta = (attr: "name" | "property", key: string, value?: string) =>
    value ? `<meta data-seo ${attr}="${key}" content="${esc(value)}">` : "";
  const tags = [
    meta("name", "description", p.description),
    meta("name", "robots", p.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"),
    p.noindex ? "" : `<link data-seo rel="canonical" href="${esc(url)}">`,
    // Single-language site for India: declare it so Google serves it for en-IN searches.
    p.noindex ? "" : `<link data-seo rel="alternate" hreflang="en-IN" href="${esc(url)}">`,
    p.noindex ? "" : `<link data-seo rel="alternate" hreflang="x-default" href="${esc(url)}">`,
    meta("name", "geo.region", "IN-MH"),
    meta("name", "geo.placename", "Mumbai"),
    meta("property", "og:site_name", site.name),
    meta("property", "og:locale", "en_IN"),
    meta("property", "og:type", p.type || "website"),
    meta("property", "og:title", p.title),
    meta("property", "og:description", p.description),
    meta("property", "og:url", url),
    meta("property", "og:image", image),
    meta("property", "og:image:alt", p.imageAlt || p.title),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", p.title),
    meta("name", "twitter:description", p.description),
    meta("name", "twitter:image", image),
  ];
  if (p.article) {
    tags.push(
      meta("property", "article:published_time", p.article.publishedTime),
      meta("property", "article:modified_time", p.article.modifiedTime),
      meta("property", "article:section", p.article.section),
      meta("property", "article:author", p.article.author),
    );
  }
  for (const block of p.jsonLd ?? []) {
    tags.push(`<script data-seo type="application/ld+json">${jsonForScript(block)}</script>`);
  }
  return tags.filter(Boolean).join("\n    ");
}

export const Seo = (props: SeoProps) => {
  const collector = useContext(HeadContext);
  // Server render: record the props so the prerender script can write them into <head>.
  if (collector) collector.data = props;

  const key = JSON.stringify(props);
  useEffect(() => {
    document.title = props.title;
    document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
    const tpl = document.createElement("template");
    tpl.innerHTML = renderHeadTags(props);
    document.head.append(tpl.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
};
