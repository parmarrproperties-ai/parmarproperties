-- ============================================================
-- Per-post SEO / AEO / GEO fields for the blog.
-- Run once in Supabase → SQL Editor. Safe to re-run.
-- Adds columns only; existing posts and the live site are unaffected.
-- ============================================================

alter table public.posts
  add column if not exists seo_title       text,
  add column if not exists seo_description text,
  add column if not exists author_name     text,
  add column if not exists author_role     text,
  add column if not exists og_image_url    text,
  add column if not exists faqs            jsonb not null default '[]'::jsonb,
  add column if not exists sources         jsonb not null default '[]'::jsonb;

comment on column public.posts.seo_title       is 'Search title (<title>); falls back to "<title> | Parmar Properties". Aim for 30–60 characters.';
comment on column public.posts.seo_description is 'Meta description; falls back to excerpt. Aim for 120–160 characters.';
comment on column public.posts.author_name     is 'Named author shown in the byline and Article schema; falls back to "Parmar Properties Advisory Team".';
comment on column public.posts.author_role     is 'Author job title, e.g. "Director, Parmar Properties".';
comment on column public.posts.og_image_url    is 'Optional 1200x630 share image; falls back to image_url.';
comment on column public.posts.faqs            is 'JSON array of {"question","answer"}; rendered on the post and as FAQPage schema.';
comment on column public.posts.sources         is 'JSON array of {"label","url"}; rendered as a Sources list and Article citations.';

-- Ask PostgREST to pick up the new columns immediately.
notify pgrst, 'reload schema';
