# Blog Admin System — Agent Handover & Context

**Migration status:** ✅ Complete — all 8 original posts seeded into Supabase.
**Build status:** ✅ Clean — 0 TypeScript errors, 140 modules.

---

## ─── What Changed From the Static Version ──────────────────────────────────

The blog system was migrated from a hardcoded array in `content.ts` to a live
**Supabase** backend (Postgres + Auth + Storage). The public site is visually
identical — the only difference is that data is now fetched at runtime instead
of at build time.

### What was removed from `content.ts`
- `BlogPost` type (moved to `src/lib/types.ts`, re-exported for compat)
- `blog.posts` array (data now lives in Supabase `posts` + `post_sections` tables)

### What was kept in `content.ts`
- `blog.heading`, `blog.subheading`, `blog.ctaButton`, `blog.categories`
  — these are static UI strings that don't need a CMS.

---

## ─── Architecture ───────────────────────────────────────────────────────────

```
Supabase (postgres + auth + storage)
     │
     ├─ posts table           ← core post data
     ├─ post_sections table   ← sections (FK → posts.id, cascade delete)
     └─ blog-images bucket    ← admin-uploaded images (public read)

src/lib/
     ├─ supabase.ts    ← singleton client (reads VITE_SUPABASE_* from .env)
     ├─ types.ts       ← BlogPost app type, DB schema types, mapPost() helper
     └─ auth.ts        ← signIn / signOut / getSession / onAuthChange

src/hooks/
     └─ useBlogPosts.ts
          ├─ useBlogPosts()        → published posts, ordered by grid_order
          ├─ useAllPostsAdmin()    → all posts (draft + published), with refetch()
          ├─ fetchPostBySlug(slug) → single post by slug (async, not a hook)
          └─ fetchMoreArticles(post) → 3 related posts (override or auto)

src/components/
     └─ BlogPreviewCard.tsx
          variant="row"     → BlogSection/index.tsx (homepage)
          variant="grid"    → BlogPage.tsx (listing)
          variant="article" → BlogPostDetail.tsx (More Articles)
          + BlogPreviewCardSkeleton  → shimmer placeholder while loading

src/pages/
     ├─ BlogPage.tsx         ← /blog        (live Supabase data)
     ├─ BlogPostDetail.tsx   ← /blog/:slug  (live, with More Articles + "See All Blogs" link)
     └─ admin/
          ├─ LoginPage.tsx      ← /admin/login
          ├─ AdminDashboard.tsx ← /admin
          └─ PostEditor.tsx     ← /admin/post/new  and  /admin/post/:slug

src/sections/BlogSection/index.tsx  ← homepage blog preview (live Supabase data)

src/components/ProtectedRoute.tsx   ← wraps all /admin/* routes, checks session
```

---

## ─── Database Schema ────────────────────────────────────────────────────────

### Table: `posts`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | auto-generated |
| `slug` | text (unique) | drives `/blog/:slug` |
| `title` | text | |
| `date` | date | |
| `excerpt` | text | used in all preview cards |
| `image_url` | text | Supabase Storage path or external URL |
| `category` | text | null if uncategorized |
| `intro` | jsonb | `string[]` |
| `downloads` | jsonb | `{label, href}[]` |
| `featured` | boolean | enforced single-true by DB trigger |
| `status` | text | `'draft'` or `'published'` |
| `grid_order` | integer | controls display order everywhere |
| `more_articles_override` | uuid[] | nullable; pinned More Articles post IDs |
| `created_at` / `updated_at` | timestamptz | |

### Table: `post_sections`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `post_id` | uuid (FK → posts.id) | cascade delete |
| `order` | integer | section position |
| `title` | text | nullable |
| `paragraphs` | jsonb | `string[]` |
| `insight` | text | nullable |

### Storage bucket: `blog-images`
- Public read access
- Upload restricted to authenticated admin sessions (Supabase Storage RLS)

### Key DB behaviours
- **Single featured post**: a Postgres trigger (`enforce_single_featured`) fires on
  every INSERT/UPDATE — if `featured = true` is set on a post, it automatically
  sets `featured = false` on all other posts. The frontend does not need to
  manage this.
- **Draft safety**: RLS policy only allows public `SELECT` where `status = 'published'`.
  Drafts are completely invisible to the public site.
- **Cascade delete**: deleting a post row automatically deletes all its sections.

---

## ─── Environment Variables ──────────────────────────────────────────────────

In `.env` (project root):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional — service role key for running the migration script
# without being signed in (bypasses RLS):
# SUPABASE_SERVICE_KEY=your-service-role-key
```

Vite exposes `VITE_*` vars to the browser bundle. The anon key is intentionally
public — it is safe to expose. RLS policies are the security boundary.

---

## ─── Admin Routes ───────────────────────────────────────────────────────────

All admin routes are protected by `ProtectedRoute` which checks `supabase.auth.getSession()`.

| Route | Component | Purpose |
|---|---|---|
| `/admin/login` | `LoginPage` | Supabase email + password sign-in |
| `/admin` | `AdminDashboard` | Post list, drag-and-drop reorder, toggles |
| `/admin/post/new` | `PostEditor` | Create a new post |
| `/admin/post/:slug` | `PostEditor` | Edit an existing post |

### Dashboard actions
- **Drag row** → reorders `grid_order` in Supabase on drop (optimistic UI)
- **Star button** → sets `featured = true` (DB trigger handles unsetting others)
- **Draft/Published badge** → toggles `status` on click
- **Edit icon** → navigates to `/admin/post/:slug`
- **Trash icon** → opens confirm dialog → hard deletes post + cascade sections
- **Sign out** → calls `signOut()` + redirects to `/admin/login`

### Post Editor fields
- Title, slug (auto-generated + manually editable), date, category, excerpt
- Featured toggle
- Hero image: upload file to Supabase Storage OR paste external URL
- Intro paragraphs: add / remove rows
- Sections: add / remove / drag-to-reorder; each has title, paragraphs, insight
- Downloads: add / remove label + URL rows
- More Articles override: pick up to 3 posts to pin (leave empty = automatic)

### Editor action bar
- **Save Draft** → `status = 'draft'` — invisible to public
- **Publish** → `status = 'published'` — immediately live everywhere
- **Discard** → reverts to last saved state (does not hit network)
- **Preview toggle** → renders a read-only view of the post as it will appear

### Live Preview Card (right panel, desktop)
Shows `BlogPreviewCard variant="grid"` and `variant="article"` updating in real
time as you type. The admin sees exactly how the post will look in the blog grid
and More Articles before saving.

---

## ─── "More Articles" Logic ──────────────────────────────────────────────────

```
post.more_articles_override is set?
  YES → fetch those specific post IDs (up to 3), in override order
  NO  → fetch 3 most recent other published posts, ordered by date DESC
```

Implemented in `fetchMoreArticles()` in `src/hooks/useBlogPosts.ts`.

---

## ─── Key Files Quick Reference ─────────────────────────────────────────────

| Task | File to edit |
|---|---|
| Change blog page heading / subheading | `src/content/content.ts` → `blog.heading / .subheading` |
| Change category list | `src/content/content.ts` → `blog.categories` |
| Change how preview cards look | `src/components/BlogPreviewCard.tsx` |
| Change how the detail page renders | `src/pages/BlogPostDetail.tsx` |
| Change admin UI | `src/pages/admin/AdminDashboard.tsx` or `PostEditor.tsx` |
| Change DB queries | `src/hooks/useBlogPosts.ts` |
| Change auth behaviour | `src/lib/auth.ts` |

---

## ─── Migration Script ───────────────────────────────────────────────────────

`scripts/migrate-to-supabase.ts` — one-time seed script.

**Status:** ✅ Successfully run — all 8 original posts are now in Supabase.

If you need to re-run (e.g. after a schema reset):
```bash
# With anon key (requires your RLS admin policy to allow it):
npx tsx scripts/migrate-to-supabase.ts

# With service role key (bypasses RLS entirely — safest for scripts):
# Add SUPABASE_SERVICE_KEY=your-service-key to .env, then:
npx tsx scripts/migrate-to-supabase.ts
```

> **Why RLS blocked the first two runs:** The script was using the anon key,
> which is subject to RLS. The admin write policy only permits
> `auth.role() = 'authenticated'` — a script running outside a browser session
> is not authenticated. The fix was to use the service role key (which bypasses
> RLS), which was added to `.env` as `SUPABASE_SERVICE_KEY`.

---

## ─── Future TODOs ───────────────────────────────────────────────────────────

- [ ] **Real images** — replace Unsplash placeholders via the admin image upload
      (uploads go to the `blog-images` Supabase Storage bucket automatically)
- [ ] **Social sharing** — X and Facebook share buttons in `BlogPostDetail.tsx`
      are visual stubs; wire them to `window.open()` or the Web Share API
- [ ] **Per-post SEO** — add `<title>` and `<meta name="description">` per post
      (can use React Helmet / `@tanstack/react-head`, or just add to `index.html`
      via a server-side approach if Vercel Edge is used)
- [ ] **Code-split admin bundle** — use `React.lazy()` + `Suspense` on the
      `/admin/*` imports in `App.tsx` to keep the public site JS smaller
      (the 668 KB bundle warning is mainly from dnd-kit + Supabase JS being
      bundled together with the public site)
- [ ] **Pagination** — if blog grows past ~30 posts, add `range()` pagination
      to `useBlogPosts()` and a page control to `BlogPage.tsx`
- [ ] **Multiple admin accounts** — Supabase Auth already supports this with no
      schema changes; just invite more users from the Supabase dashboard

---

## ─── What Has NOT Changed ───────────────────────────────────────────────────

- All non-blog sections (Hero, Identity, Services, Process, Support, Agents,
  Testimonials, CTA, Footer) are untouched.
- `content.ts` static exports (everything except `blog.posts`) are unchanged.
- The `Header` component's blog-route detection (`bg-white/95` on `/blog*`) is
  unchanged — it already worked before and still works now.
- `ScrollReveal` and `ScrollScrubRevealText` usage is identical.
- All existing routes (`/`, `/blog`, `/blog/:slug`) work exactly as before.
