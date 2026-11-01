'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from "@/components/ui/image";
import Link from 'next/link';
import { MapPin, ArrowLeft, ArrowRight, ShieldCheck, Building2, TrendingUp, Phone, Mail } from 'lucide-react';
import { PropertyCard } from '@/site/components/property/PropertyCard';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';
import { Property } from '@/site/types/property';
import {
  fetchCorridorSwitcherLocations,
  fetchLocationBySlug,
  type LocationInfo as CmsLocationInfo,
} from '@/site/lib/supabase/locations';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { LocationCategoryLinks } from '@/site/components/location/LocationCategoryLinks';
import { sameLocation, type SegmentCounts } from '@/site/lib/location-segments';

interface LocationInfo {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  priceRange: string;
  averageRate: string;
  lifestyle: string;
  keyEnclaves: string[];
}

const LOCATION_DATA: Record<string, LocationInfo> = {
  worli: {
    name: 'Worli',
    slug: 'worli',
    tagline: 'Mumbai’s Premier Sea-Facing Luxury Mile',
    description:
      'Home to iconic skyline towers, the Bandra-Worli Sea Link promenade, and coveted multi-acre gated sky residences. Worli commands premier capital appreciation and uninterrupted Arabian Sea horizons.',
    coverImage: '/properties/worli-aurum/cover.jpg',
    priceRange: '₹18 Cr - ₹75 Cr+',
    averageRate: '₹65,000 - ₹1,20,000 / sq.ft',
    lifestyle: 'Sea Link Promenade, High-Rise Sky Mansions, Michelin Dining',
    keyEnclaves: ['Worli Sea Face', 'Dr. Annie Besant Road', 'Pochkhanawala Road'],
  },
  'bandra-west': {
    name: 'Bandra West',
    slug: 'bandra-west',
    tagline: 'The Cultural Epicenter of Discreet Elegance & Heritage',
    description:
      'The address of choice for creative luminaries, legacy industrialists, and tastemakers. Bandra West blends quiet leafy enclaves like Pali Hill and Carter Road with world-class bistros and exclusive boutique towers.',
    coverImage: '/properties/bandra-palisades/cover.jpg',
    priceRange: '₹15 Cr - ₹60 Cr+',
    averageRate: '₹75,000 - ₹1,35,000 / sq.ft',
    lifestyle: 'Pali Hill Sanctuary, Carter Road Promenade, Boutique Living',
    keyEnclaves: ['Pali Hill', 'Bandstand', 'Carter Road', 'Perry Cross Road'],
  },
  juhu: {
    name: 'Juhu',
    slug: 'juhu',
    tagline: 'Sun-Drenched Coastal Estates & Cinematic Glamour',
    description:
      'Mumbai’s original beachfront gold standard. Characterized by expansive private low-rise villas, sprawling penthouses overlooking private sands, and ultimate discreet coastal living.',
    coverImage: '/properties/juhu-solitaire/cover.jpg',
    priceRange: '₹20 Cr - ₹120 Cr+',
    averageRate: '₹70,000 - ₹1,40,000 / sq.ft',
    lifestyle: 'Direct Beach Access, Private Villa Compounds, Low-Density Living',
    keyEnclaves: ['Juhu Tara Road', 'Ruia Park', 'JVPD Scheme', 'Gulmohar Avenue'],
  },
  'malabar-hill': {
    name: 'Malabar Hill',
    slug: 'malabar-hill',
    tagline: 'Generational Prestige & Queens Necklace Panoramas',
    description:
      'The historical pinnacle of power and quiet old-money prestige in South Mumbai. Unrivaled panoramic vistas over Back Bay, Hanging Gardens, and lush governor hill canopies.',
    coverImage: '/hero/hero-1-crisp.jpg',
    priceRange: '₹35 Cr - ₹150 Cr+',
    averageRate: '₹1,00,000 - ₹1,85,000 / sq.ft',
    lifestyle: 'Old Bombay Heritage, Back Bay Panoramas, Diplomatic Enclaves',
    keyEnclaves: ['Walkeshwar Road', 'Ridge Road', 'Nepeansea Road', 'Carmichael Road'],
  },
  prabhadevi: {
    name: 'Prabhadevi',
    slug: 'prabhadevi',
    tagline: 'Refined Coastal Grandeur Near Siddhivinayak',
    description:
      'A prestigious South Mumbai beachfront and skyline enclave offering seamless Sea Link connectivity, tranquil residential avenues, and unobstructed sunsets.',
    coverImage: '/properties/prabhadevi-verve/cover.jpg',
    priceRange: '₹18 Cr - ₹55 Cr+',
    averageRate: '₹62,000 - ₹1,05,000 / sq.ft',
    lifestyle: 'Beachfront Promenade, Temple Heritage, High-Rise Penthouses',
    keyEnclaves: ['Siddhivinayak Horizon', 'Kirti College Seafront', 'Sayani Road High-Rises'],
  },
  'lower-parel': {
    name: 'Lower Parel',
    slug: 'lower-parel',
    tagline: 'Midtown High-Rise Sky Suites & Financial District',
    description:
      'Mumbai’s premier corporate corridor and luxury vertical community. Home to world-class dining, luxury retail gallerias, and multi-acre integrated residential estates.',
    coverImage: '/properties/lower-parel-pavilion/cover.jpg',
    priceRange: '₹12 Cr - ₹45 Cr+',
    averageRate: '₹55,000 - ₹95,000 / sq.ft',
    lifestyle: 'Vertical Cities, Luxury Mall Access, High-Speed Financial Hub',
    keyEnclaves: ['Senapati Bapat Marg', 'Curry Road Avenue', 'Delisle Road Enclaves'],
  },
  powai: {
    name: 'Powai',
    slug: 'powai',
    tagline: 'Lakeside Sanctuary & Modern Architectural Boulevard',
    description:
      'Mumbai’s prime neoclassical sanctuary. Lush hillside panoramic views, Powai Lake shorelines, elite international schooling, and gated condominium estates.',
    coverImage: '/properties/powai-lake/cover.jpg',
    priceRange: '₹8 Cr - ₹25 Cr+',
    averageRate: '₹38,000 - ₹65,000 / sq.ft',
    lifestyle: 'Lakefront Jogging, Neoclassical Promenades, Tech Executive Estates',
    keyEnclaves: ['Hiranandani Gardens', 'Powai Lake Promenade', 'Cliff Avenue'],
  },
  sewri: {
    name: 'Sewri',
    slug: 'sewri',
    tagline: 'Eastern Waterfront Gateway Facing Atal Setu',
    description:
      'The focal point of Mumbai’s eastern bay transformation. Direct Atal Setu (MTHL) transit, expansive mangrove bird sanctuaries, and massive high-rise capital appreciation.',
    coverImage: '/hero/hero-3-crisp.jpg',
    priceRange: '₹10 Cr - ₹28 Cr+',
    averageRate: '₹40,000 - ₹70,000 / sq.ft',
    lifestyle: 'MTHL Connectivity, Harbor Views, Flamingo Sanctuary Panoramas',
    keyEnclaves: ['Sewri Seafront Promenade', 'Eastern Bay Corridor', 'Port Trust Bay'],
  },
  'cuffe-parade': {
    name: 'Cuffe Parade',
    slug: 'cuffe-parade',
    tagline: 'Exclusive Southern Promontory & Diplomatic Heritage',
    description:
      'The southern tip of Mumbai’s legacy luxury district. Waterfront high-rises, diplomatic consulates, world trade towers, and timeless Colaba proximity.',
    coverImage: '/hero/hero-2-crisp.jpg',
    priceRange: '₹22 Cr - ₹85 Cr+',
    averageRate: '₹75,000 - ₹1,40,000 / sq.ft',
    lifestyle: 'Yacht Club Proximity, Diplomatic Corridors, Coastal Skyline',
    keyEnclaves: ['Prakash Pethe Marg', 'Cuffe Parade Promontory', 'Captain Prakash Pethe Marg'],
  },
};


interface LocationPageClientProps {
  slug: string;
  /** Server-fetched data; `undefined` means "not provided, fetch in the browser". */
  initialLocation?: CmsLocationInfo | null;
  initialProperties?: Property[];
  initialCorridor?: CmsLocationInfo[];
  /** Listing counts per category, used for the Residential / Commercial links. */
  segmentCounts?: SegmentCounts;
}

export default function LocationPageClient({
  slug: slugProp,
  initialLocation,
  initialProperties,
  initialCorridor,
  segmentCounts,
}: LocationPageClientProps) {
  const slug = slugProp.toLowerCase();
  const serverRendered = initialLocation !== undefined;

  const [dbLocation, setDbLocation] = useState<LocationInfo | null>(initialLocation ?? null);
  const [locationLoading, setLocationLoading] = useState(!serverRendered);
  const [locationUnavailable, setLocationUnavailable] = useState(initialLocation === null);
  const [properties, setProperties] = useState<Property[]>(initialProperties ?? []);
  const [propertiesLoading, setPropertiesLoading] = useState(initialProperties === undefined);
  const [corridorLocations, setCorridorLocations] = useState<CmsLocationInfo[]>(initialCorridor ?? []);

  useEffect(() => {
    // Server already rendered this location; only fetch in the browser as a fallback.
    if (serverRendered) return;
    let isMounted = true;
    setLocationLoading(true);
    setLocationUnavailable(false);
    setPropertiesLoading(true);

    fetchLocationBySlug(slug).then((res) => {
      if (!isMounted) return;
      if (res) {
        setDbLocation(res);
        setLocationUnavailable(false);
      } else {
        setDbLocation(null);
        setLocationUnavailable(true);
      }
      setLocationLoading(false);
    });
    fetchCorridorSwitcherLocations(slug).then((rows) => {
      if (isMounted) setCorridorLocations(rows);
    });
    fetchPropertyCards()
      .then((rows) => {
        if (isMounted) setProperties(rows);
      })
      .finally(() => {
        if (isMounted) setPropertiesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, serverRendered]);

  const location = useMemo(() => {
    if (dbLocation) return dbLocation;
    // Static copy is only used as a loading placeholder — never for inactive CMS rows.
    return LOCATION_DATA[slug] || null;
  }, [dbLocation, slug]);

  const locationProperties = useMemo(() => {
    if (!location) return [];
    // Same rule as the Residential / Commercial category pages, so the counts always agree.
    return properties.filter((p) => sameLocation(p.location, location.name));
  }, [properties, location]);

  if (locationLoading) {
    return (
      <div className="w-full min-h-screen bg-[#EDEEE9] text-[#15181A] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Building2 className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40 animate-pulse" />
          <p className="text-sm text-[#5B605F]">Loading location…</p>
        </div>
      </div>
    );
  }

  if (locationUnavailable || !location) {
    return (
      <div className="w-full min-h-screen bg-[#EDEEE9] text-[#15181A] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <MapPin className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40" />
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#15181A] mb-3">
            Location unavailable
          </h1>
          <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-8">
            This enclave is not currently published. Explore other prime corridors or return to the locations directory.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5282F] text-white text-xs uppercase tracking-widest font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Locations</span>
          </Link>
          {corridorLocations.length > 0 ? (
            <div className="mt-16 pt-10 border-t border-[#CFD1CA] text-left">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#5B605F] mb-6">
                SWITCH TO ANOTHER PRIME CORRIDOR
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {corridorLocations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locations/${loc.slug}`}
                    className="p-4 border text-left transition-all bg-[#F7F7F4] text-[#15181A] border-[#CFD1CA] hover:border-[#C5282F]"
                  >
                    <span className="text-xs font-serif font-bold block">{loc.name}</span>
                    <span className="text-[10px] uppercase tracking-wider block mt-1 text-[#5B605F]">
                      {loc.priceRange}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#EDEEE9] text-[#15181A] pt-24">
      {/* Hero Banner for Location */}
      <section className="relative bg-[#15181A] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={location.coverImage}
            alt={location.name}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-[#15181A] via-[#15181A]/85 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 mb-6 font-sans">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#properties" className="hover:text-white transition-colors">
              Locations
            </Link>
            <span>/</span>
            <span className="text-[#C5282F] font-semibold">{location.name}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5282F] mb-4">
              <MapPin className="w-3 h-3 text-[#C5282F]" />
              <span>MUMBAI ENCLAVE SHOWCASE</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight mb-4">
              {location.name.toUpperCase()}
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed mb-8">
              {location.tagline} &bull; {location.description}
            </p>

            {/* Micro Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/15">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-white/50">Price Band</span>
                <span className="text-sm sm:text-base font-serif font-bold text-white">{location.priceRange}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-white/50">Average Capital Rate</span>
                <span className="text-sm sm:text-base font-serif font-bold text-white">{location.averageRate}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-white/50">Key Enclaves</span>
                <span className="text-xs text-white/80 font-medium truncate block">
                  {location.keyEnclaves.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {segmentCounts ? (
        <LocationCategoryLinks locationName={location.name} locationSlug={location.slug} counts={segmentCounts} />
      ) : null}

      {/* Main Content: Properties List */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-[#CFD1CA] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] mb-1 block">
              Filtered By Location
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#15181A]">
              RESIDENCES IN {location.name.toUpperCase()}
            </h2>
            <p className="text-xs text-[#5B605F] mt-1 font-sans">
              Displaying vetted luxury listings and private opportunities currently available in {location.name}.
            </p>
          </div>

          <Link
            href="/#properties"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#15181A] hover:text-[#C5282F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Locations</span>
          </Link>
        </div>

        {/* Properties Grid */}
        {propertiesLoading ? (
          <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
            <Building2 className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40 animate-pulse" />
            <p className="text-sm text-[#5B605F]">Loading residences in {location.name}…</p>
          </div>
        ) : locationProperties.length === 0 ? (
          <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
            <Building2 className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40" />
            <h3 className="font-serif text-2xl text-[#15181A] mb-2 font-light">
              No Published Listings in {location.name} Yet
            </h3>
            <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-6">
              Our advisory desk can share off-market briefings for this enclave. Browse the full portfolio or contact us for a private tour.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5282F] text-white text-xs uppercase tracking-widest font-semibold"
            >
              <span>Browse All Residences</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locationProperties.map((property, idx) => (
              <ScrollReveal key={property.id} animation="fade-up" delay={idx * 100}>
                <PropertyCard property={property} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Other Locations Quick Switcher — CMS: all active/published except current, by sort_order */}
        <div className="mt-20 pt-12 border-t border-[#CFD1CA]">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#5B605F] mb-6">
            SWITCH TO ANOTHER PRIME CORRIDOR
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {corridorLocations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="p-4 border text-left transition-all bg-[#F7F7F4] text-[#15181A] border-[#CFD1CA] hover:border-[#C5282F]"
              >
                <span className="text-xs font-serif font-bold block">{loc.name}</span>
                <span className="text-[10px] uppercase tracking-wider block mt-1 text-[#5B605F]">
                  {loc.priceRange}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
