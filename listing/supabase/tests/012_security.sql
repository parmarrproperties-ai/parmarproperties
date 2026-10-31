-- 012_security.sql — assertions for the security hardening pass.
--
-- HOW TO RUN: Supabase Dashboard > SQL Editor, paste the whole file, Run.
-- Run only AFTER migration 012 is applied. Everything happens inside one
-- transaction that is ROLLED BACK at the end, so no data is kept.
-- A failed assertion raises an exception with a message; success prints notices.
--
-- NOTE: assertion 3 only passes once a migration tightens the "Public submit
-- leads" policy (004 currently uses WITH CHECK (true)). 012 does not do that.

BEGIN;

DO $$
DECLARE
  uid uuid := gen_random_uuid();
  active boolean;
  admin_ok boolean;
BEGIN
  -- 1. A new auth.users row yields an INACTIVE profile (trigger handle_new_user).
  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES (uid, 'sectest-' || uid || '@example.invalid', '{}'::jsonb);

  SELECT is_active INTO active FROM public.profiles WHERE id = uid;
  IF active IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'FAIL 1: new profile is_active = % (expected false)', active;
  END IF;
  RAISE NOTICE 'PASS 1: new signup profile is inactive';

  -- 2. is_admin() is false for that user.
  PERFORM set_config('request.jwt.claim.sub', uid::text, true);
  SET LOCAL ROLE authenticated;
  admin_ok := public.is_admin();
  RESET ROLE;
  IF admin_ok THEN
    RAISE EXCEPTION 'FAIL 2: is_admin() true for inactive signup';
  END IF;
  RAISE NOTICE 'PASS 2: is_admin() is false for new signup';

  -- 3. anon cannot insert a lead with is_otp_verified = true.
  SET LOCAL ROLE anon;
  BEGIN
    INSERT INTO public.leads (full_name, phone, source_id, is_otp_verified)
    VALUES ('sectest', '0000000000', (SELECT id FROM public.lookup_lead_sources LIMIT 1), true);
    RESET ROLE;
    RAISE EXCEPTION 'FAIL 3: anon insert with is_otp_verified = true was accepted';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RESET ROLE;
    RAISE NOTICE 'PASS 3: anon insert with is_otp_verified = true rejected';
  END;
END $$;

ROLLBACK;
