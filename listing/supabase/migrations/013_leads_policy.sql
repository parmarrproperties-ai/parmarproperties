-- ============================================================
-- 013_leads_policy.sql
--
-- The public enquiry forms had no real OTP, yet 004 let anyone insert a lead
-- with is_otp_verified = true (or pre-assigned to an advisor). Until a real
-- OTP flow exists, public inserts must be unverified and unassigned.
-- When real OTP is built, verify server-side (service role / edge function),
-- not from the browser, then relax this rule.
-- ============================================================

DROP POLICY IF EXISTS "Public submit leads" ON public.leads;
CREATE POLICY "Public submit leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (is_otp_verified = false AND assigned_to IS NULL);
