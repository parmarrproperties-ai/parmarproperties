'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  ArrowUpDown,
  Filter,
  Building,
  Sparkles,
  Rocket,
  Crown,
  ShieldCheck,
  Calendar,
  Compass,
  ArrowRight,
  ChevronDown,
  Check,
} from 'lucide-react';
import { PropertyCard } from '@/site/components/property/PropertyCard';
import { PrivateOpportunities } from '@/site/components/property/PrivateOpportunities';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';
import { ScrollProgressBar } from '@/site/components/ui/ScrollProgressBar';
import { Property, PropertyCategory } from '@/site/types/property';
import { BUY_PAGE_CONTENT, NEW_LAUNCHES_CONTENT, LUXURY_COLLECTION_CONTENT } from '@/site/data/content';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';

function PropertiesContent({ initialProperties }: { initialProperties: Property[] | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Category Tab: 'buy' | 'new-launches' | 'luxury-collection'
  const rawTab = searchParams ? searchParams.get('tab') : null;
  const activeTab: PropertyCategory =
    rawTab === 'new-launches'
      ? 'new-launches'
      : rawTab === 'luxury-collection'
      ? 'luxury-collection'
      : 'buy';

  // Filter States
  const [selectedLocality, setSelectedLocality] = useState<string>(searchParams?.get('location') || 'All');
  const [selectedBhk, setSelectedBhk] = useState<string>(searchParams?.get('bhk') || 'All');
  const [selectedPossession, setSelectedPossession] = useState<string>(
    searchParams?.get('status') || searchParams?.get('possession') || 'All'
  );
  const [minPrice, setMinPrice] = useState<number>(Number(searchParams?.get('minPrice')) || 1);
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams?.get('maxPrice')) || 60);
  const [selectedAmenity, setSelectedAmenity] = useState<string>(searchParams?.get('amenity') || 'All');
  const [sortBy, setSortBy] = useState<string>(searchParams?.get('sort') || 'featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortOptions = [
    { val: 'featured', label: 'Featured Curated' },
    { val: 'price-asc', label: 'Price: Low to High' },
    { val: 'price-desc', label: 'Price: High to Low' },
    { val: 'area-desc', label: 'Carpet Area: Largest First' },
    { val: 'newest', label: 'Recently Added' },
  ];

  const currentSortLabel = sortOptions.find((o) => o.val === sortBy)?.label || 'Featured Curated';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sort-dropdown-container')) {
        setSortDropdownOpen(false);
      }
    };
    if (sortDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [sortDropdownOpen]);

  // Set active tab via router
  const handleTabChange = (tab: PropertyCategory) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', tab);
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  // Sync state to URL params (shallow)
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'buy') params.set('tab', activeTab);
    if (selectedLocality !== 'All') params.set('location', selectedLocality);
    if (selectedBhk !== 'All') params.set('bhk', selectedBhk);
    if (selectedPossession !== 'All') params.set('status', selectedPossession);
    if (minPrice > 1) params.set('minPrice', minPrice.toString());
    if (maxPrice < 60) params.set('maxPrice', maxPrice.toString());
    if (selectedAmenity !== 'All') params.set('amenity', selectedAmenity);
    if (sortBy !== 'featured') params.set('sort', sortBy);

    const query = params.toString();
    const newPath = query ? `/properties?${query}` : '/properties';
    router.replace(newPath, { scroll: false });
  }, [activeTab, selectedLocality, selectedBhk, selectedPossession, minPrice, maxPrice, selectedAmenity, sortBy, router]);

  const resetFilters = () => {
    setSelectedLocality('All');
    setSelectedBhk('All');
    setSelectedPossession('All');
    setMinPrice(1);
    setMaxPrice(60);
    setSelectedAmenity('All');
    setSortBy('featured');
  };

  const [properties, setProperties] = useState<Property[]>(initialProperties ?? []);
  const localities = useMemo(() => Array.from(new Set(properties.map((p) => p.location))).sort(), [properties]);
  const [propertiesLoading, setPropertiesLoading] = useState(initialProperties === null);

  useEffect(() => {
    // Server already rendered the list; only fetch in the browser as a fallback.
    if (initialProperties !== null) return;
    let isMounted = true;
    fetchPropertyCards()
      .then((data) => {
        if (isMounted) setProperties(data);
      })
      .finally(() => {
        if (isMounted) setPropertiesLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [initialProperties]);

  // 1. Base categorized list
  const baseCategoryProperties = useMemo(() => {
    if (activeTab === 'new-launches') {
      return properties.filter((p) => p.isNewLaunch);
    }
    if (activeTab === 'luxury-collection') {
      return properties.filter((p) => p.isLuxuryCollection);
    }
    // BUY tab: All verified residences
    return properties;
  }, [properties, activeTab]);

  // Counts for each tab badge
  const counts = useMemo(() => {
    return {
      buy: properties.length,
      newLaunches: properties.filter((p) => p.isNewLaunch).length,
      luxuryCollection: properties.filter((p) => p.isLuxuryCollection).length,
    };
  }, [properties]);

  // 2. Filtered & sorted properties
  const filteredAndSortedProperties = useMemo(() => {
    let list = baseCategoryProperties.filter((p) => {
      if (selectedLocality !== 'All' && p.location !== selectedLocality) return false;
      if (selectedBhk !== 'All' && !p.bhk.includes(selectedBhk)) return false;
      
      // Construction status filter matching
      if (selectedPossession !== 'All' && selectedPossession !== 'All Status') {
        const filterLower = selectedPossession.toLowerCase();
        const propPossLower = (p.possession || '').toLowerCase();
        if (filterLower.includes('ready') || filterLower.includes('move') || filterLower === 'resale') {
          if (!propPossLower.includes('ready') && !propPossLower.includes('immediate')) return false;
        } else if (filterLower.includes('under') || filterLower.includes('construction')) {
          if (!propPossLower.includes('under') && !propPossLower.includes('construction')) return false;
        } else if (filterLower.includes('pre') || filterLower.includes('launch')) {
          if (!propPossLower.includes('pre') && !propPossLower.includes('launch') && !p.isNewLaunch) return false;
        } else if (!propPossLower.includes(filterLower)) {
          return false;
        }
      }

      // Missing/zero price = Price on Request — do not exclude via budget slider.
      if (p.price > 0 && (p.price < minPrice || p.price > maxPrice)) return false;
      if (selectedAmenity !== 'All' && !p.amenities.includes(selectedAmenity)) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area-desc') {
      list.sort((a, b) => b.carpetArea - a.carpetArea);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.recentlyAdded ? 1 : 0) - (a.recentlyAdded ? 1 : 0));
    }

    return list;
  }, [baseCategoryProperties, selectedLocality, selectedBhk, selectedPossession, minPrice, maxPrice, selectedAmenity, sortBy]);

  const allAmenities = [
    'All',
    'Infinity Sky Pool',
    'Private Elevator',
    'Private Plunge Pool',
    'Sea-Facing Balconies',
    'Automated Smart Home',
    'Clubhouse & Spa',
    'Valet Parking for 4 Cars',
    'Pre-Launch Price Advantage',
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A] w-full overflow-x-hidden">
      {/* Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-widest text-[#5B605F] font-semibold mb-3 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>&bull;</span>
        <span>Mumbai Portfolio</span>
        <span>&bull;</span>
        <span className="text-[#C5282F] font-bold">
          {activeTab === 'buy' && BUY_PAGE_CONTENT.header.breadcrumb}
          {activeTab === 'new-launches' && NEW_LAUNCHES_CONTENT.header.breadcrumb}
          {activeTab === 'luxury-collection' && LUXURY_COLLECTION_CONTENT.header.breadcrumb}
        </span>
      </div>

      {/* TOP 3-CATEGORY SELECTOR TABS: BUY | NEW LAUNCHES | LUXURY COLLECTION */}
      <div className="mb-10 pb-6 border-b border-[#CFD1CA]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#15181A]">
              {activeTab === 'buy' && BUY_PAGE_CONTENT.header.title}
              {activeTab === 'new-launches' && NEW_LAUNCHES_CONTENT.header.title}
              {activeTab === 'luxury-collection' && LUXURY_COLLECTION_CONTENT.header.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B605F] mt-2 font-sans max-w-2xl leading-relaxed">
              {activeTab === 'buy' && BUY_PAGE_CONTENT.header.subtitle}
              {activeTab === 'new-launches' && NEW_LAUNCHES_CONTENT.header.subtitle}
              {activeTab === 'luxury-collection' && LUXURY_COLLECTION_CONTENT.header.subtitle}
            </p>
          </div>

          {/* Quick Sort & Mobile Filter Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#F7F7F4] border border-[#CFD1CA] text-xs uppercase tracking-wider font-semibold text-[#15181A] shadow-xs active:bg-[#EDEEE9]"
            >
              <Filter className="w-3.5 h-3.5 text-[#C5282F]" />
              <span>Filters</span>
            </button>

            <div className="relative sort-dropdown-container flex-1 sm:flex-none">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="w-full sm:w-auto flex items-center justify-between gap-2 text-xs bg-[#F7F7F4] hover:bg-[#EDEEE9] border border-[#CFD1CA] px-3.5 py-2.5 shadow-xs transition-colors cursor-pointer"
                aria-expanded={sortDropdownOpen}
                aria-label="Sort properties"
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#C5282F]" />
                  <span className="text-[#5B605F] hidden sm:inline">Sort:</span>
                </div>
                <span className="font-semibold text-[#15181A] truncate max-w-[125px] sm:max-w-none text-left">
                  {currentSortLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#5B605F] transition-transform duration-200 shrink-0 ${
                    sortDropdownOpen ? 'rotate-180 text-[#C5282F]' : ''
                  }`}
                />
              </button>

              {/* Luxury Custom Sort Dropdown Menu */}
              {sortDropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-52 sm:w-56 bg-[#F7F7F4] border border-[#CFD1CA] shadow-2xl py-1 rounded-xs font-sans">
                  <div className="px-3 pt-2 pb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#5B605F] font-bold border-b border-[#CFD1CA]/60 flex items-center justify-between">
                    <span>Sort Properties</span>
                  </div>
                  {sortOptions.map((opt) => {
                    const isSelected = sortBy === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.val);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#C5282F] text-white font-semibold'
                            : 'text-[#15181A] hover:bg-[#EDEEE9]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prominent Architectural Segmented Tab Bar (Non-sliding on Mobile) */}
        <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 sm:bg-[#F7F7F4] sm:p-2 sm:border sm:border-[#CFD1CA] w-full">
          {/* 1. BUY TAB */}
          <button
            onClick={() => handleTabChange('buy')}
            className={`w-full sm:w-auto sm:flex-1 py-2.5 sm:py-3 px-3.5 sm:px-4 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em] font-semibold transition-all duration-200 flex items-center justify-between sm:justify-center gap-2 cursor-pointer rounded-xs sm:rounded-none ${
              activeTab === 'buy'
                ? 'bg-[#C5282F] text-white shadow-xs'
                : 'bg-white sm:bg-transparent border border-[#CFD1CA] sm:border-0 text-[#15181A] hover:bg-[#EDEEE9]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>{BUY_PAGE_CONTENT.header.tabLabel}</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === 'buy' ? 'bg-white/20 text-white' : 'bg-[#CFD1CA]/60 text-[#15181A]'
              }`}
            >
              {counts.buy}
            </span>
          </button>

          {/* 2. NEW LAUNCHES TAB */}
          <button
            onClick={() => handleTabChange('new-launches')}
            className={`w-full sm:w-auto sm:flex-1 py-2.5 sm:py-3 px-3.5 sm:px-4 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em] font-semibold transition-all duration-200 flex items-center justify-between sm:justify-center gap-2 cursor-pointer rounded-xs sm:rounded-none ${
              activeTab === 'new-launches'
                ? 'bg-[#393187] text-white shadow-xs'
                : 'bg-white sm:bg-transparent border border-[#CFD1CA] sm:border-0 text-[#15181A] hover:bg-[#EDEEE9]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5 shrink-0" />
              <span>{NEW_LAUNCHES_CONTENT.header.tabLabel}</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === 'new-launches' ? 'bg-white/20 text-white' : 'bg-[#CFD1CA]/60 text-[#15181A]'
              }`}
            >
              {counts.newLaunches}
            </span>
          </button>

          {/* 3. LUXURY COLLECTION TAB */}
          <button
            onClick={() => handleTabChange('luxury-collection')}
            className={`w-full sm:w-auto sm:flex-1 py-2.5 sm:py-3 px-3.5 sm:px-4 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em] font-semibold transition-all duration-200 flex items-center justify-between sm:justify-center gap-2 cursor-pointer rounded-xs sm:rounded-none ${
              activeTab === 'luxury-collection'
                ? 'bg-[#15181A] text-white shadow-xs'
                : 'bg-white sm:bg-transparent border border-[#CFD1CA] sm:border-0 text-[#15181A] hover:bg-[#EDEEE9]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-[#C5282F] shrink-0" />
              <span>{LUXURY_COLLECTION_CONTENT.header.tabLabel}</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === 'luxury-collection' ? 'bg-white/20 text-white' : 'bg-[#CFD1CA]/60 text-[#15181A]'
              }`}
            >
              {counts.luxuryCollection}
            </span>
          </button>
        </div>




      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6 space-y-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[#CFD1CA]">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#15181A] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C5282F]" />
                Filter {activeTab === 'new-launches' ? 'Launches' : activeTab === 'luxury-collection' ? 'Collection' : 'Portfolio'}
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-[#C5282F] hover:text-[#A31D23] flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Locality Filter */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-2">
                Locality
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full p-2.5 bg-[#EDEEE9] border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
              >
                <option value="All">All Localities</option>
                {localities.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
              </select>
            </div>

            {/* BHK Filter Dropdown */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-2">
                Configuration (BHK)
              </label>
              <select
                value={selectedBhk}
                onChange={(e) => setSelectedBhk(e.target.value)}
                className="w-full p-2.5 bg-[#EDEEE9] border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
              >
                <option value="All">All Configurations</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
                <option value="6">6+ BHK / Penthouse</option>
              </select>
            </div>

            {/* 2-Way Budget Slider */}
            <div>
              <div className="flex items-center justify-between mb-3 font-sans">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#15181A]">
                  Budget Range
                </label>
                <span className="text-xs font-sans font-extrabold text-[#C5282F] tabular-nums tracking-wide">
                  ₹{minPrice} Cr &ndash; {maxPrice >= 60 ? '₹60 Cr+' : `₹${maxPrice} Cr`}
                </span>
              </div>

              {/* Single 2-Way Slider Track with Dual Thumbs */}
              <div className="relative w-full h-5 flex items-center">
                {/* Gray Background Track */}
                <div className="absolute w-full h-1.5 bg-[#CFD1CA] rounded-full" />

                {/* Red Active Range Bar between min and max */}
                <div
                  className="absolute h-1.5 bg-[#C5282F] rounded-full pointer-events-none shadow-xs"
                  style={{
                    left: `${((minPrice - 1) / (60 - 1)) * 100}%`,
                    width: `${((maxPrice - minPrice) / (60 - 1)) * 100}%`,
                  }}
                />

                {/* Min Value Thumb Slider */}
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={minPrice}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), maxPrice - 1);
                    setMinPrice(val);
                  }}
                  aria-label="Minimum Budget"
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                />

                {/* Max Value Thumb Slider */}
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), minPrice + 1);
                    setMaxPrice(val);
                  }}
                  aria-label="Maximum Budget"
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-30 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-[#5B605F] mt-2 font-sans font-semibold tabular-nums">
                <span>₹{minPrice} Cr</span>
                <span>{maxPrice >= 60 ? '₹60 Cr+' : `₹${maxPrice} Cr`}</span>
              </div>
            </div>

            {/* Construction Status Filter */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-2">
                Construction Status
              </label>
              <div className="space-y-1.5 text-xs text-[#15181A]">
                {[
                  { label: 'All Status', val: 'All' },
                  { label: 'Ready to Move In / Resale', val: 'Ready to Move' },
                  { label: 'Under Construction', val: 'Under Construction' },
                  { label: 'Pre-Launch / New Launch', val: 'Pre-Launch' },
                ].map((item) => (
                  <label key={item.val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="constructionStatus"
                      checked={
                        selectedPossession === item.val ||
                        (item.val === 'Ready to Move' && (selectedPossession === 'Resale' || selectedPossession === 'Ready to Move In')) ||
                        (item.val === 'Pre-Launch' && (selectedPossession === 'New Launch' || selectedPossession === 'Pre Launch'))
                      }
                      onChange={() => setSelectedPossession(item.val)}
                      className="accent-[#C5282F]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prime Amenity */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-2">
                Signature Amenity
              </label>
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="w-full p-2.5 bg-[#EDEEE9] border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
              >
                {allAmenities.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xs sm:max-w-sm bg-[#EDEEE9] h-full p-5 sm:p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#CFD1CA]">
                <span className="font-serif text-lg font-medium text-[#15181A]">
                  Filter Residences
                </span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-[#15181A]" />
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold mb-2">
                  Locality
                </label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#CFD1CA] text-xs"
                >
                  <option value="All">All Localities</option>
                {localities.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold mb-2">
                  Configuration (BHK)
                </label>
                <select
                  value={selectedBhk}
                  onChange={(e) => setSelectedBhk(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#CFD1CA] text-xs"
                >
                  <option value="All">All Configurations</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5 BHK</option>
                  <option value="6">6+ BHK / Penthouse</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-3 font-sans">
                  <span className="font-semibold">Budget Range</span>
                  <span className="text-[#C5282F] font-bold tabular-nums">
                    ₹{minPrice} Cr &ndash; {maxPrice >= 60 ? '₹60 Cr+' : `₹${maxPrice} Cr`}
                  </span>
                </div>

                {/* Single 2-Way Slider Track with Dual Thumbs */}
                <div className="relative w-full h-5 flex items-center">
                  {/* Gray Background Track */}
                  <div className="absolute w-full h-1.5 bg-[#CFD1CA] rounded-full" />

                  {/* Red Active Range Bar between min and max */}
                  <div
                    className="absolute h-1.5 bg-[#C5282F] rounded-full pointer-events-none shadow-xs"
                    style={{
                      left: `${((minPrice - 1) / (60 - 1)) * 100}%`,
                      width: `${((maxPrice - minPrice) / (60 - 1)) * 100}%`,
                    }}
                  />

                  {/* Min Value Thumb Slider */}
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 1);
                      setMinPrice(val);
                    }}
                    aria-label="Minimum Budget"
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                  />

                  {/* Max Value Thumb Slider */}
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 1);
                      setMaxPrice(val);
                    }}
                    aria-label="Maximum Budget"
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-30 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-[#5B605F] mt-2 font-sans font-semibold tabular-nums">
                  <span>₹{minPrice} Cr</span>
                  <span>{maxPrice >= 60 ? '₹60 Cr+' : `₹${maxPrice} Cr`}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold mb-2">
                  Construction Status
                </label>
                <select
                  value={selectedPossession}
                  onChange={(e) => setSelectedPossession(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#CFD1CA] text-xs"
                >
                  <option value="All">All Status</option>
                  <option value="Ready to Move">Ready to Move / Resale</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Pre-Launch">Pre-Launch / New Launch</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="w-1/2 py-3 border border-[#CFD1CA] text-xs uppercase tracking-wider font-semibold bg-[#F7F7F4]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-3 bg-[#C5282F] text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Main Property Cards Grid */}
        <main className="lg:col-span-9">
          {propertiesLoading ? (
            <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
              <Building className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40 animate-pulse" />
              <p className="text-sm text-[#5B605F]">Loading verified residences…</p>
            </div>
          ) : filteredAndSortedProperties.length === 0 ? (
            <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
              <Building className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40" />
              <h3 className="font-serif text-2xl text-[#15181A] mb-2 font-light">
                No Residences Found In This View
              </h3>
              <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-6">
                Try widening your budget filter or switching categories to explore other verified Mumbai properties.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((property, idx) => (
                <ScrollReveal key={property.id} animation="fade-up" delay={(idx % 3) * 100}>
                  <PropertyCard property={property} priority={idx < 3} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DISTINCT SECTION: PRIVATE OPPORTUNITIES */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-20">
        <PrivateOpportunities />
      </div>
    </div>
  );
}

export default function PropertiesPageClient({
  initialProperties = null,
}: {
  initialProperties?: Property[] | null;
}) {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs">Loading Mumbai Residences...</div>}>
      <PropertiesContent initialProperties={initialProperties} />
    </Suspense>
  );
}
