# Parmar Properties — Admin CMS

The content management system behind the Parmar Properties website. Staff sign in
here to manage property listings, the home page hero, location pages, market
statistics and business details. Everything is stored in Supabase, so the public
website reads the same tables this admin writes to.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Supabase.

---

## Getting started

### 1. Create the Supabase project

Create a project at [supabase.com](https://supabase.com), then open the SQL
editor and run, in order:

| File                                      | What it does                                                         |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `supabase/migrations/001_initial_schema.sql` | Tables, enums, triggers and row level security policies           |
| `supabase/migrations/002_storage.sql`     | The public `media` storage bucket and its access policies            |
| `supabase/migrations/003_fix_authorization.sql` | **Required on existing projects** — GRANTs, hardened `is_admin()`, non-recursive `profiles` RLS |
| `supabase/migrations/004_master_schema.sql` | Leads inbox, `page_content`, core lookup catalogues                |
| `supabase/migrations/005_master_collections.sql` | `site_branding`, commercial + insights collections, remaining lookups, lead FKs |
| `supabase/migrations/006_evolve_properties_locations.sql` | Master columns on `properties` and `locations`, the `property_configurations` layout tabs, and the `lookup_amenities` link — with backfills from the legacy columns |
| `supabase/migrations/007_content_completeness.sql` | Luxury collection flag, 2 BHK lookup, audit columns on remaining lookups/article sections |
| `supabase/migrations/008_property_configuration_price_breakdowns.sql` | Cost-sheet lines for master `property_configurations` (separate from legacy `price_breakdowns`) |
| `supabase/seed_master.sql`                | Lookup catalogue values and page copy from the master spec           |
| `supabase/seed.sql`                       | Optional sample properties, locations, amenities and metrics         |

If the Admin CMS already shows permission errors after login, run **`003_fix_authorization.sql` first** — that is the fix for profile/amenities/properties load failures. Do **not** disable RLS and do **not** put the service role key in the browser.

`004`, `005`, `006` and `007` are additive: nothing is dropped or recreated. Legacy CMS tables from `001` (`properties`, `locations`, `amenities`, key/value `site_settings`, `market_intelligence`) remain in place, and `006`/`007` add the master columns next to them — `title`, `price` in ₹ Cr, the `lookup_*` foreign keys, `publication_status`, `highlights`, `is_luxury_collection` — backfilling each one from its legacy equivalent. The property and location forms now write the master columns and dual-write the legacy ones, so both the public website and any older query keep working.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
**Project Settings → API**. Both are safe in the browser: row level security,
not secrecy, is what protects the data.

### 3. Create the first admin

Supabase does not allow public sign-ups here, so the first account is made by
hand:

1. **Authentication → Users → Add user**, with an email and password.
2. A `profiles` row is created automatically by a trigger. Promote it in the SQL
   editor:

   ```sql
   UPDATE profiles SET role = 'admin', is_active = true WHERE email = 'you@example.com';
   ```

Only rows with `role = 'admin'` and `is_active = true` can write anything. An
account that signs in without those flags sees the admin with a banner
explaining that access has not been granted.

### 4. Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000); you will land on
`/admin/dashboard`, or on `/admin/login` if you are not signed in yet.

---

## Scripts

| Command             | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Development server (Turbopack)                      |
| `npm run build`     | Production build, including a TypeScript check       |
| `npm start`         | Serve the production build                          |
| `npm run typecheck` | TypeScript only, no build                           |
| `npm run lint`      | ESLint (Next.js 16 no longer lints during `build`)   |

---

## What you can manage

**Dashboard** — counts of live, hidden and featured properties, inventory status,
a breakdown by property type and locality, and shortcuts to recently updated
listings.

**Leads** — every enquiry the website sends, whichever form or modal it came
from. Filter by pipeline stage, source or advisor, move a lead through the
pipeline from the list, and open one to read what the client asked for and
assign it. Leads are write-only for the public: anyone can submit one, only a
signed-in admin can read one back, and deleting is permanent — there is no trash
for leads. The stages and sources live in `lookup_lead_statuses` and
`lookup_lead_sources`, so renaming a stage is a database edit, not a deploy.

**Properties** — the main surface. The list supports search, filters by
publication status, collection (Buy, New launches, Luxury), project status, type,
availability and featured flag, plus sorting and pagination. Each property opens
into a tabbed editor:

- **Details** — title, slug, tagline, description and key highlights; the
  micro-market and sub-location; type, BHK and construction status from the
  `lookup_*` catalogues; price in ₹ Cr, carpet and super area, possession and
  floor; RERA number; publication status, sort order and the badge toggles
  (featured, recently added, recommended, new launch with its launch phase); meta
  title and description; and a map picker for the pin used on the website
- **Media & Documents** — cover image and gallery (`property_images`, primary
  syncs to `cover_image`); MahaRERA QR and brochure on the property file
  columns; floor / master / configuration plans (`floor_plans`). RERA number
  stays on Details → Compliance.
- **Configurations** — the public **Configuration Matrix & Details** typologies
  (plan type, BHK variant, tab label, title, area range, carpet area, price
  indicator, tower/zone, plan image), with add/edit/delete/reorder
- **Unit pricing** — optional internal unit types with cost sheets (separate
  from the public configuration matrix)
- **Amenities** — tick items from the `lookup_amenities` catalogue; the order here
  is the order the website shows
- **Inventory** — individual units with floor, facing, price and status, with bulk
  creation for a whole floor or wing

After creating a property from **Add Property**, the editor opens on the
Media & Documents tab so assets can be uploaded immediately. Configurations
remain a sibling tab (`?tab=configurations`).

**Featured Properties** — arranges the properties highlighted on the home page.

**Trash** — deleted properties are kept here. Restoring brings a listing back as
hidden; deleting forever also removes its images and documents from storage.

**Hero Section**, **Market intelligence** — the editable sections of the home page,
each with ordering and a live/hidden toggle.

**Locations** — the micro-market pages: slug, cover image, price band, average
capital rate, lifestyle tags and key enclaves, plus whether the area is one of the
four shown on the home page or part of the future pipeline strip.

**Commercials** — Grade-A offices and retail assets with hub, type, grade,
price in ₹ Cr, carpet area, RERA, highlights and publication status.

**Insights** — Market Intelligence articles with category, author card, key
takeaways and structured sections (paragraphs, optional comparison tables,
pull-quotes). Estimated read time is derived in the app, never stored.

**Page content** — one editable row per public route (`home`, `buy`,
`new-launches`, `luxury-collection`, `commercials`, `locations`, `insights`,
`about`, `compare`, `saved`) with meta fields and JSON `sections_data`.

**Amenities** — the shared `lookup_amenities` catalogue used by property
amenity pickers.

**Headline metrics** — legacy home-page number widgets (`market_intelligence`).

**Settings** — Site branding singleton (`site_branding`: firm RERA, office,
contacts, SEO defaults), plus legacy business key/value settings and your
account.

---

## How the code is organised

```
src/
  app/
    admin/
      login/            Sign-in page
      (panel)/          Everything behind the sidebar shell
    page.tsx            Redirects to the dashboard
  components/
    ui/                 Buttons, inputs, dialogs, tables — the design system
    shared/             Media picker, confirm dialog, pagination, empty states
    admin/              Sidebar, shell, login form
    <feature>/          One folder per admin section
  lib/
    api/                One module per table: every query and mutation lives here
    supabase/           Browser and server clients, session refresh
    validations/        Zod schemas shared by every form
    constants/          Enum labels, page sizes, upload limits
  types/                Domain types matching the database
supabase/
  migrations/           Schema and storage setup
  seed.sql              Sample content
  seed_master.sql       Lookup catalogues and page copy
```

A few conventions worth knowing before you add a feature:

**Pages are thin.** Each route file sets its `metadata` and renders one client
view component. The work happens in `src/components/<feature>/`.

**All data access goes through `src/lib/api/`.** Components never build a
Supabase query themselves. Each service function returns domain types from
`src/types`, so a component only deals with plain objects. Reads and writes run
from the browser against the anon key, and row level security is the
authorization boundary — `src/proxy.ts` refreshes the session and keeps signed-out
visitors out of `/admin`.

**Uploads are deferred until save.** `MediaPicker` hands back a `FileSelection`
(`unchanged`, `remove`, or `replace`) rather than uploading immediately, and
`uploadSelection` runs on submit. Cancelling a form leaves no orphaned files in
storage.

**Deleting a property is reversible.** `softDeleteProperty` sets `deleted_at`;
only `purgeProperty` removes rows and storage objects.

**Forms are React Hook Form plus the Zod schema for that entity.** If you add a
field, add it to the schema in `src/lib/validations/` first — the form types,
validation messages and the API payload all follow from it.

---

## Deploying

Any host that runs Next.js works. Set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host's environment and run
`npm run build`. In Supabase, add the deployed origin under **Authentication →
URL Configuration** so password reset links come back to the right place.
