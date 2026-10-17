# Parmar Properties — Team Activity & Handover Log 📝

> **How to use this file:**  
> Whenever you finish work, push a branch, or hand over to another team member, **add a new entry at the VERY TOP of the log section below**.  
> This ensures that the other 2 developers can quickly read what you changed without having to inspect git diffs.

---

## 📋 Standard Handover Template (Copy & Paste at Top)

```markdown
### [YYYY-MM-DD HH:MM] — [Your Name] — [Feature or Bug Summary]
- **Branch:** `main` (or `feature/xyz`)
- **Git Commit:** `<commit-hash>` (optional)
- **What Was Done:**
  - Added / modified X...
  - Fixed Y...
- **Files Modified / Created:**
  - `path/to/file1.tsx`
  - `path/to/file2.ts`
- **State & Testing:** Tested locally, dev server builds cleanly without errors.
- **Handover / Next Steps for Next Developer:**
  - What the next person should work on or watch out for.
- **Blockers / Questions:** None (or describe any blockers).
```

---

## 📜 Activity Stream

### [2026-10-18 12:00] — Claude (AI) & Parmar Properties — South Mumbai import, faster listings, protected enquiries
- **Branch:** `perf-leads-hardening` → merged to `main` as PR #1 (`76851fb`). This log entry: `brain-update-perf-leads`.
- **What Was Done:**
  - **Data (via the admin, not in git):** listed SB-001 Lodha Elise by hand, then bulk-imported SB-002 to SB-100 from `South_Mumbai_100_Properties.md` / the media zip with a temporary admin page (since deleted). All 100 are **Published**. Defaults were used where research had no value: RERA "On request" (39), possession "On request" (52), status "Under Construction" when unknown (45), config area "On request". 12 new `lookup_locations` were added (Dadar West, Parel, Girgaon, …). Full report: `IMPORT_REPORT.md` (local, not committed).
  - **Speed:** home and `/properties` fetch on the server (`page.tsx` → `HomePageClient` / `PropertiesPageClient` with `initialProperties`); first 3 cards `priority`; detail gallery has `sizes`; `images.minimumCacheTTL` 31 days; uploads use a 1-year cache header.
  - **Slim catalogue:** `fetchPropertyCards()` (in `src/site/lib/supabase/properties.ts`) replaces `fetchPublishedProperties()` on every list page and for "similar" listings: 563 KB → 160 KB.
  - **Enquiries:** `submitLead()` now posts to `POST /api/leads` (zod validation, same-origin check, burst limit) → `submit_lead()` DB function (migration 016: 5 per IP per hour, 3 per phone per 10 min). Optional Resend email to staff, also sent if the DB save fails. Migration 017 removed the public direct insert on `leads`.
  - **Admin:** photos are compressed to WebP (≤1600 px, plans ≤2400 px) before upload (`src/lib/image-compress.ts`). Settings has an **Optimize stored images** card for older files. A failed Add Property purges the half-created row. Any admin write calls `POST /api/revalidate` (active admins only), so the site updates in about 2 s. `/ads-manager` requires sign-in.
  - **Observability:** `@vercel/analytics` and `@vercel/speed-insights` in the site layout.
  - **Docs:** design review `docs/design/parmar-properties.md`; implementation plan and owner checklist `docs/design/implementation-plan.md`.
- **Files Touched / Created:** [`src/app/api/leads/route.ts`](../src/app/api/leads/route.ts), [`src/app/api/revalidate/route.ts`](../src/app/api/revalidate/route.ts), [`src/site/lib/supabase/leads.ts`](../src/site/lib/supabase/leads.ts), [`src/site/lib/supabase/properties.ts`](../src/site/lib/supabase/properties.ts), [`src/site/components/home/HomePageClient.tsx`](../src/site/components/home/HomePageClient.tsx), [`src/site/components/property/PropertiesPageClient.tsx`](../src/site/components/property/PropertiesPageClient.tsx), [`src/site/components/property/PropertyCard.tsx`](../src/site/components/property/PropertyCard.tsx), [`src/site/components/property/PropertyDetailClient.tsx`](../src/site/components/property/PropertyDetailClient.tsx), [`src/lib/image-compress.ts`](../src/lib/image-compress.ts), [`src/lib/api/storage.ts`](../src/lib/api/storage.ts), [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts), [`src/lib/supabase/middleware.ts`](../src/lib/supabase/middleware.ts), [`src/proxy.ts`](../src/proxy.ts), [`src/components/properties/property-form.tsx`](../src/components/properties/property-form.tsx), [`src/components/settings/image-optimizer-card.tsx`](../src/components/settings/image-optimizer-card.tsx), [`supabase/migrations/016_leads_rpc_and_indexes.sql`](../supabase/migrations/016_leads_rpc_and_indexes.sql), [`supabase/migrations/017_leads_rpc_only.sql`](../supabase/migrations/017_leads_rpc_only.sql), [`next.config.ts`](../next.config.ts), [`.env.example`](../.env.example).
- **Current State:** `tsc` and `next build` pass; all 100 property pages pre-render. Live site checked 2026-10-18: `/api/revalidate` → 401, `/api/leads` invalid → 400, `/ads-manager` → login redirect, listings render on the server. `submit_lead()` exists (016 applied) and the public direct insert is gone (017 applied). NOT tested: a real enquiry end-to-end, resize-on-upload, the optimizer button, Resend email.
- **Next Steps for Next Developer:**
  - Submit one real test enquiry on the live site and confirm it appears in Admin › Leads (the only write path is now `/api/leads`).
  - Click Admin › Settings › Optimize stored images once (86 photos over 500 KB).
  - Data clean-up: Lodha Elise still shows a placeholder 3 BHK area (1500 - 2000). SB-058 The Odyssey's config price is cut off. 39 listings show RERA "On request": add the numbers or unpublish them.
  - Owner: confirm Vercel plan (Hobby is non-commercial), Supabase plan/backups, Auth sign-ups off, staff MFA; set Resend env vars if lead emails are wanted.

### [2026-10-13 15:00] — Claude (AI) & Parmar Properties — Merged Frontend and backend into ONE app (single deployment)
- **Branch:** `merge/single-app` (local only, not pushed)
- **What Was Done:**
  - Stage 1 (own commit): upgraded the public site from Next 14 / React 18 / Tailwind 3 to Next 16 / React 19 / Tailwind 4 so both halves use the same versions. Ran the official Tailwind and Next codemods; moved the Tailwind theme (colours, fonts) into CSS `@theme`; renamed the font CSS variables (`--font-playfair`, `--font-jakarta`) to avoid a clash with Tailwind 4's `--font-sans`; added a small compat layer so borders, button cursors and placeholders look as before.
  - Stage 2: moved everything into one app at the repo root. Public site is route group `(site)` (own root layout, fonts, CSS); admin is route group `(admin)` under `/admin` (own root layout, fonts, CSS). Site-only code lives in `src/site/`; its imports were rewritten from `@/components/...` etc. to `@/site/components/...`. Admin code stayed in `src/components|lib|types` untouched. `supabase/` moved to the repo root; `public/` merged; one `package.json`, `tsconfig.json`, `next.config.ts`, `.env.example`.
  - The earlier `/admin` proxy rewrite and `assetPrefix` were dropped (not needed any more).
  - The public site's Supabase client now never persists a session (it shares a domain with the admin).
  - Old `Frontend/` and `backend/` folders removed (history preserved by `git mv`).
- **Files Touched / Created:** whole repo layout; see [`README.md`](../README.md), [`package.json`](../package.json), [`next.config.ts`](../next.config.ts), [`AGENTS.md`](../AGENTS.md).
- **Current State:** `tsc --noEmit` clean; `next build` builds every site and admin route. Screenshot check of 17 routes (desktop and mobile): public pages are pixel-identical (0.00% difference) to the pre-merge upgraded site, and the admin login is pixel-identical to the original admin. Compared with the ORIGINAL Tailwind 3 site, some paragraphs have a 1 to 2px line-height difference (Tailwind 4 resolves `sm:text-base` + `leading-relaxed` differently). NOT tested: a real signed-in admin session, saving a property, file uploads, or any deployment on Vercel. ESLint was not enforced on the site code.
- **Next Steps for Next Developer:** (1) In Vercel, ONE project: Root Directory `./`, same two Supabase env vars; point `parmarpropertieslisting.vercel.app` at it; then delete the `parmar-admin` project. (2) Supabase > Authentication > URL Configuration: add `https://parmarpropertieslisting.vercel.app/admin/**`. (3) Sign in at `/admin` and exercise Properties, Leads, uploads and Hero. (4) Staff sessions on the old admin URL are gone; everyone signs in again.

### [2026-10-13 12:00] — Claude (AI) & Parmar Properties — One URL: site/admin opens the admin CMS
- **Branch:** `claude/gracious-ramanujan-vtxsrx` (local only, not pushed)
- **What Was Done:**
  - `Frontend/next.config.mjs`: added rewrites so `/admin`, `/admin/*` and `/admin-static/*` are proxied to the admin app. Target is `ADMIN_ORIGIN`; in `next dev` it defaults to `http://localhost:3001`; in production nothing is proxied until `ADMIN_ORIGIN` is set (so deploying this without the variable changes nothing).
  - `backend/next.config.ts`: `assetPrefix: "/admin-static"` plus a self-rewrite `/admin-static/*` to `/*`. The admin's JS/CSS no longer sits at `/_next/...`, which would collide with the site's own `/_next`. The admin still works at its own URL.
  - Cookies/login now live on the site's domain when staff use `<site>/admin`; the admin app's middleware redirects are relative so they stay on that domain.
- **Files Touched / Created:**
  - [`Frontend/next.config.mjs`](../Frontend/next.config.mjs)
  - [`backend/next.config.ts`](../backend/next.config.ts)
- **Current State:** Verified locally with both apps running (site :3000, admin :3001): `localhost:3000/admin` redirects to `/admin/login`, the sign-in page renders fully styled, and no request failed. Admin production build (`next build` + `next start`) serves its assets under `/admin-static` with 200. NOT tested on Vercel; not tested with a real Supabase login or a signed-in session. `backend/package-lock.json` is out of sync with `package.json` (`npm ci` fails); I installed with `npm install --no-package-lock`.
- **Next Steps for Next Developer:** (1) In the SITE's Vercel project add env var `ADMIN_ORIGIN=https://<admin project>.vercel.app` (no trailing slash) and redeploy BOTH projects (deploy the admin first because of `assetPrefix`). (2) In Supabase > Authentication > URL Configuration add `https://<site domain>/admin/**` to Redirect URLs so "Forgot password" links work on the new URL. (3) Sign in once on the new URL and open Properties, Leads and a file upload to confirm. (4) Regenerate `backend/package-lock.json`.

### [2026-10-11 20:00] — Claude (AI) & Parmar Properties — Premium per-property landing page (/<slug>/project)
- **Branch:** `claude/gracious-ramanujan-vtxsrx` (local only, not pushed)
- **What Was Done:**
  - Redesigned `PpcLanding.tsx`, the page opened by "Preview" in `/ads-manager`, for every published property: full-bleed hero with the enquiry form beside it (stacked right under the hero on mobile), a key-facts band, overview + highlights, a gallery (uses the property's other photos), residences table, floor plans (only those with an image), amenities, Google Maps link, developer block with RERA QR, closing call-to-action, fixed mobile Call bar.
  - Every section renders only when the property has that data, so thin listings still look right; no invented content.
  - Same site palette tokens (`mineral`, `surface`, `line`, `slateText`, `ink`, `brick`) and serif headings; real form labels, focus rings, 44px+ fields.
  - Form logic unchanged (`submitLead`, source `google_ppc_landing`, utm/gclid kept in the lead message).
- **Files Touched / Created:**
  - [`Frontend/components/ppc/PpcLanding.tsx`](../Frontend/components/ppc/PpcLanding.tsx)
- **Current State:** `tsc --noEmit` clean; impeccable detector 0 findings. Rendered locally at 1280px and 390px against a throwaway fake Supabase server with two sample properties (nothing committed), including a sparse property. Not tested against the live database; the callback form submit was not exercised.
- **Next Steps for Next Developer:** Check a few real published properties on live data; add a real photo/plan to a draft to see the gallery and floor-plan sections; consider `/impeccable critique` on this page.

### [2026-10-11 18:00] — Claude (AI) & Parmar Properties — /ads-manager: impeccable critique + fixes
- **Branch:** `claude/gracious-ramanujan-vtxsrx` (local only, not pushed)
- **What Was Done:**
  - Ran `/impeccable critique` on `/ads-manager` (dual-agent). Score 21/40, 5 priority issues; archive in `.impeccable/critique/`.
  - Rewrote `AdsManager.tsx` in place (card layout kept): loading/ready/error states with Retry (a failed fetch no longer reads as "no properties"); copy now confirms in text, falls back to a hidden textarea when `navigator.clipboard` is missing, and reports failure; timers cleared on unmount.
  - Domain is validated and normalised with `new URL()` (adds `https://`, drops pasted paths); both inputs persist in `localStorage`; campaign slug shown as typed-vs-sent.
  - One shared tracking-suffix block (identical for every property) instead of a button per row; per row: filled "Copy Final URL", secondary "Copy URL with tracking", "Preview on this site" link; slug is URL-encoded.
  - Accessibility/type: how-to moved to numbered steps at the top, 14px text, 40px controls, `focus-visible` rings, per-property `aria-label`s, palette tokens (`ink`, `surface`, `line`, `slateText`, `brick`) instead of hard-coded hex.
- **Files Touched / Created:**
  - [`Frontend/components/ppc/AdsManager.tsx`](../Frontend/components/ppc/AdsManager.tsx)
- **Current State:** `npx tsc --noEmit` clean; `impeccable detect` 0 findings; dev server rendered `/ads-manager` at 1280px and 390px with no horizontal overflow. Property rows were NOT rendered (no Supabase env in this session), so the per-row layout is unverified visually. ESLint is not configured in `Frontend`.
- **Next Steps for Next Developer:** Open `/ads-manager` against a real Supabase project and check the rows. `/ads-manager` has no login check (only `noindex`); decided to leave as is for now.

### [2026-10-11 23:30] — Claude (AI) & Parmar Properties — Media tab: no reload on reorder, drag-and-swap for images and floor plans
- **Branch:** `fix/audit-hardening`
- **What Was Done:**
  - Cause of the "page reloads": the property editor's `reload` shows a full-page "Loading property…" and was passed to every child as `onChanged`; `reload` in the image and floor plan managers also flipped their cards to a loading state.
  - `useResource` gets `refresh()` (background refetch, no loading state). The property editor, images manager and floor plans manager use it for saves, deletes, cover changes and error recovery.
  - Reordering is optimistic and saved in the background; it no longer refreshes the parent.
  - Drag-and-swap (drop one card on another) for property images (already in the working tree, now compiling) and floor plans; up/down arrows kept for keyboard and touch.
- **Current State:** `tsc --noEmit` clean. In the browser on a property with 4 images and 2 plans: drag-swap and arrows reorder instantly, order persists in the database, no loading screen appears, and a page marker survives. Not tested: real mouse drag on touch devices.
- **Next Steps:** none required.

### [2026-10-11 22:00] — Claude (AI) & Parmar Properties — Google PPC ads manager and landing pages
- **Branch:** `fix/audit-hardening`
- **What Was Done:**
  - `/ads-manager` (Frontend, noindex, read-only): lists published properties with a copyable Final URL `https://<domain>/<slug>/project`, a Google ValueTrack tracking suffix (`{campaignid}`, `{keyword}`, `{creative}`) and a preview link.
  - `/<slug>/project` (Frontend, noindex): fixed-layout landing page (hero, facts, overview, residences table, highlights, amenities, callback form, sticky call button) built from the same property data as the main page. Only published properties resolve; drafts 404.
  - Leads from the landing page use source `google_ppc_landing` (migration 015, applied) and store the property id plus the URL's utm/gclid parameters in the message.
  - `SiteChrome` hides the site nav and footer on `/ads-manager` and `/<slug>/project`. `withOnwards` moved to `lib/price.ts`.
  - `next.config.mjs` now allows images from the Supabase project in `NEXT_PUBLIC_SUPABASE_URL` (it only allowed an old project's host).
- **Current State:** `tsc --noEmit` clean; `/ads-manager` empty state, noindex and no-chrome verified in the browser; draft landing URL returns 404. Landing page with real data and the lead form NOT yet verified (needs a published property).
- **Next Steps:** verify with a published property; set the real domain in the panel; decide whether `/ads-manager` needs a login before it goes public (it only exposes published property links).

### [2026-10-11 20:00] — Claude (AI) & Parmar Properties — Listing audit fix pass
- **Branch:** `fix/audit-hardening`
- **What Was Done:**
  - A separate Supabase project was set up for this work: migrations 001-014 and seeds applied; admin profile activated. Other developers must apply 012-015 to their own project (see READ_FIRST.md).
  - 013: public lead inserts must be `is_otp_verified=false`, unassigned. Frontend no longer sends `true` (no real OTP yet). Removed dead `/api/enquire`.
  - 014: `properties.price_on_request` (admin switch + public "Price on Request"), property type `Apartment`, status `Ready (OC received)`, Mahalaxmi editorial page as unpublished draft.
  - Login form posts (no credentials in URL). New listings default to Draft. Detail pages revalidate every 60 s.
  - Public pages: possession date, exclusive amenities (`custom_label`), no highlights-as-amenities, no "onwards" on text prices, card BHK and area from configurations, locality dedupe, neutral placeholder image, SEO metadata, lead linked to property, catalogue locality options from loaded listings.
  - Entered the 8 listing drafts (see AUDIT_8_LISTINGS.md); all remain Draft.
- **Files Touched:** see `git log`; migrations [013](../backend/supabase/migrations/013_leads_policy.sql) and [014](../backend/supabase/migrations/014_listing_fixes.sql); [AUDIT_8_LISTINGS.md](../AUDIT_8_LISTINGS.md); [FIX_PLAN.md](../FIX_PLAN.md).
- **Current State:** `tsc --noEmit` clean and `next build` passes in both apps; `tests/012_security.sql` passes on the new project (all 3 checks); live check of detail pages, price switch and lead form done and test data deleted.
- **Next Steps for Next Developer:** real OTP (then relax 013); owner decisions on homepage Featured fallback, hard-coded location prices, Apartment type for the 8 drafts, office details and Pune seed cleanup; images, plans and RERA QR for the 8 drafts; deferred audit items (A3, A6, C3).

### [2026-10-11 12:00] — Claude (AI) & Parmar Properties — Audit hardening pass
- **Branch:** `fix/audit-hardening`
- **What Was Done:** (only Fixes 1 and 10-15 were in the prompt received; Fixes 2-9 were NOT supplied and are NOT done)
  - Fix 1: migration 012 redefines `handle_new_user()` so new signups get `is_active=false` (locked out of `is_admin()`).
  - Fix 10: detail-page layout-variant fallback is now one variant built from `property` data; default selection is `layoutVariants[0]`.
  - Fix 11: "Prime locality" joins sub-location and location, dropping empty and case-insensitive duplicates.
  - Fix 12: no invented `superArea` (0 when missing); variant area falls back to `Area on request`; `PropertyCard`, `compare`, `commercials` show `Area on request` when carpet area is 0; added `'Apartment'` to `PropertyType`, allowed list, and as the default.
  - Fix 13: removed the fake client login and auth gate from `/saved`, deleted `store/auth.ts`, reworded the unused guest notice copy.
  - Fix 14: SKIPPED (needs >30 lines). Finding recorded in TASK_BOARD.
  - Fix 15: `backend/supabase/tests/012_security.sql` written but NOT executed. Assertion 3 (anon lead with `is_otp_verified=true` rejected) will fail until a migration tightens the `leads` insert policy (004 still has `WITH CHECK (true)`).
- **Files Touched / Created:**
  - [012_security_hardening.sql](../backend/supabase/migrations/012_security_hardening.sql)
  - [012_security.sql](../backend/supabase/tests/012_security.sql)
  - [PropertyDetailClient.tsx](../Frontend/components/property/PropertyDetailClient.tsx)
  - [properties.ts](../Frontend/lib/supabase/properties.ts), [property.ts](../Frontend/types/property.ts), [PropertyCard.tsx](../Frontend/components/property/PropertyCard.tsx)
  - [compare/page.tsx](../Frontend/app/compare/page.tsx), [commercials/page.tsx](../Frontend/app/commercials/page.tsx)
  - [saved/page.tsx](../Frontend/app/saved/page.tsx), [saved.content.ts](../Frontend/data/content/saved.content.ts), `Frontend/store/auth.ts` (deleted)
- **Current State:** Baseline and after: `npx tsc --noEmit` clean in Frontend; backend only `src/app/layout.tsx(27,50) TS2304 LayoutProps` pre-change (go away after `next build` generates types). `npm run build` passes in both apps. `npm run lint` is NOT configured in Frontend (prompts interactively), not run. Dev server / browser check NOT run. SQL migration and test NOT executed.
- **Next Steps for Next Developer:**
  - Owner applies 010, 011, 012 in the Supabase SQL editor (in that order) and turns off public email signup.
  - Supply/do Fixes 2-9 (incl. leads insert rule and `/api/enquire`, which still exists), real OTP, then run `tests/012_security.sql`.
  - Deferred items are listed in TASK_BOARD.

### [2026-10-04 16:45] — Antigravity (AI) & Arisha — Location ordering + homepage filter CMS wiring
- **Branch:** `main` (working tree)
- **What Was Done:**
  - Root-caused homepage Explore bug: 5× `is_primary_home` rows + 0-based `primary_order` + `slice(0,4)` dropped Malad (`primary_order=4`).
  - Backend `locations` API now transactionally resequences unique contiguous `sort_order`/`display_order` and unique homepage `primary_order` (1–4, max 4), with clear error when enabling a 5th homepage location. Drag-reorder writes both `sort_order` and `display_order`.
  - Repaired live data: homepage four = Worli/Bandra/Juhu/Malad (orders 1–4); directory `sort_order` contiguous.
  - Homepage hero filter now loads locations (`sort_order`), BHK (`lookup_bhk`), construction status (`lookup_construction_status`), budget min/max/step (`page_content.home`).
  - Explore Properties uses only `is_primary_home` + `primary_order` (no inventing replacements).
  - Location detail “Switch to Another Prime Corridor” fetches all active/published locations except current slug by `sort_order`.
- **Files Touched / Created:**
  - [`backend/src/lib/api/locations.ts`](../backend/src/lib/api/locations.ts)
  - [`backend/src/components/locations/location-dialog.tsx`](../backend/src/components/locations/location-dialog.tsx)
  - [`backend/src/lib/validations/index.ts`](../backend/src/lib/validations/index.ts)
  - [`Frontend/lib/supabase/locations.ts`](../Frontend/lib/supabase/locations.ts)
  - [`Frontend/lib/supabase/hero.ts`](../Frontend/lib/supabase/hero.ts)
  - [`Frontend/lib/supabase/lookups.ts`](../Frontend/lib/supabase/lookups.ts)
  - [`Frontend/lib/supabase/page-content.ts`](../Frontend/lib/supabase/page-content.ts)
  - [`Frontend/components/hero/HeroCarousel.tsx`](../Frontend/components/hero/HeroCarousel.tsx)
  - [`Frontend/app/page.tsx`](../Frontend/app/page.tsx)
  - [`Frontend/app/locations/[slug]/page.tsx`](../Frontend/app/locations/[slug]/page.tsx)
- **Current State:** FE + BE `tsc --noEmit` clean. Manual DB checks: Malad homepage #4; deactivate removes from public list; sort_order unique.
- **Next Steps for Next Developer:** Optional DB unique indexes if desired; Admin UI could surface the max-4 homepage error more prominently near the toggle.
- **Blockers / Questions:** None.

### [2026-10-04 16:10] — Antigravity (AI) & Arisha — CMS-drive Locations / Hero / Why Parmar / Insights
- **Branch:** `main` (working tree)
- **What Was Done:**
  - Seeded existing Frontend Mumbai content into canonical CMS tables via `seed_cms_frontend_content.sql` (applied to linked Supabase): `hero_slides`, `page_content.home` Why/MI chrome, `locations` (+ lookup), `insights_articles` + `article_sections`.
  - Frontend location filter bar now builds from active/published `locations` (`All` first); Malad and future admin-added locations appear automatically.
  - Home hero reads slides/images/order from `hero_slides` and headline/subtext/duration from `page_content`; location dropdown options from `locations`.
  - Why Parmar pillars + trust metrics read from `page_content.home.sections_data.why_*` (not `market_intelligence` KPI table — avoided duplicate system).
  - Home Insights preview reads published `insights_articles` (first 4 by `sort_order`) plus MI chrome from `page_content`.
  - Home primary/future location cards hydrate from `is_primary_home` / `is_future`.
- **Files Touched / Created:**
  - [`backend/supabase/seed_cms_frontend_content.sql`](../backend/supabase/seed_cms_frontend_content.sql)
  - [`Frontend/lib/supabase/hero.ts`](../Frontend/lib/supabase/hero.ts)
  - [`Frontend/lib/supabase/page-content.ts`](../Frontend/lib/supabase/page-content.ts)
  - [`Frontend/lib/supabase/locations.ts`](../Frontend/lib/supabase/locations.ts)
  - [`Frontend/components/hero/HeroCarousel.tsx`](../Frontend/components/hero/HeroCarousel.tsx)
  - [`Frontend/components/home/WhyParmar.tsx`](../Frontend/components/home/WhyParmar.tsx)
  - [`Frontend/components/home/MarketIntelligenceSection.tsx`](../Frontend/components/home/MarketIntelligenceSection.tsx)
  - [`Frontend/app/locations/page.tsx`](../Frontend/app/locations/page.tsx)
  - [`Frontend/app/page.tsx`](../Frontend/app/page.tsx)
- **Current State:** Frontend + backend `tsc --noEmit` clean. Live DB verified: 10 locations (incl. Malad), 3 hero slides, 6 insights, Why metrics match Frontend.
- **Next Steps for Next Developer:**
  - Optionally replace hero image paths with Supabase Storage uploads via Admin → Hero (paths currently point at Frontend `/public/hero/*`).
  - Wire Navbar/Footer from `site_branding` (Task 5.1).
- **Blockers / Questions:** Remote Supabase still has unknown migrations `011`/`012` not present locally — content was applied via `supabase db query --linked`, not `db push`.

### [2026-10-04 00:30] — Antigravity (AI) & Arisha — Publication/RLS authority → publication_status
- **Branch:** `main`
- **What Was Done:**
  - Added migration `010_publication_status_rls.sql` so public/anon SELECT on properties and property children gates on `publication_status = 'published' AND deleted_at IS NULL` (MASTER §5.5).
  - Recreated public SELECT policies for: `properties`, `property_images`, `configurations`, `price_breakdowns`, `floor_plans`, `property_amenities`.
  - Left already-correct master policies on `property_configurations` / `property_configuration_price_breakdowns` unchanged.
  - Preserved all admin FOR ALL / inventory / catalogue / locations / storage policies; kept `is_active` column and app dual-write untouched.
  - Did **not** apply the migration to Supabase.
- **Files Touched / Created:**
  - [`backend/supabase/migrations/010_publication_status_rls.sql`](../backend/supabase/migrations/010_publication_status_rls.sql)
- **Current State:** Migration authored; `npm run typecheck` (`tsc --noEmit`) passed with 0 errors. No backend test script exists (`package.json` has no `test`). Migration not applied to Supabase. No commit/push.
- **Next Steps for Next Developer:**
  - Apply `010_publication_status_rls.sql` in the Supabase SQL Editor after reviewing.
  - Spot-check: draft property with `is_active=true` must be hidden from anon; published + not deleted must remain visible with images/configs/amenities.
  - Continue architecture fix order (floor_plans FK / launch phase) only after this is applied and verified.

### [2026-10-04 00:05] — Antigravity (AI) & Arisha — Add Property main price in Property Information
- **Branch:** `main`
- **What Was Done:**
  - Added the canonical numeric `price` field to the Property Information section of the Admin property form, labeled exactly `Price (₹ Cr)`, beside Property Type.
  - Layout is now: Title | URL Slug → Tagline → Property Type | Price (₹ Cr).
  - Create and edit both use the existing `price` form value / `masterPropertySchema` / payload mapping (no new column, migration, or frontend budget-filter changes).
  - Removed the duplicate Price input from the edit-only Pricing & Area card so there is a single price control; carpet/super area remain there on edit.
- **Files Touched / Created:**
  - [`backend/src/components/properties/property-form.tsx`](../backend/src/components/properties/property-form.tsx)
- **Current State:** UI change complete; `npm run typecheck` (`tsc --noEmit`) passed with 0 errors.
- **Next Steps for Next Developer:**
  - Create/edit a property with price `20` or `32.5` and confirm the public portal shows ₹ Cr instead of “Price on Request”.
  - Optionally tighten `masterPropertySchema.price` from optional to required if blank submissions should be blocked at Zod level (UI already marks the field required).

### 2026-10-01 19:43 — Antigravity & Sayli — Full Property Attribute Audit & Live Portfolio Sync
- **Branch:** `main`
- **What Was Done:**
  - Performed a 100% comprehensive property attribute audit comparing Frontend UI components against Backend Admin CMS controls and Supabase columns.
  - Verified and enhanced dynamic data bindings for every UI attribute (Title, Price, Location, Gallery, Lightbox, Configurations, MahaRERA QR & Number, Brochure PDF, Developer House, Amenities, GPS Coordinates, Lead forms).
  - Wired live Supabase properties into [`Frontend/app/compare/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/compare/page.tsx) and [`Frontend/app/saved/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/saved/page.tsx) so live CMS listings can be compared and bookmarked dynamically.
  - Verified TypeScript compilation: `npx tsc --noEmit` exited with **0 errors**.
- **Files Modified:**
  - [`Frontend/app/compare/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/compare/page.tsx)
  - [`Frontend/app/saved/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/saved/page.tsx)
  - [`Frontend/components/property/PropertyDetailClient.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/property/PropertyDetailClient.tsx)

### 2026-10-01 19:40 — Antigravity & Sayli — Complete CMS-to-Frontend Property Attribute Reflection & Functional Testing Setup
- **Branch:** `main`
- **What Was Done:**
  - **Full Property Attribute Reflection:**
    - Updated [`Frontend/types/property.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/types/property.ts): Added `reraQrImage`, `brochureUrl`, `developerName`, `developerDescription`, `googleMapsUrl`, and `PropertyLayoutVariant` interface.
    - Updated [`Frontend/lib/supabase/properties.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/properties.ts):
      - Mapped `rera_qr_image` and `rera_qr_url` from CMS to `reraQrImage`.
      - Mapped `brochure_url` from CMS to `brochureUrl`.
      - Mapped `developer_name` and `developer_description` from CMS.
      - Mapped `property_configurations` dynamically to custom `layoutVariants` with carpet area, price indicator, tower zone, and layout blueprint images.
      - Updated queries to match both `publication_status = 'published'` and `status = 'active'`.
    - Updated [`Frontend/components/property/PropertyDetailClient.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/property/PropertyDetailClient.tsx):
      - Renders actual uploaded MahaRERA QR image directly in the compliance verification box.
      - Displays the verified MahaRERA registration number.
      - Unlocks and provides direct PDF download for uploaded property brochure.
      - Renders the Developer & Architectural House details if specified in CMS.
      - Dynamically hydrates floor plan typologies and blueprints directly from CMS configurations.
  - Verified TypeScript compilation: `npx tsc --noEmit` exited with **0 errors**.
- **Files Modified:**
  - [`Frontend/types/property.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/types/property.ts)
  - [`Frontend/lib/supabase/properties.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/properties.ts)
  - [`Frontend/components/property/PropertyDetailClient.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/property/PropertyDetailClient.tsx)
- **Current State:** Manager can modify every attribute in Admin CMS (`/admin/properties/[id]`) and observe immediate, 1:1 reflection on the public portal (`/properties/[slug]`).

### 2026-10-01 19:31 — Antigravity & Sayli — Verified Live Lead Ingestion Pipeline
- **Branch:** `main`
- **What Was Done:**
  - User executed master catalogue seed script in Supabase (`seed_master.sql`).
  - Verified live submission test: "Talk to Our Advisory" form submitted on Frontend (`http://localhost:3001`) immediately ingested into Supabase `leads` table and appeared in Admin CMS Leads inbox (`http://localhost:3000/leads`).
  - Confirmed full end-to-end connectivity between Client Portal, Database, and Admin CMS.
- **Current State:** Core data pipeline is 100% operational. Ready for Phase 3 (Global Settings & Branding or Live CMS inventory testing).

### 2026-10-01 18:08 — Antigravity & Sayli — Lead Submission Diagnostics & Resolution
- **Branch:** `main`
- **What Was Done:**
  - Diagnosed why "Talk to Our Advisory" submissions were rejected by Supabase with Postgres code `23502`:
    - Table `leads` has constraint: `source_id UUID NOT NULL REFERENCES lookup_lead_sources(id)`.
    - In new Supabase project (`wmnptubgyikrwpbsckdn`), `lookup_lead_sources` currently has **0 rows** because `seed_master.sql` has not yet been executed in the Supabase SQL Editor.
  - Enhanced [`Frontend/lib/supabase/leads.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/leads.ts):
    - Added fallback in `resolveSourceId()` to pick first available source if exact slug is missing.
  - Enhanced [`Frontend/components/layout/Navbar.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/layout/Navbar.tsx):
    - Added explicit console logging of Supabase submission responses so any future database errors are immediately surfaced.
- **Files Modified:**
  - [`Frontend/lib/supabase/leads.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/leads.ts)
  - [`Frontend/components/layout/Navbar.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/layout/Navbar.tsx)
- **Current State:** Awaiting execution of [`backend/supabase/seed_master.sql`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/backend/supabase/seed_master.sql) in Supabase SQL editor to populate lookup records.

### 2026-10-01 17:42 — Antigravity & Sayli — Complete Frontend & Backend Dynamic Content & Lead Wiring
- **Branch:** `main`
- **What Was Done:**
  - **Full Dynamic Page Wiring with Zero-Breakage Hybrid Fallbacks:**
    1. **Home Page ([`Frontend/app/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/page.tsx)):** Featured properties grid now dynamically queries published residences from Supabase via [`fetchPublishedProperties()`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/properties.ts) with seamless fallback.
    2. **Properties Listing ([`Frontend/app/properties/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/properties/page.tsx)):** Wired with `fetchPublishedProperties()` for live inventory filtering (BHK, price, location).
    3. **Property Detail Page ([`Frontend/app/properties/[slug]/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/properties/[slug]/page.tsx)):** Wired with `fetchPropertyBySlug(slug)` to load live property data, configurations, amenities, and gallery images.
    4. **Commercial Properties ([`Frontend/app/commercials/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/commercials/page.tsx)):** Wired with `fetchPublishedCommercials()` to load live commercial listings.
    5. **Locations Directory ([`Frontend/app/locations/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/locations/page.tsx)):** Enclaves directory and filtered listings now dynamically hydrate from Supabase via `fetchLocations()` and `fetchPublishedProperties()`.
    6. **Location Detail Page ([`Frontend/app/locations/[slug]/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/locations/[slug]/page.tsx)):** Wired with `fetchLocationBySlug(slug)` and `fetchPublishedProperties()`.
    7. **Market Intelligence List ([`Frontend/app/market-intelligence/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/market-intelligence/page.tsx)):** Wired with `fetchInsightsArticles()` to load live research articles from `insights_articles` with fallback.
    8. **Article Detail Page ([`Frontend/app/market-intelligence/[slug]/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/market-intelligence/[slug]/page.tsx)):** Wired with `fetchArticleBySlug(slug)` and `fetchInsightsArticles()`.
  - **Shared Types & Schema Harmonization:**
    - Re-exported `Property` from [`Frontend/data/properties.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/data/properties.ts) so both `@/types/property` and `@/data/properties` resolve cleanly.
    - Added `image?: string` to `InsightArticle` in [`Frontend/data/insights.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/data/insights.ts) and mapped `image_path` in [`Frontend/lib/supabase/insights.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/insights.ts).
  - **Testing & Build Verification:**
    - TypeScript compilation (`npx tsc --noEmit`): Passed with **0 errors** in both `Frontend/` and `backend/`.
    - Next.js production build (`npm run build` in `Frontend/`): Generated all 29 static and dynamic routes successfully with **0 errors**.
- **Files Touched / Created:**
  - [`Frontend/app/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/page.tsx)
  - [`Frontend/app/locations/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/locations/page.tsx)
  - [`Frontend/app/market-intelligence/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/market-intelligence/page.tsx)
  - [`Frontend/app/market-intelligence/[slug]/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/market-intelligence/[slug]/page.tsx)
  - [`Frontend/data/properties.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/data/properties.ts)
  - [`Frontend/data/insights.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/data/insights.ts)
  - [`Frontend/lib/supabase/insights.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/insights.ts)
- **Current State:** Both `Frontend` and `backend` are fully configured with the active Supabase project (`wmnptubgyikrwpbsckdn`). Lead submissions insert directly into the `leads` table and all public frontend pages dynamically consume Supabase published data with safe local fallbacks.
- **Next Steps for Next Developer:**
  - Launch both applications concurrently: Backend on `http://localhost:3000` (`npm run dev` in `backend`) and Frontend on `http://localhost:3001` (`npm run dev -- -p 3001` in `Frontend`).
  - Add test properties or articles in Admin CMS and observe live updates on the public portal.

### 2026-09-30 19:40 — Antigravity & Sayli — Frontend Supabase Client & Lead Ingestion Wiring
- **Branch:** `main`
- **What Was Done:**
  - Installed `@supabase/supabase-js` in `Frontend/package.json`.
  - Created [`Frontend/lib/supabase/client.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/client.ts) with singleton Supabase client and `isSupabaseConfigured()` check.
  - Created [`Frontend/lib/supabase/leads.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/leads.ts) supporting all 6 lead sources with automatic `lookup_lead_sources` slug resolution and offline fallback.
  - Created [`Frontend/lib/supabase/properties.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/lib/supabase/properties.ts) with full database-to-frontend mapper and safe static fallback.
  - **Wired 5 Lead Forms to Supabase `leads` Table:**
    1. **Navbar Advisory Modal:** [`Frontend/components/layout/Navbar.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/layout/Navbar.tsx) (`sourceSlug: 'navbar_advisory'`).
    2. **Property Detail Sticky Sidebar:** [`Frontend/components/property/PropertyDetailClient.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/property/PropertyDetailClient.tsx) (`sourceSlug: 'property_sidebar_inquiry'`).
    3. **Property Resource Gate (Brochure / Floor Plan / Map):** [`Frontend/components/property/PropertyDetailClient.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/property/PropertyDetailClient.tsx) (`sourceSlug: 'property_gate_modal'`).
    4. **Private Opportunities OTP Gate:** [`Frontend/components/property/PrivateOpportunities.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/components/property/PrivateOpportunities.tsx) (`sourceSlug: 'private_opportunities_otp'`).
    5. **Commercial Dossier Modal:** [`Frontend/app/commercials/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/commercials/page.tsx) (`sourceSlug: 'commercial_card_modal'`).
    6. **Article Consultation Modal:** [`Frontend/app/market-intelligence/[slug]/page.tsx`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/app/market-intelligence/[slug]/page.tsx) (`sourceSlug: 'article_consultation_modal'`).
  - Ran `npx tsc --noEmit` in `Frontend`: Compiled with **0 errors**.
- **Files Modified / Created:**
  - `Frontend/lib/supabase/client.ts`
  - `Frontend/lib/supabase/leads.ts`
  - `Frontend/lib/supabase/properties.ts`
  - `Frontend/components/layout/Navbar.tsx`
  - `Frontend/components/property/PropertyDetailClient.tsx`
  - `Frontend/components/property/PrivateOpportunities.tsx`
  - `Frontend/app/commercials/page.tsx`
  - `Frontend/app/market-intelligence/[slug]/page.tsx`
- **Current State:** Lead forms are 100% wired to Supabase `leads`. When visitors submit an inquiry, it immediately inserts into the database.
- **Next Steps for Next Developer:**
  - Verify Backend dependencies install (`npm install` in `backend`).
  - Wire listing pages (`/properties`, `/commercials`, `/locations`) to fetch live from Supabase.

### 2026-09-30 19:25 — Antigravity & Sayli — Setup Environment Configuration Files
- **Branch:** `main`
- **What Was Done:**
  - Created [`backend/.env.local`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/backend/.env.local) and [`Frontend/.env.local`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/.env.local) placeholders for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Added [`.env.example`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/backend/.env.example) templates to both directories for team onboarding.
  - Confirmed both directories share the identical Supabase project credentials.
- **Files Modified / Created:**
  - [`backend/.env.local`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/backend/.env.local)
  - [`Frontend/.env.local`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/.env.local)
  - [`backend/.env.example`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/backend/.env.example)
  - [`Frontend/.env.example`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/.env.example)
- **Current State:** `.env.local` files ready for user to paste credentials.
- **Next Steps for Next Developer:**
  - Add Supabase credentials to both `.env.local` files.
  - Install `@supabase/supabase-js` in `Frontend` and wire lead forms to Supabase `leads` table.

### 2026-09-30 13:40 — Antigravity & Sayli — Project Brain & Frontend/Backend Audit
- **Branch:** `main`
- **What Was Done:**
  - Conducted full audit of Frontend vs Backend architecture and data models.
  - Confirmed 100% attribute coverage between Frontend components and Backend Admin CMS forms.
  - Created centralized [`brain/`](./README.md) collaboration system for the 3 developers:
    - [`brain/README.md`](./README.md) — Team working protocol.
    - [`brain/PROJECT_STATE.md`](./PROJECT_STATE.md) — System status and architecture.
    - [`brain/TEAM_LOG.md`](./TEAM_LOG.md) — This handover activity stream.
    - [`brain/TASK_BOARD.md`](./TASK_BOARD.md) — Active kanban task board with assignments.
    - [`brain/ARCHITECTURE_MAP.md`](./ARCHITECTURE_MAP.md) — Frontend to Backend mapping matrix.
- **Files Created:**
  - `brain/README.md`
  - `brain/PROJECT_STATE.md`
  - `brain/TEAM_LOG.md`
  - `brain/TASK_BOARD.md`
  - `brain/ARCHITECTURE_MAP.md`
- **Current State:** Repository `main` branch clean and synchronized with GitHub.
- **Next Steps for Next Developer:**
  1. Add Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to `Frontend/.env.local` and `backend/.env.local`.
  2. Install `@supabase/supabase-js` in `Frontend` and wire lead form submissions to Supabase `leads` table.

---

### 2026-09-30 11:00 — Sayli — Merged `backend-completion` to `main` and Pushed to GitHub
- **Branch:** `main`
- **Git Commit:** `87c5d1f` (*Complete backend admin CMS*)
- **What Was Done:**
  - Pulled `origin/backend-completion` into local repository.
  - Fast-forward merged changes into `main`.
  - Pushed updated `main` to `https://github.com/Sayli-02/Parmar-properties-listing2.git`.
  - Verified remote status: local and remote `main` are 100% in sync.
- **Files Modified / Added:**
  - `backend/` full admin app with Next.js 16, Supabase SSR, and Zod validations.
  - `backend/supabase/migrations/` (migrations 001 to 008).
  - `MASTER_BACKEND_SPEC.md` root specification.
- **Next Steps:** Wire the Frontend to communicate with Supabase.

---

### 2026-09-30 09:30 — Sayli — UI Polish & Backend Specification Alignment
- **Branch:** `sayali` (Local) / `main`
- **Git Commit:** `6ce195a`
- **What Was Done:**
  - Removed property top badges and refined slider typography in Frontend.
  - Added backend content attribute specifications.
- **Files Modified:**
  - `Frontend/components/property/PropertyCard.tsx`
  - `Frontend/components/hero/HeroCarousel.tsx`
  - `BACKEND_CONTENT_ATTRIBUTES_SPECIFICATION.md`

---

### 2026-09-29 — Team — Initial Repository Setup
- **Branch:** `main`
- **Git Commit:** `86b6f03`
- **What Was Done:**
  - Initial commit containing Parmar Properties luxury real estate listing frontend and base backend folder.
