-- ============================================================
-- 012_security_hardening.sql
--
-- Fix 1: every new signup used to become an ACTIVE admin
-- (003_fix_authorization.sql handle_new_user inserted is_active = true).
-- Anyone with the public anon key could call auth.signUp and pass is_admin().
--
-- New profiles are now created with is_active = false. is_admin() requires
-- is_active = true, so a fresh signup is locked out until promoted.
--
-- OWNER TODO (manual, not done by this file):
--   1. Supabase Dashboard > Authentication > Providers > Email:
--      turn OFF "Allow new users to sign up".
--   2. Promote real staff in the SQL editor:
--        update public.profiles set is_active = true where email = '...';
--   3. Existing profiles are NOT changed by this migration.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- role stays 'admin': profiles.role CHECK only allows admin / super_admin.
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'admin',
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
