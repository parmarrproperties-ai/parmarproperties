-- ============================================================
-- 014_listing_fixes.sql
--
-- 1. properties.price_on_request: per-listing switch. When true the public
--    site shows "Price on Request" instead of the numeric price.
-- 2. New catalogue options: property type "Apartment", construction status
--    "Ready (OC received)".
-- 3. Editorial micro-market page for Mahalaxmi, as an unpublished draft so
--    the owner can write its content (nothing public until published).
-- Idempotent: safe to run twice.
-- ============================================================

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_on_request boolean NOT NULL DEFAULT false;

INSERT INTO public.lookup_property_types (slug, name, display_order)
SELECT 'apartment', 'Apartment', 5
WHERE NOT EXISTS (SELECT 1 FROM public.lookup_property_types WHERE slug = 'apartment');

INSERT INTO public.lookup_construction_status (slug, name, display_order)
SELECT 'ready-oc-received', 'Ready (OC received)', 5
WHERE NOT EXISTS (SELECT 1 FROM public.lookup_construction_status WHERE slug = 'ready-oc-received');

INSERT INTO public.locations (name, slug, city, is_active, publication_status, sort_order)
SELECT 'Mahalaxmi', 'mahalaxmi', 'Mumbai', false, 'draft', 20
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE slug = 'mahalaxmi');
