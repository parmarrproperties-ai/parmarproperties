-- Parmar Properties Admin CMS — sample data
-- Run after 001_initial_schema.sql and 002_storage.sql.
-- Safe to run more than once: every insert is matched against a natural key
-- (slug, name, heading, title) so nothing is duplicated.
--
-- Images and documents are intentionally left empty. Upload them from the admin
-- so the files land in your own storage bucket.

BEGIN;

-- ============================================================
-- BUSINESS SETTINGS
-- ============================================================

INSERT INTO site_settings (key, value)
VALUES (
  'business',
  jsonb_build_object(
    'business_name', 'Parmar Properties',
    'phone', '+91 98765 43210',
    'email', 'sales@parmarproperties.com',
    'office_address', 'Ground Floor, Trident House, Baner Road, Pune 411045',
    'whatsapp', '+91 98765 43210',
    'currency', 'INR',
    'social_links', jsonb_build_object(
      'instagram', 'https://instagram.com/parmarproperties',
      'linkedin', 'https://linkedin.com/company/parmarproperties'
    )
  )
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================
-- AMENITIES CATALOG
-- ============================================================

INSERT INTO amenities (name, icon) VALUES
  ('Swimming pool', 'waves'),
  ('Clubhouse', 'building'),
  ('Gymnasium', 'dumbbell'),
  ('Kids play area', 'baby'),
  ('Landscaped garden', 'trees'),
  ('Jogging track', 'footprints'),
  ('Multipurpose hall', 'users'),
  ('Indoor games', 'gamepad-2'),
  ('Yoga deck', 'flower'),
  ('Covered parking', 'car'),
  ('24x7 security', 'shield-check'),
  ('Power backup', 'zap'),
  ('Rainwater harvesting', 'cloud-rain'),
  ('EV charging', 'plug-zap')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- HERO SLIDES
-- ============================================================

INSERT INTO hero_slides (heading, supporting_text, cta_label, cta_url, display_order)
SELECT v.heading, v.supporting_text, v.cta_label, v.cta_url, v.display_order
FROM (VALUES
  (
    'Find your next address in Pune',
    'Handpicked homes from developers we have worked with for two decades.',
    'Browse properties',
    'https://parmarproperties.com/properties',
    0
  ),
  (
    'Ready to move, ready to live',
    'Completed projects with possession available this quarter.',
    'See ready homes',
    'https://parmarproperties.com/properties?status=ready_to_move',
    1
  ),
  (
    'Invest where the city is heading',
    'Market-backed guidance on the corridors with the strongest momentum.',
    'Talk to an advisor',
    'https://parmarproperties.com/contact',
    2
  )
) AS v(heading, supporting_text, cta_label, cta_url, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM hero_slides h WHERE h.heading = v.heading
);

-- ============================================================
-- LOCATIONS
-- ============================================================

INSERT INTO locations (name, tagline, description, city, display_order)
SELECT v.name, v.tagline, v.description, v.city, v.display_order
FROM (VALUES
  (
    'Baner',
    'Pune''s most connected suburb',
    'Straddling the Mumbai–Bengaluru highway, Baner pairs quick access to the Hinjewadi IT parks with the restaurants and schools of an established neighbourhood.',
    'Pune',
    0
  ),
  (
    'Kharadi',
    'Where the offices are',
    'Home to EON IT Park and a growing cluster of business districts, Kharadi has the shortest commutes in east Pune.',
    'Pune',
    1
  ),
  (
    'Wakad',
    'Value with velocity',
    'A dependable rental market close to Hinjewadi, with steady appreciation and family-oriented projects.',
    'Pune',
    2
  ),
  (
    'Koregaon Park',
    'Pune''s classic address',
    'Tree-lined avenues, boutique retail and the city''s most enduring premium residential demand.',
    'Pune',
    3
  )
) AS v(name, tagline, description, city, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM locations l WHERE l.name = v.name
);

-- ============================================================
-- MARKET INTELLIGENCE
-- ============================================================

INSERT INTO market_intelligence (
  title, value, unit, description, change_percentage, source, display_order
)
SELECT v.title, v.value, v.unit, v.description, v.change_percentage, v.source, v.display_order
FROM (VALUES
  (
    'Average price growth',
    '8.4',
    '% YoY',
    'Weighted average capital appreciation across west Pune residential corridors.',
    1.20,
    'Internal analysis, Q2 2026',
    0
  ),
  (
    'Units absorbed',
    '12,480',
    'homes',
    'New homes sold across Pune in the last four quarters.',
    6.10,
    'Pune registrations data, Q2 2026',
    1
  ),
  (
    'Average rental yield',
    '3.6',
    '%',
    'Gross yield on two and three bedroom homes near the employment hubs.',
    0.30,
    'Internal analysis, Q2 2026',
    2
  ),
  (
    'Inventory overhang',
    '14',
    'months',
    'How long current unsold stock would take to clear at today''s pace.',
    -2.50,
    'Pune registrations data, Q2 2026',
    3
  )
) AS v(title, value, unit, description, change_percentage, source, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM market_intelligence m WHERE m.title = v.title
);

-- ============================================================
-- PROPERTIES
-- ============================================================
-- location_id is resolved from the seeded locations by name.

INSERT INTO properties (
  name, slug, property_type, location_id, location_name, city, locality,
  location_details, tagline, description, project_overview, project_details,
  developer_name, developer_description, price_amount, price_display, bhk,
  carpet_area, possession, availability, status, rera_number, is_featured,
  featured_order, latitude, longitude, address
)
SELECT
  v.name, v.slug, v.property_type::property_type,
  (SELECT id FROM locations WHERE locations.name = v.location), v.location_name,
  'Pune', v.locality, v.location_details, v.tagline, v.description,
  v.project_overview, v.project_details, v.developer_name,
  v.developer_description, v.price_amount, v.price_display, v.bhk,
  v.carpet_area, v.possession, v.availability::availability_status,
  v.status::property_status, v.rera_number, v.is_featured, v.featured_order,
  v.latitude, v.longitude, v.address
FROM (VALUES
  (
    'Parmar Trident Towers',
    'parmar-trident-towers',
    'apartment',
    'Baner',
    'Baner, Pune',
    'Baner',
    '5 minutes to the Mumbai–Bengaluru highway · 2 km to Balewadi High Street · 15 minutes to Hinjewadi Phase 1',
    'Riverside living, minutes from the expressway',
    'Two towers of thoughtfully planned two and three bedroom homes, wrapped around a central garden podium.',
    'Trident Towers was designed around a simple idea: every home should get cross ventilation and a view of something green. The towers are offset so no living room looks into another, and the podium garden lifts the amenity deck a full level above the road.',
    '2 towers · 18 floors · 1.2 acres · 68% open space · 3-level basement parking',
    'Parmar Group',
    'Four decades and 40 delivered projects across Pune, with a record of handing over on the promised date.',
    9500000,
    '₹95 L onwards',
    '2 & 3 BHK',
    '720 – 1,140 sq ft',
    'Dec 2027',
    'available',
    'under_construction',
    'P52100012345',
    true,
    0,
    18.5590000,
    73.7860000,
    'Survey No. 42, Baner Road, opposite Orchid School, Baner, Pune 411045'
  ),
  (
    'Parmar Eastwood Greens',
    'parmar-eastwood-greens',
    'apartment',
    'Kharadi',
    'Kharadi, Pune',
    'Kharadi',
    '1 km to EON IT Park · 8 minutes to the airport road · two schools within walking distance',
    'Ready homes at the doorstep of east Pune''s offices',
    'Completed three bedroom residences with possession available now, for families who want to stop commuting.',
    'Eastwood Greens finished construction ahead of schedule. Every home is a corner unit, and the club level on the eleventh floor gives residents a pool and gym with a view over the Mula-Mutha.',
    '1 tower · 14 floors · 0.9 acres · club level on the 11th floor',
    'Parmar Group',
    'Four decades and 40 delivered projects across Pune, with a record of handing over on the promised date.',
    14200000,
    '₹1.42 Cr onwards',
    '3 BHK',
    '1,080 – 1,260 sq ft',
    'Ready to move',
    'limited',
    'ready_to_move',
    'P52100067890',
    true,
    1,
    18.5510000,
    73.9400000,
    'Near EON IT Park, Kharadi, Pune 411014'
  ),
  (
    'Parmar Courtyard Villas',
    'parmar-courtyard-villas',
    'villa',
    'Wakad',
    'Wakad, Pune',
    'Wakad',
    '10 minutes to Hinjewadi Phase 2 · 3 km to the Wakad bridge',
    'Twelve villas around a shared courtyard',
    'A small, gated cluster of four bedroom villas with private terraces, launching this quarter.',
    'Courtyard Villas puts twelve homes around one landscaped court, so children can play within sight of every kitchen window. Each villa has its own plunge pool deck on the terrace.',
    '12 villas · G+2 · 1.8 acres · private terrace per home',
    'Parmar Group',
    'Four decades and 40 delivered projects across Pune, with a record of handing over on the promised date.',
    28500000,
    '₹2.85 Cr onwards',
    '4 BHK',
    '2,400 – 2,750 sq ft',
    'Jun 2029',
    'coming_soon',
    'upcoming',
    NULL,
    false,
    NULL,
    18.5980000,
    73.7620000,
    'Datta Mandir Road, Wakad, Pune 411057'
  )
) AS v(
  name, slug, property_type, location, location_name, locality,
  location_details, tagline, description, project_overview, project_details,
  developer_name, developer_description, price_amount, price_display, bhk,
  carpet_area, possession, availability, status, rera_number, is_featured,
  featured_order, latitude, longitude, address
)
WHERE NOT EXISTS (
  SELECT 1 FROM properties p WHERE p.slug = v.slug
);

-- ============================================================
-- CONFIGURATIONS
-- ============================================================

INSERT INTO configurations (
  property_id, name, bhk, variant, carpet_area, possession, price,
  price_display, availability, display_order
)
SELECT
  p.id, v.name, v.bhk, v.variant, v.carpet_area, v.possession, v.price,
  v.price_display, v.availability::availability_status, v.display_order
FROM properties p
JOIN (VALUES
  ('parmar-trident-towers',   '2 BHK Compact',              '2 BHK', 'A Wing · East facing',  '720 sq ft',  'Dec 2027',      9500000,  '₹95 L',    'available',   0),
  ('parmar-trident-towers',   '2 BHK Premium',              '2 BHK', 'B Wing · Garden view',  '845 sq ft',  'Dec 2027',      11200000, '₹1.12 Cr', 'limited',     1),
  ('parmar-trident-towers',   '3 BHK Signature',            '3 BHK', 'B Wing · Corner',       '1140 sq ft', 'Mar 2028',      15800000, '₹1.58 Cr', 'available',   2),
  ('parmar-eastwood-greens',  '3 BHK Classic',              '3 BHK', 'Corner unit',           '1080 sq ft', 'Ready to move', 14200000, '₹1.42 Cr', 'limited',     0),
  ('parmar-eastwood-greens',  '3 BHK Club Level',           '3 BHK', 'Floors 11 and above',   '1260 sq ft', 'Ready to move', 16900000, '₹1.69 Cr', 'available',   1),
  ('parmar-courtyard-villas', '4 BHK Villa',                '4 BHK', 'Inner court',           '2400 sq ft', 'Jun 2029',      28500000, '₹2.85 Cr', 'coming_soon', 0),
  ('parmar-courtyard-villas', '4 BHK Villa with terrace',   '4 BHK', 'Corner plot',           '2750 sq ft', 'Jun 2029',      32000000, '₹3.20 Cr', 'coming_soon', 1)
) AS v(slug, name, bhk, variant, carpet_area, possession, price, price_display, availability, display_order)
  ON v.slug = p.slug
WHERE NOT EXISTS (
  SELECT 1 FROM configurations c WHERE c.property_id = p.id AND c.name = v.name
);

-- ============================================================
-- COST SHEET FOR THE ENTRY CONFIGURATION
-- ============================================================

INSERT INTO price_breakdowns (configuration_id, label, amount, display_order)
SELECT c.id, v.label, v.amount, v.display_order
FROM configurations c
JOIN properties p ON p.id = c.property_id
CROSS JOIN (VALUES
  ('Base price',                    8600000, 0),
  ('Floor rise',                     220000, 1),
  ('Covered parking',                350000, 2),
  ('GST (5%)',                       430000, 3),
  ('Stamp duty and registration',    520000, 4)
) AS v(label, amount, display_order)
WHERE p.slug = 'parmar-trident-towers'
  AND c.name = '2 BHK Compact'
  AND NOT EXISTS (
    SELECT 1 FROM price_breakdowns b WHERE b.configuration_id = c.id
  );

-- ============================================================
-- FLOOR PLANS (files are uploaded from the admin)
-- ============================================================

INSERT INTO floor_plans (property_id, name, plan_type, display_order)
SELECT p.id, v.name, v.plan_type::floor_plan_type, v.display_order
FROM properties p
JOIN (VALUES
  ('parmar-trident-towers',   'Master plan',        'master_plan',        0),
  ('parmar-trident-towers',   'Typical floor plan', 'floor_plan',         1),
  ('parmar-trident-towers',   '2 BHK Compact plan', 'configuration_plan', 2),
  ('parmar-eastwood-greens',  'Master plan',        'master_plan',        0),
  ('parmar-eastwood-greens',  '3 BHK Classic plan', 'configuration_plan', 1),
  ('parmar-courtyard-villas', 'Site layout',        'master_plan',        0)
) AS v(slug, name, plan_type, display_order)
  ON v.slug = p.slug
WHERE NOT EXISTS (
  SELECT 1 FROM floor_plans f WHERE f.property_id = p.id AND f.name = v.name
);

-- ============================================================
-- AMENITIES PER PROPERTY
-- ============================================================

INSERT INTO property_amenities (property_id, amenity_id, display_order)
SELECT
  p.id,
  a.id,
  (row_number() OVER (PARTITION BY p.id ORDER BY a.name) - 1)::integer
FROM properties p
JOIN (VALUES
  ('parmar-trident-towers',   'Swimming pool'),
  ('parmar-trident-towers',   'Clubhouse'),
  ('parmar-trident-towers',   'Gymnasium'),
  ('parmar-trident-towers',   'Kids play area'),
  ('parmar-trident-towers',   'Landscaped garden'),
  ('parmar-trident-towers',   'Covered parking'),
  ('parmar-trident-towers',   '24x7 security'),
  ('parmar-trident-towers',   'Power backup'),
  ('parmar-eastwood-greens',  'Swimming pool'),
  ('parmar-eastwood-greens',  'Gymnasium'),
  ('parmar-eastwood-greens',  'Clubhouse'),
  ('parmar-eastwood-greens',  'Jogging track'),
  ('parmar-eastwood-greens',  'Multipurpose hall'),
  ('parmar-eastwood-greens',  'EV charging'),
  ('parmar-eastwood-greens',  '24x7 security'),
  ('parmar-courtyard-villas', 'Landscaped garden'),
  ('parmar-courtyard-villas', 'Covered parking'),
  ('parmar-courtyard-villas', '24x7 security'),
  ('parmar-courtyard-villas', 'Rainwater harvesting'),
  ('parmar-courtyard-villas', 'Yoga deck')
) AS v(slug, amenity) ON v.slug = p.slug
JOIN amenities a ON a.name = v.amenity
ON CONFLICT (property_id, amenity_id) DO NOTHING;

-- ============================================================
-- INVENTORY (a block of twelve units on the entry configuration)
-- ============================================================

INSERT INTO inventory_units (
  property_id, configuration_id, unit_number, floor, facing, price, status
)
SELECT
  c.property_id,
  c.id,
  'A-' || n,
  left(n::text, 1),
  CASE WHEN n % 2 = 0 THEN 'East' ELSE 'West' END,
  9500000 + (n - 101) * 50000,
  (CASE
    WHEN n <= 103 THEN 'sold'
    WHEN n <= 105 THEN 'booked'
    WHEN n = 106 THEN 'hold'
    ELSE 'available'
  END)::inventory_status
FROM configurations c
JOIN properties p ON p.id = c.property_id
CROSS JOIN generate_series(101, 112) AS n
WHERE p.slug = 'parmar-trident-towers'
  AND c.name = '2 BHK Compact'
  AND NOT EXISTS (
    SELECT 1 FROM inventory_units u WHERE u.configuration_id = c.id
  );

COMMIT;
