-- 018: commercial listings belong to a location and a deal type.
--
-- Public location pages split every location into Residential (Buy, New Launches,
-- Luxury Collection) and Commercial (Buy, Pre-Lease, Rent). Commercial listings now
-- use the same location list as residential ones (lookup_locations) and carry a
-- deal type. The old "hub" column is kept but no longer required.

ALTER TABLE public.commercial_properties
  ADD COLUMN IF NOT EXISTS lookup_location_id uuid REFERENCES public.lookup_locations(id),
  ADD COLUMN IF NOT EXISTS deal_type text NOT NULL DEFAULT 'buy';

ALTER TABLE public.commercial_properties
  DROP CONSTRAINT IF EXISTS commercial_properties_deal_type_check;
ALTER TABLE public.commercial_properties
  ADD CONSTRAINT commercial_properties_deal_type_check
  CHECK (deal_type IN ('buy', 'pre_lease', 'rent'));

ALTER TABLE public.commercial_properties ALTER COLUMN hub_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS commercial_properties_location_deal_idx
  ON public.commercial_properties (lookup_location_id, deal_type)
  WHERE status = 'published';
