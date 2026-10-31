-- ============================================================
-- 010_publication_status_rls.sql
-- Publication / RLS authority correction for residential properties.
--
-- GOAL:
--   Make properties.publication_status the canonical public-visibility
--   gate (with deleted_at), matching MASTER_BACKEND_SPEC §5.5 and the
--   policies already used by property_configurations /
--   property_configuration_price_breakdowns (006 / 008).
--
-- BEFORE (001):
--   Public SELECT on properties and most children required
--   parent.is_active = true AND parent.deleted_at IS NULL.
--
-- AFTER (this migration):
--   Public SELECT requires
--   parent.publication_status = 'published' AND parent.deleted_at IS NULL.
--
-- SAFE / SCOPED:
--   * Does NOT drop or alter the is_active column
--   * Does NOT change application dual-write logic
--   * Does NOT edit migrations 001–009
--   * Drops/recreates only the relevant public SELECT policies
--   * Leaves admin FOR ALL / admin SELECT policies untouched
--   * Does NOT open INSERT/UPDATE/DELETE to anon
--   * Leaves lookup catalogues, amenities catalogue, locations editorial
--     RLS, inventory (admin-only), and storage policies unchanged
--
-- ALREADY CORRECT (left unchanged):
--   * property_configurations_public_read (006)
--   * pc_price_breakdowns_public_read (008)
--
-- Run AFTER 009_add_property_flow.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 1. properties — public SELECT
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public read active properties" ON public.properties;
CREATE POLICY "Public read active properties"
  ON public.properties
  FOR SELECT
  TO anon, authenticated
  USING (
    (publication_status = 'published' AND deleted_at IS NULL)
    OR public.is_admin()
  );

-- Admin manage policy intentionally unchanged:
--   "Admins manage properties" FOR ALL TO authenticated

-- ------------------------------------------------------------
-- 2. property_images — public SELECT via parent property
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public read property images" ON public.property_images;
CREATE POLICY "Public read property images"
  ON public.property_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.properties p
      WHERE p.id = property_id
        AND (
          (p.publication_status = 'published' AND p.deleted_at IS NULL)
          OR public.is_admin()
        )
    )
  );

-- ------------------------------------------------------------
-- 3. configurations (legacy) — public SELECT via parent property
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public read configurations" ON public.configurations;
CREATE POLICY "Public read configurations"
  ON public.configurations
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.properties p
      WHERE p.id = property_id
        AND (
          (p.publication_status = 'published' AND p.deleted_at IS NULL)
          OR public.is_admin()
        )
    )
  );

-- ------------------------------------------------------------
-- 4. price_breakdowns (legacy) — public SELECT via configurations → properties
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public read price breakdowns" ON public.price_breakdowns;
CREATE POLICY "Public read price breakdowns"
  ON public.price_breakdowns
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.configurations c
      JOIN public.properties p ON p.id = c.property_id
      WHERE c.id = configuration_id
        AND (
          (p.publication_status = 'published' AND p.deleted_at IS NULL)
          OR public.is_admin()
        )
    )
  );

-- ------------------------------------------------------------
-- 5. floor_plans — public SELECT via parent property
--    Keeps floor_plans.is_active as the plan-row active flag
--    (this is NOT properties.is_active).
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public read floor plans" ON public.floor_plans;
CREATE POLICY "Public read floor plans"
  ON public.floor_plans
  FOR SELECT
  TO anon, authenticated
  USING (
    (
      is_active = true
      AND EXISTS (
        SELECT 1
        FROM public.properties p
        WHERE p.id = property_id
          AND p.publication_status = 'published'
          AND p.deleted_at IS NULL
      )
    )
    OR public.is_admin()
  );

-- ------------------------------------------------------------
-- 6. property_amenities — public SELECT via parent property
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public read property amenities" ON public.property_amenities;
CREATE POLICY "Public read property amenities"
  ON public.property_amenities
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.properties p
      WHERE p.id = property_id
        AND (
          (p.publication_status = 'published' AND p.deleted_at IS NULL)
          OR public.is_admin()
        )
    )
  );

-- ------------------------------------------------------------
-- Intentionally unchanged in this migration
-- ------------------------------------------------------------
-- property_configurations_public_read
--   Already: parent publication_status = 'published' AND deleted_at IS NULL
-- pc_price_breakdowns_public_read
--   Already: same parent publication gate via property_configurations → properties
-- Admins manage * / *_admin_all on all property tables
--   Authenticated admin write path preserved
-- Admins manage inventory / Admins read inventory
--   No public SELECT; not a public listing surface
-- Public read amenities (catalogue amenities.is_active)
--   Catalogue visibility, not property publication
-- locations / lookup_* / storage / leads / commercial / insights
--   Out of scope for this properties publication-authority fix
