# Audit: entering the 8 listing drafts as a real admin user

Date: 2026-10-11 · Source: `Parmar_Properties_8_Listing_Drafts.docx` · Method: created every listing through the admin form (localhost:3001) as the signed-in admin, then checked the database and the public site code/behaviour (localhost:3000).

## 0. Status after the fix pass (2026-10-11)

Fixed and verified live (listings temporarily published, then reverted to Draft): D1, D2, L1, L2, L3, L5, L8, C1, C2/L7 (card area and BHK), C5/L6 (see correction), C6, C7, C9, L10, B3, A1, A2 (draft page), A5 (status option added), price-on-request switch (new, per your request). B1 field-error path (toast and scroll).

Not fixed, by decision: homepage Featured fallback (L9, deliberate design, your call), hard-coded "From ₹X Cr" on location cards, Lodha Vista "starting price" (now the owner's choice via the Price on Request switch), A3, A6, A7, B4-B6, C3, per-tower status, Pune seed and office details (waiting for details), re-pointing the 8 listings to the new Apartment type (waiting for your call).

Corrections to this audit: (1) the cover image path `/properties/worli-aurum/cover.jpg` does not exist, so visitors saw a broken image, not another property's photo. (2) The config-error path in the admin form already showed a toast; only field errors were silent.

## 1. What was entered

All 8 listings exist as **Draft** (document rule), with title, slug, tagline, overview, highlights, developer name and overview, location, sub-location, possession, MahaRERA text, exclusive amenities, sort order 1-8, meta title and description, and **18 configuration rows**. Shared amenities, images, plans, coordinates and RERA QR are empty, as the document says. Saved values were read back from the database and match the document.

| # | Listing | Location | Price (₹ Cr) | Configs | Excl. amenities | New launch |
|---|---|---|---|---|---|---|
| 1 | Godrej Trilogy | Worli | 23.00 (indicative) | 2 | 0 | Yes |
| 2 | Embassy Citadel | Worli | 13.80 (indicative) | 3 | 5 | Yes |
| 3 | Mahindra BeaconHill | Mahalaxmi | 6.31 (indicative) | 3 | 2 | Yes |
| 4 | Godrej Avenue Eleven | Mahalaxmi | 16.00 (indicative) | 1 | 0 | No |
| 5 | Lodha Vista | Lower Parel | 7.39 | 2 | 6 | No |
| 6 | Lodha World View | Lower Parel | 11.46 (indicative) | 2 | 5 | No |
| 7 | Rustomjee Crown | Prabhadevi | 17.01 | 3 | 5 | No |
| 8 | Kalpataru Oceana | Prabhadevi | blank (document says reconfirm first) | 2 | 4 | No |

Recently added is on for all 8. Featured, Recommended and Luxury are off.

Created on the way: location **Mahalaxmi** in the filter catalogue (it did not exist).

## 2. Frontend verification: what I could and could not do

- Confirmed: Drafts are hidden from visitors. `/properties` shows no residences and each detail URL returns 404. This is correct.
- The listings were later published **temporarily with the owner's approval**, checked live, and **reverted to Draft** (8 drafts, 0 published). Results are in section 2b.
- Items in section 3 marked **(predicted)** were confirmed by the live check; see 2b.

## 2b. Live verification (done 2026-10-11, listings temporarily published, now back to Draft)

**Matched the document exactly (all 8):** title, tagline, sub-location, price shown ("Price on Request" for Oceana), every configuration row (area and price text), highlights, MahaRERA text, developer name, construction status label, tab counts (Buy 8, New Launches 3, Luxury 0), 8 listings in the catalogue, Mahalaxmi shown as a location.

**Did not match or was missing on the public pages:**

| # | Finding | Evidence |
|---|---|---|
| L1 | **Possession dates are never shown.** "December 2033", "December 2028", "Pending confirmation" etc. are saved but no detail page prints them. Only the status label appears. | Trilogy, Avenue Eleven, BeaconHill pages: no possession line. |
| L2 | **Exclusive amenities never reach the public page.** Gym, Guest rooms, Swimming pool, Private theatre, Ballroom, Squash court, etc. all absent (Oceana's "Sea viewing deck" only appears because it is also a highlight). The query does not select `custom_label`. | Lodha Vista 0/6, World View 0/5, Rustomjee 0/5, Oceana 2/4 (via highlights). |
| L3 | Listings with no shared amenities show their **highlights under "Signature Amenities"**, each tagged "PREMIUM LIFESTYLE AMENITY". | BeaconHill, Avenue Eleven. |
| L4 | **"STARTING PRICE" is wrong for Lodha Vista:** shows ₹7.39 Cr while its own 2 BHK row is ₹4.42-4.79 Cr (the document warns against this). Trilogy shows ₹23.00 Cr as "STARTING PRICE" although it is only an indicative secondary reference. | Detail pages. |
| L5 | Price text reads "₹23 Cr (indicative) onwards", "On request onwards", "Price on Request onwards", "...all inclusive onwards". Grammar breaks whenever the price is not a plain number. | All pages. |
| L6 | Cover is the placeholder `/properties/worli-aurum/cover.jpg` (another property's photo) and the plan is a stock `floor-plate.jpg`. | Embassy Citadel. |
| L7 | Card BHK shows only the first configuration: 3 BHK for Trilogy (3 and 4), Embassy (3, 4, 5), BeaconHill, Rustomjee; 2 BHK for Lodha Vista. Card area is "Area on request" for all 8. | Catalogue cards. |
| L8 | "Prime locality" repeats the area: "Dr Annie Besant Road corridor, Worli, Worli". The duplicate check only removes identical values. | Trilogy, BeaconHill, Rustomjee and others. |
| L9 | Homepage "Featured Properties" lists 6 of the 8 although none is flagged Featured (fallback). Homepage location cards show hard-coded prices ("From ₹18 Cr" for Worli) that do not come from the listings. | Home page. |
| L10 | **Stale cache.** Detail pages have no `revalidate`/`dynamic` setting. A slug first visited as a draft kept returning 404 after publishing until I restarted the server. In production a newly published listing, an edit, or an unpublish will not show until the next rebuild. | Trilogy 404 after publish. |

## 3. Issues, where they are, and how to fix them

### A. Data the document needs but the portal cannot hold

| # | Issue | Where | Fix |
|---|---|---|---|
| A1 | No "Residential apartment" property type. Options are Sea-Facing Apartment, Penthouse, Sky Villa, Duplex, Luxury Estate. I used Sea-Facing Apartment for all 8, which is wrong for e.g. Lodha Vista. | `lookup_property_types` | Add an `Apartment` row (the Frontend now defaults to `Apartment`). |
| A2 | **Mahalaxmi missing** from locations; two listings could not be placed until I added it. No editorial micro-market page exists for it. Two separate location tables (`locations` for pages, `lookup_locations` for filters) must be kept in sync by hand. | Admin Locations | Seed Mahalaxmi in both; long term merge into one source. |
| A3 | Compliance caveats ("indicative", "confirm phase", sources) have **no field**. The document's "Details to confirm before publishing" notes only live in the .docx. | Property form | Add an admin-only "Internal notes / sources" field. |
| A4 | A single price cannot say official vs indicative vs on request. Trilogy's ₹23 Cr is an indicative secondary reference; the public page will show it as "STARTING PRICE ₹23.00 Cr onwards" **(predicted)**. Misleading price claims are a MahaRERA advertising risk. | `price` column, `PropertyDetailClient` | Add `price_basis` (official / indicative / on request); show "Indicative" or "Price on request"; leave blank where unconfirmed. |
| A5 | One construction status per listing. Rustomjee Crown is mixed (A and B have OC, C is under construction). Kalpataru Oceana has OC but needs unit confirmation. I had to pick "Under Construction" for both, which is inaccurate. | `status_id` | Per-tower status, or a "Ready (OC received)" / "Mixed" option. |
| A6 | One RERA field holds several numbers (per tower/phase) as free text. | `rera_id` | Repeating RERA entries with a label each. |
| A7 | "Launch phase" offers only Not set / Under Construction / Pre-Launch, which is unrelated to the "New launch" switch. Confusing. | Publishing & SEO | Rename or remove. |

### B. Admin form behaviour

| # | Issue | Fix |
|---|---|---|
| B1 | Choosing BHK "Other" requires a "Custom type", but clicking **Create property** does nothing visible. The error is small text, no toast, no scroll. A user thinks the button is broken. | Toast plus scroll/focus to first error. |
| B2 | Price is marked required (*) yet saves blank. The form and the database disagree on what is required. | Make optional everywhere, or enforce it. |
| B3 | New listings default to **Published**. | Default to Draft. |
| B4 | Catalogue "Display order" rejects negatives, but the seeded rows use -11 to -1. | Allow or reseed to positives. |
| B5 | Catalogue still contains seed leftover "Malad". | Delete if unused. |
| B6 | A long-lived admin tab got stuck on "Loading workspace..." until I opened a fresh tab (looks like a stale auth lock). Seen once. | Investigate session/lock handling. |

### C. Public site

| # | Issue | Where | Fix |
|---|---|---|---|
| C1 | **SEO fields are never used.** There is no `generateMetadata` anywhere. Meta title and description saved in the admin do not reach any page. | `Frontend/app/properties/[slug]/page.tsx` | Add `generateMetadata` reading the stored meta fields. |
| C2 | Cards and compare table will say **"Area on request"** for all 8 **(predicted)**. The property-level carpet area is never filled by the admin, although every configuration has an area. | `carpet_area_sqft` vs `property_configurations` | Derive the card area from configuration data, or add numeric min/max. |
| C3 | Configuration areas and prices are free text ("1,749 (indicative)"). They cannot be sorted or filtered, and sort-by-area uses 0. | `property_configurations.area_range` | Add numeric `area_min`, `area_max`, `price_min`, `price_max` plus a note. |
| C4 | Card BHK label comes from the first configuration only (e.g. "3 BHK" for Trilogy, which has 3 and 4) **(predicted)**. | `mapDbPropertyToFrontend` | Join all configuration labels. |
| C5 | With no images, the site shows `/properties/worli-aurum/cover.jpg`, **another property's photo**, as the cover. Same for locations, insights, commercials. | `properties.ts:311`, `locations.ts`, `insights.ts`, `commercials.ts` | Use a neutral placeholder or hide the card until an image exists. |
| C6 | Invented defaults appear as facts: floor "High-Rise Sky Suites", tower "Prime Tower", and a stock plan image presented as the unit plan. | `properties.ts` | Remove; render nothing when empty. |
| C7 | Catalogue locality filter is a hardcoded list of 11 names. It has no Mahalaxmi, so those two listings cannot be filtered. | `Frontend/app/properties/page.tsx` | Build the list from `lookup_locations` (deferred Fix 14). |
| C8 | Listings without shared amenities (Trilogy, Avenue Eleven) fall back to showing the *highlights* in the amenities area. | `properties.ts` amenities fallback | Show nothing, or label correctly. |
| C9 | Lead from a property page is saved without the property: "Interested in" is blank in the admin. | Enquiry form / `leads.ts` | Save `property_id`. |

### D. Security and operations

| # | Issue | Fix |
|---|---|---|
| D1 | **Credentials were sent in a URL query string.** The dev server log shows `/admin/login?email=...&password=...`, from submitting the login form before the page had finished loading. The password is therefore in the server log and browser history. | Set `method="post"` and prevent default submit until hydrated. **Change the admin password and clear logs/history.** |
| D2 | The `leads` insert policy is still `WITH CHECK (true)`. Anyone with the public key can insert a lead marked OTP-verified. `tests/012_security.sql` check 3 fails for this reason. | Tighten the policy (rule still needed from you). |
| D3 | `seed.sql` still writes Pune data. `site_settings.business` has a Pune address and made-up phone and email. | Replace with real Mumbai details; remove Pune seed. |

## 4. Recommended order

1. D1 (rotate password), D2.
2. C1 (SEO), C5/C6 (fake images and defaults), A4 (price basis), B3 (default Draft).
3. A1, A2, B1, B2, C2 to C4, C7 to C9.
4. A3, A5, A6, A7, B4 to B6, D3.
5. Approve a temporary publish to complete the live verification of every number.
