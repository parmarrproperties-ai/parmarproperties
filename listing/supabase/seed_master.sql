-- Parmar Properties Admin CMS — master specification reference data
-- Run after 004_master_schema.sql.
--
-- Unlike seed.sql, this is not sample content: the lookup catalogues are the
-- option lists the website and this admin read at runtime, and the page
-- content rows are the editorial copy for each route, taken from
-- MASTER_BACKEND_SPEC.md.
--
-- Safe to run more than once. Existing rows are left exactly as they are, so
-- re-running never overwrites an edit made from the admin.

BEGIN;

-- ============================================================
-- BHK CONFIGURATIONS
-- ============================================================

INSERT INTO lookup_bhk (slug, name, display_order) VALUES
  ('any',         'Any Configuration',     0),
  ('3-bhk',       '3 BHK',                 1),
  ('4-bhk',       '4 BHK',                 2),
  ('5-bhk',       '5 BHK',                 3),
  ('6-plus-bhk',  '6+ BHK / Penthouse',    4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CONSTRUCTION STATUS
-- ============================================================

INSERT INTO lookup_construction_status (slug, name, display_order) VALUES
  ('ready-to-move',      'Ready to Move In',   0),
  ('under-construction', 'Under Construction', 1),
  ('pre-launch',         'Pre-Launch',         2),
  ('luxury-collection',  'Luxury Collection',  3),
  ('resale',             'Resale',             4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- RESIDENTIAL PROPERTY TYPES
-- ============================================================

INSERT INTO lookup_property_types (slug, name, display_order) VALUES
  ('sea-facing-apartment', 'Sea-Facing Apartment', 0),
  ('penthouse',            'Penthouse',            1),
  ('sky-villa',            'Sky Villa',            2),
  ('duplex',               'Duplex',               3),
  ('luxury-estate',        'Luxury Estate',        4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- COMMERCIAL PROPERTY TYPES
-- ============================================================

INSERT INTO lookup_commercial_types (slug, name, display_order) VALUES
  ('grade-a-office',       'Grade-A Office',       0),
  ('corporate-hq',         'Corporate HQ',         1),
  ('high-street-retail',   'High-Street Retail',   2),
  ('commercial-penthouse', 'Commercial Penthouse', 3),
  ('boutique-office',      'Boutique Office',      4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MARKET INTELLIGENCE ARTICLE CATEGORIES
-- ============================================================

INSERT INTO lookup_article_categories (slug, name, display_order) VALUES
  ('location', 'Location Guides & Micro-Market Analysis',      0),
  ('price',    'Price Benchmarks & Capital Appreciation',      1),
  ('buyer',    'Buyer Advisory & Architecture',                2),
  ('nri',      'Cross-Border & NRI Regulatory Playbook',       3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- LEAD SOURCES — one per form or modal on the website
-- ============================================================

INSERT INTO lookup_lead_sources (slug, name, display_order) VALUES
  ('navbar_advisory',            'Navbar Advisory Modal',            0),
  ('private_opportunities_otp',  'Private Opportunities Gate',       1),
  ('property_gate_modal',        'Property Resource Gate',           2),
  ('property_sidebar_inquiry',   'Property Detail Sidebar Form',     3),
  ('commercial_card_modal',      'Commercial Acquisition Dossier',   4),
  ('article_consultation_modal', 'Article Consultation Modal',       5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- LEAD STATUSES — the CRM pipeline
-- ============================================================

INSERT INTO lookup_lead_statuses (slug, name, display_order) VALUES
  ('new',               'New Inquiry Received',       0),
  ('assigned',          'Assigned to Senior Advisor', 1),
  ('contacted',         'Client Contacted',           2),
  ('viewing_scheduled', 'Site Viewing Scheduled',     3),
  ('negotiation',       'Term Sheet / Negotiation',   4),
  ('closed_won',        'Transaction Closed',         5),
  ('disqualified',      'Disqualified / Spam',        6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PAGE CONTENT — one row per route
-- ============================================================

INSERT INTO page_content (
  id, title, subtitle, breadcrumb, badge, meta_title, meta_description,
  sections_data
) VALUES
  (
    'home',
    'MUMBAI''S FINEST ADDRESSES',
    'Curated residences, private opportunities and investment properties across Mumbai''s most sought after neighbourhoods',
    'Home',
    NULL,
    'Parmar Properties | Luxury Real Estate Mumbai',
    'Curated portfolio of prime waterfront residences across Mumbai.',
    jsonb_build_object(
      'hero_headline', 'MUMBAI''S FINEST ADDRESSES',
      'hero_subtext', 'Curated residences, private opportunities and investment properties across Mumbai''s most sought after neighbourhoods',
      'hero_slide_duration_ms', 5000,
      'search_min_budget_cr', 3.0,
      'search_max_budget_cr', 60.0,
      'featured_heading', 'FEATURED PROPERTIES',
      'featured_subheading', 'Hand-curated prime residences across Mumbai''s most coveted enclaves.',
      'featured_max_count', 6,
      'location_tag', 'FILTERED BY LOCATION',
      'location_heading', 'EXPLORE PROPERTIES',
      'location_subheading', 'Explore Mumbai''s premier residential micro-markets.',
      'future_locations_label', 'FUTURE LOCATIONS :',
      'why_badge', 'ESTABLISHED 1981 • FOUR DECADES OF EXCELLENCE',
      'why_title_prefix', 'WHY',
      'why_title_highlight', 'PARMAR PROPERTIES',
      'why_subtitle', 'Bespoke advisory for buyers who expect discretion, accuracy and access.',
      'why_trust_metrics', jsonb_build_array(
        jsonb_build_object('value', '40+', 'label', 'Market Leadership', 'sub', 'Generational Expertise'),
        jsonb_build_object('value', '₹5,000+ Cr', 'label', 'Transacted Portfolio', 'sub', 'Discreet advisory volume'),
        jsonb_build_object('value', '9', 'label', 'Micro-Markets', 'sub', 'Prime Mumbai coverage'),
        jsonb_build_object('value', '100%', 'label', 'MahaRERA Verified', 'sub', 'Every listing checked')
      ),
      'why_pillars', jsonb_build_array(
        jsonb_build_object('number', '01', 'title', 'Generational Trust', 'description', 'Four decades of repeat family mandates.', 'badge', 'Heritage'),
        jsonb_build_object('number', '02', 'title', 'Architectural Integrity', 'description', 'Buildings assessed on design, not brochure copy.', 'badge', 'Design'),
        jsonb_build_object('number', '03', 'title', 'Absolute Discretion', 'description', 'Off-market mandates handled privately.', 'badge', 'Privacy'),
        jsonb_build_object('number', '04', 'title', 'Verified Compliance', 'description', 'RERA, title and approvals checked before listing.', 'badge', 'Diligence')
      ),
      'private_badge', 'OFF-MARKET & CONFIDENTIAL',
      'private_heading', 'PRIVATE OPPORTUNITIES',
      'private_paragraphs', jsonb_build_array(
        'A portion of our portfolio is never advertised. These mandates are released only to verified principals.',
        'Complete a one-time verification to view the confidential dossier.'
      ),
      'private_cta_text', 'REQUEST PRIVATE ACCESS',
      'private_disclaimer', 'Verified HNIs, Family Offices & Principals Only'
    )
  ),
  (
    'buy',
    'Buy Mumbai Residences',
    'Explore the complete portfolio of hand-selected, verified ready-to-move and under-construction residences.',
    'Buy',
    NULL,
    'Buy Luxury Residences in Mumbai | Parmar Properties',
    'Verified ready-to-move and under-construction residences across prime Mumbai micro-markets.',
    jsonb_build_object(
      'header_title', 'Buy Mumbai Residences',
      'header_subtitle', 'Explore the complete portfolio of hand-selected, verified ready-to-move and under-construction residences.',
      'budget_default_min', 10.0,
      'budget_default_max', 60.0,
      'empty_heading', 'No Residences Match Your Exact Filter Criteria',
      'empty_reset_btn', 'RESET ALL FILTERS'
    )
  ),
  (
    'new-launches',
    'New Launches & Pre-Launch',
    'Upcoming landmark towers, pre-launch Expression of Interest (EOI) phases and investor milestones.',
    'New Launches',
    NULL,
    'New Launches & Pre-Launch Towers in Mumbai | Parmar Properties',
    'Pre-launch EOI windows, launch phase pricing and MahaRERA approved construction milestones.',
    jsonb_build_object(
      'header_title', 'New Launches & Pre-Launch',
      'header_subtitle', 'Upcoming landmark towers, pre-launch Expression of Interest (EOI) phases and investor milestones.',
      'show_eoi_banner', true,
      'eoi_banner_title', 'Pre-Launch EOI Window Open:',
      'eoi_banner_subtitle', 'Priority floor allocation, launch phase payment flexibilities & MahaRERA approved milestones.',
      'investor_highlights', jsonb_build_array(
        jsonb_build_object('title', 'Pre-Launch Price Advantage', 'description', 'Entry pricing ahead of the public launch schedule.'),
        jsonb_build_object('title', 'Construction Milestones', 'description', 'Payments tied to verified RERA milestones.'),
        jsonb_build_object('title', 'Priority Floor Selection', 'description', 'First allocation on preferred levels and views.')
      )
    )
  ),
  (
    'luxury-collection',
    'The Luxury Collection',
    'Publicly viewable signature trophy assets: oceanfront sky villas and sprawling penthouses.',
    'Luxury Collection',
    NULL,
    'The Luxury Collection | Parmar Properties Mumbai',
    'Trophy residences above ₹25 Cr: oceanfront sky villas, penthouses and generational estates in Mumbai.',
    jsonb_build_object(
      'header_title', 'The Luxury Collection',
      'header_subtitle', 'Publicly viewable signature trophy assets: oceanfront sky villas and sprawling penthouses.',
      'min_price_threshold', 25.0,
      'curation_standards', jsonb_build_array(
        jsonb_build_object('title', 'Waterfront Horizons', 'desc', 'Uninterrupted sea or bay frontage.'),
        jsonb_build_object('title', 'Private Access', 'desc', 'Dedicated lobbies and private elevators.'),
        jsonb_build_object('title', 'Generational Scale', 'desc', 'Floor plates designed to be held for decades.'),
        jsonb_build_object('title', 'Diplomatic Security', 'desc', 'Screened access and round-the-clock protection.')
      )
    )
  ),
  (
    'commercials',
    'COMMERCIAL REAL ESTATE',
    'Grade-A corporate headquarters, boutique office suites and pre-leased assets.',
    'Commercials',
    NULL,
    'Commercial Real Estate in Mumbai | Parmar Properties',
    'Grade-A offices, corporate headquarters and pre-leased commercial assets across BKC, Lower Parel and Worli.',
    jsonb_build_object(
      'header_title', 'COMMERCIAL REAL ESTATE',
      'header_subtitle', 'Grade-A corporate headquarters, boutique office suites and pre-leased assets.',
      'budget_slider_min', 15.0,
      'budget_slider_max', 65.0,
      'dossier_modal_title', 'Commercial Acquisition Desk',
      'dossier_modal_subtitle', 'Receive detailed lease schedules, capital cap rates & architectural floor plans.'
    )
  ),
  (
    'locations',
    'Explore Properties by Location',
    'Explore Mumbai''s premier residential micro-markets.',
    'Locations',
    NULL,
    'Mumbai Micro-Market Directory | Parmar Properties',
    'Micro-market guides for Worli, Bandra West, Juhu, Malabar Hill and the rest of prime Mumbai.',
    jsonb_build_object(
      'header_title', 'Explore Properties by Location',
      'header_subtitle', 'Explore Mumbai''s premier residential micro-markets.',
      'upcoming_pipeline_title', 'Upcoming Location Pipeline',
      'upcoming_pipeline_subtitle', 'Sewri • Powai • Prabhadevi • Pre-Launch Pipeline'
    )
  ),
  (
    'insights',
    'MARKET INTELLIGENCE',
    'Data-backed insights, micro-market pricing analyses, and legal guidance for Mumbai real estate acquisitions.',
    'Market Intelligence',
    'RESEARCH & ADVISORY DESK',
    'Mumbai Market Intelligence & Research | Parmar Properties',
    'Data-backed pricing analyses, micro-market guides and NRI regulatory playbooks for Mumbai real estate.',
    jsonb_build_object(
      'badge', 'RESEARCH & ADVISORY DESK',
      'header_title', 'MARKET INTELLIGENCE',
      'header_subtitle', 'Data-backed insights, micro-market pricing analyses, and legal guidance for Mumbai real estate acquisitions.'
    )
  ),
  (
    'about',
    'Parmar Properties',
    'A Legacy of Discretion & Architectural Integrity',
    'About',
    'Our Heritage • Active Since 1981',
    'About Parmar Properties | Mumbai Real Estate Since 1981',
    'Four decades of discreet advisory on Mumbai''s prime residential addresses, led by founder Vikram Parmar.',
    jsonb_build_object(
      'header_badge', 'Our Heritage • Active Since 1981',
      'header_title', 'Parmar Properties',
      'story_heading', 'A Legacy of Discretion & Architectural Integrity',
      'story_paragraphs', jsonb_build_array(
        'Founded in Mumbai in 1981, the firm began by advising a handful of families on the city''s coastal addresses.',
        'From the iconic coastal towers to today''s off-market mandates, the practice has stayed deliberately small and deliberately private.'
      ),
      'founder_name', 'Vikram Parmar',
      'founder_title', 'Founder & Principal Managing Director',
      'founder_initials', 'VP',
      'metrics', jsonb_build_array(
        jsonb_build_object('value', '₹5,000+ Cr', 'label', 'Transacted Portfolio', 'sub', 'Discreet advisory volume'),
        jsonb_build_object('value', '40+', 'label', 'Years Advising', 'sub', 'Since 1981'),
        jsonb_build_object('value', '9', 'label', 'Micro-Markets', 'sub', 'Prime Mumbai coverage'),
        jsonb_build_object('value', '100%', 'label', 'MahaRERA Verified', 'sub', 'Every listing checked')
      ),
      'pillars', jsonb_build_array(
        jsonb_build_object('title', 'Generational Trust', 'description', 'Families return to us across generations.'),
        jsonb_build_object('title', 'Architectural Integrity', 'description', 'We assess buildings on how they are built, not how they are marketed.'),
        jsonb_build_object('title', 'Absolute Discretion', 'description', 'Mandates and identities stay private.')
      )
    )
  ),
  (
    'compare',
    'Compare Residences',
    'Select up to 4 properties from our portfolio to view a detailed side-by-side analysis.',
    'Compare',
    NULL,
    'Compare Mumbai Residences | Parmar Properties',
    'Compare up to four Mumbai residences side by side on price, carpet rate, possession and RERA registration.',
    jsonb_build_object(
      'max_compare_limit', 4,
      'header_title', 'Compare Residences',
      'empty_heading', 'No Residences Added to Comparison',
      'empty_subtext', 'Select up to 4 properties from our portfolio to view a detailed side-by-side analysis.',
      'attributeLabels', jsonb_build_object(
        'price', 'Price',
        'carpet_area', 'Carpet Area',
        'price_per_sqft', 'Carpet Rate / sq.ft',
        'bhk', 'Configuration',
        'location', 'Location',
        'possession', 'Possession',
        'floor', 'Floor',
        'rera_id', 'MahaRERA ID',
        'amenities', 'Amenities'
      )
    )
  ),
  (
    'saved',
    'Saved Residences',
    'Your saved properties portfolio is secured.',
    'Saved',
    NULL,
    'Saved Residences | Parmar Properties',
    'Your private portfolio of bookmarked Mumbai residences, available after client sign-in.',
    jsonb_build_object(
      'header_title', 'Saved Residences',
      'auth_prompt_heading', 'Client Authentication Required',
      'auth_prompt_desc', 'Your saved properties portfolio is secured. Sign in with your client profile to access and manage your curated Mumbai residences.'
    )
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
