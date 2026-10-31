-- ============================================================
-- 006_evolve_properties_locations.sql
-- Phase 4–5: Additive evolution toward MASTER_BACKEND_SPEC
--
-- SAFE:
--   * Does NOT drop tables or columns
--   * Does NOT recreate the database
--   * Does NOT change/remove existing FKs on location_id → locations
--   * Backfills master columns from legacy data where mapping is clear
--
-- NOTE on naming conflicts with legacy columns:
--   * Master `carpet_area` (INTEGER) → column `carpet_area_sqft`
--     (legacy `carpet_area` TEXT is preserved)
--   * Master publication `status` → column `publication_status`
--     (legacy enum `status` / `is_active` preserved)
--   * Master location FK to lookup_locations → `lookup_location_id`
--     (legacy `location_id` → locations preserved)
--
-- Run AFTER 003, 004, 005.
-- ============================================================

-- ------------------------------------------------------------
-- 1. properties — add master columns
-- ------------------------------------------------------------

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS title VARCHAR(150),
  ADD COLUMN IF NOT EXISTS sub_location VARCHAR(150),
  ADD COLUMN IF NOT EXISTS price NUMERIC(6, 2),
  ADD COLUMN IF NOT EXISTS bhk_id UUID REFERENCES lookup_bhk(id),
  ADD COLUMN IF NOT EXISTS carpet_area_sqft INTEGER,
  ADD COLUMN IF NOT EXISTS super_area INTEGER,
  ADD COLUMN IF NOT EXISTS property_type_id UUID REFERENCES lookup_property_types(id),
  ADD COLUMN IF NOT EXISTS status_id UUID REFERENCES lookup_construction_status(id),
  ADD COLUMN IF NOT EXISTS possession_date VARCHAR(50),
  ADD COLUMN IF NOT EXISTS floor VARCHAR(80),
  ADD COLUMN IF NOT EXISTS recently_added BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new_launch BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS launch_phase_id UUID REFERENCES lookup_construction_status(id),
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS rera_id VARCHAR(50),
  ADD COLUMN IF NOT EXISTS rera_qr_image TEXT,
  ADD COLUMN IF NOT EXISTS highlights TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS publication_status VARCHAR(20) NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(120),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(255),
  ADD COLUMN IF NOT EXISTS lookup_location_id UUID REFERENCES lookup_locations(id);

-- publication_status check (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'properties_publication_status_check'
  ) THEN
    ALTER TABLE properties
      ADD CONSTRAINT properties_publication_status_check
      CHECK (publication_status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Optional positive checks (only when values present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'properties_price_positive'
  ) THEN
    ALTER TABLE properties
      ADD CONSTRAINT properties_price_positive
      CHECK (price IS NULL OR price > 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'properties_carpet_sqft_positive'
  ) THEN
    ALTER TABLE properties
      ADD CONSTRAINT properties_carpet_sqft_positive
      CHECK (carpet_area_sqft IS NULL OR carpet_area_sqft > 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'properties_super_area_positive'
  ) THEN
    ALTER TABLE properties
      ADD CONSTRAINT properties_super_area_positive
      CHECK (super_area IS NULL OR super_area > 0);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_properties_publication
  ON properties(publication_status);
CREATE INDEX IF NOT EXISTS idx_properties_new_launch
  ON properties(is_new_launch) WHERE is_new_launch = true;
CREATE INDEX IF NOT EXISTS idx_properties_price
  ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_lookup_location
  ON properties(lookup_location_id);
CREATE INDEX IF NOT EXISTS idx_properties_sort
  ON properties(sort_order);

-- ------------------------------------------------------------
-- 2. Backfill properties from legacy columns
-- ------------------------------------------------------------

-- title ← name
UPDATE properties
SET title = LEFT(name, 150)
WHERE title IS NULL AND name IS NOT NULL AND name <> '';

-- sub_location ← locality, else location_details, else location_name
UPDATE properties
SET sub_location = LEFT(
  COALESCE(NULLIF(locality, ''), NULLIF(location_details, ''), NULLIF(location_name, ''), ''),
  150
)
WHERE sub_location IS NULL
  AND COALESCE(locality, location_details, location_name) IS NOT NULL;

-- price (₹ Cr): if price_amount looks like absolute rupees (> 1000), convert; else treat as Cr
UPDATE properties
SET price = CASE
  WHEN price_amount IS NULL THEN NULL
  WHEN price_amount > 1000 THEN ROUND((price_amount / 10000000.0)::numeric, 2)
  ELSE ROUND(price_amount::numeric, 2)
END
WHERE price IS NULL AND price_amount IS NOT NULL AND price_amount > 0;

-- carpet_area_sqft ← parse digits from legacy carpet_area text
UPDATE properties
SET carpet_area_sqft = NULLIF(
  regexp_replace(COALESCE(carpet_area, ''), '[^0-9]', '', 'g'),
  ''
)::integer
WHERE carpet_area_sqft IS NULL
  AND carpet_area IS NOT NULL
  AND regexp_replace(carpet_area, '[^0-9]', '', 'g') <> '';

-- possession_date ← possession
UPDATE properties
SET possession_date = LEFT(possession, 50)
WHERE possession_date IS NULL AND possession IS NOT NULL AND possession <> '';

-- rera_id ← rera_number
UPDATE properties
SET rera_id = LEFT(rera_number, 50)
WHERE (rera_id IS NULL OR rera_id = '')
  AND rera_number IS NOT NULL
  AND rera_number <> '';

-- rera_qr_image ← rera_qr_url
UPDATE properties
SET rera_qr_image = rera_qr_url
WHERE rera_qr_image IS NULL AND rera_qr_url IS NOT NULL AND rera_qr_url <> '';

-- publication_status from legacy is_active / status / deleted_at
UPDATE properties
SET publication_status = CASE
  WHEN deleted_at IS NOT NULL THEN 'archived'
  WHEN is_active = false OR status = 'inactive' THEN 'draft'
  ELSE 'published'
END
WHERE publication_status = 'published'
  AND (
    deleted_at IS NOT NULL
    OR is_active = false
    OR status = 'inactive'
  );

-- cover_image ← primary property image url
UPDATE properties p
SET cover_image = img.url
FROM (
  SELECT DISTINCT ON (property_id) property_id, url
  FROM property_images
  ORDER BY property_id, is_primary DESC, display_order ASC, created_at ASC
) img
WHERE p.id = img.property_id
  AND (p.cover_image IS NULL OR p.cover_image = '');

-- bhk_id ← match lookup_bhk by normalized legacy bhk text (one row max)
UPDATE properties p
SET bhk_id = matched.id
FROM (
  SELECT DISTINCT ON (p2.id) p2.id AS property_id, lb.id
  FROM properties p2
  JOIN lookup_bhk lb ON (
    lower(replace(COALESCE(p2.bhk, ''), ' ', '')) = lower(replace(lb.name, ' ', ''))
    OR (lb.slug = '3-bhk' AND p2.bhk ~* '3\s*bhk')
    OR (lb.slug = '4-bhk' AND p2.bhk ~* '4\s*bhk')
    OR (lb.slug = '5-bhk' AND p2.bhk ~* '5\s*bhk')
    OR (lb.slug = '6-plus-bhk' AND p2.bhk ~* '(6\+|6\s*bhk|7\s*bhk|penthouse)')
    OR (lb.slug = '2-bhk' AND p2.bhk ~* '2\s*bhk')
  )
  WHERE p2.bhk_id IS NULL AND p2.bhk IS NOT NULL
  ORDER BY p2.id, lb.display_order
) matched
WHERE p.id = matched.property_id AND p.bhk_id IS NULL;

-- property_type_id ← map legacy enum to nearest lookup slug (one row max)
UPDATE properties p
SET property_type_id = matched.id
FROM (
  SELECT DISTINCT ON (p2.id) p2.id AS property_id, lpt.id
  FROM properties p2
  JOIN lookup_property_types lpt ON (
    (p2.property_type = 'penthouse' AND lpt.slug = 'penthouse')
    OR (p2.property_type = 'duplex' AND lpt.slug = 'duplex')
    OR (p2.property_type = 'villa' AND lpt.slug = 'sky-villa')
    OR (p2.property_type IN ('apartment', 'other', 'plot', 'commercial') AND lpt.slug = 'sea-facing-apartment')
  )
  WHERE p2.property_type_id IS NULL
  ORDER BY p2.id, lpt.display_order
) matched
WHERE p.id = matched.property_id AND p.property_type_id IS NULL;

-- status_id ← map legacy status / availability (one row max)
UPDATE properties p
SET status_id = matched.id
FROM (
  SELECT DISTINCT ON (p2.id) p2.id AS property_id, lcs.id
  FROM properties p2
  JOIN lookup_construction_status lcs ON (
    (p2.status = 'ready_to_move' AND lcs.slug = 'ready-to-move')
    OR (p2.status = 'under_construction' AND lcs.slug = 'under-construction')
    OR (p2.status = 'upcoming' AND lcs.slug = 'pre-launch')
    OR (p2.availability = 'coming_soon' AND lcs.slug = 'pre-launch')
    OR (p2.status IN ('active', 'inactive', 'sold_out') AND lcs.slug = 'ready-to-move')
  )
  WHERE p2.status_id IS NULL
  ORDER BY p2.id, lcs.display_order
) matched
WHERE p.id = matched.property_id AND p.status_id IS NULL;

-- lookup_location_id ← match lookup_locations by name (one row max)
UPDATE properties p
SET lookup_location_id = matched.id
FROM (
  SELECT DISTINCT ON (p2.id) p2.id AS property_id, ll.id
  FROM properties p2
  JOIN lookup_locations ll ON (
    lower(COALESCE(p2.location_name, '')) = lower(ll.name)
    OR lower(COALESCE(p2.locality, '')) = lower(ll.name)
    OR lower(COALESCE(p2.city, '')) = lower(ll.name)
  )
  WHERE p2.lookup_location_id IS NULL
  ORDER BY p2.id, ll.display_order
) matched
WHERE p.id = matched.property_id AND p.lookup_location_id IS NULL;

-- is_new_launch from legacy upcoming / under_construction
UPDATE properties
SET is_new_launch = true
WHERE is_new_launch = false
  AND status IN ('upcoming', 'under_construction');

-- ------------------------------------------------------------
-- 3. property_configurations (master C.3) — NEW table only
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS property_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  plan_type VARCHAR(30) NOT NULL
    CHECK (plan_type IN ('master', 'floor', 'individual')),
  variant_code VARCHAR(20) NOT NULL
    CHECK (variant_code IN ('2bhk', '3bhk', '4bhk', '5bhk', 'custom')),
  tab_label VARCHAR(30) NOT NULL,
  title VARCHAR(100) NOT NULL,
  area_range VARCHAR(60) NOT NULL DEFAULT '',
  carpet_area VARCHAR(50) NOT NULL DEFAULT '',
  price_indicator VARCHAR(60) NOT NULL DEFAULT '',
  tower_zone VARCHAR(100) NOT NULL DEFAULT '',
  image_path TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_configurations_property
  ON property_configurations(property_id, display_order);

DROP TRIGGER IF EXISTS property_configurations_updated_at ON property_configurations;
CREATE TRIGGER property_configurations_updated_at
  BEFORE UPDATE ON property_configurations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE property_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "property_configurations_public_read" ON property_configurations;
CREATE POLICY "property_configurations_public_read"
  ON property_configurations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND (
          (p.publication_status = 'published' AND p.deleted_at IS NULL)
          OR public.is_admin()
        )
    )
  );

DROP POLICY IF EXISTS "property_configurations_admin_all" ON property_configurations;
CREATE POLICY "property_configurations_admin_all"
  ON property_configurations FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON property_configurations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON property_configurations TO authenticated;

-- Optional backfill: copy simple legacy configurations → property_configurations
-- only when the master table has none for that property yet.
INSERT INTO property_configurations (
  property_id, plan_type, variant_code, tab_label, title,
  area_range, carpet_area, price_indicator, tower_zone, image_path, display_order
)
SELECT
  c.property_id,
  'individual',
  CASE
    WHEN c.bhk ~* '2' THEN '2bhk'
    WHEN c.bhk ~* '3' THEN '3bhk'
    WHEN c.bhk ~* '4' THEN '4bhk'
    WHEN c.bhk ~* '5' THEN '5bhk'
    ELSE 'custom'
  END,
  COALESCE(NULLIF(c.name, ''), COALESCE(c.bhk, 'Config')),
  COALESCE(NULLIF(c.name, ''), COALESCE(c.bhk, 'Configuration')),
  COALESCE(c.carpet_area, ''),
  COALESCE(c.carpet_area, ''),
  COALESCE(c.price_display, CASE WHEN c.price IS NOT NULL THEN '₹' || c.price::text ELSE '' END),
  COALESCE(c.variant, ''),
  '',
  c.display_order
FROM configurations c
WHERE NOT EXISTS (
  SELECT 1 FROM property_configurations pc WHERE pc.property_id = c.property_id
);

-- ------------------------------------------------------------
-- 4. property_amenities — additive link to lookup_amenities
-- ------------------------------------------------------------

ALTER TABLE property_amenities
  ADD COLUMN IF NOT EXISTS lookup_amenity_id UUID REFERENCES lookup_amenities(id);

-- Allow legacy amenity_id to be null for rows that only use lookup_amenity_id
ALTER TABLE property_amenities
  ALTER COLUMN amenity_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_property_amenities_lookup
  ON property_amenities(lookup_amenity_id);

-- ------------------------------------------------------------
-- 5. locations — add master micro-market columns
-- ------------------------------------------------------------

ALTER TABLE locations
  ADD COLUMN IF NOT EXISTS slug VARCHAR(80),
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS price_range VARCHAR(50),
  ADD COLUMN IF NOT EXISTS average_rate VARCHAR(60),
  ADD COLUMN IF NOT EXISTS lifestyle VARCHAR(200),
  ADD COLUMN IF NOT EXISTS key_enclaves TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_primary_home BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS primary_order SMALLINT,
  ADD COLUMN IF NOT EXISTS is_future BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS future_order SMALLINT,
  ADD COLUMN IF NOT EXISTS publication_status VARCHAR(20) NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(120),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(255),
  ADD COLUMN IF NOT EXISTS lookup_location_id UUID REFERENCES lookup_locations(id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'locations_publication_status_check'
  ) THEN
    ALTER TABLE locations
      ADD CONSTRAINT locations_publication_status_check
      CHECK (publication_status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Unique slug when present
CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_slug_unique
  ON locations(slug)
  WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_locations_publication
  ON locations(publication_status);
CREATE INDEX IF NOT EXISTS idx_locations_primary_home
  ON locations(is_primary_home, primary_order);
CREATE INDEX IF NOT EXISTS idx_locations_future
  ON locations(is_future, future_order);

-- Backfill slug from name
UPDATE locations
SET slug = lower(regexp_replace(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL AND name IS NOT NULL AND name <> '';

-- Deduplicate slugs if collision (append short id)
UPDATE locations l
SET slug = l.slug || '-' || substr(replace(l.id::text, '-', ''), 1, 6)
WHERE l.slug IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM locations o
    WHERE o.slug = l.slug AND o.id <> l.id AND o.ctid < l.ctid
  );

-- cover_image ← image_url
UPDATE locations
SET cover_image = image_url
WHERE (cover_image IS NULL OR cover_image = '')
  AND image_url IS NOT NULL
  AND image_url <> '';

-- publication_status from is_active
UPDATE locations
SET publication_status = CASE WHEN is_active THEN 'published' ELSE 'draft' END
WHERE publication_status = 'published' AND is_active = false;

-- sort_order ← display_order
UPDATE locations
SET sort_order = display_order
WHERE sort_order = 0 AND display_order <> 0;

-- lookup_location_id by name match
UPDATE locations loc
SET lookup_location_id = ll.id
FROM lookup_locations ll
WHERE loc.lookup_location_id IS NULL
  AND lower(loc.name) = lower(ll.name);

-- ------------------------------------------------------------
-- Done. Legacy columns and tables remain intact.
-- ------------------------------------------------------------
