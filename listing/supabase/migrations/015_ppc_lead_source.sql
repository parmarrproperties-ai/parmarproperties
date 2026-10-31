-- Lead source for the Google PPC landing pages (/<slug>/project). Idempotent.
INSERT INTO public.lookup_lead_sources (slug, name, display_order)
SELECT 'google_ppc_landing', 'Google PPC Landing Page', 10
WHERE NOT EXISTS (SELECT 1 FROM public.lookup_lead_sources WHERE slug = 'google_ppc_landing');
