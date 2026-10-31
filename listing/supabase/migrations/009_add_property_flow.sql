-- ============================================================
-- 009_add_property_flow.sql
-- Supports the updated Admin Add Property workflow:
--   * property_configurations.variant_code includes 1bhk
--   * property_amenities.custom_label for property-exclusive amenities
--   * lookup_bhk gains a 1 BHK catalogue row
--
-- SAFE / ADDITIVE:
--   * Does NOT drop tables or columns
--   * Does NOT rewrite prior migrations
--   * Preserves existing production data
--
-- Run AFTER 008_property_configuration_price_breakdowns.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 1. property_configurations — allow 1 BHK variants
-- ------------------------------------------------------------

ALTER TABLE property_configurations
  DROP CONSTRAINT IF EXISTS property_configurations_variant_code_check;

ALTER TABLE property_configurations
  ADD CONSTRAINT property_configurations_variant_code_check
  CHECK (variant_code IN ('1bhk', '2bhk', '3bhk', '4bhk', '5bhk', 'custom'));

-- ------------------------------------------------------------
-- 2. property_amenities — property-specific exclusive labels
--    Exclusive amenities are stored only on the property link row
--    and must NOT become lookup_amenities catalogue entries.
-- ------------------------------------------------------------

ALTER TABLE property_amenities
  ADD COLUMN IF NOT EXISTS custom_label VARCHAR(120);

COMMENT ON COLUMN property_amenities.custom_label IS
  'Property-exclusive amenity label. When set, amenity_id and lookup_amenity_id stay null so the amenity is not added to the global catalogue.';

-- Row must identify an amenity somehow: lookup, legacy, or exclusive label.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'property_amenities_identity_check'
  ) THEN
    ALTER TABLE property_amenities
      ADD CONSTRAINT property_amenities_identity_check
      CHECK (
        lookup_amenity_id IS NOT NULL
        OR amenity_id IS NOT NULL
        OR (custom_label IS NOT NULL AND length(trim(custom_label)) > 0)
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_property_amenities_custom
  ON property_amenities(property_id)
  WHERE custom_label IS NOT NULL;

-- ------------------------------------------------------------
-- 3. lookup_bhk — ensure 1 BHK exists for property-level sync
-- ------------------------------------------------------------

INSERT INTO lookup_bhk (slug, name, display_order) VALUES
  ('1-bhk', '1 BHK', 0)
ON CONFLICT (slug) DO NOTHING;

UPDATE lookup_bhk SET display_order = -1 WHERE slug = 'any';
UPDATE lookup_bhk SET display_order = 0 WHERE slug = '1-bhk';
UPDATE lookup_bhk SET display_order = 1 WHERE slug = '2-bhk';
UPDATE lookup_bhk SET display_order = 2 WHERE slug = '3-bhk';
UPDATE lookup_bhk SET display_order = 3 WHERE slug = '4-bhk';
UPDATE lookup_bhk SET display_order = 4 WHERE slug = '5-bhk';
