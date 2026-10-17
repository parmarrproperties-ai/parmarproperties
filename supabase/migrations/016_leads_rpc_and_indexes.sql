-- ============================================================
-- 016_leads_rpc_and_indexes.sql
--
-- 1. Public enquiries now go through POST /api/leads, which calls
--    submit_lead(). The function rate-limits by hashed IP and by phone in the
--    database (so every serverless instance shares one limit), and always
--    stores leads as unverified and unassigned.
-- 2. Indexes for the published-catalogue query and future server-side filters.
--
-- Safe to run before deploying the new code: the old direct insert keeps
-- working until 017 removes it.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lead_rate_events (
  id BIGSERIAL PRIMARY KEY,
  ip_hash TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_rate_events_ip ON public.lead_rate_events(ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_rate_events_phone ON public.lead_rate_events(phone, created_at DESC);

-- No policies: only submit_lead() (SECURITY DEFINER) reads or writes this table.
ALTER TABLE public.lead_rate_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.submit_lead(p_lead JSONB, p_ip_hash TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_phone TEXT := left(trim(coalesce(p_lead->>'phone', '')), 30);
  v_name TEXT := left(trim(coalesce(p_lead->>'full_name', '')), 120);
  v_source UUID;
  v_id UUID;
BEGIN
  IF v_name = '' OR v_phone = '' THEN
    RAISE EXCEPTION 'invalid_lead' USING ERRCODE = '22023';
  END IF;

  -- Max 5 enquiries per IP per hour and 3 per phone number per 10 minutes.
  IF p_ip_hash IS NOT NULL AND (
    SELECT count(*) FROM lead_rate_events
    WHERE ip_hash = p_ip_hash AND created_at > now() - interval '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  IF (
    SELECT count(*) FROM lead_rate_events
    WHERE phone = v_phone AND created_at > now() - interval '10 minutes'
  ) >= 3 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  SELECT id INTO v_source FROM lookup_lead_sources WHERE slug = p_lead->>'source_slug';
  IF v_source IS NULL THEN
    SELECT id INTO v_source FROM lookup_lead_sources ORDER BY display_order NULLS LAST LIMIT 1;
  END IF;

  INSERT INTO leads (
    full_name, phone, email, company_name, source_id, property_id, commercial_id,
    article_id, asset_class, budget_range, message, gate_type, is_otp_verified, assigned_to
  ) VALUES (
    v_name,
    v_phone,
    nullif(left(trim(coalesce(p_lead->>'email', '')), 120), ''),
    nullif(left(trim(coalesce(p_lead->>'company_name', '')), 120), ''),
    v_source,
    (SELECT id FROM properties WHERE id::text = p_lead->>'property_id'),
    (SELECT id FROM commercial_properties WHERE id::text = p_lead->>'commercial_id'),
    (SELECT id FROM insights_articles WHERE id::text = p_lead->>'article_id'),
    nullif(left(coalesce(p_lead->>'asset_class', ''), 80), ''),
    nullif(left(coalesce(p_lead->>'budget_range', ''), 80), ''),
    nullif(left(trim(coalesce(p_lead->>'message', '')), 5000), ''),
    nullif(left(coalesce(p_lead->>'gate_type', ''), 50), ''),
    false,
    NULL
  )
  RETURNING id INTO v_id;

  INSERT INTO lead_rate_events (ip_hash, phone) VALUES (p_ip_hash, v_phone);
  DELETE FROM lead_rate_events WHERE created_at < now() - interval '1 day';

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_lead(JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_lead(JSONB, TEXT) TO anon, authenticated;

-- Published catalogue: WHERE publication_status = 'published' AND deleted_at IS NULL ORDER BY sort_order
CREATE INDEX IF NOT EXISTS idx_properties_published_sort
  ON public.properties(publication_status, sort_order)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_properties_lookup_location ON public.properties(lookup_location_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_property_images_property ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_configurations_property ON public.property_configurations(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_property ON public.property_amenities(property_id);
