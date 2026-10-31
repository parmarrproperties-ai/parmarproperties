# Parmar Properties

One Next.js app (Next 16, React 19, Tailwind 4) that serves both:

- the **public website** at `/listing` (properties, locations, insights, enquiry forms, Google-Ads landing pages), and
- the **staff admin CMS** at `/listing/admin`.

Both talk to the same Supabase project. Deploy it as a single Vercel project.

## Layout

```
src/app/(site)/      public website pages (own root layout, fonts and CSS)
src/app/(admin)/     admin CMS at /admin (own root layout, fonts and CSS)
src/site/            code used by the public site (components, lib, data, store, types)
src/components, src/lib, src/types   code used by the admin
src/proxy.ts         protects /admin (redirects to /admin/login when signed out)
supabase/            database migrations (001 onwards), tests and seed scripts
public/              images and static files for both
scripts/             one-off helper scripts (image downloads)
docs/                content guides and the original admin README
brain/               team memory: read brain/READ_FIRST.md before you code
```

## Run it

```bash
cp .env.example .env.local      # then put your Supabase URL and anon key in it
npm install
npm run dev                     # site: http://localhost:3000/listing   admin: http://localhost:3000/listing/admin
```

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`, `npm run lint`.

## Deploy

This app lives at **parmarproperties.in/listing**. `next.config.ts` sets `basePath: "/listing"` (from
`src/lib/base-path.ts`), and the main site (`../main-site/vercel.json`) forwards every `/listing/*` request here.

Vercel project: Root Directory `listing`, framework Next.js, with the variables from `.env.example`. Set
`NEXT_PUBLIC_SITE_URL=https://www.parmarproperties.in/listing` and `NEXT_PUBLIC_ALLOW_INDEXING=true` in production.

Locally the site is at http://localhost:3000/listing and the admin at http://localhost:3000/listing/admin.

Next.js adds `/listing` to `<Link>`, `router.push` and redirects by itself. Plain strings do not get it: wrap local
image paths and `fetch('/api/...')` calls in `withBasePath()`, and import `Image` from `@/components/ui/image`
instead of `next/image`.
