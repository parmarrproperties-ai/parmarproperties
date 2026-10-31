-- ============================================================
-- 005_master_collections.sql
-- Completes MASTER_BACKEND_SPEC collections deferred from 004:
--   site_branding (singleton corporate settings — Section A)
--   lookup_commercial_hubs, lookup_commercial_grades, lookup_amenities
--   commercial_properties (C.5)
--   insights_articles + article_sections (C.7 / C.8)
--   leads.commercial_id / leads.article_id FKs
--
-- Does NOT drop legacy 001 tables (properties, locations, amenities,
-- market_intelligence, site_settings key/value). Those remain for the
-- current Admin CMS until a dedicated alignment migration.
--
-- RLS: public reads published content only; leads remain write-only
-- for anon. No service_role in client. RLS stays enabled.
-- Run AFTER 003 and 004.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Additional lookups
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lookup_commercial_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS lookup_commercial_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Spec D.6 catalogue (separate from legacy `amenities` used by property M2M)
CREATE TABLE IF NOT EXISTS lookup_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Spec D.1 — geographic catalogue distinct from editorial `locations` pages
CREATE TABLE IF NOT EXISTS lookup_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO lookup_commercial_hubs (slug, name, display_order) VALUES
  ('bkc', 'Bandra Kurla Complex', 1),
  ('lower-parel', 'Lower Parel', 2),
  ('worli', 'Worli', 3),
  ('nariman-point', 'Nariman Point', 4),
  ('andheri-east', 'Andheri East', 5),
  ('thane', 'Thane', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lookup_commercial_grades (slug, name, display_order) VALUES
  ('grade-a', 'Grade-A', 1),
  ('grade-a-plus', 'Grade-A+', 2),
  ('leed-platinum', 'LEED Platinum', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lookup_amenities (slug, name, display_order) VALUES
  ('private-elevator', 'Private Elevator', 1),
  ('infinity-sky-pool', 'Infinity Sky Pool', 2),
  ('private-plunge-pool', 'Private Plunge Pool', 3),
  ('sea-facing-balconies', 'Sea-Facing Balconies', 4),
  ('automated-smart-home', 'Automated Smart Home', 5),
  ('concierge-valet', 'Concierge & Valet', 6),
  ('clubhouse-spa', 'Clubhouse & Spa', 7),
  ('ev-charging-bays', 'EV Charging Bays', 8),
  ('biometric-security', '24/7 Biometric Security', 9),
  ('private-wine-cellar', 'Temperature Controlled Wine Cellar', 10)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lookup_locations (slug, name, display_order) VALUES
  ('worli', 'Worli', 1),
  ('bandra-west', 'Bandra West', 2),
  ('juhu', 'Juhu', 3),
  ('malabar-hill', 'Malabar Hill', 4),
  ('lower-parel', 'Lower Parel', 5),
  ('prabhadevi', 'Prabhadevi', 6),
  ('powai', 'Powai', 7),
  ('sewri', 'Sewri', 8),
  ('cuffe-parade', 'Cuffe Parade', 9),
  ('bkc', 'BKC', 10),
  ('khar-west', 'Khar West', 11)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- 2. site_branding singleton (spec Section A)
--    Legacy key/value `site_settings` remains until Admin migrates.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS site_branding (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name VARCHAR(100) NOT NULL DEFAULT 'PARMAR PROPERTIES',
  est_year SMALLINT NOT NULL DEFAULT 1981,
  est_badge VARCHAR(30) NOT NULL DEFAULT 'EST. 1981',
  brand_tagline VARCHAR(200) NOT NULL DEFAULT 'Mumbai • Prime Residential Real Estate',
  contact_landline VARCHAR(30) NOT NULL DEFAULT '+91 (022) 6666 9733',
  contact_mobile VARCHAR(30),
  whatsapp_number VARCHAR(20) NOT NULL DEFAULT '919820012345',
  contact_email VARCHAR(120) NOT NULL DEFAULT 'contact@parmarproperties.com',
  advisory_email VARCHAR(120) NOT NULL DEFAULT 'advisory@parmarproperties.com',
  office_building VARCHAR(150) NOT NULL DEFAULT 'Peninsula Center, 208',
  office_street VARCHAR(150) NOT NULL DEFAULT 'Doctor SS Rao Marg, Parel',
  office_city_pin VARCHAR(100) NOT NULL DEFAULT 'Mumbai, Maharashtra 400012',
  working_hours VARCHAR(100) NOT NULL DEFAULT 'Mon - Sun: 10:00 AM - 6:30 PM IST',
  firm_rera_number VARCHAR(50) NOT NULL DEFAULT 'A51900018442',
  official_website VARCHAR(255) NOT NULL DEFAULT 'https://www.parmarproperties.in/',
  nav_cta_label VARCHAR(50) NOT NULL DEFAULT 'TALK TO OUR ADVISORY',
  meta_title VARCHAR(100) NOT NULL DEFAULT 'Parmar Properties | Luxury Real Estate Mumbai',
  meta_desc VARCHAR(255) NOT NULL DEFAULT 'Curated portfolio of prime waterfront residences across Mumbai.',
  social_links JSONB NOT NULL DEFAULT '{"linkedin":"","instagram":"","x":""}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id)
);

INSERT INTO site_branding (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

DROP TRIGGER IF EXISTS site_branding_updated_at ON site_branding;
CREATE TRIGGER site_branding_updated_at
  BEFORE UPDATE ON site_branding
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 3. commercial_properties
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS commercial_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  tagline VARCHAR(200) NOT NULL DEFAULT '',
  hub_id UUID NOT NULL REFERENCES lookup_commercial_hubs(id),
  sub_location VARCHAR(150) NOT NULL DEFAULT '',
  price NUMERIC(6, 2) NOT NULL CHECK (price > 0),
  carpet_area INTEGER NOT NULL CHECK (carpet_area > 0),
  commercial_type_id UUID NOT NULL REFERENCES lookup_commercial_types(id),
  floor VARCHAR(80) NOT NULL DEFAULT '',
  possession VARCHAR(50) NOT NULL DEFAULT 'Ready to Move',
  grade_id UUID REFERENCES lookup_commercial_grades(id),
  cover_image TEXT NOT NULL DEFAULT '',
  rera_id VARCHAR(50) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  meta_title VARCHAR(120),
  meta_description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_commercial_status ON commercial_properties(status);
CREATE INDEX IF NOT EXISTS idx_commercial_hub ON commercial_properties(hub_id);
CREATE INDEX IF NOT EXISTS idx_commercial_sort ON commercial_properties(sort_order);

DROP TRIGGER IF EXISTS commercial_properties_updated_at ON commercial_properties;
CREATE TRIGGER commercial_properties_updated_at
  BEFORE UPDATE ON commercial_properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 4. insights_articles + article_sections
--    read_time is intentionally NOT stored (spec §E — derive in app).
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS insights_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL UNIQUE,
  category_header VARCHAR(80) NOT NULL DEFAULT '',
  category_id UUID NOT NULL REFERENCES lookup_article_categories(id),
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(200) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tag VARCHAR(50) NOT NULL DEFAULT '',
  date_tag VARCHAR(50) NOT NULL DEFAULT '',
  image_path TEXT NOT NULL DEFAULT '',
  author_name VARCHAR(100) NOT NULL DEFAULT 'Advisory Research Desk',
  author_role VARCHAR(100) NOT NULL DEFAULT '',
  author_desk VARCHAR(100) NOT NULL DEFAULT 'Parmar Properties Research',
  key_takeaways TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  meta_title VARCHAR(120),
  meta_description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_insights_status ON insights_articles(status);
CREATE INDEX IF NOT EXISTS idx_insights_category ON insights_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights_articles(slug);

DROP TRIGGER IF EXISTS insights_articles_updated_at ON insights_articles;
CREATE TRIGGER insights_articles_updated_at
  BEFORE UPDATE ON insights_articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS article_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES insights_articles(id) ON DELETE CASCADE,
  section_order INTEGER NOT NULL DEFAULT 0,
  heading VARCHAR(150) NOT NULL,
  paragraphs TEXT[] NOT NULL DEFAULT '{}',
  table_data JSONB,
  highlight_quote TEXT
);

CREATE INDEX IF NOT EXISTS idx_article_sections_article
  ON article_sections(article_id, section_order);

-- ------------------------------------------------------------
-- 5. Extend leads with commercial / article FKs
-- ------------------------------------------------------------

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS commercial_id UUID REFERENCES commercial_properties(id) ON DELETE SET NULL;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS article_id UUID REFERENCES insights_articles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_commercial ON leads(commercial_id);
CREATE INDEX IF NOT EXISTS idx_leads_article ON leads(article_id);

-- ------------------------------------------------------------
-- 6. RLS
-- ------------------------------------------------------------

ALTER TABLE lookup_commercial_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup_commercial_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE commercial_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_sections ENABLE ROW LEVEL SECURITY;

-- Lookups: public read active; admin manage
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'lookup_commercial_hubs',
    'lookup_commercial_grades',
    'lookup_amenities',
    'lookup_locations'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_public_read', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin())',
      t || '_public_read', t
    );
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
      t || '_admin_all', t
    );
  END LOOP;
END $$;

DROP POLICY IF EXISTS "site_branding_public_read" ON site_branding;
CREATE POLICY "site_branding_public_read"
  ON site_branding FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "site_branding_admin_update" ON site_branding;
CREATE POLICY "site_branding_admin_update"
  ON site_branding FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "commercial_public_read" ON commercial_properties;
CREATE POLICY "commercial_public_read"
  ON commercial_properties FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "commercial_admin_all" ON commercial_properties;
CREATE POLICY "commercial_admin_all"
  ON commercial_properties FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "insights_public_read" ON insights_articles;
CREATE POLICY "insights_public_read"
  ON insights_articles FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "insights_admin_all" ON insights_articles;
CREATE POLICY "insights_admin_all"
  ON insights_articles FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "article_sections_public_read" ON article_sections;
CREATE POLICY "article_sections_public_read"
  ON article_sections FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM insights_articles a
      WHERE a.id = article_id
        AND (a.status = 'published' OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "article_sections_admin_all" ON article_sections;
CREATE POLICY "article_sections_admin_all"
  ON article_sections FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------
-- 7. Privileges
-- ------------------------------------------------------------

GRANT SELECT ON
  lookup_commercial_hubs,
  lookup_commercial_grades,
  lookup_amenities,
  lookup_locations,
  site_branding,
  commercial_properties,
  insights_articles,
  article_sections
TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  lookup_commercial_hubs,
  lookup_commercial_grades,
  lookup_amenities,
  lookup_locations,
  commercial_properties,
  insights_articles,
  article_sections
TO authenticated;

GRANT SELECT, UPDATE ON site_branding TO authenticated;
