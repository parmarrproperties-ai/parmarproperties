-- ============================================================
-- 008_property_configuration_price_breakdowns.sql
-- Master Configuration Matrix cost-sheet lines.
--
-- Legacy `price_breakdowns` remains attached to `configurations`.
-- This table attaches the same label/amount/order concept to
-- `property_configurations` for the public Configuration Matrix.
--
-- SAFE / ADDITIVE:
--   * Does NOT alter legacy price_breakdowns or configurations
--   * Does NOT migrate legacy rows automatically
--
-- Run AFTER 007_content_completeness.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS property_configuration_price_breakdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID NOT NULL
    REFERENCES property_configurations(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_pc_price_breakdowns_config
  ON property_configuration_price_breakdowns(configuration_id, display_order);

DROP TRIGGER IF EXISTS property_configuration_price_breakdowns_audit
  ON property_configuration_price_breakdowns;
CREATE TRIGGER property_configuration_price_breakdowns_audit
  BEFORE INSERT OR UPDATE ON property_configuration_price_breakdowns
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

ALTER TABLE property_configuration_price_breakdowns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pc_price_breakdowns_public_read"
  ON property_configuration_price_breakdowns;
CREATE POLICY "pc_price_breakdowns_public_read"
  ON property_configuration_price_breakdowns
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM property_configurations pc
      JOIN properties p ON p.id = pc.property_id
      WHERE pc.id = configuration_id
        AND (
          (p.publication_status = 'published' AND p.deleted_at IS NULL)
          OR public.is_admin()
        )
    )
  );

DROP POLICY IF EXISTS "pc_price_breakdowns_admin_all"
  ON property_configuration_price_breakdowns;
CREATE POLICY "pc_price_breakdowns_admin_all"
  ON property_configuration_price_breakdowns
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON property_configuration_price_breakdowns TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON property_configuration_price_breakdowns TO authenticated;
