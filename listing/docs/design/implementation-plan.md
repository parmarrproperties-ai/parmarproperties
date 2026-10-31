# Implementation plan: design-review fixes

Source: [parmar-properties.md](parmar-properties.md) (18 Oct 2026). **Code** = done in this change.
**Owner** = needs a dashboard, account or billing action that code can't do.

| # | Finding | Fix | Who |
|---|---|---|---|
| 1 | Pages slow to show cards and photos | Server-render home and listings, `priority` on first cards, `sizes` on detail images, 31-day image cache | Code ✅ |
| 2 | Leads go straight from the browser to the DB; no rate limit; failures lost silently | `POST /api/leads` route: validation, same-origin check, per-instance burst limit, Supabase RPC `submit_lead` (DB-side limit: 5 per IP per hour, 3 per phone per 10 min), staff email via Resend (also sent when the DB save fails, so the lead is never lost), browser keeps an offline copy on failure. Falls back to the old direct insert until 016 is run | Code ✅ + Owner: run migration 016, set env vars |
| 3 | Bots can still call the `leads` insert directly with the public key | Migration **017** removes the public insert policy, so only `submit_lead` can write. Run it **after** the new code is deployed | Owner |
| 4 | Whole catalogue (563 KB) on every list page | `fetchPropertyCards()`: slim select without galleries, descriptions or floor-plan images; used by home, listings, locations, compare, saved, CompareBar, AdsManager | Code ✅ |
| 5 | Detail pages fetch every listing to pick 3 "similar" | `fetchSimilarProperties()`: same location or type, `limit` in SQL, slim select | Code ✅ |
| 6 | Large photos (up to 1.9 MB) | Admin uploads resize to ≤1600 px WebP before upload (photos only, not PDFs/SVG/small files) | Code ✅ |
| 7 | 86 already-uploaded photos over 500 KB | Admin › Settings › "Optimize stored images" button: recompresses in place (same URL) | Code ✅ + Owner: click once |
| 8 | Half-created listing if Add Property fails mid-way | Form deletes the new property row (plus uploaded files) when any later step fails | Code ✅ |
| 9 | Edits take up to 60 s to appear | `POST /api/revalidate` (active admin required). The admin Supabase client calls it about 1.5 s after any successful write (rows or files), so every admin screen is covered. 60 s ISR stays as a backstop | Code ✅ |
| 10 | `/ads-manager` open to anyone | Added to the admin session gate | Code ✅ |
| 11 | No observability | Vercel Analytics + Speed Insights; structured server logs for lead failures (visible in Vercel › Logs) | Code ✅ + Owner: enable Analytics in Vercel |
| 12 | Catalogue filters run in the browser | DB indexes added now (016); server-side filtering/pagination deferred until ~300 listings (no benefit at 100) | Code (indexes) ✅ · rest deferred |
| 13 | Sign-ups / MFA / plans | Turn off Auth sign-ups; enable MFA for staff; confirm Vercel Pro (commercial use) and Supabase paid plan (no pausing, backups) | Owner |
| 14 | Data: Lodha Elise placeholder area; SB-058 truncated price; 39 listings without RERA | Edit in admin, or unpublish the 39 until RERA is known | Owner |
| 15 | Spam captcha | Optional Cloudflare Turnstile after the rate limit is live and if spam appears | Deferred |

## Verified locally (18 Oct 2026)

- `tsc` and the production `next build` pass. All 100 property pages are pre-rendered; no new lint errors.
- Production server: home, listings, detail, compare, saved and locations return 200. Locations shows all 100 cards.
- Compressed page weight: home **27 KB** (was 12.5 KB HTML plus a 122 KB catalogue download), listings **17 KB**.
- Card query: 563 KB → 160 KB raw (122 KB → 22 KB gzip).
- `/ads-manager` signed out → redirect to login. `/api/revalidate` without admin → 401.
  `/api/leads`: invalid body → 400; cross-origin → 403.
- **Not tested:** a real lead submission (it would create a live lead; do it in step 4 below); the image optimizer button
  and resize-on-upload (they need an admin session); Resend email (needs keys).

## Owner checklist (in order)

1. Supabase › SQL Editor: run `supabase/migrations/016_leads_rpc_and_indexes.sql`.
2. Vercel › Settings › Environment Variables (optional, for lead emails): `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL`.
   Also `LEAD_IP_SALT` (any random string).
3. Deploy (push to GitHub).
4. Submit a test enquiry on the live site and check Admin › Leads.
5. Supabase › SQL Editor: run `supabase/migrations/017_leads_rpc_only.sql`.
6. Vercel › Analytics and Speed Insights: enable.
7. Supabase › Authentication › Providers › Email: turn off "Allow new users to sign up". Enable MFA for staff.
8. Admin › Settings › Optimize stored images: click once.
9. Fix the data items in row 14.
