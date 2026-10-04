# SEO / GEO / AEO Implementation Plan

Goal: move parmarproperties.in from **SEO 4 · GEO 3 · AEO 3** (audit of 4 Oct 2026) towards 10/10 in each,
with metadata and structured data defined **per page and per blog post**.

## How it works after this change

```
npm run build
  1. vite build                      → client bundle (dist/)
  2. vite build --ssr entry-server   → server renderer (dist-ssr/)
  3. node scripts/prerender.mjs
       - fetches published posts from Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
       - renders every route to real HTML with its own <head>
       - writes dist/<route>.html, sitemap.xml, robots.txt, llms.txt, 404.html, spa.html
```

Bots (Google, Bing, GPTBot, ClaudeBot, PerplexityBot, WhatsApp/LinkedIn previews) now receive the full
page text, title, description, canonical, Open Graph tags and JSON-LD without running JavaScript.
In the browser, React takes over as before, and `<Seo>` keeps the head correct during client-side navigation.

Blog posts published from the admin after a deploy still work (they fall back to `spa.html`, and the
client-side `<Seo>` sets their tags), but they are only pre-rendered and added to the sitemap on the next
build. **Trigger a Vercel redeploy after publishing a post** (a Vercel Deploy Hook can automate this).

## Phases

| # | Phase | Fixes audit items | Status |
|---|-------|-------------------|--------|
| 1 | SEO core: `src/seo/` site config, `<Seo>` component, JSON-LD builders | Identical titles, no canonical, no OG, no schema | Done |
| 2 | Build-time pre-rendering, sitemap.xml, robots.txt, llms.txt, real 404s | JS-only HTML, no sitemap/robots, soft 404s, AI crawler visibility | Done |
| 3 | On-page fixes: split-text renders each word once, one H1 per page, `/About` → `/about`, broken links | Doubled words, 2 H1s, duplicate URL, dead `/contact`, footer link to vercel.app | Done |
| 4 | Per-blog SEO: SEO title/description, author byline, FAQs, sources, breadcrumbs, Article + FAQPage schema, admin SEO panel | No bylines, no Article/FAQ schema, no per-post meta | Done (needs DB migration) |
| 5 | New pages: `/contact`, `/faq`, `/services` + Buy / Sell / Lease / NRI pages | No contact page, no FAQ, no service pages, wrong Lease copy | Done |
| 6 | Performance: compress the 43 MB video and 2 MB PNGs | Page weight / Core Web Vitals | Done |
| 7 | Owner actions (see below) | Trust signals that only the business can supply | **Waiting on you** |

## Per-page SEO (static pages)

Defined in `src/seo/pages.ts` — edit titles and descriptions there.

| Route | Schema |
|-------|--------|
| `/` | RealEstateAgent (Organization), WebSite |
| `/about` | AboutPage, Person × 3 (directors), BreadcrumbList |
| `/services`, `/services/*` | Service, BreadcrumbList, FAQPage (service FAQs) |
| `/contact` | ContactPage, RealEstateAgent with address and phones, BreadcrumbList |
| `/faq` | FAQPage, BreadcrumbList |
| `/blog` | Blog with BlogPosting list, BreadcrumbList |
| `/privacy-policy`, `/terms-of-service` | BreadcrumbList |

## Per-blog SEO

Every post gets, automatically:

- `<title>`: *SEO title* if set, otherwise `<post title> | Parmar Properties`
- meta description: *SEO description* if set, otherwise the excerpt
- canonical `https://www.parmarproperties.in/blog/<slug>`
- Open Graph `article` tags with the post image, published and modified dates, and category
- JSON-LD: `BlogPosting` (author, publisher, dates, image, section), `BreadcrumbList`,
  plus `FAQPage` when the post has FAQs
- a visible byline (author name and role, linked to /about), with published and updated dates
- a visible FAQ block and a "Sources" list when those fields are filled in

Optional per-post fields (set in **Admin → Post editor → SEO & AEO** after running the migration):
`seo_title`, `seo_description`, `author_name`, `author_role`, `faqs`, `sources`, `og_image_url`.

Run `supabase/migrations/20261004_post_seo_fields.sql` once in the Supabase SQL editor to add them.
`supabase/seed/20261004_post_faqs_sources.sql` then fills in FAQs and source links for the 10 existing
posts, drafted from each post's own content. Review them before running it.

## Owner actions needed for 10/10

These can't be done in code. Each one is a strong trust signal:

1. **MahaRERA agent registration number.** Add it to `rera` in `src/seo/site.ts` and it appears in the footer and schema.
2. **Google Business Profile** for the Parel office. Add its URL to `sameAs` in `src/seo/site.ts`.
3. **Named testimonials.** Replace "Anonymous" with a first name and area (with client consent), or link Google reviews.
4. **Search Console and Bing Webmaster Tools.** Verify the domain and submit `https://www.parmarproperties.in/sitemap.xml`.
5. **Supabase migration.** Run the SQL files above.
6. **Deploy hook.** Redeploy after publishing posts so they get pre-rendered.
7. **Content depth.** Grow pillar posts (e.g. the South Mumbai guide) to 1,500+ words and add locality pages (Worli, Malabar Hill, Mahalaxmi) over time.
8. **Backlinks and PR.** Get mentions from developer partners, press, and property portals.
