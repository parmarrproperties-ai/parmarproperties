-- ============================================================
-- 017_leads_rpc_only.sql
--
-- Run AFTER the code that posts enquiries to /api/leads is deployed and a
-- test enquiry has arrived. Removes the public direct insert on leads, so
-- the rate-limited submit_lead() (016) is the only way in for visitors.
-- Admin insert/update policies are unchanged.
-- ============================================================

DROP POLICY IF EXISTS "Public submit leads" ON public.leads;
