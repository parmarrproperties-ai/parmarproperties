-- ============================================================
-- 004_master_schema.sql
-- Parmar Properties Admin CMS — master specification, part one
--
-- Brings in the tables from MASTER_BACKEND_SPEC.md that 001 does not
-- already cover: the option catalogues (Section 3D), per-page editorial
-- content (Section 3B) and the consolidated lead inbox (Section 3C.9).
--
-- ADDITIVE ONLY. Nothing created by 001, 002 or 003 is altered or dropped,
-- and every statement is safe to run twice.
--
-- Mapping notes for anyone comparing this against the specification:
--   * `lookup_locations` is not created — `locations` from 001 already is
--     the micro-market catalogue, and `properties.location_id` points at it.
--   * `lookup_amenities` is not created — `amenities` from 001 already is
--     the shared amenity catalogue.
--   * `leads.commercial_id` and `leads.article_id` are left out until
--     `commercial_properties` and `insights_articles` exist; a lead about
--     either still records its source, message and budget.
--
-- Run in the Supabase SQL editor after 001, 002 and 003.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Lookup catalogues
--    Shared shape: id, slug (unique), name, display_order, is_active.
--    Editable reference data, so no option list has to live in code.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lookup_bhk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lookup_construction_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lookup_property_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lookup_commercial_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lookup_article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lookup_lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lookup_lead_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2. Page content — one row per route
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS page_content (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  subtitle TEXT,
  breadcrumb VARCHAR(100),
  badge VARCHAR(80),
  meta_title VARCHAR(120) NOT NULL,
  meta_description VARCHAR(255) NOT NULL,
  sections_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id)
);

-- ------------------------------------------------------------
-- 3. Leads — every website form and modal lands here
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(120),
  company_name VARCHAR(120),
  source_id UUID NOT NULL REFERENCES lookup_lead_sources(id),
  status_id UUID REFERENCES lookup_lead_statuses(id),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  asset_class VARCHAR(80),
  budget_range VARCHAR(80),
  message TEXT,
  gate_type VARCHAR(50),
  is_otp_verified BOOLEAN NOT NULL DEFAULT false,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status_id);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source_id);
CREATE INDEX IF NOT EXISTS idx_leads_property ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);

-- A public form should not have to know, or be able to choose, a pipeline
-- stage: an insert that leaves status_id empty starts at "new".
CREATE OR REPLACE FUNCTION public.set_default_lead_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status_id IS NULL THEN
    SELECT id INTO NEW.status_id
    FROM public.lookup_lead_statuses
    WHERE slug = 'new';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_default_status ON leads;
CREATE TRIGGER leads_default_status
  BEFORE INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION set_default_lead_status();

-- ------------------------------------------------------------
-- 4. updated_at triggers
-- ------------------------------------------------------------

DO $$
DECLARE
  target text;
BEGIN
  FOREACH target IN ARRAY ARRAY[
    'lookup_bhk',
    'lookup_construction_status',
    'lookup_property_types',
    'lookup_commercial_types',
    'lookup_article_categories',
    'lookup_lead_sources',
    'lookup_lead_statuses',
    'page_content',
    'leads'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %1$s_updated_at ON public.%1$I',
      target
    );
    EXECUTE format(
      'CREATE TRIGGER %1$s_updated_at BEFORE UPDATE ON public.%1$I
         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      target
    );
  END LOOP;
END $$;

-- ------------------------------------------------------------
-- 5. Row level security
--    Catalogues and page content are public reads; leads are write-only
--    for the public and readable only by admins.
-- ------------------------------------------------------------

DO $$
DECLARE
  target text;
BEGIN
  FOREACH target IN ARRAY ARRAY[
    'lookup_bhk',
    'lookup_construction_status',
    'lookup_property_types',
    'lookup_commercial_types',
    'lookup_article_categories',
    'lookup_lead_sources',
    'lookup_lead_statuses'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target);

    EXECUTE format(
      'DROP POLICY IF EXISTS "Public read active %1$s" ON public.%1$I',
      target
    );
    EXECUTE format(
      'CREATE POLICY "Public read active %1$s" ON public.%1$I
         FOR SELECT TO anon, authenticated
         USING (is_active = true OR public.is_admin())',
      target
    );

    EXECUTE format(
      'DROP POLICY IF EXISTS "Admins manage %1$s" ON public.%1$I',
      target
    );
    EXECUTE format(
      'CREATE POLICY "Admins manage %1$s" ON public.%1$I
         FOR ALL TO authenticated
         USING (public.is_admin())
         WITH CHECK (public.is_admin())',
      target
    );
  END LOOP;
END $$;

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read page content" ON page_content;
CREATE POLICY "Public read page content"
  ON page_content FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage page content" ON page_content;
CREATE POLICY "Admins manage page content"
  ON page_content FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anyone may submit an enquiry …
DROP POLICY IF EXISTS "Public submit leads" ON leads;
CREATE POLICY "Public submit leads"
  ON leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- … and only admins may ever read one back.
DROP POLICY IF EXISTS "Admins read leads" ON leads;
CREATE POLICY "Admins read leads"
  ON leads FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins update leads" ON leads;
CREATE POLICY "Admins update leads"
  ON leads FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins delete leads" ON leads;
CREATE POLICY "Admins delete leads"
  ON leads FOR DELETE TO authenticated
  USING (is_admin());

-- ------------------------------------------------------------
-- 6. Grants
--    RLS filters rows, but PostgREST rejects the request with 42501 before
--    RLS runs if the role has no table privilege at all. 003 set default
--    privileges for future tables; these statements make the intent explicit
--    and take back the anon SELECT that leads must never have.
-- ------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON
  lookup_bhk,
  lookup_construction_status,
  lookup_property_types,
  lookup_commercial_types,
  lookup_article_categories,
  lookup_lead_sources,
  lookup_lead_statuses,
  page_content,
  leads
TO authenticated;

GRANT SELECT ON
  lookup_bhk,
  lookup_construction_status,
  lookup_property_types,
  lookup_commercial_types,
  lookup_article_categories,
  lookup_lead_sources,
  lookup_lead_statuses,
  page_content
TO anon;

REVOKE ALL ON leads FROM anon;
GRANT INSERT ON leads TO anon;

-- Done.
-- Verify after running:
--   SELECT count(*) FROM lookup_lead_statuses;   -- 7 after seed_master.sql
--   SELECT has_table_privilege('anon', 'public.leads', 'select');  -- false
--   SELECT has_table_privilege('anon', 'public.leads', 'insert');  -- true
