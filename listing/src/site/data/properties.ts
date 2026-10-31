import { Property } from '@/site/types/property';
export type { Property } from '@/site/types/property';

export const PROPERTIES: Property[] = [
  // ============================================================================
  // 🌟 [SECTION 1: FEATURED PROPERTIES SHOWCASE]
  // ----------------------------------------------------------------------------
  // The first 6 properties below are showcased on the HOME PAGE in the
  // "FEATURED PROPERTIES" 3-column grid, and also appear on the BUY PAGE (/properties?tab=buy).
  // ============================================================================

  // ----------------------------------------------------------------------------
  // [FEATURED PROPERTY 1 of 6]
  // 📍 LISTED ON:
  //    • HOME PAGE (Featured Properties Section - Card 1)
  //    • BUY PAGE (/properties?tab=buy)
  //    • LUXURY COLLECTION PAGE (/properties?tab=luxury-collection)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-1',
    slug: 'the-aurum-sea-residence-worli',
    title: 'The Aurum Sea Residence',
    tagline: 'Uninterrupted Arabian Sea Panoramas from Worli Sea Face',
    location: 'Worli',
    subLocation: 'Worli Sea Face, South Mumbai',
    price: 32.5,
    priceFormatted: '₹32.50 Cr',
    bhk: '4 BHK',
    carpetArea: 3850,
    superArea: 4900,
    propertyType: 'Sea-Facing Apartment',
    possession: 'Ready to Move',
    floor: '42nd Floor of 58',
    featured: true,
    recentlyAdded: false,
    recommended: true,
    isLuxuryCollection: false,
    coverImage: '/properties/worli-aurum/cover.jpg',
    images: [
      '/properties/worli-aurum/cover.jpg',
      '/hero/hero-1-crisp.jpg',
      '/hero/hero-2-crisp.jpg',
    ],
    amenities: ['Private Elevator', 'Infinity Sky Pool', 'Concierge & Valet', 'Sea-Facing Balconies', 'Automated Smart Home', 'Temperature Controlled Wine Cellar'],
    description: 'An architectural magnum opus rising above the iconic Worli Sea Face promenade. Experience panoramic Arabian sea views from floor-to-ceiling glass expanses, bespoke Italian marble flooring, and private sky decks.',
    highlights: ['180° Arabian Sea View', 'Direct Sea Link connectivity', 'Triple-height private entrance lobby'],
    reraId: 'P51900028192',
    coordinates: { lat: 19.0144, lng: 72.8159 },
    floorPlans: [
      { title: 'Master Suite & Living Pavilion', area: '2,200 sq.ft', description: 'Expansive oceanfront formal salon with cantilevered balcony.' },
      { title: 'Guest & Family Quarters', area: '1,650 sq.ft', description: '3 en-suite bedrooms with Italian walk-in wardrobes.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [FEATURED PROPERTY 2 of 6]
  // 📍 LISTED ON:
  //    • HOME PAGE (Featured Properties Section - Card 2)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-2',
    slug: 'palisades-crest-bandra-west',
    title: 'Palisades Crest',
    tagline: 'Quiet Luxury in the Heart of Bandra’s Most Coveted Enclave',
    location: 'Bandra West',
    subLocation: 'Pali Hill, Bandra West',
    price: 24.0,
    priceFormatted: '₹35.00 Cr',
    bhk: '3 BHK',
    carpetArea: 2450,
    superArea: 3200,
    propertyType: 'Sky Villa',
    possession: 'Ready to Move',
    floor: '12th Floor of 18',
    featured: true,
    recentlyAdded: false,
    recommended: true,
    coverImage: '/properties/bandra-palisades/cover.jpg',
    images: [
      '/properties/bandra-palisades/cover.jpg',
      '/hero/hero-2-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['Private Plunge Pool', 'Private Terrace Garden', 'Clubhouse & Spa', 'Automated Shading', 'EV Charging Bays', '24/7 Biometric Security'],
    description: 'Tucked away in the serene greenery of Pali Hill, Bandra West. Crafted for discerning tastemakers seeking absolute privacy, lush canopy views, and contemporary minimalist luxury.',
    highlights: ['Low-density boutique tower', 'Steps from Bandra’s finest culinary scene', 'Double-height living pavilion'],
    reraId: 'P51800034871',
    coordinates: { lat: 19.0607, lng: 72.8258 },
    floorPlans: [
      { title: 'Major Plan', area: '1,500 sq.ft', description: 'Master architectural layout, private pool sundeck, and gourmet show kitchen.' },
      { title: 'Floor Plan', area: '950 sq.ft', description: 'Master sanctum with private leafy balcony.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [FEATURED PROPERTY 3 of 6]
  // 📍 LISTED ON:
  //    • HOME PAGE (Featured Properties Section - Card 3)
  //    • BUY PAGE (/properties?tab=buy)
  //    • LUXURY COLLECTION PAGE (/properties?tab=luxury-collection)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-3',
    slug: 'solitaire-manor-juhu',
    title: 'Solitaire Manor',
    tagline: 'Beachside Elegance & Exclusive High-Rise Sanctuary',
    location: 'Juhu',
    subLocation: 'Juhu Tara Road, Mumbai',
    price: 28.75,
    priceFormatted: '₹28.75 Cr',
    bhk: '4 BHK',
    carpetArea: 3200,
    superArea: 4250,
    propertyType: 'Penthouse',
    possession: 'Ready to Move',
    floor: '16th Floor of 16',
    featured: true,
    recentlyAdded: false,
    recommended: true,
    isLuxuryCollection: true,
    coverImage: '/properties/juhu-solitaire/cover.jpg',
    images: [
      '/properties/juhu-solitaire/cover.jpg',
      '/hero/hero-3-crisp.jpg',
      '/hero/hero-1-crisp.jpg',
    ],
    amenities: ['Private Rooftop Observatory', 'Direct Beach Access Path', 'Heated Jacuzzi Spa', 'Italian Designer Kitchen', 'High-Speed Private Lift', 'Valet Parking for 3 Cars'],
    description: 'Directly overlooking the sands of Juhu Beach. Solitaire Manor occupies the entire top level, offering an exclusive rooftop terrace with unbroken sea views and a private jacuzzi under the stars.',
    highlights: ['Exclusive single-residence floor', 'Private beach access gate', 'Private rooftop observatory'],
    reraId: 'P51800021940',
    coordinates: { lat: 19.0988, lng: 72.8264 },
    floorPlans: [
      { title: 'Penthouse Main Level', area: '2,400 sq.ft', description: 'Grand great room, four en-suite bedrooms, and wraparound sundeck.' },
      { title: 'Private Sky Observatory', area: '800 sq.ft', description: 'Open-air lounge with jacuzzi and direct beach horizon.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [FEATURED PROPERTY 4 of 6]
  // 📍 LISTED ON:
  //    • HOME PAGE (Featured Properties Section - Card 4)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-4',
    slug: 'the-pavilion-sky-villas-lower-parel',
    title: 'The Pavilion Sky Villas',
    tagline: 'Modern Opulence Above Mumbai’s Corporate & Lifestyle Epicenter',
    location: 'Lower Parel',
    subLocation: 'Senapati Bapat Marg, Lower Parel',
    price: 19.5,
    priceFormatted: '₹19.50 Cr',
    bhk: '4 BHK',
    carpetArea: 2900,
    superArea: 3750,
    propertyType: 'Sky Villa',
    possession: 'Ready to Move',
    floor: '55th Floor of 70',
    featured: false,
    recentlyAdded: true,
    recommended: true,
    coverImage: '/properties/lower-parel-pavilion/cover.jpg',
    images: [
      '/properties/lower-parel-pavilion/cover.jpg',
      '/hero/hero-1-crisp.jpg',
      '/hero/hero-2-crisp.jpg',
    ],
    amenities: ['Olympic Heated Pool', 'Private Screening Theatre', 'Squash & Tennis Courts', 'Cigar & Whiskey Lounge', 'Helipad Access', 'Valet Parking for 4 Cars'],
    description: 'Rising grandly above Lower Parel, this sky villa commands breathtaking day-and-night skyline vistas, seamless access to Mumbai’s business hubs, and unmatched 5-star lifestyle amenities.',
    highlights: ['Floor-to-ceiling glass curtain walls', 'Dedicated lifestyle concierge', 'Zero common walls'],
    reraId: 'P51900018442',
    coordinates: { lat: 18.9986, lng: 72.8315 },
    floorPlans: [
      { title: 'Panoramic Sky Residence', area: '2,900 sq.ft', description: 'Double-height living pavilion with city skyline vistas.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [FEATURED PROPERTY 5 of 6]
  // 📍 LISTED ON:
  //    • HOME PAGE (Featured Properties Section - Card 5)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-5',
    slug: 'verve-belvedere-prabhadevi',
    title: 'Verve Belvedere',
    tagline: 'Refined Coastal Grandeur Near Siddhivinayak',
    location: 'Prabhadevi',
    subLocation: 'Prabhadevi Seafront, South Mumbai',
    price: 21.8,
    priceFormatted: '₹21.80 Cr',
    bhk: '3 BHK',
    carpetArea: 2600,
    superArea: 3400,
    propertyType: 'Sea-Facing Apartment',
    possession: 'Ready to Move',
    floor: '28th Floor of 40',
    featured: false,
    recentlyAdded: true,
    recommended: false,
    coverImage: '/properties/prabhadevi-verve/cover.jpg',
    images: [
      '/properties/prabhadevi-verve/cover.jpg',
      '/hero/hero-2-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['State-of-the-Art Gymnasium', 'Yoga & Meditation Pavilion', 'Private Elevators', 'Lush Podium Gardens', 'High-Speed Fibre & Smart Security'],
    description: 'Perfect harmony between cultural heritage and ultra-modern coastal architecture. Unobstructed sea horizons and direct connectivity to both South Mumbai and BKC.',
    highlights: ['Unbroken view of Sea Link', 'LEED Platinum Certified Green Building', 'Vastu-compliant layout'],
    reraId: 'P51900029511',
    coordinates: { lat: 19.0166, lng: 72.8295 },
    floorPlans: [
      { title: 'Full Floor Suite', area: '2,600 sq.ft', description: 'Vastu-aligned 3 BHK layout with unobstructed coastal horizon.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [FEATURED PROPERTY 6 of 6]
  // 📍 LISTED ON:
  //    • HOME PAGE (Featured Properties Section - Card 6)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-6',
    slug: 'lake-panache-estates-powai',
    title: 'The Panache Sky Suites',
    tagline: 'Tranquil Urban Luxury Overlooking Powai Lake',
    location: 'Powai',
    subLocation: 'Hiranandani Gardens, Powai',
    price: 14.5,
    priceFormatted: '₹14.50 Cr',
    bhk: '4 BHK',
    carpetArea: 2800,
    superArea: 3600,
    propertyType: 'Duplex',
    possession: 'Ready to Move',
    floor: '22nd & 23rd Duplex',
    featured: false,
    recentlyAdded: false,
    recommended: false,
    coverImage: '/properties/powai-lake/cover.jpg',
    images: [
      '/properties/powai-lake/cover.jpg',
      '/hero/hero-3-crisp.jpg',
      '/hero/hero-1-crisp.jpg',
    ],
    amenities: ['Lakeview Terrace', 'Private Spa Suite', 'Biophilic Indoor Atrium', 'Tennis Academy Access', 'Multi-tier Security', 'Childrens Play Pavilion'],
    description: 'A bespoke double-storey duplex overlooking serene waters of Powai Lake and forested hill slopes. European neoclassical architecture with sprawling interior volumes.',
    highlights: ['Direct lakefront promenade views', 'Double-height cathedral ceilings in living salon', 'Minutes from Powai business centers'],
    reraId: 'P51800019234',
    coordinates: { lat: 19.1176, lng: 72.9060 },
    floorPlans: [
      { title: 'Lower Duplex Level', area: '1,600 sq.ft', description: 'Grand double-height foyer, formal drawing room, and dining salon.' },
      { title: 'Upper Duplex Level', area: '1,200 sq.ft', description: 'Three private ensuite bedrooms with lakeview balconies.' },
    ],
  },

  // ============================================================================
  // 🏢 [SECTION 2: BUY RESIDENCES PORTFOLIO]
  // ----------------------------------------------------------------------------
  // The properties below appear on the BUY PAGE (/properties?tab=buy)
  // and in the Locations directory (/locations).
  // Properties with `isLuxuryCollection: true` also appear on the LUXURY COLLECTION page.
  // ============================================================================

  // ----------------------------------------------------------------------------
  // [BUY RESIDENCE 7]
  // 📍 LISTED ON:
  //    • BUY PAGE (/properties?tab=buy)
  //    • LUXURY COLLECTION PAGE (/properties?tab=luxury-collection)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-7',
    slug: 'malabar-crest-governor-hill',
    title: 'Malabar Crest Manor',
    tagline: 'South Mumbai Heritage & Ultra-Elite Bay Panoramas',
    location: 'Malabar Hill',
    subLocation: 'Walkeshwar Road, Malabar Hill',
    price: 45.0,
    priceFormatted: '₹45.00 Cr',
    bhk: '5 BHK',
    carpetArea: 4600,
    superArea: 6000,
    propertyType: 'Penthouse',
    possession: 'Immediate',
    floor: 'Top Floor Signature Penthouse',
    featured: true,
    recentlyAdded: true,
    recommended: true,
    isLuxuryCollection: true,
    coverImage: '/properties/worli-aurum/cover.jpg',
    images: [
      '/properties/worli-aurum/cover.jpg',
      '/hero/hero-1-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['Private Swimming Pool', 'Direct Queens Necklace Panoramas', 'Grand Porte-Cochere', 'Private 6-Car Garages', 'Butler Residence', 'Bullet-resistant Glass'],
    description: 'The pinnacle of Mumbai prestige. Nestled atop prestigious Malabar Hill overlooking Back Bay and the glowing Queen’s Necklace. An ultra-rare trophy residence offering generational exclusivity.',
    highlights: ['Unrivaled Queens Necklace vista', 'Private elevator opening to sky foyer', 'Diplomatic-grade security'],
    reraId: 'P51900031102',
    coordinates: { lat: 18.9548, lng: 72.7985 },
    floorPlans: [
      { title: 'Grand Penthouse Level', area: '4,600 sq.ft', description: 'Five presidential master suites, 360-degree glass gallery, and banquet room.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [BUY RESIDENCE 8]
  // 📍 LISTED ON:
  //    • BUY PAGE (/properties?tab=buy)
  //    • LUXURY COLLECTION PAGE (/properties?tab=luxury-collection)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-8',
    slug: 'cuffe-parade-regalia',
    title: 'Cuffe Parade Regalia',
    tagline: 'Colaba Waterfront Haven with Arabian Sea Horizon',
    location: 'Cuffe Parade',
    subLocation: 'Cuffe Parade, South Mumbai',
    price: 36.0,
    priceFormatted: '₹36.00 Cr',
    bhk: '4 BHK',
    carpetArea: 3500,
    superArea: 4400,
    propertyType: 'Sea-Facing Apartment',
    possession: 'Ready to Move',
    floor: '31st Floor of 36',
    featured: true,
    recentlyAdded: false,
    recommended: true,
    isLuxuryCollection: true,
    coverImage: '/properties/bandra-palisades/cover.jpg',
    images: [
      '/properties/bandra-palisades/cover.jpg',
      '/hero/hero-3-crisp.jpg',
      '/hero/hero-2-crisp.jpg',
    ],
    amenities: ['Deep Sea Facing Balconies', 'Private Foyer Elevators', 'Indoor Temperature Controlled Pool', '24/7 Diplomatic Security Desk', 'Resident Wine Lounge'],
    description: 'Commanding front-line sea frontage at the southern tip of Mumbai. Elegant maritime architecture with wraparound glass balustrades framing sweeping vistas of ocean vessels and coastal sunsets.',
    highlights: ['Front-line Arabian Sea frontage', 'Walkable to Colaba clubs and art district', 'Ultra-low density community'],
    reraId: 'P51900019940',
    coordinates: { lat: 18.9100, lng: 72.8200 },
    floorPlans: [
      { title: 'Waterfront Living Suite', area: '3,500 sq.ft', description: 'Oceanfront master suite with dual dressing rooms and terrace.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [BUY RESIDENCE 9]
  // 📍 LISTED ON:
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-9',
    slug: 'khar-west-bel-air',
    title: 'Bel Air Residences Khar',
    tagline: 'Contemporary Chic Living Minutes from Carter Road',
    location: 'Khar West',
    subLocation: '14th Road, Khar West',
    price: 18.25,
    priceFormatted: '₹18.25 Cr',
    bhk: '3 BHK',
    carpetArea: 2150,
    superArea: 2800,
    propertyType: 'Luxury Estate',
    possession: 'Ready to Move',
    floor: '9th Floor of 14',
    featured: false,
    recentlyAdded: true,
    recommended: true,
    coverImage: '/properties/juhu-solitaire/cover.jpg',
    images: [
      '/properties/juhu-solitaire/cover.jpg',
      '/hero/hero-3-crisp.jpg',
      '/hero/hero-2-crisp.jpg',
    ],
    amenities: ['Rooftop Zen Garden', 'Fitness Studio', 'Automated Parking Stack', 'Private Balconies', 'Smart Security System'],
    description: 'A boutique modernist building in fashionable Khar West. Thoughtfully oriented to capture coastal cross-breezes while offering quiet residential tranquility.',
    highlights: ['Minutes from Carter Road promenade', 'Full floor-plate privacy', 'Imported Italian joinery'],
    reraId: 'P51800028821',
    coordinates: { lat: 19.0700, lng: 72.8350 },
    floorPlans: [
      { title: 'Boutique Residence', area: '2,150 sq.ft', description: 'Clean open-plan entertaining pavilion and three generous bedrooms.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [BUY RESIDENCE 10]
  // 📍 LISTED ON:
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-10',
    slug: 'bkc-one-signature-suites',
    title: 'BKC One Signature Suites',
    tagline: 'Executive Luxury in Mumbai’s Premier Financial District',
    location: 'BKC',
    subLocation: 'G Block, Bandra Kurla Complex',
    price: 16.8,
    priceFormatted: '₹16.80 Cr',
    bhk: '3 BHK',
    carpetArea: 2300,
    superArea: 3000,
    propertyType: 'Sky Villa',
    possession: 'Ready to Move',
    floor: '24th Floor of 32',
    featured: false,
    recentlyAdded: true,
    recommended: false,
    coverImage: '/properties/lower-parel-pavilion/cover.jpg',
    images: [
      '/properties/lower-parel-pavilion/cover.jpg',
      '/hero/hero-1-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['Business Lounge & Boardroom', 'Heated Indoor Pool', 'Private Dining Club', 'Helipad Access', 'Electric Car Charging Bay'],
    description: 'The ultimate metropolitan residence for corporate titans and global executives. Located steps from Mumbai’s world-class financial institutions, fine dining, and cultural centres.',
    highlights: ['Zero commute to BKC financial hub', 'Five-star hotel concierge services', 'Private business suites on podium'],
    reraId: 'P51800015502',
    coordinates: { lat: 19.0657, lng: 72.8688 },
    floorPlans: [
      { title: 'Executive Suite', area: '2,300 sq.ft', description: 'Sprawling master bedroom with office study and private terrace.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [BUY RESIDENCE 11]
  // 📍 LISTED ON:
  //    • BUY PAGE (/properties?tab=buy)
  //    • LUXURY COLLECTION PAGE (/properties?tab=luxury-collection)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-11',
    slug: 'worli-sea-breeze-pavilion',
    title: 'Sea Breeze Pavilion Worli',
    tagline: 'Skyline Icon Overlooking Mahalaxmi Racecourse & Sea',
    location: 'Worli',
    subLocation: 'Dr. Annie Besant Road, Worli',
    price: 27.5,
    priceFormatted: '₹27.50 Cr',
    bhk: '4 BHK',
    carpetArea: 3100,
    superArea: 4100,
    propertyType: 'Sky Villa',
    possession: 'Ready to Move',
    floor: '38th Floor of 65',
    featured: true,
    recentlyAdded: true,
    recommended: true,
    isLuxuryCollection: true,
    coverImage: '/properties/prabhadevi-verve/cover.jpg',
    images: [
      '/properties/prabhadevi-verve/cover.jpg',
      '/hero/hero-2-crisp.jpg',
      '/hero/hero-1-crisp.jpg',
    ],
    amenities: ['Dual Sea & Racecourse Views', 'Private Spa Suite', 'Temperature Controlled Infinity Pool', 'Screening Theatre', 'Cigar Room'],
    description: 'Perched high in an iconic Worli landmark, offering twin vistas of the Arabian Sea to the west and the emerald expanse of Mahalaxmi Racecourse to the east.',
    highlights: ['Dual-aspect ocean and racecourse views', 'Double-height sundeck', 'Private express elevators'],
    reraId: 'P51900024410',
    coordinates: { lat: 19.0050, lng: 72.8180 },
    floorPlans: [
      { title: 'Dual Aspect Grand Villa', area: '3,100 sq.ft', description: 'Wraparound glass walls with dual views of sea and racecourse.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [BUY RESIDENCE 12]
  // 📍 LISTED ON:
  //    • BUY PAGE (/properties?tab=buy)
  //    • LUXURY COLLECTION PAGE (/properties?tab=luxury-collection)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-12',
    slug: 'juhu-coastal-villa-estates',
    title: 'The Juhu Dunes Villa',
    tagline: 'Rare Low-Rise Private Coastal Villa Sanctuary',
    location: 'Juhu',
    subLocation: 'Ruia Park, Juhu',
    price: 52.0,
    priceFormatted: '₹52.00 Cr',
    bhk: '5 BHK',
    carpetArea: 5500,
    superArea: 7200,
    propertyType: 'Luxury Estate',
    possession: 'Immediate',
    floor: 'Independent 3-Storey Villa',
    featured: true,
    recentlyAdded: false,
    recommended: true,
    isLuxuryCollection: true,
    coverImage: '/properties/powai-lake/cover.jpg',
    images: [
      '/properties/powai-lake/cover.jpg',
      '/hero/hero-1-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['Private Heated Pool & Lawn', 'Private Elevator', 'Basement Home Cinema', 'Servants Quarters for 4', '5 Car Parking Courtyard', 'Security Outpost'],
    description: 'An exceedingly rare standalone beachside villa estate in Juhu’s quietest private enclave. Uncompromising space, lush private landscaped gardens, and absolute discretion.',
    highlights: ['Standalone private land title', 'Private pool and private landscaped lawn', 'Minutes to beach access'],
    reraId: 'P51800039912',
    coordinates: { lat: 19.1020, lng: 72.8280 },
    floorPlans: [
      { title: 'Ground Floor & Garden Pavilions', area: '2,200 sq.ft', description: 'Pool deck, living salon, banquet dining room, and professional kitchen.' },
      { title: 'First Floor Family Sanctum', area: '2,000 sq.ft', description: 'Four large ensuite bedrooms with private garden terraces.' },
      { title: 'Top Floor Master Penthouse', area: '1,300 sq.ft', description: 'Presidential suite with open sky terrace and private gym.' },
    ],
  },

  // ============================================================================
  // 🚀 [SECTION 3: NEW LAUNCHES & PRE-LAUNCH OPPORTUNITIES]
  // ----------------------------------------------------------------------------
  // The properties below appear on the NEW LAUNCHES page (/properties?tab=new-launches)
  // and also on the BUY page (/properties?tab=buy).
  // Properties with `isLuxuryCollection: true` also appear on the LUXURY COLLECTION page.
  // ============================================================================

  // ----------------------------------------------------------------------------
  // [NEW LAUNCH PROPERTY 1 of 4]
  // 📍 LISTED ON:
  //    • NEW LAUNCHES PAGE (/properties?tab=new-launches)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-13',
    slug: 'lumina-marina-bay-worli',
    title: 'The Lumina Marina Bay',
    tagline: 'Pre-Launch Waterfront Residences with Direct Sea Link Panoramas',
    location: 'Worli',
    subLocation: 'Worli Sea Face Promenade, South Mumbai',
    price: 17.5,
    priceFormatted: '₹17.50 Cr',
    bhk: '3 BHK',
    carpetArea: 2250,
    superArea: 2950,
    propertyType: 'Sea-Facing Apartment',
    possession: 'Pre-Launch',
    possessionDate: 'Q4 2027',
    floor: 'Choice of Low, Mid & High Sky Decks',
    featured: true,
    recentlyAdded: true,
    recommended: true,
    isNewLaunch: true,
    completionYear: '2027',
    coverImage: '/properties/worli-aurum/cover.jpg',
    images: [
      '/properties/worli-aurum/cover.jpg',
      '/hero/hero-1-crisp.jpg',
      '/hero/hero-2-crisp.jpg',
    ],
    amenities: ['Pre-Launch Price Advantage', 'Triple-height Ocean Sky Club', 'Direct Sea Link Access', 'EV Charging Bays', 'MahaRERA Registered', 'Flexible Construction-Linked Payment'],
    description: 'A landmark pre-launch opportunity rising along Worli’s iconic seafront promenade. Designed by internationally acclaimed architects, Lumina Marina Bay introduces cantilevered sky decks, acoustic glass curtain walls, and exclusive early-allocation investor pricing.',
    highlights: ['Pre-Launch EOI window open', 'Expressions of interest eligible for priority floor selection', '180° uninterrupted coastal horizon'],
    reraId: 'P51900048210',
    coordinates: { lat: 19.0125, lng: 72.8165 },
    floorPlans: [
      { title: 'Pre-Launch 3 BHK Suite', area: '2,250 sq.ft', description: 'Generous oceanfront living pavilion and 3 en-suite bedrooms.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [NEW LAUNCH PROPERTY 2 of 4]
  // 📍 LISTED ON:
  //    • NEW LAUNCHES PAGE (/properties?tab=new-launches)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-14',
    slug: 'mirador-sky-mansions-bandra',
    title: 'Mirador Sky Mansions',
    tagline: 'Under-Construction Boutique Tower on Perry Cross Road',
    location: 'Bandra West',
    subLocation: 'Perry Cross Road, Bandra West',
    price: 23.5,
    priceFormatted: '₹23.50 Cr',
    bhk: '4 BHK',
    carpetArea: 2750,
    superArea: 3500,
    propertyType: 'Sky Villa',
    possession: 'Under Construction',
    possessionDate: 'Dec 2026',
    floor: '18th Floor of 24',
    featured: true,
    recentlyAdded: true,
    recommended: true,
    isNewLaunch: true,
    completionYear: '2026',
    coverImage: '/properties/bandra-palisades/cover.jpg',
    images: [
      '/properties/bandra-palisades/cover.jpg',
      '/hero/hero-2-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['Rooftop Infinity Lap Pool', 'Private Elevator Foyer', 'Automated Smart Home Hub', 'Boutique Gymnasium', 'MahaRERA Approved Milestone Payments'],
    description: 'Rising on Perry Cross Road in Bandra West, Mirador Sky Mansions is an exclusive 24-storey boutique address delivering one bespoke sky mansion per floor. Currently at advanced slab construction with planned handover in December 2026.',
    highlights: ['Single residence per floor plate', 'Prime Perry Cross Road tranquility', 'Customizable interior layouts during construction'],
    reraId: 'P51800049921',
    coordinates: { lat: 19.0585, lng: 72.8270 },
    floorPlans: [
      { title: 'Full Floor Mansion', area: '2,750 sq.ft', description: 'Single-residence floorplate with 360-degree canopy cross ventilation.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [NEW LAUNCH PROPERTY 3 of 4]
  // 📍 LISTED ON:
  //    • NEW LAUNCHES PAGE (/properties?tab=new-launches)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-15',
    slug: 'one-bayview-towers-sewri',
    title: 'One Bayview Promenade',
    tagline: 'Upcoming Coastal Tower Connected to the Mumbai Trans Harbour Link',
    location: 'Sewri',
    subLocation: 'Marine Bay Corridor, Sewri',
    price: 12.8,
    priceFormatted: '₹12.80 Cr',
    bhk: '3 BHK',
    carpetArea: 1950,
    superArea: 2550,
    propertyType: 'Sea-Facing Apartment',
    possession: 'Pre-Launch',
    possessionDate: 'Q2 2028',
    floor: 'Choice of High-Rise Floors',
    featured: false,
    recentlyAdded: true,
    recommended: true,
    isNewLaunch: true,
    completionYear: '2028',
    coverImage: '/properties/lower-parel-pavilion/cover.jpg',
    images: [
      '/properties/lower-parel-pavilion/cover.jpg',
      '/hero/hero-1-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['Flamingo Bay Panoramas', 'Direct Atal Setu (MTHL) Expressway Ramp', '50,000 sq.ft Podium Club', 'Pre-Launch Investor Allocation', 'Tennis Courts & Squash'],
    description: 'Poised to become the eastern coastal icon of South-Central Mumbai. Benefiting from the transformative Atal Setu (MTHL) connectivity, One Bayview Promenade offers panoramic views of the Arabian Sea and flamingo sanctuaries.',
    highlights: ['Pre-launch priority pricing', 'High-capital-appreciation corridor', 'Direct connector to Navi Mumbai & upcoming International Airport'],
    reraId: 'P51900051180',
    coordinates: { lat: 19.0010, lng: 72.8550 },
    floorPlans: [
      { title: 'Bayview 3 BHK', area: '1,950 sq.ft', description: 'Optimized coastal layout with sunrise bay balcony.' },
    ],
  },

  // ----------------------------------------------------------------------------
  // [NEW LAUNCH PROPERTY 4 of 4]
  // 📍 LISTED ON:
  //    • NEW LAUNCHES PAGE (/properties?tab=new-launches)
  //    • LUXURY COLLECTION PAGE (/properties?tab=luxury-collection)
  //    • BUY PAGE (/properties?tab=buy)
  // ----------------------------------------------------------------------------
  {
    id: 'prop-16',
    slug: 'the-reserve-at-malabar',
    title: 'The Reserve at Walkeshwar',
    tagline: 'Under-Construction Ultra-Luxury Signature Tower in Malabar Hill',
    location: 'Malabar Hill',
    subLocation: 'Walkeshwar Road, Malabar Hill',
    price: 38.0,
    priceFormatted: '₹38.00 Cr',
    bhk: '4 BHK',
    carpetArea: 3900,
    superArea: 5100,
    propertyType: 'Sky Villa',
    possession: 'Under Construction',
    possessionDate: 'Mid 2027',
    floor: '26th Floor of 34',
    featured: true,
    recentlyAdded: true,
    recommended: true,
    isNewLaunch: true,
    isLuxuryCollection: true,
    completionYear: '2027',
    coverImage: '/properties/worli-aurum/cover.jpg',
    images: [
      '/properties/worli-aurum/cover.jpg',
      '/hero/hero-2-crisp.jpg',
      '/hero/hero-3-crisp.jpg',
    ],
    amenities: ['Direct Queen’s Necklace Horizon', 'Heated Indoor Sky Pool', 'Private Wine Tasting Cellar', 'Biometric Elevators', '24/7 White-Glove Butler Desk'],
    description: 'An ultra-rare under-construction masterpiece on prestigious Walkeshwar Road. Limited to only 14 bespoke residences, offering unmatched privacy, monumental ceiling heights, and sweeping panoramas of Mumbai’s glittering Back Bay.',
    highlights: ['Bespoke ultra-luxury under construction', 'Delivery targeted Mid 2027', 'Direct Back Bay & Queen’s Necklace vista'],
    reraId: 'P51900052304',
    coordinates: { lat: 18.9510, lng: 72.7995 },
    floorPlans: [
      { title: 'Signature Sky Villa', area: '3,900 sq.ft', description: 'Four palatial master bedroom suites with deep ocean-facing verandas.' },
    ],
  },
];
