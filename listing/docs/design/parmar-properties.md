# Design review: Parmar Properties (listing site + admin CMS)

Reviewed 18 October 2026 from the code in this repo and measurements against the live
Supabase project and `parmarproperties-lisitng.vercel.app`. This reviews the system **as built**
and recommends how it should evolve. It is not a greenfield design.

## 1. Problem & scope

**What the system must do (functional)**
1. Public visitors browse, filter and compare residential listings, locations and market insights,
   then send an enquiry (a lead).
2. Google Ads traffic lands on per-property PPC pages and converts to leads with utm/gclid kept.
3. Staff (a handful of people) sign in at `/admin` to create, edit, publish or unpublish listings,
   media, floor plans, locations, page copy and the hero section, and to work the lead inbox.

**Non-functional constraints (inferred, to confirm in §9)**
- Listing pages should feel instant on Indian mobile networks. Images matter most.
- Leads are the revenue path: **a lost lead is the worst failure**, a stale listing for 60 s is not.
- Admin edits should appear publicly within about a minute.
- Low cost and low operations: there is no dedicated ops person.
- Compliance: MahaRERA numbers shown per listing, and media reuse rights.

**Out of scope:** payments, user accounts for buyers (Saved and Compare are local-only),
multi-city scale, a native app, a real-time inventory feed from developers.

## 2. Scale estimates

| Quantity | Estimate | Basis |
|---|---|---|
| Listings | 100 now · 500–1,000 in 1–2 years | Research pack plus growth |
| Page views | ~10k/day → peak ~2 req/s (ad bursts ×10) | Assumed: boutique brokerage plus PPC |
| Leads | ~10–100/day → writes ≈ 0.001 req/s | Assumed |
| Media | 403 files, **167 MB** originals; median 165 KB, 47 files over 1 MB | Measured from the import |
| Full catalogue query | **563 KB raw / 122 KB gzip, 2.1 s** for 100 listings | Measured (`fetchPublishedProperties`) |
| Catalogue at 1,000 listings | ≈ 5.6 MB raw / 1.2 MB gzip per call | Linear extrapolation |

**What the numbers force:** request rate is trivial, so no load balancing, sharding, queues or
Redis are needed. The real pressure is **bytes per page**: whole-catalogue payloads and large
images. Storage passes the Supabase free tier's 1 GB at about 600 listings at today's media sizes.

## 3. API (entry points)

There is no custom backend API. Browsers and Next.js server components call **Supabase PostgREST
directly**, with Row Level Security (RLS) as the only authorisation layer.

| Caller | Operation | Path today | Note |
|---|---|---|---|
| Public pages (server, ISR 60 s) | Read published listings | `properties?select=*,property_images(*),property_configurations(*),…` | Fetches **the whole catalogue with every relation**, on every list page and every detail page (for "similar properties") |
| Public pages (browser) | Same full-catalogue read | Locations, Compare, Saved, CompareBar, AdsManager | The full 563 KB again, from the visitor's phone |
| Public forms (browser) | `insert into leads` | anon key + RLS (`013`: unverified, unassigned) | No rate limit, captcha or server hop |
| Admin (browser) | CRUD on all tables + Storage uploads | Signed-in Supabase session, `is_admin()` RLS | Create-property is about 6 separate calls, **not one transaction** |
| Images | `/_next/image?url=<supabase public URL>` | Vercel Image Optimization | Resized on first request, now cached 31 days |

## 4. High-level design (as built)

```
 Visitor (mobile)                     Staff
     │                                  │
     ▼                                  ▼
 Vercel edge ── ISR HTML (60 s) ──► Next.js 16 app (one project)
     │                               ├─ (site)  public pages, server components + client islands
     │                               ├─ (admin) /admin CMS, client components, proxy.ts session gate
     │ /_next/image                  └─ server fetch ──┐
     ▼                                                  ▼
 Vercel Image Optimizer ── originals ──► Supabase: Postgres (RLS) · Auth · Storage (public bucket "media")
                                                        ▲
 Browser islands (compare, locations, lead forms) ──────┘  direct anon-key calls
```

Each component earns its place:
- **Next.js monolith on Vercel:** one small team, one deploy (§1). It serves pages from cache, so the request rate doesn't matter (§2).
- **Supabase:** one managed backend for database, auth and file storage. The cost and operations constraint in §1 is why.
- **RLS:** without a server API layer, it is the only security boundary.
- **Vercel image optimizer:** images are the main weight (§2).

## 5. Data model

Postgres (relational fits: listings ↔ configurations ↔ price lines ↔ amenities ↔ lookups).
Key access patterns and what supports them:

| Pattern | Today | Needed index |
|---|---|---|
| Published catalogue, ordered | `publication_status = 'published' and deleted_at is null order by sort_order` | `(publication_status, sort_order) where deleted_at is null` |
| Detail by slug | `slug = $1` | unique `slug` ✓ |
| Filter by location / price / status | **Done in the browser** over the whole list | `(lookup_location_id)`, `(price)`, `(status_id)` once filtering moves server-side |
| Children by property | `property_images.property_id`, `property_configurations.property_id`, … | FK indexes (verify they exist) |

Legacy dual-write columns (`name`, `locality`, `price_display`, …) double the write surface and
can drift from the master columns. Plan their removal (§8, P2).

## 6. Key decisions & trade-offs

| Decision | Solves | Worsens | Change it when |
|---|---|---|---|
| One Next.js app for site + admin | One deploy and codebase for a small team | Admin bundle and site share a release cadence | Never at this scale |
| Supabase BaaS, browser talks to DB directly | No API server to build or run | Security rests entirely on RLS; no place for rate limits, validation or transactions | First abuse incident on leads, or when a write must be atomic (now: create-property) |
| ISR with `revalidate = 60` | Pages served from cache; Supabase load independent of traffic | Up to 60 s staleness; every revalidation re-fetches the whole catalogue | Use on-demand `revalidateTag` from admin saves, so edits appear instantly with fewer DB reads |
| **Whole-catalogue fetch + client-side filtering** | Simple; filters feel instant at 100 rows | Payload grows linearly (563 KB → ~5.6 MB at 1k); repeated on 10 call sites; detail pages pull every listing to pick 3 "similar" | **Now** for the projection; server-side filtering at ~300 listings |
| Public storage bucket + Vercel optimizer | Responsive, cached images with no image service | First view of each size is slow (1.5–3.3 s measured); originals up to 1.9 MB; Vercel plan quotas | Resize on upload in the admin (≤1600 px WebP) so originals are small |
| Lead insert from the browser with the anon key | No server needed | Spam and flooding risk; a failed insert is a silent lost lead | Now (see §7) |
| Multi-call create-property from the browser | Reuses table APIs | Partial records if a step fails mid-way (the form comments admit it) | Move to one Postgres RPC/transaction or a server action |

**Breaking point:** catalogue **bytes** (about 300–500 listings) and **lead integrity**. Request rate is not one.

## 7. Failure modes & degradation

| Failure | What users see today | Degradation target |
|---|---|---|
| Supabase down or slow | Cached ISR pages keep serving (good). Client islands (Locations, Compare, Saved) render empty. **Lead forms fail; the lead is lost** | Lead submit through a server action that falls back to email/WhatsApp notification, and shows the phone number on failure |
| Lead spam or bot flood | Inbox and DB fill; real leads buried | Server action with per-IP rate limit plus Cloudflare Turnstile; keep RLS 013 as the backstop |
| **Supabase free project paused** (inactive for 7 days) | Whole site loses data on next revalidation | Paid Supabase plan for production (also gives daily backups) — verify the current plan |
| Vercel image quota exceeded | Images stop rendering site-wide | Small originals (resize on upload) plus 31-day cache (done); or serve pre-sized images directly |
| Admin save fails mid-create | Half-created listing (row without images or configs) | One transactional RPC; the admin shows a "repair draft" state |
| Admin account takeover or self-signup | Full CMS write access | Verify Auth "allow sign-ups" is **off** (READ_FIRST step 1); enforce MFA for staff |
| `/ads-manager` open to anyone | Leaks campaign URLs and structure | Put it behind the admin session |
| Bad bulk publish (like this import) | Placeholder data live | Default to Draft, a review queue, and an audit log of who published what |

There is **no observability**: errors only reach `console.error`. Without it, a lead-form outage
would go unnoticed until someone complains.

## 8. Scale evolution (prioritised plan)

**P0: this week (correctness and revenue)**
1. Deploy the image/SSR fixes already made locally (server-rendered cards, `priority`, `sizes`, 31-day image cache).
2. Lead path: move the insert to a server action with rate limit, Turnstile and an email/WhatsApp notification to staff; on failure show the phone number. Add a lead-count alert.
3. Verify Supabase sign-ups are disabled and staff have MFA; put `/ads-manager` behind the admin session.
4. Verify the hosting plans. Vercel Hobby is for non-commercial use only. A free Supabase project pauses after inactivity and has no backups.

**P1: next 2–4 weeks (bytes and visibility)**
5. Add `fetchPropertyCards()`: a slim projection (about 15 columns plus the cover URL) for list pages, Compare, Saved and Locations. Expect about 10× smaller payloads.
6. Detail page "similar": query by the same location, `limit 6`, instead of fetching the catalogue.
7. Resize on upload in the admin (canvas → WebP ≤1600 px, about 200–300 KB), and one-off recompress the 86 originals over 500 KB.
8. Observability: Vercel Analytics/Speed Insights plus Sentry, with an alert on lead-insert errors.

**P2: at about 300–500 listings**
9. Server-side filtering and pagination: URL params → SQL, cursor on `(sort_order, id)`. Add the indexes from §5.
10. Postgres full-text search (`tsvector` on title, locality, developer). No search cluster is needed.
11. On-demand revalidation (`revalidateTag('properties')` from admin saves) replaces 60 s polling.
12. Make create-property one RPC transaction; retire the legacy dual-write columns.

**Not needed at 10× or even 100× this traffic:** microservices, queues, Redis, sharding, multi-region.
The next real step change would be a developer inventory feed, which would need scheduled
ingestion jobs (skill `task-scheduling`).

**Signals to watch:** catalogue payload over 300 KB gzip · LCP over 2.5 s on mobile ·
Supabase storage over 70% of plan · Vercel image transformations over 70% of quota ·
lead insert error rate above 0.

## 9. Open questions

- Actual traffic and lead volume (from Google Ads / Analytics) to replace the §2 assumptions.
- Current Vercel and Supabase plans and region (latency to Mumbai users).
- Is public Auth sign-up disabled on this project? Do staff have MFA?
- Media rights for developer images, and whether low-res placeholders are acceptable.
- Should placeholder listings (no RERA, "On request") stay published?

---
### Validation
- [x] Every §6 row has a non-empty "Worsens" and a change trigger; the breaking point is named.
- [x] §2 estimates carry units and state their assumptions.
- [x] §7 gives a degradation path per critical dependency (Supabase, images, leads, auth).
- [x] Each §4 component ties to §1–§2.
- [x] Coverage sweep: media (§6/§8) · IDs (Postgres UUIDs, fine) · search (§8 P2) · logs/SLOs (§7–§8 P1) · jobs (deferred, §8).

**Quality score (1–5):** Simplicity 5 · Fit to scale 4 · Performance 3 · Resilience 2 · Security 3 · Observability 1.
**Weakest dimension: observability and lead resilience.** P0-2 and P1-8 raise both.
