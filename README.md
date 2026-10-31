# Parmar Properties

One repository, one domain, two apps:

| Folder | What it is | Served at | Tech |
|---|---|---|---|
| [`main-site/`](main-site) | Company website, blog, services, blog admin | `parmarproperties.in/` | Vite + React 18 |
| [`listing/`](listing) | Property listings, locations, insights, listings admin | `parmarproperties.in/listing/` | Next.js 16 + React 19 |

## How the two fit together

Visitors only ever see `parmarproperties.in`. The main site's `main-site/vercel.json` forwards every
`/listing/*` request to the listing app's own deployment, and the listing app is built with
`basePath: "/listing"` so all its pages, images and API calls live under that prefix.

Each app keeps its own Supabase project and its own environment variables for now.

## Vercel setup (two projects, same repo)

| Vercel project | Root Directory | Domain | Notes |
|---|---|---|---|
| Main site | `main-site` | `parmarproperties.in` / `www` | Existing project. |
| Listing | `listing` | none needed | Its `*.vercel.app` address must match the one in `main-site/vercel.json`. Env: Supabase keys, `NEXT_PUBLIC_SITE_URL=https://www.parmarproperties.in/listing`, `NEXT_PUBLIC_ALLOW_INDEXING=true`. |

In each project, set **Settings → Git → Ignored Build Step** to
`git diff --quiet HEAD^ HEAD -- .` so a change in one folder doesn't rebuild the other app.

## Working locally

```bash
cd main-site && npm install && npm run dev      # http://localhost:5173
cd listing && npm install && npm run dev        # http://localhost:3000/listing
```

`/listing` links on the main site only work on Vercel (the forwarding rule); locally, open the listing app directly.
