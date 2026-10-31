-- Parmar Properties Admin CMS — storage bucket and policies
-- Run after 001_initial_schema.sql. Creates the public `media` bucket the admin
-- uploads to, and restricts writes to active admin profiles.

-- ============================================================
-- BUCKET
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============================================================
-- POLICIES
-- ============================================================
-- Anyone may read, because the public website serves these URLs directly.
-- Only admins may add, replace or remove objects.

DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admins upload media" ON storage.objects;
CREATE POLICY "Admins upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "Admins update media" ON storage.objects;
CREATE POLICY "Admins update media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND is_admin())
  WITH CHECK (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "Admins delete media" ON storage.objects;
CREATE POLICY "Admins delete media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND is_admin());
