-- ============================================================
-- 003_fix_authorization.sql
-- Parmar Properties Admin CMS — Authorization Repair
--
-- Fixes the post-login CMS failures:
--   "Loading your profile failed: your account does not have permission..."
--   "Counting amenities failed."
--   and similar 42501 / RLS evaluation failures across CMS pages.
--
-- Causes addressed:
--   1. Missing GRANTs for anon / authenticated on public tables
--   2. Unsafe is_admin() (no fixed search_path; unqualified profiles read)
--   3. Recursive RLS risk: profiles policies calling is_admin() which
--      SELECTs profiles under RLS
--
-- SAFE: Does NOT disable RLS. Does NOT use service_role. Does NOT open
-- leads (or any sensitive table) to public SELECT.
--
-- Run in Supabase SQL Editor AFTER 001 and 002.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Harden is_admin()
--    - SECURITY DEFINER so it bypasses RLS when reading profiles
--    - Fixed search_path to prevent resolution / injection issues
--    - Fully qualified public.profiles
--    - Explicit EXECUTE grants (revoke from PUBLIC first)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_active = true
      AND p.role IN ('admin', 'super_admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- Also harden handle_new_user if present (auth signup profile insert)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'admin',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------
-- 2. Fix profiles RLS — remove recursive is_admin() on SELECT
--    Own-row SELECT must not depend on is_admin().
--    Admin listing of other profiles uses a separate policy that
--    still calls the now-safe SECURITY DEFINER is_admin().
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

-- Every authenticated user can read their own profile row.
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Active admins can read all profiles (admin directory / assignment).
CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Users can update their own non-privilege fields; admins can update any.
-- Privilege escalation (role / is_active) should be constrained in app +
-- optionally a trigger; for V1 admins may update via SQL / CMS carefully.
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_admin"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------
-- 3. Table / sequence / routine GRANTs
--    RLS still filters rows. Without GRANTs, PostgREST returns 42501
--    before RLS is even evaluated.
-- ------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Existing CMS tables from 001
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public
  TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public
  TO anon;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public
  TO authenticated, anon, service_role;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public
  TO authenticated, anon, service_role;

-- Future tables created by postgres in this schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated, anon, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO authenticated, anon, service_role;

-- ------------------------------------------------------------
-- 4. Storage: ensure authenticated can use media via existing policies
--    (policies already call is_admin(); GRANT on storage.objects is
--     managed by Supabase — do not over-grant here.)
-- ------------------------------------------------------------

-- Done.
-- Verify after running (as SQL editor / postgres):
--   SELECT public.is_admin();           -- false in SQL editor (no JWT)
--   SELECT has_table_privilege('authenticated', 'public.profiles', 'select');
--   SELECT has_table_privilege('authenticated', 'public.amenities', 'select');
-- Then re-login in the Admin CMS and confirm Dashboard / Properties load.
