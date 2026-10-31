-- ============================================================
-- seed_cms_frontend_content.sql
-- Migrates EXISTING Frontend home/locations/hero/insights content
-- into the canonical CMS tables already used by Admin.
--
-- Canonical mapping (no new systems):
--   Hero slides/images/order     → hero_slides
--   Hero headline/subtext/Why    → page_content (id='home')
--   Insights articles            → insights_articles + article_sections
--   Location directory/filter    → locations (+ lookup_locations)
--
-- Idempotent: safe to re-run. Preserves Malad and other custom rows.
-- Does NOT touch properties, amenities, leads, auth, or pricing.
-- ============================================================

-- ------------------------------------------------------------
-- 1. HERO SLIDES — existing Frontend carousel content
-- ------------------------------------------------------------
-- Clear legacy Pune slides / empty table, then insert Mumbai slides.
DELETE FROM hero_slides
WHERE heading IN (
  'Find your next address in Pune',
  'Ready to move, ready to live',
  'Invest where the city is heading'
)
OR heading = 'MUMBAI''S FINEST ADDRESSES';

INSERT INTO hero_slides (
  heading, supporting_text, cta_label, cta_url,
  image_path, image_url, is_active, display_order
)
SELECT v.heading, v.supporting_text, v.cta_label, v.cta_url,
       v.image_path, v.image_url, true, v.display_order
FROM (VALUES
  (
    'MUMBAI''S FINEST ADDRESSES',
    'Curated residences, private opportunities and investment properties across Mumbai''s most sought after neighbourhoods',
    'SEARCH',
    '/properties?tab=buy',
    '/hero/hero-image-property-1.png',
    '/hero/hero-image-property-1.png',
    0
  ),
  (
    'MUMBAI''S FINEST ADDRESSES',
    'Curated residences, private opportunities and investment properties across Mumbai''s most sought after neighbourhoods',
    'SEARCH',
    '/properties?tab=buy',
    '/hero/hero-image-property-2.png',
    '/hero/hero-image-property-2.png',
    1
  ),
  (
    'MUMBAI''S FINEST ADDRESSES',
    'Curated residences, private opportunities and investment properties across Mumbai''s most sought after neighbourhoods',
    'SEARCH',
    '/properties?tab=buy',
    '/hero/hero-image-property-3.png',
    '/hero/hero-image-property-3.png',
    2
  )
) AS v(heading, supporting_text, cta_label, cta_url, image_path, image_url, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM hero_slides h
  WHERE h.image_url = v.image_url OR h.image_path = v.image_path
);

-- ------------------------------------------------------------
-- 2. PAGE CONTENT — home Why Parmar + hero chrome (match Frontend)
-- ------------------------------------------------------------
UPDATE page_content
SET
  title = 'MUMBAI''S FINEST ADDRESSES',
  subtitle = 'Curated residences, private opportunities and investment properties across Mumbai''s most sought after neighbourhoods',
  sections_data = sections_data || jsonb_build_object(
    'hero_headline', 'MUMBAI''S FINEST ADDRESSES',
    'hero_subtext', 'Curated residences, private opportunities and investment properties across Mumbai''s most sought after neighbourhoods',
    'hero_slide_duration_ms', 2200,
    'why_badge', 'OUR LEGACY & STANDARDS',
    'why_title_prefix', 'WHY',
    'why_title_highlight', 'PARMAR PROPERTIES',
    'why_subtitle', 'Parmar Properties combines curated property discovery with decades of Mumbai real estate experience, hyper-local market intelligence, and discreet advisory.',
    'why_cta_text', 'EXPLORE PORTFOLIO',
    'why_cta_link', '/properties?tab=buy',
    'why_trust_metrics', jsonb_build_array(
      jsonb_build_object(
        'value', '40+',
        'label', 'Years of Proven Heritage',
        'sub', 'Active in South & West Mumbai since 1981'
      ),
      jsonb_build_object(
        'value', '100%',
        'label', 'RERA & Title Due Diligence',
        'sub', 'Every listing undergoes strict legal vetting'
      ),
      jsonb_build_object(
        'value', '₹5,000+ Cr',
        'label', 'Portfolio Transaction Equity',
        'sub', 'High-value transactions advised discreetly'
      ),
      jsonb_build_object(
        'value', '1-on-1',
        'label', 'Bespoke Advisory Desk',
        'sub', 'Confidential viewings & direct promoter access'
      )
    ),
    'why_pillars', jsonb_build_array(
      jsonb_build_object(
        'number', '01',
        'subtitle', 'OVER 4 DECADES OF TRUST',
        'title', 'SINCE 1981',
        'description', 'Four decades of continuous family-run integrity, unmatched relationship equity, and deep-rooted standing across Mumbai''s prime property corridors.',
        'badge', 'Generational Standing'
      ),
      jsonb_build_object(
        'number', '02',
        'subtitle', 'VETTED & TROPHY ASSETS',
        'title', 'CURATED INVENTORY',
        'description', 'Every home in our portfolio is personally hand-selected, verified for clear titles, superior layouts, panoramic vistas, and enduring luxury prestige.',
        'badge', '100% Verified Titles'
      ),
      jsonb_build_object(
        'number', '03',
        'subtitle', 'HYPER-LOCAL VALUATION DATA',
        'title', 'MARKET INTELLIGENCE',
        'description', 'Unrivaled micro-market data across Worli, Bandra, and South Mumbai, enabling confident decisions with transparent pricing and capital yield benchmarks.',
        'badge', 'Micro-Market Pricing'
      ),
      jsonb_build_object(
        'number', '04',
        'subtitle', 'DISCREET PRIVATE CONSULTATION',
        'title', 'END-TO-END ADVISORY',
        'description', 'Bespoke white-glove guidance through confidential viewings, legal due diligence, title scrutiny, structuring, and seamless final handover.',
        'badge', 'Confidential White-Glove'
      )
    ),
    'mi_badge', 'RESEARCH & ADVISORY DESK',
    'mi_heading', 'Market Intelligence',
    'mi_subheading', 'Curated micro-market data, capital valuation trends, and strategic advisory to guide high-value property decisions across South & West Mumbai.',
    'mi_view_all_text', 'VIEW ALL INSIGHTS ->',
    'mi_view_all_link', '/market-intelligence'
  ),
  updated_at = now()
WHERE id = 'home';

UPDATE page_content
SET
  title = 'Market Intelligence',
  subtitle = 'Curated micro-market data, capital valuation trends, and strategic advisory to guide high-value property decisions across South & West Mumbai.',
  badge = 'RESEARCH & ADVISORY DESK',
  sections_data = sections_data || jsonb_build_object(
    'badge', 'RESEARCH & ADVISORY DESK',
    'header_title', 'Market Intelligence',
    'header_subtitle', 'Curated micro-market data, capital valuation trends, and strategic advisory to guide high-value property decisions across South & West Mumbai.'
  ),
  updated_at = now()
WHERE id = 'insights';

-- ------------------------------------------------------------
-- 3. LOOKUP LOCATIONS — ensure filter catalogue includes Malad
-- ------------------------------------------------------------
INSERT INTO lookup_locations (slug, name, display_order, is_active)
VALUES
  ('worli', 'Worli', 1, true),
  ('bandra-west', 'Bandra West', 2, true),
  ('juhu', 'Juhu', 3, true),
  ('malabar-hill', 'Malabar Hill', 4, true),
  ('prabhadevi', 'Prabhadevi', 5, true),
  ('lower-parel', 'Lower Parel', 6, true),
  ('powai', 'Powai', 7, true),
  ('sewri', 'Sewri', 8, true),
  ('cuffe-parade', 'Cuffe Parade', 9, true),
  ('malad', 'Malad', 10, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name;
-- Do NOT clobber display_order or is_active on re-seed — Admin owns those.

-- ------------------------------------------------------------
-- 4. LOCATIONS — existing Frontend directory + dossier content
-- ------------------------------------------------------------
INSERT INTO locations (
  name, slug, tagline, description, city,
  cover_image, image_url, price_range, average_rate, lifestyle,
  key_enclaves, is_primary_home, primary_order, is_future, future_order,
  publication_status, is_active, sort_order, display_order, lookup_location_id
)
SELECT
  v.name, v.slug, v.tagline, v.description, 'Mumbai',
  v.cover_image, v.cover_image, v.price_range, v.average_rate, v.lifestyle,
  v.key_enclaves::text[], v.is_primary_home, v.primary_order, v.is_future, v.future_order,
  'published', true, v.sort_order, v.sort_order,
  (SELECT id FROM lookup_locations ll WHERE ll.slug = v.slug LIMIT 1)
FROM (VALUES
  (
    'Worli', 'worli',
    'Sea Face & Skyline Towers',
    'Home to iconic skyline towers, the Bandra-Worli Sea Link promenade, and coveted multi-acre gated sky residences. Worli commands premier capital appreciation and uninterrupted Arabian Sea horizons.',
    '/properties/worli-aurum/cover.jpg',
    'From ₹18 Cr',
    '₹65,000 - ₹1,20,000 / sq.ft',
    'Sea Link Promenade, High-Rise Sky Mansions, Michelin Dining',
    ARRAY['Worli Sea Face', 'Dr. Annie Besant Road', 'Pochkhanawala Road'],
    true, 1, false, NULL::int, 1
  ),
  (
    'Bandra West', 'bandra-west',
    'Pali Hill & Coastal Enclaves',
    'The address of choice for creative luminaries, legacy industrialists, and tastemakers. Bandra West blends quiet leafy enclaves like Pali Hill and Carter Road with world-class bistros and exclusive boutique towers.',
    '/properties/bandra-palisades/cover.jpg',
    'From ₹15 Cr',
    '₹75,000 - ₹1,35,000 / sq.ft',
    'Pali Hill Sanctuary, Carter Road Promenade, Boutique Living',
    ARRAY['Pali Hill', 'Bandstand', 'Carter Road', 'Perry Cross Road'],
    true, 2, false, NULL::int, 2
  ),
  (
    'Juhu', 'juhu',
    'Beachfront Estates & Penthouses',
    'Mumbai''s original beachfront gold standard. Characterized by expansive private low-rise villas, sprawling penthouses overlooking private sands, and ultimate discreet coastal living.',
    '/properties/juhu-solitaire/cover.jpg',
    'From ₹20 Cr',
    '₹70,000 - ₹1,40,000 / sq.ft',
    'Direct Beach Access, Private Villa Compounds, Low-Density Living',
    ARRAY['Juhu Tara Road', 'Ruia Park', 'JVPD Scheme', 'Gulmohar Avenue'],
    true, 3, false, NULL::int, 3
  ),
  (
    'Malabar Hill', 'malabar-hill',
    'Queens Necklace Panoramas',
    'The historical pinnacle of power and quiet old-money prestige in South Mumbai. Unrivaled panoramic vistas over Back Bay, Hanging Gardens, and lush governor hill canopies.',
    '/hero/hero-1-crisp.jpg',
    'From ₹35 Cr',
    '₹1,00,000 - ₹1,85,000 / sq.ft',
    'Old Bombay Heritage, Back Bay Panoramas, Diplomatic Enclaves',
    ARRAY['Walkeshwar Road', 'Ridge Road', 'Nepeansea Road', 'Carmichael Road'],
    false, NULL::int, false, NULL::int, 4
  ),
  (
    'Prabhadevi', 'prabhadevi',
    'Coastal Grandeur & Sea Link Access',
    'A prestigious South Mumbai beachfront and skyline enclave offering seamless Sea Link connectivity, tranquil residential avenues, and unobstructed sunsets.',
    '/properties/prabhadevi-verve/cover.jpg',
    'From ₹18 Cr',
    '₹62,000 - ₹1,05,000 / sq.ft',
    'Beachfront Promenade, Temple Heritage, High-Rise Penthouses',
    ARRAY['Siddhivinayak Horizon', 'Kirti College Seafront', 'Sayani Road High-Rises'],
    false, NULL::int, true, 2, 5
  ),
  (
    'Lower Parel', 'lower-parel',
    'Midtown Sky Suites & Commercial Hub',
    'Mumbai''s premier corporate corridor and luxury vertical community. Home to world-class dining, luxury retail gallerias, and multi-acre integrated residential estates.',
    '/properties/lower-parel-pavilion/cover.jpg',
    'From ₹12 Cr',
    '₹55,000 - ₹95,000 / sq.ft',
    'Vertical Cities, Luxury Mall Access, High-Speed Financial Hub',
    ARRAY['Senapati Bapat Marg', 'Curry Road Avenue', 'Delisle Road Enclaves'],
    false, NULL::int, true, 3, 6
  ),
  (
    'Powai', 'powai',
    'Lakeside Hills & Modern Architecture',
    'Mumbai''s prime neoclassical sanctuary. Lush hillside panoramic views, Powai Lake shorelines, elite international schooling, and gated condominium estates.',
    '/properties/powai-lake/cover.jpg',
    'From ₹8 Cr',
    '₹38,000 - ₹65,000 / sq.ft',
    'Lakefront Jogging, Neoclassical Promenades, Tech Executive Estates',
    ARRAY['Hiranandani Gardens', 'Powai Lake Promenade', 'Cliff Avenue'],
    false, NULL::int, true, 1, 7
  ),
  (
    'Sewri', 'sewri',
    'Eastern Waterfront & Atal Setu (MTHL)',
    'The focal point of Mumbai''s eastern bay transformation. Direct Atal Setu (MTHL) transit, expansive mangrove bird sanctuaries, and massive high-rise capital appreciation.',
    '/hero/hero-3-crisp.jpg',
    'From ₹10 Cr',
    '₹40,000 - ₹70,000 / sq.ft',
    'MTHL Connectivity, Harbor Views, Flamingo Sanctuary Panoramas',
    ARRAY['Sewri Seafront Promenade', 'Eastern Bay Corridor', 'Port Trust Bay'],
    false, NULL::int, true, 0, 8
  ),
  (
    'Cuffe Parade', 'cuffe-parade',
    'Legacy Southern Promontory',
    'The southern tip of Mumbai''s legacy luxury district. Waterfront high-rises, diplomatic consulates, world trade towers, and timeless Colaba proximity.',
    '/hero/hero-2-crisp.jpg',
    'From ₹22 Cr',
    '₹75,000 - ₹1,40,000 / sq.ft',
    'Yacht Club Proximity, Diplomatic Corridors, Coastal Skyline',
    ARRAY['Prakash Pethe Marg', 'Cuffe Parade Promontory', 'Captain Prakash Pethe Marg'],
    false, NULL::int, true, 4, 9
  )
) AS v(
  name, slug, tagline, description, cover_image, price_range, average_rate,
  lifestyle, key_enclaves, is_primary_home, primary_order, is_future, future_order, sort_order
)
ON CONFLICT (slug) WHERE slug IS NOT NULL DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  city = EXCLUDED.city,
  cover_image = EXCLUDED.cover_image,
  image_url = EXCLUDED.image_url,
  price_range = EXCLUDED.price_range,
  average_rate = EXCLUDED.average_rate,
  lifestyle = EXCLUDED.lifestyle,
  key_enclaves = EXCLUDED.key_enclaves,
  is_primary_home = EXCLUDED.is_primary_home,
  primary_order = EXCLUDED.primary_order,
  is_future = EXCLUDED.is_future,
  future_order = EXCLUDED.future_order,
  publication_status = 'published',
  is_active = true,
  sort_order = EXCLUDED.sort_order,
  display_order = EXCLUDED.display_order,
  lookup_location_id = EXCLUDED.lookup_location_id,
  updated_at = now();

-- Keep Malad active; when selected for homepage with order 4 it occupies slot 4.
UPDATE locations
SET
  is_active = true,
  publication_status = 'published',
  is_primary_home = true,
  primary_order = 4,
  sort_order = GREATEST(COALESCE(sort_order, 0), 10),
  display_order = GREATEST(COALESCE(display_order, 0), 10),
  lookup_location_id = COALESCE(
    lookup_location_id,
    (SELECT id FROM lookup_locations WHERE slug = 'malad' LIMIT 1)
  ),
  updated_at = now()
WHERE slug = 'malad' OR lower(name) = 'malad';

-- ------------------------------------------------------------
-- 5. INSIGHTS ARTICLES — existing Frontend research content
-- ------------------------------------------------------------
WITH cats AS (
  SELECT slug, id FROM lookup_article_categories
),
upserted AS (
  INSERT INTO insights_articles (
    slug, category_header, category_id, title, subtitle, description,
    tag, date_tag, image_path, author_name, author_role, author_desk,
    key_takeaways, status, sort_order
  )
  SELECT
    v.slug,
    v.category_header,
    c.id,
    v.title,
    v.subtitle,
    v.description,
    v.tag,
    v.date_tag,
    v.image_path,
    v.author_name,
    v.author_role,
    v.author_desk,
    v.key_takeaways,
    'published',
    v.sort_order
  FROM (VALUES
    (
      'worli-guide-2026',
      'WORLI PROPERTY GUIDE 2026',
      'location',
      'What Rs. 10–25 Cr buys in Worli today.',
      'Neighbourhood pricing benchmarks, product types, and buyer-profile context across Sea Face and high-rise luxury towers.',
      'Neighbourhood, product, price band and buyer-profile context across Sea Face and high-rise developments.',
      'Price Analysis',
      'Q1 2026 Benchmark',
      '/properties/worli-aurum/cover.jpg',
      'Advisory Research Desk',
      'Head of Prime Residential Valuation',
      'Parmar Properties Research',
      ARRAY[
        'Worli Sea Face commands a 25%–35% capital premium over inner arterial developments.',
        'In the ₹10–18 Cr band, buyers primarily access 3 BHK residences (1,800–2,400 sq.ft) in established towers.',
        'The ₹18–25 Cr bracket unlocks 4 BHK sky residences with unobstructed Arabian Sea panoramas and private elevator foyers.',
        'The Coastal Road and Sea Link interchanges have cemented Worli as South Mumbai''s highest liquidity luxury corridor.'
      ],
      1
    ),
    (
      'mahalaxmi-vs-worli',
      'LOCATION COMPARISON',
      'location',
      'Mahalaxmi vs Worli',
      'Understanding two of South Mumbai''s evolving luxury corridors, racecourse vistas, and coastal expressway connectivity.',
      'Understanding two of South Mumbai''s evolving luxury corridors, racecourse vistas, and coastal connectivity.',
      'Macro Trends',
      'Market Comparative',
      '/hero/hero-2-crisp.jpg',
      'Advisory Research Desk',
      'Senior Micro-Market Analyst',
      'Parmar Properties Research',
      ARRAY[
        'Mahalaxmi delivers rare emerald green open space panoramas over the 225-acre historical Racecourse.',
        'Worli commands greater international brand cachet and premium seafront promenade lifestyle.',
        'Rental yields in Mahalaxmi average 2.8%–3.4%, compared to 2.2%–2.7% along prime Worli Sea Face.',
        'Both corridors benefit equally from the newly commissioned Mumbai Coastal Road arterial nodes.'
      ],
      2
    ),
    (
      'buying-penthouse-mumbai',
      'BUYER GUIDE',
      'buyer',
      'Buying a Penthouse in Mumbai',
      'What high-net-worth buyers should evaluate beyond the view: private elevators, structural terrace loads, and wind engineering.',
      'What buyers should evaluate beyond the view: private elevators, structural terrace loads, and wind engineering.',
      'Architecture & Law',
      'Executive Advisory',
      '/properties/juhu-solitaire/cover.jpg',
      'Legal & Engineering Desk',
      'Senior Title Counsel & Structural Auditor',
      'Parmar Properties Legal Advisory',
      ARRAY[
        'Ensure private terrace rights are explicitly registered on the index-II deed and not classified as common society refuge.',
        'Check structural slab capacity for rooftop plunge pools, soil loads for landscaped decks, and waterproofing warranties.',
        'Verify private elevator transit isolation, separate service shafts, and backup inverter circuits for vertical lifts.',
        'Examine high-altitude wind engineering certifications and hurricane-rated facade glazing at 40+ storey heights.'
      ],
      3
    ),
    (
      'nri-mumbai-property',
      'NRI GUIDE',
      'nri',
      'Buying Mumbai property from overseas',
      'A practical guide to search, compare, repatriate funds, and transact under FEMA and RBI statutory frameworks.',
      'A practical guide to search, compare, repatriate funds, and transact under FEMA & RBI guidelines.',
      'Cross-Border Advisory',
      'Regulatory Playbook',
      '/hero/hero-3-crisp.jpg',
      'Cross-Border Advisory Desk',
      'Director of International Client Services',
      'Parmar Properties Global Desk',
      ARRAY[
        'NRIs and OCIs can freely acquire any number of residential and commercial properties in India with no prior RBI approvals.',
        'All payments must originate from verified NRE/NRO accounts or through direct inward foreign inward remittances (FIRC).',
        'Power of Attorney (PoA) documents executed overseas must be apostilled or consularized before local adjudication.',
        'Capital gains repatriation is guaranteed under the USD 1,000,000 annual repatriation scheme using Form 15CA/15CB.'
      ],
      4
    ),
    (
      'bandra-west-micromarket',
      'BANDRA WEST PROPERTY REPORT',
      'location',
      'Pali Hill vs. Bandstand: Capital Velocity & Scarcity',
      'Micro-market evaluation of Bandra West''s heritage canopy enclaves against waterfront landmark towers.',
      'An authoritative study of Bandra West''s ultra-prime residential micro-markets, analyzing low-density heritage zoning, redevelopment premiums, and celebrity-anchored waterfront corridors.',
      'Micro-Market Intelligence',
      'Strategic Report',
      '/properties/bandra-palisades/cover.jpg',
      'Advisory Research Desk',
      'Western Suburbs Luxury Lead',
      'Parmar Properties Research',
      ARRAY[
        'Pali Hill commands an enduring canopy premium of ₹1.10L to ₹1.35L per sq.ft due to strictly enforced low-density zoning.',
        'Bandstand waterfront properties rarely trade publicly; off-market transactions maintain 100% price defense.',
        'Corporate founders and creative agency principals drive over 60% of secondary market transactions in Bandra West.',
        'Rental demand remains the highest in Western Mumbai, with yields averaging 3.2% to 3.8% for furnished designer apartments.'
      ],
      5
    ),
    (
      'capital-gains-structuring',
      'TAX & STRUCTURING GUIDE',
      'price',
      'Section 54 Reinvestment & Luxury Asset Allocation',
      'Navigating long-term capital gain exemptions when transitioning from commercial or industrial assets to luxury residential.',
      'A strategic wealth structuring whitepaper on legally optimizing tax incidence when deploying capital gains into prime residential real estate across Mumbai.',
      'Wealth Structuring',
      'Legal & Tax Brief',
      '/properties/lower-parel-pavilion/cover.jpg',
      'Tax & Estate Advisory Desk',
      'Senior Partner, Wealth Structuring',
      'Parmar Properties Family Office Desk',
      ARRAY[
        'Section 54 and 54F allow tax exemption up to ₹10 Crore when reinvesting long-term capital gains into residential property.',
        'The statutory window requires purchase within 1 year before or 2 years after sale, or construction within 3 years.',
        'Unutilized capital gains must be securely parked in the Capital Gains Account Scheme (CGAS) prior to filing the return.',
        'Consolidating multi-unit floor plates into a single contiguous residential unit requires precise architectural documentation.'
      ],
      6
    )
  ) AS v(
    slug, category_header, category_slug, title, subtitle, description,
    tag, date_tag, image_path, author_name, author_role, author_desk,
    key_takeaways, sort_order
  )
  JOIN cats c ON c.slug = v.category_slug
  ON CONFLICT (slug) DO UPDATE SET
    category_header = EXCLUDED.category_header,
    category_id = EXCLUDED.category_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    tag = EXCLUDED.tag,
    date_tag = EXCLUDED.date_tag,
    image_path = EXCLUDED.image_path,
    author_name = EXCLUDED.author_name,
    author_role = EXCLUDED.author_role,
    author_desk = EXCLUDED.author_desk,
    key_takeaways = EXCLUDED.key_takeaways,
    status = 'published',
    sort_order = EXCLUDED.sort_order,
    updated_at = now()
  RETURNING id, slug
)
-- Refresh sections for upserted articles (idempotent replace)
, deleted AS (
  DELETE FROM article_sections s
  USING upserted u
  WHERE s.article_id = u.id
  RETURNING s.article_id
)
INSERT INTO article_sections (article_id, section_order, heading, paragraphs, table_data, highlight_quote)
SELECT u.id, s.section_order, s.heading, s.paragraphs, s.table_data::jsonb, s.highlight_quote
FROM upserted u
JOIN (VALUES
  (
    'worli-guide-2026', 1,
    '1. The Worli Micro-Market Landscape',
    ARRAY[
      'Over the last five years, Worli has evolved from an industrial textile corridor into Mumbai''s definitive skyline capital. Today, the micro-market represents the highest concentration of ultra-high-net-worth (UHNW) families, corporate leaders, and multi-generational business dynasties in Western India.',
      'When evaluating real estate acquisitions within the ₹10 Cr to ₹25 Cr threshold, capital allocation behaves very differently depending on proximity to the coastal promenade versus arterial transit lines such as Dr. Annie Besant Road.'
    ],
    '{"headers":["Micro-Enclave","Target Price Band","Average Carpet Area","Primary Asset Class"],"rows":[["Worli Sea Face Promenade","₹22 Cr – ₹35 Cr+","3,200 – 4,800 sq.ft","Direct Sea-Facing Penthouses & Sky Mansions"],["Pochkhanawala Luxury Enclave","₹16 Cr – ₹24 Cr","2,400 – 3,200 sq.ft","Low-Density Boutique Residences"],["Dr. Annie Besant Gated Towers","₹12 Cr – ₹20 Cr","1,950 – 2,800 sq.ft","Integrated Luxury Towers & Sky Villas"],["Worli Naka / Midtown Transit","₹10 Cr – ₹14 Cr","1,600 – 2,200 sq.ft","Executive 3 BHK Residences"]]}',
    NULL
  ),
  (
    'worli-guide-2026', 2,
    '2. Sea Face vs. Racecourse Horizon Realizations',
    ARRAY[
      'One of the most frequent valuation puzzles our advisory desk addresses is the spread between Arabian Sea horizons and Mahalaxmi Racecourse vistas.',
      'While unobstructed western sunset ocean views command ₹75,000 to ₹1,10,000 per sq.ft of carpet area, eastern residences looking out across the racecourse greenery typically trade at ₹62,000 to ₹80,000 per sq.ft. For investors seeking long-term yield stability, the racecourse-facing units often yield higher rental returns given their lower entry basis.'
    ],
    NULL,
    'A 4 BHK sky villa on Worli Sea Face commands an enduring 30% rarity premium because new beachfront land parcels are physically non-existent.'
  ),
  (
    'worli-guide-2026', 3,
    '3. What Discerning Buyers Should Scrutinize',
    ARRAY[
      'Before signing an Agreement for Sale in Worli, buyers should verify three crucial parameters:',
      '1. Super-to-Carpet Efficiency: In older developments, loading ratios could run up to 45%. Under current MahaRERA mandates, ensure you are evaluating price strictly on usable RERA carpet area plus registered en-suite deck areas.',
      '2. Wind Engineering & Acoustic Dampening: At elevations above the 35th floor, wind shear and high-altitude sound reverberation require triple-glazed acoustic curtain walls.',
      '3. Parking Entitlements: In Mumbai''s prime luxury tier, each 4 BHK residence should have at least 3 to 4 covered basement car parking slots registered on title.'
    ],
    NULL,
    NULL
  ),
  (
    'mahalaxmi-vs-worli', 1,
    '1. Two Divergent Luxury Archetypes',
    ARRAY[
      'South Mumbai real estate has historically been defined by scarcity. However, within a 3-kilometer radius, Worli and Mahalaxmi present two completely distinct urban luxury lifestyles.',
      'Worli is characterized by expansive, high-density international towers rising along the Arabian Sea. Mahalaxmi, on the other hand, centers around the monumental 225-acre heritage open expanse of the Royal Western India Turf Club (RWITC) Racecourse, flanked by historic colonial villas and modern sky sanctuaries.'
    ],
    '{"headers":["Attribute","Worli Prime Corridor","Mahalaxmi Racecourse Corridor"],"rows":[["Primary Vista","Arabian Sea & Sea Link Panoramas","225-Acre Emerald Turf Club Grounds"],["Average Rate (₹ / sq.ft)","₹70,000 – ₹1,20,000","₹55,000 – ₹90,000"],["Typical Entry Threshold","₹15 Cr – ₹35 Cr+","₹10 Cr – ₹25 Cr"],["Gross Rental Yield","2.2% – 2.8%","2.8% – 3.4%"],["Target Demographics","Industrialists, Private Equity Promoters","Senior Corporate Leaders, Doctors, Tech Founders"]]}',
    NULL
  ),
  (
    'mahalaxmi-vs-worli', 2,
    '2. The Racecourse Stability Factor',
    ARRAY[
      'One of the defining advantages of acquiring a racecourse-facing residence in Mahalaxmi is view preservation. Because the RWITC grounds are protected open heritage reserves, buyers are guaranteed that no high-rise tower can ever obstruct their green horizon.',
      'In contrast, certain inner pockets of Worli face redevelopment activity where future high-rise towers can occasionally compromise diagonal vistas. Working with an experienced advisory firm ensures that building height allowances on adjacent plots are rigorously audited.'
    ],
    NULL,
    'Mahalaxmi''s permanent racecourse view protection makes it one of the safest long-term horizon assets in South Mumbai.'
  ),
  (
    'buying-penthouse-mumbai', 1,
    '1. Terrace Title & Legal Demarcation',
    ARRAY[
      'A penthouse in Mumbai is only as valuable as the certainty of its open sky rights. Under Maharashtra Ownership Flats Act (MOFA) and MahaRERA statutory guidelines, rooftop terraces are frequently contested between developers and housing societies.',
      'Discerning buyers must ensure that the private terrace is clearly designated on the approved municipal building plans as an exclusive-use appurtenance, and that corresponding stamp duty has been paid on the terrace area calculation.'
    ],
    NULL,
    NULL
  ),
  (
    'buying-penthouse-mumbai', 2,
    '2. Structural Engineering & Private Pools',
    ARRAY[
      'Many trophy buyers wish to install private plunge pools, heated jacuzzi tubs, or mature rooftop gardens. These additions introduce substantial dead and live loads to the structural floor plate.',
      'A standard residential RCC slab is engineered for 200–300 kg/m² of live load. A 4-foot deep plunge pool exerts over 1,200 kg/m² of hydrostatic pressure. Before placing earnest money on a top-floor unit, our team insists on reviewing the structural engineer''s column alignment schedule and waterproofing drainage gradients.'
    ],
    NULL,
    'Never install a private plunge pool without structural load certification signed by the municipal structural auditor.'
  ),
  (
    'nri-mumbai-property', 1,
    '1. Regulatory Entitlements under FEMA',
    ARRAY[
      'Under the Foreign Exchange Management Act (FEMA), Non-Resident Indians (NRIs) and Overseas Citizens of India (OCIs) are granted unrestricted parity with resident citizens for the purchase of immovable residential and commercial real estate in India.',
      'There is no cap on the number of luxury apartments, penthouses, or commercial office suites an overseas buyer can hold.'
    ],
    NULL,
    NULL
  ),
  (
    'nri-mumbai-property', 2,
    '2. Banking, Remittance & FIRC Protocols',
    ARRAY[
      'The single most common oversight for overseas buyers is neglecting the Foreign Inward Remittance Certificate (FIRC).',
      'When remitting foreign currency (USD, GBP, AED, SGD, EUR) for property booking advances or milestone disbursements, your Indian receiving bank must issue a digital FIRC. This certificate serves as irrefutable statutory evidence that foreign funds were introduced, which is mandatory when later repatriating capital upon sale.'
    ],
    NULL,
    'Ensure every inward wire transfer is supported by a Foreign Inward Remittance Certificate (FIRC) to guarantee future repatriation.'
  ),
  (
    'bandra-west-micromarket', 1,
    '1. The Architectural Divide: Hillside Canopy vs. Oceanfront',
    ARRAY[
      'Bandra West holds a unique position in Mumbai''s cultural and economic topography. Divided between the serene, tree-lined quietude of Pali Hill and the dramatic oceanfront promenade of Bandstand, each pocket caters to distinct buyer aspirations.',
      'Pali Hill remains the enclave of choice for multi-generational industrial families and low-profile tech entrepreneurs prioritizing discreet privacy and lush greenery. Bandstand, conversely, is iconic, high-visibility oceanfront living.'
    ],
    '{"headers":["Micro-Enclave","Price Range (₹ / sq.ft)","Key Asset Profile","Average Ticket Size"],"rows":[["Pali Hill Enclave","₹1,05,000 – ₹1,40,000","Boutique Full-Floor Residences","₹20 Cr – ₹45 Cr+"],["Bandstand Promenade","₹1,15,000 – ₹1,55,000","Waterfront Penthouses & Mansions","₹35 Cr – ₹80 Cr+"],["Carter Road Coastal Belt","₹90,000 – ₹1,20,000","Sea-Facing Mid-Rise Towers","₹15 Cr – ₹30 Cr"],["Perry Cross / Union Park","₹85,000 – ₹1,10,000","Modern Gated Developments","₹12 Cr – ₹22 Cr"]]}',
    NULL
  ),
  (
    'bandra-west-micromarket', 2,
    '2. Redevelopment Dynamics and Scarcity',
    ARRAY[
      'Because greenfield plots in Bandra West are entirely non-existent, new inventory is created exclusively through society redevelopments under Regulation 33(7B).',
      'Navigating these developments requires examining developer balance sheets, municipal concessions, and transit-oriented loading allowances. Our advisory team verifies RERA bank escrow disbursements on all projects in this zone.'
    ],
    NULL,
    'Scarcity in Pali Hill ensures that capital appreciation historically outpaces broader suburban averages by 4.2% annually.'
  ),
  (
    'capital-gains-structuring', 1,
    '1. The ₹10 Crore Statutory Threshold',
    ARRAY[
      'Following recent Finance Act amendments, the maximum capital gains tax exemption permissible under Section 54 and Section 54F is capped at ₹10 Crore.',
      'For ultra-high-net-worth families monetizing equity stakes, business assets, or prime commercial parcels, this cap necessitates careful phased deployment and multi-entity family trust structuring.'
    ],
    '{"headers":["Parameter","Section 54","Section 54F"],"rows":[["Original Asset Sold","Residential House Property","Any Long-Term Asset (Shares, Commercial, Land)"],["Reinvestment Requirement","Amount of Capital Gain only","Net Sale Consideration in its entirety"],["Eligible New Asset","One Residential House in India","One Residential House in India"],["Max Exemption Ceiling","₹10 Crore Cap","₹10 Crore Cap"]]}',
    NULL
  ),
  (
    'capital-gains-structuring', 2,
    '2. The Contiguous Unit Precedent',
    ARRAY[
      'When acquiring an entire floor or duplex penthouse comprising two distinct municipal flat numbers, tax authorities frequently dispute whether it qualifies as "one residential house".',
      'Judicial precedents by the Bombay High Court have consistently held that if multiple adjacent apartments are modified into a single habitable residential unit with a common kitchen, the exemption is legally valid. Our advisory desk coordinates with leading chartered accountants and architects to furnish the necessary physical inspection and amalgamation certificates.'
    ],
    NULL,
    'Amalgamating adjacent units into a single home requires formal municipal modification and architect certification to protect your Section 54 claim.'
  )
) AS s(slug, section_order, heading, paragraphs, table_data, highlight_quote)
  ON u.slug = s.slug;

-- Done.
