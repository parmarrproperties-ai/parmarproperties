export interface CommercialProperty {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  location: string;
  subLocation: string;
  price: number; // in Cr
  priceFormatted: string;
  carpetArea: number; // in sq ft
  propertyType: 'Grade-A Office' | 'Corporate HQ' | 'High-Street Retail' | 'Commercial Penthouse' | 'Boutique Office';
  possession: 'Ready to Move' | 'Immediate' | 'Under Construction';
  floor: string;
  coverImage: string;
  amenities: string[];
  reraId: string;
  highlights: string[];
  description: string;
}

export const COMMERCIAL_PROPERTIES: CommercialProperty[] = [
  {
    id: 'comm-1',
    slug: 'one-bkc-corporate-chambers',
    title: 'One BKC Financial Tower',
    tagline: 'Ultra-Prime Grade-A Corporate Suite in Mumbai’s Financial Capital',
    location: 'BKC',
    subLocation: 'G Block, Bandra Kurla Complex',
    price: 36.5,
    priceFormatted: '₹36.50 Cr',
    carpetArea: 8500,
    propertyType: 'Grade-A Office',
    possession: 'Ready to Move',
    floor: '18th Floor of 24',
    coverImage: '/properties/lower-parel-pavilion/cover.jpg',
    amenities: ['LEED Gold Certified', 'Private Executive Boardroom', 'High-Speed Elevators', '12 Reserved Car Bays', 'Central HVAC with Fresh Air filtration'],
    reraId: 'P51800062190',
    highlights: ['Zero commute to multinational banks', 'Turnkey premium fit-outs', 'Column-free floor plate'],
    description: 'An iconic commercial address in BKC G Block. Designed for global financial institutions, private equity firms, and corporate headquarters with state-of-the-art building management systems.',
  },
  {
    id: 'comm-2',
    slug: 'worli-seafront-retail-flagship',
    title: 'Worli Promontory Retail Flagship',
    tagline: 'High-Visibility Coastal Retail Suite with Massive Frontage',
    location: 'Worli',
    subLocation: 'Dr. Annie Besant Road, Worli',
    price: 42.0,
    priceFormatted: '₹42.00 Cr',
    carpetArea: 6200,
    propertyType: 'High-Street Retail',
    possession: 'Immediate',
    floor: 'Ground & Mezzanine Level',
    coverImage: '/properties/worli-aurum/cover.jpg',
    amenities: ['Double-Height 22ft Ceiling', 'Prime Arterial Road Frontage', 'Dedicated Valet Bay', 'Heavy Footfall Zone', 'High-Load Glass Facade'],
    reraId: 'P51900058312',
    highlights: ['Direct view on Worli arterial highway', 'Ideal for luxury fashion or auto flagship', 'Triple-height private entrance'],
    description: 'A trophy commercial ground-floor retail acquisition situated on Mumbai’s most prestigious luxury commercial corridor in Worli.',
  },
  {
    id: 'comm-3',
    slug: 'peninsula-spire-lower-parel',
    title: 'Peninsula Spire Corporate HQ',
    tagline: 'Full-Floor Corporate Headquarters in Central Mumbai’s Business Core',
    location: 'Lower Parel',
    subLocation: 'Senapati Bapat Marg, Lower Parel',
    price: 48.0,
    priceFormatted: '₹48.00 Cr',
    carpetArea: 12500,
    propertyType: 'Corporate HQ',
    possession: 'Ready to Move',
    floor: '32nd Full Floor Plate',
    coverImage: '/properties/bandra-palisades/cover.jpg',
    amenities: ['Full Floor Plate Privacy', 'Private Helipad Access', '20 Basement Car Parks', '100% Power Backup', 'Concierge & VIP Lounge'],
    reraId: 'P51900049910',
    highlights: ['Panoramic 360-degree city views', 'Direct access to luxury hotels & dining', 'High corporate density node'],
    description: 'A monument of corporate prestige in Lower Parel. Spanning 12,500 sq.ft of column-free architectural space with panoramic skyline and racecourse panoramas.',
  },
  {
    id: 'comm-4',
    slug: 'pali-hill-creative-studios-bandra',
    title: 'Pali Sanctuary Boutique Suites',
    tagline: 'Discreet Boutique Studio & Family Office Chambers in Bandra',
    location: 'Bandra West',
    subLocation: 'Pali Hill, Bandra West',
    price: 19.8,
    priceFormatted: '₹19.80 Cr',
    carpetArea: 3400,
    propertyType: 'Boutique Office',
    possession: 'Ready to Move',
    floor: '3rd & 4th Floor Duplex',
    coverImage: '/properties/prabhadevi-verve/cover.jpg',
    amenities: ['Private Garden Terrace', 'Dedicated Private Elevator', 'Soundproof Studio Glass', '6 Reserved Car Parks', 'Smart Biometric Access'],
    reraId: 'P51800038820',
    highlights: ['Serene leafy environment in Pali Hill', 'Ideal for family offices and hedge funds', 'Low-density commercial zoning'],
    description: 'An ultra-rare boutique commercial retreat nestled in the green environs of Pali Hill, Bandra West. Tailored for private family offices and discreet creative studios.',
  },
  {
    id: 'comm-5',
    slug: 'powai-tech-horizon-offices',
    title: 'Powai Lakeview Executive Floor',
    tagline: 'Lake-Facing Modern Commercial Suite in Hiranandani',
    location: 'Powai',
    subLocation: 'Hiranandani Business Park, Powai',
    price: 16.5,
    priceFormatted: '₹16.50 Cr',
    carpetArea: 5800,
    propertyType: 'Grade-A Office',
    possession: 'Ready to Move',
    floor: '14th Floor of 20',
    coverImage: '/properties/powai-lake/cover.jpg',
    amenities: ['Lake View Offices', 'Cafeteria & Wellness Hub', 'EV Charging Infrastructure', '8 Dedicated Parking Spots', 'High-Speed Fibre Ring'],
    reraId: 'P51800029940',
    highlights: ['Lush lake & hill backdrop', 'Walkable dining and retail amenities', 'Excellent talent catchment connectivity'],
    description: 'Sprawling Grade-A office plate overlooking serene Powai Lake. Designed for expanding tech giants, consulting practices, and research offices.',
  },
  {
    id: 'comm-6',
    slug: 'nariman-point-heritage-chambers',
    title: 'Nariman Point Legacy Chambers',
    tagline: 'Waterfront Financial Suite in South Mumbai’s Historic Core',
    location: 'Nariman Point',
    subLocation: 'Marine Drive & Nariman Point, South Mumbai',
    price: 28.5,
    priceFormatted: '₹28.50 Cr',
    carpetArea: 4900,
    propertyType: 'Commercial Penthouse',
    possession: 'Immediate',
    floor: 'Top Floor with Terrace',
    coverImage: '/hero/hero-1-crisp.jpg',
    amenities: ['Unobstructed Arabian Sea Horizon', 'Private Boardroom Foyer', 'Heritage Facade', '6 Reserved Car Parks', 'High-Security Access'],
    reraId: 'P51900018890',
    highlights: ['Unrivaled Marine Drive oceanfront view', 'Prestigious corporate address', 'High rental yield pedigree'],
    description: 'A prized top-floor commercial penthouse at Nariman Point overlooking Back Bay and Marine Drive. Timeless pedigree and generational prestige.',
  },
];
