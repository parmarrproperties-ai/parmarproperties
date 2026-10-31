#!/usr/bin/env node
// ============================================================
// scripts/prerender.mjs — Build-time pre-rendering for SEO / GEO / AEO.
//
// Runs after `vite build` and `vite build --ssr src/entry-server.tsx`.
//   1. Fetches published blog posts from Supabase (read-only, anon key).
//   2. Renders every public route to static HTML with its own <head>.
//   3. Writes sitemap.xml, robots.txt, llms.txt, 404.html and spa.html.
//
// Output layout (served by Vercel with "cleanUrls": true):
//   /            → dist/index.html
//   /about       → dist/about.html
//   /blog/<slug> → dist/blog/<slug>.html
//   unknown URLs → dist/404.html (real 404 status)
//   /admin, new posts not yet pre-rendered → dist/spa.html (client-side app),
//   reached through vercel.json rewrites to "/spa" — with cleanUrls, rewrite
//   destinations must use the clean path, never "/spa.html".
// ============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import dotenv from "dotenv";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

for (const file of [".env", ".env.local", ".env.production", ".env.production.local"]) {
  const p = path.join(root, file);
  if (fs.existsSync(p)) dotenv.config({ path: p, override: false });
}

const basename = process.env.GITHUB_PAGES === "true" ? "/parmarproperties" : "";
const log = (...a) => console.log("[prerender]", ...a);
const warn = (...a) => console.warn("[prerender] WARNING:", ...a);

const ssr = await import(pathToFileURL(ssrEntry).href);
const { render, staticRoutes, site, absoluteUrl, mapPost, postDescription, servicePages, pages, faqGroups } = ssr;

// ─── 1. Blog posts ─────────────────────────────────────────
async function fetchPosts() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    warn("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — blog posts will not be pre-rendered.");
    return [];
  }
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const get = async (q) => {
    const res = await fetch(`${url}/rest/v1/${q}`, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${q.split("?")[0]}`);
    return res.json();
  };
  try {
    const rows = await get("posts?select=*&status=eq.published&order=grid_order.asc");
    if (!rows.length) return [];
    const ids = rows.map((r) => r.id).join(",");
    const sections = await get(`post_sections?select=*&post_id=in.(${ids})&order=order.asc`);
    const byPost = {};
    for (const s of sections) (byPost[s.post_id] ??= []).push(s);
    return rows.map((r) => mapPost(r, byPost[r.id] ?? []));
  } catch (err) {
    warn(`could not load blog posts from Supabase (${err.message}). Blog posts will fall back to client rendering.`);
    return [];
  }
}

const posts = await fetchPosts();
log(`${posts.length} published posts`);

/** List views don't need the article bodies. */
const listPost = (p) => ({ ...p, content: undefined });

/** Same rule as fetchMoreArticles(): pinned overrides, else the 3 most recent other posts. */
function moreArticlesFor(post) {
  const pinned = (post.moreArticlesOverride ?? []).slice(0, 3).map((id) => posts.find((p) => p.id === id)).filter(Boolean);
  if (pinned.length) return pinned.map(listPost);
  return posts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 3)
    .map(listPost);
}

// ─── 2. Render routes ──────────────────────────────────────
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes('<div id="app"></div>')) throw new Error("dist/index.html has no empty #app container");

// Untouched client-side shell for routes that are not pre-rendered.
fs.writeFileSync(path.join(dist, "spa.html"), template);

const escapeScriptJson = (data) =>
  JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

// Search Console / Bing Webmaster verification: set in src/seo/site.ts or as
// GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION environment variables on Vercel.
const verification = [
  ["google-site-verification", process.env.GOOGLE_SITE_VERIFICATION || site.verification?.google],
  ["msvalidate.01", process.env.BING_SITE_VERIFICATION || site.verification?.bing],
]
  .filter(([, v]) => v)
  .map(([name, v]) => `<meta name="${name}" content="${String(v).replace(/"/g, "")}">`)
  .join("\n    ");

function buildPage(route, data) {
  const { html, title, headTags } = render(route, data, basename);
  let page = template;
  if (title) {
    page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>`);
    page = page.replace(/\s*<meta[^>]*name="description"[^>]*>/, "");
  }
  page = page.replace("</head>", `    ${headTags}${verification ? `\n    ${verification}` : ""}\n  </head>`);
  const dataScript = Object.keys(data).length ? `<script>window.__PP_DATA__=${escapeScriptJson(data)}</script>` : "";
  page = page.replace('<div id="app"></div>', `<div id="app">${html}</div>${dataScript}`);
  return page;
}

function write(route, html) {
  const file = route === "/" ? "index.html" : route === "/404" ? "404.html" : `${route.slice(1)}.html`;
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return file;
}

const listData = { posts: posts.map(listPost) };
const routes = [
  ...staticRoutes.map((route) => ({ route, data: ["/", "/blog"].includes(route) ? listData : {} })),
  ...posts.map((post) => ({ route: `/blog/${post.slug}`, data: { post, moreArticles: moreArticlesFor(post) } })),
  { route: "/newsletter-confirmed", data: {} },
  { route: "/404", data: {} },
];

for (const { route, data } of routes) {
  const file = write(route, buildPage(route, data));
  log(`${route} → ${file}`);
}

// ─── 3. sitemap.xml, robots.txt, llms.txt ──────────────────
const xmlEscape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const latestPost = posts.reduce((max, p) => ((p.updatedAt || p.date) > max ? p.updatedAt || p.date : max), "");
const day = (d) => (d ? d.slice(0, 10) : undefined);

const sitemapEntries = [
  ...staticRoutes.map((route) => ({
    loc: absoluteUrl(route),
    lastmod: route === "/" || route === "/blog" ? day(latestPost) : undefined,
    priority: route === "/" ? "1.0" : route.startsWith("/services") || route === "/blog" ? "0.8" : route.includes("policy") || route.includes("terms") ? "0.2" : "0.6",
  })),
  ...posts.map((p) => ({
    loc: absoluteUrl(`/blog/${p.slug}`),
    lastmod: day(p.updatedAt || p.date),
    priority: "0.7",
    image: p.imageUrl ? { loc: p.imageUrl, title: p.title } : null,
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries
  .map(
    (e) => `  <url>
    <loc>${xmlEscape(e.loc)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
    <priority>${e.priority}</priority>${e.image ? `\n    <image:image><image:loc>${xmlEscape(e.image.loc)}</image:loc><image:title>${xmlEscape(e.image.title)}</image:title></image:image>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot"];
const robots = `# robots.txt for ${site.url}
User-agent: *
Allow: /
Disallow: /admin

# AI search and answer engines are welcome to read and cite this site.
${aiBots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /admin`).join("\n\n")}

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;
fs.writeFileSync(path.join(dist, "robots.txt"), robots);

// llms.txt — a plain-language map of the site for AI assistants (https://llmstxt.org).
const llms = `# ${site.name}

> ${site.description}

- Founded: ${site.foundingDate}, Mumbai, India
- Legal name: ${site.legalName}
- Office: ${site.address.streetAddress}, ${site.address.addressLocality} ${site.address.postalCode}, ${site.address.addressRegion}, India
- Phone: ${site.officePhone} (office); ${site.phones.join(", ")}
- Email: ${site.email}
- Track record: ${site.stats.familiesHelped.toLocaleString("en-IN")}+ families helped, ${site.stats.residentialDeals.toLocaleString("en-IN")}+ residential deals, ${site.stats.commercialDeals}+ commercial deals
- Areas served: ${site.areaServed.join(", ")}
- Leadership: ${site.founders.map((f) => `${f.name} (${f.jobTitle})`).join("; ")}${site.rera ? `\n- MahaRERA registration: ${site.rera}` : ""}

## Pages

- [Home](${absoluteUrl("/")}): ${pages.home.description}
- [About](${absoluteUrl("/about")}): ${pages.about.description}
- [Services](${absoluteUrl("/services")}): ${pages.services.description}
${servicePages.map((s) => `- [${s.h1}](${absoluteUrl(`/services/${s.slug}`)}): ${s.seoDescription}`).join("\n")}
- [FAQ](${absoluteUrl("/faq")}): ${pages.faq.description}
- [Contact](${absoluteUrl("/contact")}): ${pages.contact.description}

## Services

${servicePages.map((s) => `### ${s.h1}\n\n${s.summary}\n\nMore: ${absoluteUrl(`/services/${s.slug}`)}`).join("\n\n")}

## Frequently asked questions

${faqGroups.flatMap((g) => g.faqs).map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}

## Blog

${posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${postDescription(p)}`).join("\n") || "- See " + absoluteUrl("/blog")}
`;
fs.writeFileSync(path.join(dist, "llms.txt"), llms);

log(`sitemap.xml (${sitemapEntries.length} URLs), robots.txt, llms.txt written`);

// ─── 4. IndexNow ───────────────────────────────────────────
// Tells Bing (which also powers ChatGPT search), Yandex and others to recrawl
// every page after a production deploy. Never fails the build.
if (process.env.VERCEL_ENV === "production" && site.indexNowKey && process.env.INDEXNOW !== "off") {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(site.url).host,
        key: site.indexNowKey,
        keyLocation: absoluteUrl(`/${site.indexNowKey}.txt`),
        urlList: sitemapEntries.map((e) => e.loc),
      }),
      signal: AbortSignal.timeout(10000),
    });
    log(`IndexNow: submitted ${sitemapEntries.length} URLs (HTTP ${res.status})`);
  } catch (err) {
    warn(`IndexNow submission failed (${err.message}) — search engines will still find pages via the sitemap.`);
  }
}
