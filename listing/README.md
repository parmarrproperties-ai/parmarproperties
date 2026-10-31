# Parmar Properties

One Next.js app (Next 16, React 19, Tailwind 4) that serves both:

- the **public website** at `/` (properties, locations, insights, enquiry forms, Google-Ads landing pages), and
- the **staff admin CMS** at `/admin`.

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
npm run dev                     # site: http://localhost:3000   admin: http://localhost:3000/admin
```

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`, `npm run lint`.

## Deploy

One Vercel project, Root Directory `./` (the repo root), framework Next.js, with the two Supabase variables from
`.env.example`.
