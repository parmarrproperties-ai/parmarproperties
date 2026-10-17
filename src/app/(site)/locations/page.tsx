'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  ArrowRight,
  Building2,
  ChevronDown,
  Check,
} from 'lucide-react';
import type { Property } from '@/site/types/property';
import { PropertyCard } from '@/site/components/property/PropertyCard';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';
import { ScrollProgressBar } from '@/site/components/ui/ScrollProgressBar';
import { PrivateOpportunities } from '@/site/components/property/PrivateOpportunities';
import { LOCATIONS_PAGE_CONTENT } from '@/site/data/content/locations.content';
import { fetchLocations, fetchLocationFilterNames } from '@/site/lib/supabase/locations';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';

interface LocationDirectoryItem {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  rate: string;
  subLocation: string;
}

function LocationsContent() {
  const searchParams = useSearchParams();
  const initialLoc = searchParams ? searchParams.get('location') : null;

  const [selectedLoc, setSelectedLoc] = useState<string>(initialLoc || 'All');
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  // Start empty — public visibility comes only from CMS active+published locations.
  const [locationsDirectory, setLocationsDirectory] = useState<LocationDirectoryItem[]>([]);
  const [locationsList, setLocationsList] = useState<string[]>(['All']);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.location-dropdown-container')) {
        setLocationDropdownOpen(false);
      }
    };
    if (locationDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [locationDropdownOpen]);

  React.useEffect(() => {
    let isMounted = true;
    fetchPropertyCards()
      .then((data) => {
        if (isMounted) setProperties(data);
      })
      .finally(() => {
        if (isMounted) setPropertiesLoading(false);
      });
    Promise.all([fetchLocations(), fetchLocationFilterNames()])
      .then(([data, filterNames]) => {
        if (!isMounted) return;
        const mapped = (data ?? []).map((l) => ({
          name: l.name,
          slug: l.slug,
          image: l.coverImage || '/properties/worli-aurum/cover.jpg',
          tagline: l.tagline,
          rate: l.priceRange,
          subLocation: l.keyEnclaves?.length > 0 ? l.keyEnclaves.join(' & ') : l.lifestyle,
        }));
        setLocationsDirectory(mapped);
        setLocationsList(filterNames?.length ? filterNames : ['All']);
      })
      .finally(() => {
        if (isMounted) setLocationsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProperties = useMemo(() => {
    if (selectedLoc === 'All') return properties;
    return properties.filter((p) => {
      const pLoc = p.location.toLowerCase();
      const pSub = p.subLocation.toLowerCase();
      const sel = selectedLoc.toLowerCase();
      return pLoc.includes(sel) || pSub.includes(sel) || sel.includes(pLoc);
    });
  }, [selectedLoc, properties]);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A] w-full overflow-x-hidden">
      <ScrollProgressBar />

      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-widest text-[#5B605F] font-semibold mb-3 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>&bull;</span>
        <span className="text-[#C5282F] font-bold">LOCATIONS</span>
      </div>

      {/* Page Header */}
      <div className="mb-10 pb-6 border-b border-[#CFD1CA]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#15181A]">
              {LOCATIONS_PAGE_CONTENT.header.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B605F] mt-2 font-sans max-w-2xl leading-relaxed">
              Explore Mumbai’s premier residential micro-markets: from iconic waterfronts to cultural and financial enclaves.
            </p>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5282F] shrink-0">
            {selectedLoc === 'All' ? `${locationsDirectory.length} Enclaves Available` : `${filteredProperties.length} Properties in ${selectedLoc}`}
          </div>
        </div>

        {/* Luxury Location Dropdown (Replaces horizontal side-scroll) */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative location-dropdown-container w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="w-full sm:min-w-[320px] flex items-center justify-between gap-3 bg-[#F7F7F4] hover:bg-[#EDEEE9] border border-[#CFD1CA] px-4 py-3 shadow-xs transition-colors cursor-pointer text-xs"
              aria-expanded={locationDropdownOpen}
              aria-label="Select Enclave"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5282F] shrink-0" />
                <span className="text-[#5B605F] uppercase tracking-wider text-[11px] font-medium">Filter Enclave:</span>
                <span className="font-semibold text-[#15181A] uppercase tracking-wide">
                  {selectedLoc === 'All' ? 'All Enclaves' : selectedLoc}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#5B605F] transition-transform duration-200 shrink-0 ${
                  locationDropdownOpen ? 'rotate-180 text-[#C5282F]' : ''
                }`}
              />
            </button>

            {/* Dropdown Panel */}
            {locationDropdownOpen && (
              <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full sm:w-80 bg-[#F7F7F4] border border-[#CFD1CA] shadow-2xl py-1 rounded-xs font-sans max-h-72 overflow-y-auto">
                <div className="px-3.5 pt-2 pb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#5B605F] font-bold border-b border-[#CFD1CA]/60 flex items-center justify-between sticky top-0 bg-[#F7F7F4] z-10">
                  <span>Mumbai Prime Enclaves</span>
                  <span className="text-[#C5282F] font-mono font-bold text-[9px]">
                    {locationsList.length} options
                  </span>
                </div>
                {locationsList.map((loc) => {
                  const isSelected = selectedLoc === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLoc(loc);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#C5282F] text-white font-semibold'
                          : 'text-[#15181A] hover:bg-[#EDEEE9]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#C5282F]'}`} />
                        <span>{loc === 'All' ? 'All Enclaves' : loc}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedLoc !== 'All' && (
            <button
              onClick={() => setSelectedLoc('All')}
              className="text-xs text-[#C5282F] hover:underline font-semibold uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto cursor-pointer py-1"
            >
              <span>&times; Reset to All Enclaves</span>
            </button>
          )}
        </div>
      </div>

      {/* PRIME ENCLAVES CARDS DIRECTORY — CMS active+published locations only */}
      {selectedLoc === 'All' && (
        <section className="mb-20">
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-[#CFD1CA]">
            <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#15181A]">
              Explore Prime Enclaves
            </h2>
            <span className="text-xs text-[#5B605F] font-sans">
              Click any location to view dedicated enclaves &amp; market details
            </span>
          </div>

          {locationsLoading ? (
            <div className="text-center py-16 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
              <Building2 className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40 animate-pulse" />
              <p className="text-sm text-[#5B605F]">Loading enclaves…</p>
            </div>
          ) : locationsDirectory.length === 0 ? (
            <div className="text-center py-16 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
              <MapPin className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40" />
              <p className="text-sm text-[#5B605F]">No active enclaves are published right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {locationsDirectory.map((loc, idx) => (
                <ScrollReveal key={loc.slug} animation="fade-up" delay={(idx % 4) * 80}>
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="group bg-[#F7F7F4] border border-[#CFD1CA] hover:border-[#15181A] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between h-full cursor-pointer"
                  >
                    <div>
                      {/* Location Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-[#15181A]">
                        <Image
                          src={loc.image}
                          alt={loc.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase tracking-wider text-white/70 block font-sans font-semibold">
                            {loc.tagline}
                          </span>
                          <h3 className="font-sans text-xl font-extrabold tracking-tight text-white drop-shadow">
                            {loc.name}
                          </h3>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="p-4 flex items-center justify-between text-xs text-[#5B605F] border-b border-[#CFD1CA]/60">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#C5282F]" />
                          <span>Mumbai</span>
                        </span>
                        <span className="font-semibold text-[#15181A]">{loc.rate}</span>
                      </div>
                    </div>

                    {/* Explore Enclave Action */}
                    <div className="p-4 pt-3">
                      <span className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#C5282F] group-hover:bg-[#A31D23] text-white text-[11px] uppercase tracking-[0.15em] font-semibold transition-all duration-200 shadow-xs">
                        <span>VIEW {loc.name.toUpperCase()}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      )}

      {/* PROPERTIES IN THIS LOCATION */}
      <section className="mb-20">
        <div className="mb-6 flex items-center justify-between pb-3 border-b border-[#CFD1CA]">
          <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#15181A]">
            {selectedLoc === 'All' ? 'Featured Residences Across Mumbai' : `Properties in ${selectedLoc}`}
          </h2>
          <span className="text-xs font-semibold text-[#5B605F]">
            {filteredProperties.length} Available Listings
          </span>
        </div>

        {propertiesLoading ? (
          <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
            <Building2 className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40 animate-pulse" />
            <p className="text-sm text-[#5B605F]">Loading residences…</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
            <Building2 className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40" />
            <h3 className="font-serif text-2xl text-[#15181A] mb-2 font-light">
              No Properties Currently Listed in {selectedLoc}
            </h3>
            <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-6">
              Our advisory desk maintains private off-market residences in {selectedLoc}. Contact our private desk for confidential briefings.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setSelectedLoc('All')}
                className="px-6 py-2.5 bg-[#C5282F] text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                View All Residences
              </button>
              <Link
                href={`/locations/${selectedLoc.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-6 py-2.5 bg-[#15181A] text-white text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#C5282F] transition-colors"
              >
                View {selectedLoc} Enclave Page
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, idx) => (
              <ScrollReveal key={property.id} animation="fade-up" delay={(idx % 3) * 100}>
                <PropertyCard property={property} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* PRIVATE OPPORTUNITIES AT BOTTOM */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-24">
        <PrivateOpportunities minimal={true} />
      </div>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs">Loading Mumbai Enclaves...</div>}>
      <LocationsContent />
    </Suspense>
  );
}
