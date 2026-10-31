# Parmar Properties — Task Board & Sprint Tracker 📌

> **Instructions for the 3 Developers:**  
> When you start working on a task:
> 1. Change its status to 🔄 **In Progress** and put your name in **Assigned:**.
> 2. When finished, move it to ✅ **Completed** and log the work in [`TEAM_LOG.md`](./TEAM_LOG.md).
> 3. Never work on a task marked 🔄 **In Progress** by another teammate without communicating first!

---

## 🚀 Active Sprint: Frontend & Backend Wiring

### 1. In Progress 🔄
*(Claim a task by adding your name here)*

- [ ] **Task 5.1: Dynamic Header & Footer Branding**
  - **Status:** 🔄 Ready to Start
  - **Assigned:** `[Unassigned]`
  - **Description:** Read phone, email, office address, and MahaRERA number from `site_branding` table.

---

### 2. To Do (Upcoming Tasks) 📋

- [ ] Switch Vercel to ONE project for the merged app (Root Directory = repo root), then delete the `parmar-admin` project; add `/admin/**` to Supabase redirect URLs; smoke-test the admin (sign in, edit a property, upload an image).
- [ ] Optional: tidy ESLint for `src/site` (it was never linted) and re-check the 1 to 2px paragraph line-height difference left by the Tailwind 4 upgrade.

#### SEO follow-ups (2026-10-18)
- [ ] Final domain: set `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_ALLOW_INDEXING=true` in Vercel, then submit the sitemap in Google Search Console and Bing Webmaster Tools.
- [ ] Admin: write real meta title/description for priority listings.
- [ ] Optional: dedicated `/new-launches` and `/luxury-collection` routes; per-page OG images; Google Business Profile for the Parel office.

#### Design-review follow-ups (2026-10-18, see `docs/design/implementation-plan.md`)
- [ ] Submit one real test enquiry on the live site; confirm it reaches Admin › Leads (only path is now `/api/leads` → `submit_lead()`).
- [ ] Admin › Settings › **Optimize stored images**: click once (86 photos over 500 KB).
- [ ] Data: fix Lodha Elise placeholder area (1500 - 2000), SB-058 The Odyssey cut-off config price; add RERA numbers to the 39 "On request" listings or unpublish them.
- [ ] Data: SB-077 to SB-100 (completed buildings, no confirmed units) are Published; decide whether to keep them live.
- [ ] Owner: Vercel plan (Hobby is non-commercial), Supabase plan + backups, Auth sign-ups off, staff MFA; optional Resend env vars for lead emails; enable Vercel Analytics + Speed Insights.
- [ ] At ~300 listings: server-side filtering/pagination and Postgres full-text search (indexes already added in 016).

#### Audit hardening follow-ups
- [ ] **Before going live:** the 8 listings are currently Published (so /ads-manager works on localhost). Set them back to Draft, or finish images and price decisions first.
- [ ] Real OTP, then relax migration 013.
- [ ] Owner decisions: homepage Featured fallback, hard-coded "From ₹X Cr" on location cards, Apartment type for the 8 drafts, Mumbai office details, Pune seed cleanup.
- [ ] Add images, plans and RERA QR to the 8 draft listings, then publish.
- [ ] **Audit Fixes 2-9** — not supplied in the prompt of 2026-10-11; not done (includes the `leads` insert rule and `/api/enquire`, which still exists).
- [ ] **Fix 14: catalogue location filter** — `Frontend/app/properties/page.tsx` hardcodes localities (desktop ~L396, mobile ~L566) and compares `p.location !== selectedLocality` (L155); same in `app/commercials/page.tsx` L244. Root cause: `normalizeLocality` in `Frontend/lib/supabase/properties.ts` coerces any CMS locality to an 11-name union and defaults unknown to `'Worli'`. Homepage uses `locations` table via `fetchLocationFilterNames`; properties use `lookup_locations`. Needs a shared key (slug) and a widened `location` type (>30 lines).
- [ ] Apply migrations 010, 011, 012 (owner, SQL editor, in order) and turn off public signup.
- [ ] Run `backend/supabase/tests/012_security.sql`.
- [ ] Do not-now items: split large files (`PropertyDetailClient.tsx`, `property-form.tsx`, `HeroCarousel.tsx`, `backend/src/lib/api/properties.ts`); align/upgrade Next/React/Tailwind; move 39 MB of `Frontend/public` images; remove `Frontend/data/*.ts` fallback content (plan first).

#### Phase 3: Global Settings & Branding
- [ ] **Task 5.1: Dynamic Header & Footer Branding**
  - **Assigned:** `[Unassigned]`
  - **Files:** `Frontend/components/layout/Navbar.tsx`, `Frontend/components/layout/Footer.tsx`
  - **Goal:** Read phone, email, office address, and MahaRERA number from `site_branding` table.

---

### 3. Completed Tasks ✅

- [x] **Per-page SEO** (Done: 2026-10-18, branch `seo-per-page`) — metadata, canonicals, OG, JSON-LD, sitemap, robots, server-rendered content for location/insight pages. Indexing is OFF until `NEXT_PUBLIC_ALLOW_INDEXING=true`.

- [x] **South Mumbai import: 100 listings published** (Done: 2026-10-18) — SB-001 by hand, SB-002 to SB-100 bulk-imported via a temporary admin page; defaults listed in TEAM_LOG.
- [x] **Design-review fixes** (Done: 2026-10-18, PR #1) — server-rendered listings, slim card query, image sizing/caching, compress-on-upload, `/api/leads` + `submit_lead()` (016) and RPC-only leads (017, applied), rollback on failed create, instant revalidation, `/ads-manager` behind login, Vercel Analytics.
- [x] **`/ads-manager` behind the admin login** (Done: 2026-10-18).

- [x] **Listing audit fix pass** (Done: 2026-10-11) — see TEAM_LOG; plan in FIX_PLAN.md, findings in AUDIT_8_LISTINGS.md.
- [x] **Audit hardening: Fixes 1, 10, 11, 12, 13, 15** (Done: 2026-10-11) — branch `fix/audit-hardening`; migration 012 authored, not applied.
- [x] **CMS-drive Locations filter bar + Hero + Why Parmar + Home Insights** (Done: 2026-10-04) — Seeded existing Frontend content into `hero_slides` / `page_content` / `locations` / `insights_articles`; Frontend now reads these sections from Supabase with fallbacks.
- [x] **Task 5.2: Dynamic Hero Carousel Slides** (Done: 2026-10-04) — `HeroCarousel` reads active slides from `hero_slides` + headline/subtext from `page_content`.
- [x] **Backend RLS: publication_status authority for properties + children** (Done: 2026-10-04) — Migration `010_publication_status_rls.sql` authored (not yet applied to Supabase).
- [x] **Admin Add/Edit Property: main Price (₹ Cr) in Property Information** (Done: 2026-10-04) — Canonical `price` field shown beside Property Type so create/edit can set catalogue price (avoids public “Price on Request”).
- [x] **Task 4.1: Residential Properties Query Hook & Home Showcase** (Done: 2026-10-01) — Connected `/` and `/properties` to Supabase `properties` table with zero-breakage fallback.
- [x] **Task 4.2: Single Property Dossier (`/properties/[slug]`)** (Done: 2026-10-01) — Connected dynamic slug lookup with configurations, gallery images, and lead inquiry hooks.
- [x] **Task 4.3: Commercial Properties Query Hook (`/commercials`)** (Done: 2026-10-01) — Connected `/commercials` to Supabase `commercial_properties` table with fallback.
- [x] **Task 4.4: Locations Directory & Detail (`/locations`, `/locations/[slug]`)** (Done: 2026-10-01) — Connected enclaves directory and location slug pages to Supabase `locations` table.
- [x] **Task 4.5: Market Intelligence Articles (`/market-intelligence`, `[slug]`)** (Done: 2026-10-01) — Connected `/market-intelligence` and article slug pages to Supabase `insights_articles` table.

- [x] **Wire 6 Lead Touchpoints to Supabase `leads` (Navbar, Property Gate, Sidebar, Private Opportunities, Commercials, Market Intelligence)** — *Completed by Antigravity & Sayli (2026-09-30)*
- [x] **Frontend Supabase Client (`lib/supabase/client.ts`, `leads.ts`, `properties.ts`)** — *Completed by Antigravity & Sayli (2026-09-30)*
- [x] **Setup `.env.local` and `.env.example` in `backend` and `Frontend`** — *Completed by Antigravity & Sayli (2026-09-30)*
- [x] **Audit Frontend and Backend Architecture & Attributes** — *Completed by Antigravity & Sayli (2026-09-30)*
- [x] **Setup Project Brain & Team Collaboration System** — *Completed by Antigravity & Sayli (2026-09-30)*
- [x] **Pull `backend-completion` and Fast-Forward Merge to `main`** — *Completed by Sayli (2026-09-30)*
- [x] **Backend Admin CMS Panels Implementation (Properties, Commercials, Locations, Insights, Leads, Hero, Settings)** — *Completed (87c5d1f)*
- [x] **Database Migrations 001 through 008 + Master Seed Scripts** — *Completed (backend/supabase/migrations)*
- [x] **Frontend 11 Routes & 6 Lead Modal UI Implementations** — *Completed*
