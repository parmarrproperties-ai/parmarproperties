-- Parmar Properties Admin CMS — Initial Schema
-- Source of truth for all editable website/property content

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE property_status AS ENUM (
  'active',
  'inactive',
  'sold_out',
  'upcoming',
  'ready_to_move',
  'under_construction'
);

CREATE TYPE property_type AS ENUM (
  'apartment',
  'villa',
  'penthouse',
  'plot',
  'commercial',
  'duplex',
  'other'
);

CREATE TYPE availability_status AS ENUM (
  'available',
  'limited',
  'sold_out',
  'coming_soon'
);

CREATE TYPE floor_plan_type AS ENUM (
  'floor_plan',
  'master_plan',
  'configuration_plan'
);

CREATE TYPE inventory_status AS ENUM (
  'available',
  'booked',
  'hold',
  'sold'
);

-- ============================================================
-- PROFILES (admins)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = COALESCE(NEW.created_by, auth.uid());
  END IF;
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'super_admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;

-- ============================================================
-- SETTINGS (singleton-style key/value business settings)
-- ============================================================

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- HERO SLIDES
-- ============================================================

CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL,
  supporting_text TEXT,
  cta_label TEXT,
  cta_url TEXT,
  image_path TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_hero_slides_order ON hero_slides(display_order);
CREATE INDEX idx_hero_slides_active ON hero_slides(is_active);

CREATE TRIGGER hero_slides_audit
  BEFORE INSERT OR UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- LOCATIONS
-- ============================================================

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  city TEXT,
  image_path TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_locations_order ON locations(display_order);
CREATE INDEX idx_locations_active ON locations(is_active);

CREATE TRIGGER locations_audit
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- MARKET INTELLIGENCE
-- ============================================================

CREATE TABLE market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  description TEXT,
  change_percentage NUMERIC(10, 2),
  source TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_market_intelligence_order ON market_intelligence(display_order);

CREATE TRIGGER market_intelligence_audit
  BEFORE INSERT OR UPDATE ON market_intelligence
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- PROPERTIES
-- ============================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  property_type property_type NOT NULL DEFAULT 'apartment',
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  location_name TEXT,
  city TEXT,
  locality TEXT,
  location_details TEXT,
  tagline TEXT,
  description TEXT,
  project_overview TEXT,
  project_details TEXT,
  developer_name TEXT,
  developer_description TEXT,
  price_amount NUMERIC(14, 2),
  price_display TEXT,
  bhk TEXT,
  carpet_area TEXT,
  possession TEXT,
  availability availability_status NOT NULL DEFAULT 'available',
  status property_status NOT NULL DEFAULT 'active',
  rera_number TEXT,
  rera_qr_path TEXT,
  rera_qr_url TEXT,
  brochure_path TEXT,
  brochure_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  featured_order INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  google_maps_url TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(is_featured, featured_order);
CREATE INDEX idx_properties_active ON properties(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_name ON properties(name);
CREATE INDEX idx_properties_updated ON properties(updated_at DESC);

CREATE TRIGGER properties_audit
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- PROPERTY IMAGES
-- ============================================================

CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_property_images_property ON property_images(property_id, display_order);

CREATE TRIGGER property_images_audit
  BEFORE INSERT OR UPDATE ON property_images
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- CONFIGURATIONS
-- ============================================================

CREATE TABLE configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bhk TEXT,
  variant TEXT,
  carpet_area TEXT,
  possession TEXT,
  price NUMERIC(14, 2),
  price_display TEXT,
  availability availability_status NOT NULL DEFAULT 'available',
  status TEXT NOT NULL DEFAULT 'active',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_configurations_property ON configurations(property_id, display_order);

CREATE TRIGGER configurations_audit
  BEFORE INSERT OR UPDATE ON configurations
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- PRICE BREAKDOWNS
-- ============================================================

CREATE TABLE price_breakdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_price_breakdowns_config ON price_breakdowns(configuration_id, display_order);

CREATE TRIGGER price_breakdowns_audit
  BEFORE INSERT OR UPDATE ON price_breakdowns
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- FLOOR PLANS
-- ============================================================

CREATE TABLE floor_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  configuration_id UUID REFERENCES configurations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  plan_type floor_plan_type NOT NULL DEFAULT 'floor_plan',
  image_path TEXT,
  image_url TEXT,
  file_path TEXT,
  file_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_floor_plans_property ON floor_plans(property_id, display_order);

CREATE TRIGGER floor_plans_audit
  BEFORE INSERT OR UPDATE ON floor_plans
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- AMENITIES (reusable catalog)
-- ============================================================

CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE TABLE property_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, amenity_id)
);

CREATE INDEX idx_property_amenities_property ON property_amenities(property_id, display_order);

-- ============================================================
-- INVENTORY UNITS
-- ============================================================

CREATE TABLE inventory_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  configuration_id UUID REFERENCES configurations(id) ON DELETE SET NULL,
  unit_number TEXT NOT NULL,
  floor TEXT,
  facing TEXT,
  price NUMERIC(14, 2),
  status inventory_status NOT NULL DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_inventory_property ON inventory_units(property_id);
CREATE INDEX idx_inventory_status ON inventory_units(status);

CREATE TRIGGER inventory_units_audit
  BEFORE INSERT OR UPDATE ON inventory_units
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_breakdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_units ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Admins can view profiles"
  ON profiles FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (is_admin());

-- Public read for active content (for future public website — Step 2)
-- Admin write for authenticated admins

CREATE POLICY "Public read active hero"
  ON hero_slides FOR SELECT TO anon, authenticated
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins manage hero"
  ON hero_slides FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read active locations"
  ON locations FOR SELECT TO anon, authenticated
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins manage locations"
  ON locations FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read active market intel"
  ON market_intelligence FOR SELECT TO anon, authenticated
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins manage market intel"
  ON market_intelligence FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read active properties"
  ON properties FOR SELECT TO anon, authenticated
  USING ((is_active = true AND deleted_at IS NULL) OR is_admin());

CREATE POLICY "Admins manage properties"
  ON properties FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read property images"
  ON property_images FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND ((p.is_active = true AND p.deleted_at IS NULL) OR is_admin())
    )
  );

CREATE POLICY "Admins manage property images"
  ON property_images FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read configurations"
  ON configurations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND ((p.is_active = true AND p.deleted_at IS NULL) OR is_admin())
    )
  );

CREATE POLICY "Admins manage configurations"
  ON configurations FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read price breakdowns"
  ON price_breakdowns FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM configurations c
      JOIN properties p ON p.id = c.property_id
      WHERE c.id = configuration_id
        AND ((p.is_active = true AND p.deleted_at IS NULL) OR is_admin())
    )
  );

CREATE POLICY "Admins manage price breakdowns"
  ON price_breakdowns FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read floor plans"
  ON floor_plans FOR SELECT TO anon, authenticated
  USING (
    (is_active = true AND EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND p.is_active = true AND p.deleted_at IS NULL
    )) OR is_admin()
  );

CREATE POLICY "Admins manage floor plans"
  ON floor_plans FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read amenities"
  ON amenities FOR SELECT TO anon, authenticated
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins manage amenities"
  ON amenities FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read property amenities"
  ON property_amenities FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND ((p.is_active = true AND p.deleted_at IS NULL) OR is_admin())
    )
  );

CREATE POLICY "Admins manage property amenities"
  ON property_amenities FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins manage inventory"
  ON inventory_units FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins read inventory"
  ON inventory_units FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Public read settings"
  ON site_settings FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage settings"
  ON site_settings FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or storage API)
-- ============================================================
-- Buckets to create:
--   media (public read, admin write)
-- Paths:
--   hero/
--   locations/
--   properties/{property_id}/images/
--   properties/{property_id}/floor-plans/
--   properties/{property_id}/brochure/
--   properties/{property_id}/rera/
