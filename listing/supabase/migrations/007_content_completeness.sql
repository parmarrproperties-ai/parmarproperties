-- ============================================================
-- 007_content_completeness.sql
-- Closes remaining MASTER_BACKEND_SPEC / content-attribute gaps
-- without duplicating tables introduced in 004–006.
--
-- SAFE / ADDITIVE:
--   * Does NOT drop tables or columns
--   * Does NOT rewrite prior migrations
--   * Preserves existing production data
--
-- Run AFTER 006_evolve_properties_locations.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 1. properties — luxury collection editorial flag
--    Spec: isLuxuryCollection (CONTENT ATTRIBUTES §3.1).
--    Luxury tab also derives from price ≥ ₹25 Cr; this flag lets
--    admins include sub-threshold trophy assets editorially.
-- ------------------------------------------------------------

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS is_luxury_collection BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_properties_luxury_collection
  ON properties(is_luxury_collection)
  WHERE is_luxury_collection = true;

-- Backfill from master price threshold (₹25 Cr)
UPDATE properties
SET is_luxury_collection = true
WHERE is_luxury_collection = false
  AND price IS NOT NULL
  AND price >= 25;

-- ------------------------------------------------------------
-- 2. lookup_bhk — 2 BHK option (used by property_configurations)
-- ------------------------------------------------------------

INSERT INTO lookup_bhk (slug, name, display_order) VALUES
  ('2-bhk', '2 BHK', 0)
ON CONFLICT (slug) DO NOTHING;

-- Shift "any" to stay first if present; leave other rows alone.
UPDATE lookup_bhk SET display_order = -1 WHERE slug = 'any';

-- ------------------------------------------------------------
-- 3. Lookup tables from 005 — add standard audit columns where missing
-- ------------------------------------------------------------

ALTER TABLE lookup_commercial_hubs
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE lookup_commercial_grades
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE lookup_amenities
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE lookup_locations
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
DECLARE
  target text;
BEGIN
  FOREACH target IN ARRAY ARRAY[
    'lookup_commercial_hubs',
    'lookup_commercial_grades',
    'lookup_amenities',
    'lookup_locations'
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
-- 4. commercial_properties — ensure SEO columns exist (idempotent)
-- ------------------------------------------------------------

ALTER TABLE commercial_properties
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(120),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(255);

-- ------------------------------------------------------------
-- 5. insights_articles — ensure SEO + sort columns exist (idempotent)
-- ------------------------------------------------------------

ALTER TABLE insights_articles
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(120),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(255),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- ------------------------------------------------------------
-- 6. article_sections — audit timestamps for Admin edit tracking
-- ------------------------------------------------------------

ALTER TABLE article_sections
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS article_sections_updated_at ON article_sections;
CREATE TRIGGER article_sections_updated_at
  BEFORE UPDATE ON article_sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- Done. No derived values (formatted price, read time, counts) stored.
-- ------------------------------------------------------------
