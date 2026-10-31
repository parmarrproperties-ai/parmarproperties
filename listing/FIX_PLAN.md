# Fix plan for AUDIT_8_LISTINGS.md (ponytail ultra)

Rules: smallest complete change per item, reuse what exists, no new dependency, no new abstraction, delete before adding, one commit per item, branch `fix/audit-hardening`. Each item has a check I can run. DB changes are new migrations only (013+), applied to the new Supabase project via the CLI after you approve.

## What I push back on (skip or shrink)

| Audit item | Decision | Why |
|---|---|---|
| A3 internal notes field | **Skip for now** | Needs a column, a form field and a UI. Keep the caveats in the .docx until you ask for it. |
| A6 repeating RERA entries | **Skip** | Free text already carries tower/phase numbers and shows correctly. |
| C3 numeric min/max area and price columns | **Skip** | Biggest change, only needed for sorting/filtering by area or price range. Revisit when the catalogue needs it. |
| B4, B5, B6 (negative order, "Malad", stuck tab) | **Skip** | Cosmetic or not reproducible. B5 is a one-line data delete if you want it. |
| A7 rename "Launch phase" | **Skip** | Wording only. |
| A5 per-tower status | **Shrink** | Add one status option, no per-tower model (see Phase 4). |
| C7 / deferred Fix 14 catalogue locality filter | **Shrink** | Read the list from `lookup_locations`, keep comparing by name. |
| Pune seed / site_settings (D3) | **Shrink** | Delete the Pune rows from `seed.sql`; replace the settings row only with details you give me. |

## Phase 1: security and "wrong on the public site" (do first)

| # | Fix | Files | Size | Check |
|---|---|---|---|---|
| 1.1 (D1) | Login form posts credentials in the URL. Add `method="post"` and make submit a no-op until the handler is attached. | `backend/src/components/admin/login-form.tsx` | ~3 lines | Submit before hydration: no `?password=` in the server log. You also change the admin password. |
| 1.2 (D2) | Tighten the `leads` insert policy. **Needs your rule**; my proposal: anon may insert only with `is_otp_verified = false` and no `assigned_to`/`status_id`. | new `013_leads_policy.sql` | ~10 lines SQL | `tests/012_security.sql` check 3 passes. |
| 1.3 (L10) | Stale detail pages: add `export const revalidate = 60` to the detail page and the catalogue server data (or `dynamic = 'force-dynamic'`). | `Frontend/app/properties/[slug]/page.tsx` | 1 line | Publish, unpublish, edit: site follows within 60 s without a restart. |
| 1.4 (B3) | New listings default to Draft. | `property-form.tsx:189` | 1 word | New form shows Draft. |

## Phase 2: public page correctness (Frontend only)

| # | Fix | Files | Size | Check |
|---|---|---|---|---|
| 2.1 (L1) | Show possession date next to the status (the data is already mapped, no component prints it). | `PropertyDetailClient.tsx` | ~3 lines | Trilogy shows "December 2033". |
| 2.2 (L2) | Add `custom_label` to the property-amenities select (migration 009 is applied now), remove the "older remote" workaround comment. | `lib/supabase/properties.ts` | 1 line | Lodha Vista shows all 6 exclusive amenities. |
| 2.3 (L3) | Stop using highlights as amenities. Drop the fallback; hide the section when empty. | `properties.ts`, `PropertyDetailClient.tsx` | delete ~3 lines | BeaconHill shows no fake "PREMIUM LIFESTYLE AMENITY". |
| 2.4 (L5) | Price wording: print " onwards" only when the text starts with a number or "₹" and contains no "request". | `PropertyDetailClient.tsx` lines 268, 361, 800 | ~3 lines | No "On request onwards". |
| 2.5 (L4) | "Starting price" must be the lowest priced configuration, not the single `price` field, and must not appear when the price is indicative or blank. Simplest: render the property price as "Price on request" unless set, and show per-configuration prices only. **Needs your decision** (see Questions). | `PropertyDetailClient.tsx`, `PropertyCard.tsx` | ~10 lines | Lodha Vista no longer claims ₹7.39 Cr as its cheapest. |
| 2.6 (L7) | Card BHK: join the unique configuration labels ("3 & 4 BHK"). Card area: show the first configuration's area text instead of "Area on request". | `properties.ts`, `PropertyCard.tsx` | ~6 lines | Trilogy card reads "3 & 4 BHK" with an area. |
| 2.7 (L8) | "Prime locality": skip the location when the sub-location already ends with it. | `PropertyDetailClient.tsx` | 1 line | No "Worli, Worli". |
| 2.8 (L6, C5, C6) | Remove fake fallbacks: other property's cover photo, "High-Rise Sky Suites", "Prime Tower", stock plan image. Render nothing (or a neutral grey block) when missing. | `properties.ts`, `locations.ts`, `insights.ts`, `commercials.ts`, `PropertyDetailClient.tsx` | delete ~10 lines | No Worli Aurum image on Embassy Citadel. |
| 2.9 (C1) | SEO: add `generateMetadata` to the detail page using meta title/description (fall back to title + tagline). | `[slug]/page.tsx`, `properties.ts` (select the two columns) | ~12 lines | Tab title of Trilogy is "Godrej Trilogy Worli \| Parmar Properties". |
| 2.10 (L9) | Home "Featured": show only flagged listings (empty state otherwise). Location cards: drop the hard-coded "From ₹X Cr" unless it is computed. | `components/home/*`, `locations.ts` | ~6 lines | Home shows no un-flagged listing as Featured. |
| 2.11 (C9) | Save `property_id` with the enquiry. | `Frontend/lib/supabase/leads.ts`, enquiry form | ~3 lines | Admin Leads shows "Interested in". |

## Phase 3: admin form

| # | Fix | Files | Size | Check |
|---|---|---|---|---|
| 3.1 (B1) | When validation fails, toast the first error and scroll to it. | `property-form.tsx` | ~6 lines | "Other" without a custom type now explains itself. |
| 3.2 (B2) | Make the price asterisk match reality (optional). | `property-form.tsx` | label text | Blank price allowed and not starred. |

## Phase 4: data and catalogue options (migration 013/014)

| # | Fix | Size |
|---|---|---|
| 4.1 (A1) | Insert `Apartment` into `lookup_property_types`; re-point the 8 drafts from Sea-Facing Apartment where wrong (you confirm which). | 1 SQL insert + updates |
| 4.2 (A2) | Seed Mahalaxmi into `locations` (editorial page) as well; keep the catalogue row I added. | 1 SQL insert |
| 4.3 (A5) | Add status option "Ready (OC received)" and use it for Kalpataru Oceana; Rustomjee stays "Under Construction" with the tower detail in possession text. | 1 SQL insert |
| 4.4 (C7) | Catalogue locality select reads `lookup_locations` (fetch helper exists in `lookups.ts`). | ~15 lines |
| 4.5 (D3) | Remove Pune rows from `seed.sql`; replace `site_settings.business` with your real office details. | seed edit |

## Phase 5: wrap-up

1. Re-run the live verification: publish the 8 temporarily, re-check every number, revert to Draft.
2. `tsc --noEmit` and `npm run build` in both apps, `tests/012_security.sql`.
3. Update `brain/TEAM_LOG.md`, `TASK_BOARD.md`, `PROJECT_STATE.md`, `ARCHITECTURE_MAP.md`; untrack `backend/supabase/.temp/*`; push the branch (no PR unless asked).

## Questions I need answered (ponytail: don't build on a guess)

1. **Leads rule (1.2):** is "anon may insert only with `is_otp_verified = false`" right, or do you plan real OTP verification soon?
2. **Price display (2.5):** for listings with only an indicative price, do you want (a) "Price on request" on the card and detail header, with configuration rows showing the indicative text, or (b) the indicative number shown with an "Indicative" label?
3. **Pune and office details (4.5):** what are the real office address, phone and email for Mumbai?
4. **Property type (4.1):** confirm all 8 become "Apartment", or keep Sea-Facing Apartment for any?

## Skipped and risk (ponytail close-out)

- Skipped: A3, A6, A7, B4-B6, C3, and the per-tower model in A5. They are real but not needed to make the site truthful.
- Risk: 2.5 and 1.2 change what visitors see and what the public can submit, so I will not build them before you answer questions 1 and 2. Migrations touch the live new project, so each one is shown to you before I run it.
- Risk: 1.3 trades freshness for speed (60 s delay); say if you want instant updates, which needs an on-demand revalidation call from the admin (more code).

Estimated total: about 100 changed lines across ~12 files plus 2 small migrations.
