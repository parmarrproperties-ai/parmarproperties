'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from "@/components/ui/image";
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  BedDouble,
  Building2,
  IndianRupee,
  Check,
} from 'lucide-react';
import { HERO_SLIDES, SLIDE_DURATION_MS } from '@/site/lib/constants';
import { fetchHeroContent, type HeroCmsContent } from '@/site/lib/supabase/hero';

export interface HeroSearchParams {
  location?: string;
  bhk?: string;
  budget?: string;
  type?: string;
}

interface HeroCarouselProps {
  onUnlockStateChange?: (unlocked: boolean) => void;
  onSearch?: (params: HeroSearchParams) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onUnlockStateChange }) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search bar form state
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBhk, setSearchBhk] = useState('Any');
  const [searchMinBudget, setSearchMinBudget] = useState<number>(3);
  const [searchMaxBudget, setSearchMaxBudget] = useState<number>(50);
  const [searchStatus, setSearchStatus] = useState('All');
  const [openDropdown, setOpenDropdown] = useState<'location' | 'bhk' | 'budget' | 'status' | null>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroCmsContent>({
    headline: "MUMBAI'S FINEST ADDRESSES",
    subtext:
      "Curated residences, private opportunities and investment properties across Mumbai's most sought after neighbourhoods",
    slideDurationMs: SLIDE_DURATION_MS,
    slides: HERO_SLIDES,
    locationOptions: [{ label: 'All Prime Locations', val: '' }],
    bhkOptions: [{ label: 'Any Configuration', val: 'Any' }],
    statusOptions: [{ label: 'All Status', val: 'All', tab: 'buy' }],
    budgetMin: 3,
    budgetMax: 60,
    budgetStep: 1,
  });

  const slides = heroContent.slides.length > 0 ? heroContent.slides : HERO_SLIDES;
  const totalSlides = slides.length;
  const slideDurationMs = heroContent.slideDurationMs || SLIDE_DURATION_MS;
  const budgetMin = heroContent.budgetMin;
  const budgetMax = heroContent.budgetMax;
  const budgetStep = heroContent.budgetStep || 1;
  const budgetSpan = Math.max(budgetMax - budgetMin, 1);

  // Swipe gesture tracking (horizontal touch swipes for slide switching)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Free natural scrolling - strict scroll disabled
  useEffect(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
    }

    if (onUnlockStateChange) {
      onUnlockStateChange(true);
    }
  }, [onUnlockStateChange]);

  useEffect(() => {
    let isMounted = true;
    fetchHeroContent().then((data) => {
      if (!isMounted) return;
      setHeroContent(data);
      setSearchMinBudget(data.budgetMin);
      setSearchMaxBudget(data.budgetMax);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      goToNextSlide();
    } else if (distance < -minSwipeDistance) {
      goToPrevSlide();
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.hero-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Slide rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      goToNextSlide();
    }, slideDurationMs);

    return () => clearInterval(timer);
  }, [goToNextSlide, slideDurationMs]);

  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [currentSlide, totalSlides]);

  // Execute search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenDropdown(null);

    const hasLocation = Boolean(searchLocation && searchLocation.trim() && searchLocation !== 'All');
    const hasBhk = Boolean(searchBhk && searchBhk !== 'Any');
    const hasMinBudget = searchMinBudget > budgetMin;
    const hasMaxBudget = searchMaxBudget < budgetMax;
    const hasStatus = Boolean(searchStatus && searchStatus !== 'All' && searchStatus !== 'All Status');

    const selectedStatus = heroContent.statusOptions.find(
      (opt) => opt.val === searchStatus || opt.label === searchStatus
    );
    const targetTab =
      selectedStatus?.tab ||
      (searchStatus.toLowerCase().includes('luxury')
        ? 'luxury-collection'
        : searchStatus.toLowerCase().includes('pre') ||
            searchStatus.toLowerCase().includes('under') ||
            searchStatus.toLowerCase().includes('launch')
          ? 'new-launches'
          : 'buy');

    // If a user does not put any filter and simply clicks Search
    if (!hasLocation && !hasBhk && !hasMinBudget && !hasMaxBudget && !hasStatus) {
      router.push(`/properties?tab=${targetTab}`);
      return;
    }

    const params = new URLSearchParams();
    params.set('tab', targetTab);
    if (hasLocation) params.set('location', searchLocation.trim());
    if (hasBhk) params.set('bhk', searchBhk);
    if (hasMinBudget) params.set('minPrice', searchMinBudget.toString());
    if (hasMaxBudget) params.set('maxPrice', searchMaxBudget.toString());
    if (
      hasStatus &&
      searchStatus !== 'All' &&
      !searchStatus.toLowerCase().includes('luxury')
    ) {
      params.set('status', searchStatus);
    }
    router.push(`/properties?${params.toString()}`);
  };

  // Reusable search form renderer for desktop overlay and mobile below-hero box
  const renderSearchForm = (mode: 'desktop' | 'mobile') => {
    const isDesktop = mode === 'desktop';

    if (isDesktop) {
      return (
        <form
          onSubmit={handleSearchSubmit}
          className="bg-black/35 hover:bg-black/45 backdrop-blur-xl border border-white/20 hover:border-white/35 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] p-2 sm:p-2.5 transition-all duration-300 font-sans"
        >
          <div className="grid grid-cols-12 gap-0 items-center divide-x divide-white/10">
            {/* 1. Location */}
            <div className="hero-dropdown-container col-span-3 min-w-0 px-3.5 py-2.5 hover:bg-white/[0.06] transition-colors group relative font-sans">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4">
                <MapPin className="w-3.5 h-3.5 text-[#C5282F]" />
                <span>Location</span>
              </label>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onFocus={() => setOpenDropdown('location')}
                  placeholder="Worli, Bandra, Juhu..."
                  className="w-full bg-transparent text-sm font-normal text-white placeholder:text-white/40 outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                  aria-label="Toggle location options"
                  className="text-white/60 hover:text-white ml-1.5 cursor-pointer"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
                      openDropdown === 'location' ? 'rotate-180 text-[#C5282F]' : ''
                    }`}
                  />
                </button>
              </div>

              {openDropdown === 'location' && (
                <div
                  style={{ backgroundColor: '#16181C' }}
                  className="absolute top-[calc(100%+8px)] left-0 min-w-[260px] sm:min-w-[310px] max-w-[calc(100vw-32px)] bg-[#16181C] border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.8)] p-3 z-50 rounded-sm font-sans"
                >
                  <div className="px-3.5 pt-1 pb-2.5 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium border-b border-white/10 mb-2 flex items-center justify-between">
                    <span>Prime Enclaves</span>
                    <span className="text-[9px] text-[#C5282F] font-medium">Mumbai</span>
                  </div>
                  {heroContent.locationOptions.map((loc) => (
                    <button
                      key={loc.slug || loc.label || loc.val || 'all-locations'}
                      type="button"
                      onClick={() => {
                        setSearchLocation(loc.val);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-3 sm:py-3.5 text-xs sm:text-[13px] tracking-wide transition-all duration-200 flex items-center justify-between cursor-pointer rounded-xs ${
                        searchLocation === loc.val
                          ? 'bg-[#C5282F] text-white font-medium shadow-md'
                          : 'text-white/90 font-normal hover:bg-white/10 hover:text-white hover:pl-5'
                      }`}
                    >
                      <span>{loc.label}</span>
                      {searchLocation === loc.val && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. BHK */}
            <div className="hero-dropdown-container col-span-2 px-3.5 py-2.5 hover:bg-white/[0.06] transition-colors relative group font-sans">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4 whitespace-nowrap">
                <BedDouble className="w-3.5 h-3.5 text-[#C5282F]" />
                <span>Bedrooms</span>
              </label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'bhk' ? null : 'bhk')}
                className="w-full bg-transparent text-sm font-normal text-white outline-none flex items-center justify-between cursor-pointer font-sans text-left"
              >
                <span className="truncate">{searchBhk === 'Any' ? 'Any BHK' : searchBhk}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 shrink-0 ml-1 ${
                    openDropdown === 'bhk' ? 'rotate-180 text-[#C5282F]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'bhk' && (
                <div
                  style={{ backgroundColor: '#16181C' }}
                  className="absolute top-[calc(100%+8px)] left-0 min-w-[240px] sm:min-w-[280px] max-w-[calc(100vw-32px)] bg-[#16181C] border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.8)] p-3 z-50 rounded-sm font-sans"
                >
                  <div className="px-3.5 pt-1 pb-2.5 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium border-b border-white/10 mb-2 flex items-center justify-between">
                    <span>Configuration</span>
                    <span className="text-[9px] text-[#C5282F] font-medium">BHK</span>
                  </div>
                  {heroContent.bhkOptions.map((opt) => (
                    <button
                      key={opt.slug || opt.val}
                      type="button"
                      onClick={() => {
                        setSearchBhk(opt.val);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-3 sm:py-3.5 text-xs sm:text-[13px] tracking-wide transition-all duration-200 flex items-center justify-between cursor-pointer rounded-xs ${
                        searchBhk === opt.val
                          ? 'bg-[#C5282F] text-white font-medium shadow-md'
                          : 'text-white/90 font-normal hover:bg-white/10 hover:text-white hover:pl-5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {searchBhk === opt.val && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Budget (Single 2-Way Range Slider) */}
            <div className="hero-dropdown-container col-span-2 min-w-0 px-3 py-2.5 hover:bg-white/[0.06] transition-colors relative group font-sans">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4 whitespace-nowrap">
                <IndianRupee className="w-3.5 h-3.5 text-[#C5282F]" />
                <span>Budget Range</span>
              </label>

              <div className="relative w-full h-5 flex items-center mt-1">
                <div className="absolute w-full h-1.5 bg-white/25 rounded-full" />
                <div
                  className="absolute h-1.5 bg-[#C5282F] rounded-full pointer-events-none shadow-xs"
                  style={{
                    left: `${((searchMinBudget - budgetMin) / budgetSpan) * 100}%`,
                    width: `${((searchMaxBudget - searchMinBudget) / budgetSpan) * 100}%`,
                  }}
                />

                <input
                  type="range"
                  min={budgetMin}
                  max={budgetMax}
                  step={budgetStep}
                  value={searchMinBudget}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), searchMaxBudget - budgetStep);
                    setSearchMinBudget(val);
                  }}
                  aria-label="Minimum Budget"
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                />

                <input
                  type="range"
                  min={budgetMin}
                  max={budgetMax}
                  step={budgetStep}
                  value={searchMaxBudget}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), searchMinBudget + budgetStep);
                    setSearchMaxBudget(val);
                  }}
                  aria-label="Maximum Budget"
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-30 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-white/80 mt-1 font-sans font-normal">
                <span className="tabular-nums">₹{searchMinBudget} Cr</span>
                <span className="tabular-nums">
                  {searchMaxBudget >= budgetMax ? `₹${budgetMax} Cr+` : `₹${searchMaxBudget} Cr`}
                </span>
              </div>
            </div>

            {/* 4. Construction Status */}
            <div className="hero-dropdown-container col-span-3 min-w-0 px-3.5 py-2.5 hover:bg-white/[0.06] transition-colors relative group font-sans">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4 min-w-0">
                <Building2 className="w-3.5 h-3.5 text-[#C5282F] shrink-0" />
                <span className="truncate">Construction Status</span>
              </label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                className="w-full bg-transparent text-sm font-normal text-white outline-none flex items-center justify-between cursor-pointer font-sans text-left min-w-0"
              >
                <span className="truncate pr-1">{searchStatus === 'All' ? 'All Status' : searchStatus}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 shrink-0 ml-1 ${
                    openDropdown === 'status' ? 'rotate-180 text-[#C5282F]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'status' && (
                <div
                  style={{ backgroundColor: '#16181C' }}
                  className="absolute top-[calc(100%+8px)] left-0 min-w-[260px] sm:min-w-[300px] max-w-[calc(100vw-32px)] bg-[#16181C] border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.8)] p-3 z-50 rounded-sm font-sans"
                >
                  <div className="px-3.5 pt-1 pb-2 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium border-b border-white/10 mb-2 flex items-center justify-between">
                    <span>Construction Status</span>
                    <span className="text-[9px] text-[#C5282F] font-medium">Phase</span>
                  </div>
                  {heroContent.statusOptions.map((opt) => (
                    <button
                      key={opt.slug || opt.val}
                      type="button"
                      onClick={() => {
                        setSearchStatus(opt.val);
                        setOpenDropdown(null);

                        const params = new URLSearchParams();
                        params.set('tab', opt.tab || 'buy');
                        if (searchLocation && searchLocation.trim() && searchLocation !== 'All') {
                          params.set('location', searchLocation.trim());
                        }
                        if (searchBhk && searchBhk !== 'Any') {
                          params.set('bhk', searchBhk);
                        }
                        if (searchMinBudget > budgetMin) {
                          params.set('minPrice', searchMinBudget.toString());
                        }
                        if (searchMaxBudget < budgetMax) {
                          params.set('maxPrice', searchMaxBudget.toString());
                        }
                        if (
                          opt.val !== 'All' &&
                          !(opt.slug === 'luxury-collection' || opt.val.toLowerCase().includes('luxury'))
                        ) {
                          params.set('status', opt.val);
                        }
                        router.push(`/properties?${params.toString()}`);
                      }}
                      className={`w-full text-left px-4 py-3 sm:py-3.5 text-xs sm:text-[13px] tracking-wide transition-all duration-200 flex items-center justify-between cursor-pointer rounded-xs ${
                        searchStatus === opt.val
                          ? 'bg-[#C5282F] text-white font-medium shadow-md'
                          : 'text-white/90 font-normal hover:bg-white/10 hover:text-white hover:pl-5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {searchStatus === opt.val && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Search Button */}
            <div className="col-span-2 min-w-0 p-1 flex items-center justify-center">
              <button
                type="submit"
                className="w-full h-11 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-98 rounded-xs"
              >
                <Search className="w-4 h-4 text-white stroke-2 shrink-0" />
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </form>
      );
    }

    // Mobile Search Form (Below Hero Section)
    return (
      <form
        onSubmit={handleSearchSubmit}
        className="bg-[#1C1F24] border border-[#2E343C] p-3.5 sm:p-4 rounded-xs font-sans shadow-lg space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          {/* 1. Mobile Location */}
          <div className="hero-dropdown-container min-w-0 p-2.5 bg-black/25 border border-white/10 rounded-xs relative font-sans">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4">
              <MapPin className="w-3.5 h-3.5 text-[#C5282F]" />
              <span>Location</span>
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onFocus={() => setOpenDropdown('location')}
                placeholder="Worli, Bandra, Juhu..."
                className="w-full bg-transparent text-sm font-normal text-white placeholder:text-white/40 outline-none font-sans"
              />
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                aria-label="Toggle location options"
                className="text-white/60 hover:text-white ml-1.5 cursor-pointer"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
                    openDropdown === 'location' ? 'rotate-180 text-[#C5282F]' : ''
                  }`}
                />
              </button>
            </div>

            {openDropdown === 'location' && (
              <div
                style={{ backgroundColor: '#16181C' }}
                className="absolute top-[calc(100%+4px)] left-0 right-0 sm:right-auto sm:min-w-[280px] bg-[#16181C] border border-white/25 shadow-2xl p-2.5 z-50 rounded-sm font-sans max-h-56 overflow-y-auto"
              >
                <div className="px-3 pt-1 pb-2 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium border-b border-white/10 mb-1 flex items-center justify-between">
                  <span>Prime Enclaves</span>
                  <span className="text-[9px] text-[#C5282F] font-medium">Mumbai</span>
                </div>
                {heroContent.locationOptions.map((loc) => (
                  <button
                    key={loc.slug || loc.label || loc.val || 'mobile-loc'}
                    type="button"
                    onClick={() => {
                      setSearchLocation(loc.val);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs tracking-wide transition-all duration-200 flex items-center justify-between cursor-pointer rounded-xs ${
                      searchLocation === loc.val
                        ? 'bg-[#C5282F] text-white font-medium'
                        : 'text-white/90 font-normal hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{loc.label}</span>
                    {searchLocation === loc.val && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Mobile BHK */}
          <div className="hero-dropdown-container min-w-0 p-2.5 bg-black/25 border border-white/10 rounded-xs relative font-sans">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4 whitespace-nowrap">
              <BedDouble className="w-3.5 h-3.5 text-[#C5282F]" />
              <span>Bedrooms</span>
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'bhk' ? null : 'bhk')}
              className="w-full bg-transparent text-sm font-normal text-white outline-none flex items-center justify-between cursor-pointer font-sans text-left"
            >
              <span className="truncate">{searchBhk === 'Any' ? 'Any BHK' : searchBhk}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 shrink-0 ml-1 ${
                  openDropdown === 'bhk' ? 'rotate-180 text-[#C5282F]' : ''
                }`}
              />
            </button>

            {openDropdown === 'bhk' && (
              <div
                style={{ backgroundColor: '#16181C' }}
                className="absolute top-[calc(100%+4px)] left-0 right-0 sm:right-auto sm:min-w-[240px] bg-[#16181C] border border-white/25 shadow-2xl p-2.5 z-50 rounded-sm font-sans max-h-56 overflow-y-auto"
              >
                <div className="px-3 pt-1 pb-2 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium border-b border-white/10 mb-1 flex items-center justify-between">
                  <span>Configuration</span>
                  <span className="text-[9px] text-[#C5282F] font-medium">BHK</span>
                </div>
                {heroContent.bhkOptions.map((opt) => (
                  <button
                    key={opt.slug || opt.val}
                    type="button"
                    onClick={() => {
                      setSearchBhk(opt.val);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs tracking-wide transition-all duration-200 flex items-center justify-between cursor-pointer rounded-xs ${
                      searchBhk === opt.val
                        ? 'bg-[#C5282F] text-white font-medium'
                        : 'text-white/90 font-normal hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {searchBhk === opt.val && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Mobile Budget */}
          <div className="hero-dropdown-container col-span-1 sm:col-span-2 min-w-0 p-2.5 bg-black/25 border border-white/10 rounded-xs relative font-sans">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4 whitespace-nowrap">
              <IndianRupee className="w-3.5 h-3.5 text-[#C5282F]" />
              <span>Budget Range</span>
            </label>

            <div className="relative w-full h-5 flex items-center mt-1">
              <div className="absolute w-full h-1.5 bg-white/25 rounded-full" />
              <div
                className="absolute h-1.5 bg-[#C5282F] rounded-full pointer-events-none shadow-xs"
                style={{
                  left: `${((searchMinBudget - budgetMin) / budgetSpan) * 100}%`,
                  width: `${((searchMaxBudget - searchMinBudget) / budgetSpan) * 100}%`,
                }}
              />

              <input
                type="range"
                min={budgetMin}
                max={budgetMax}
                step={budgetStep}
                value={searchMinBudget}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), searchMaxBudget - budgetStep);
                  setSearchMinBudget(val);
                }}
                aria-label="Minimum Budget"
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
              />

              <input
                type="range"
                min={budgetMin}
                max={budgetMax}
                step={budgetStep}
                value={searchMaxBudget}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), searchMinBudget + budgetStep);
                  setSearchMaxBudget(val);
                }}
                aria-label="Maximum Budget"
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-30 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-white/80 mt-1 font-sans font-normal">
              <span className="tabular-nums">₹{searchMinBudget} Cr</span>
              <span className="tabular-nums">
                {searchMaxBudget >= budgetMax ? `₹${budgetMax} Cr+` : `₹${searchMaxBudget} Cr`}
              </span>
            </div>
          </div>

          {/* 4. Mobile Construction Status */}
          <div className="hero-dropdown-container col-span-1 sm:col-span-2 min-w-0 p-2.5 bg-black/25 border border-white/10 rounded-xs relative font-sans">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-white/70 mb-1.5 font-sans h-4 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-[#C5282F] shrink-0" />
              <span className="truncate">Construction Status</span>
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              className="w-full bg-transparent text-sm font-normal text-white outline-none flex items-center justify-between cursor-pointer font-sans text-left min-w-0"
            >
              <span className="truncate pr-1">{searchStatus === 'All' ? 'All Status' : searchStatus}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 shrink-0 ml-1 ${
                  openDropdown === 'status' ? 'rotate-180 text-[#C5282F]' : ''
                }`}
              />
            </button>

            {openDropdown === 'status' && (
              <div
                style={{ backgroundColor: '#16181C' }}
                className="absolute top-[calc(100%+4px)] left-0 right-0 sm:right-auto sm:min-w-[260px] bg-[#16181C] border border-white/25 shadow-2xl p-2.5 z-50 rounded-sm font-sans max-h-56 overflow-y-auto"
              >
                <div className="px-3 pt-1 pb-2 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium border-b border-white/10 mb-1 flex items-center justify-between">
                  <span>Construction Status</span>
                  <span className="text-[9px] text-[#C5282F] font-medium">Phase</span>
                </div>
                {heroContent.statusOptions.map((opt) => (
                  <button
                    key={opt.slug || opt.val}
                    type="button"
                    onClick={() => {
                      setSearchStatus(opt.val);
                      setOpenDropdown(null);

                      const params = new URLSearchParams();
                      params.set('tab', opt.tab || 'buy');
                      if (searchLocation && searchLocation.trim() && searchLocation !== 'All') {
                        params.set('location', searchLocation.trim());
                      }
                      if (searchBhk && searchBhk !== 'Any') {
                        params.set('bhk', searchBhk);
                      }
                      if (searchMinBudget > budgetMin) {
                        params.set('minPrice', searchMinBudget.toString());
                      }
                      if (searchMaxBudget < budgetMax) {
                        params.set('maxPrice', searchMaxBudget.toString());
                      }
                      if (
                        opt.val !== 'All' &&
                        !(opt.slug === 'luxury-collection' || opt.val.toLowerCase().includes('luxury'))
                      ) {
                        params.set('status', opt.val);
                      }
                      router.push(`/properties?${params.toString()}`);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs tracking-wide transition-all duration-200 flex items-center justify-between cursor-pointer rounded-xs ${
                      searchStatus === opt.val
                        ? 'bg-[#C5282F] text-white font-medium'
                        : 'text-white/90 font-normal hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {searchStatus === opt.val && <Check className="w-3.5 h-3.5 text-white stroke-2 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Mobile Search Button */}
          <div className="col-span-1 sm:col-span-2 min-w-0 pt-1 flex items-center justify-center">
            <button
              type="submit"
              className="w-full h-11 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 rounded-xs"
            >
              <Search className="w-4 h-4 text-white stroke-2 shrink-0" />
              <span>SEARCH PROPERTIES</span>
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <>
      <section
        id="hero"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="group relative w-full h-[45vh] min-h-[340px] max-h-[460px] sm:h-[50vh] sm:min-h-[400px] sm:max-h-[500px] md:h-[calc(100svh-80px)] md:min-h-[750px] lg:min-h-[820px] md:max-h-none overflow-hidden bg-[#1C1C1C] select-none"
      >
        {/* Navigation Arrows (Desktop / Tablet) */}
        <button
          onClick={goToPrevSlide}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center bg-black/40 hover:bg-[#C5282F] text-white/80 hover:text-white border border-white/20 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={goToNextSlide}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center bg-black/40 hover:bg-[#C5282F] text-white/80 hover:text-white border border-white/20 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Background Slides */}
        {slides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={`${slide.id}-${slide.image}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              } ${reducedMotion ? 'transition-none' : ''}`}
              aria-hidden={!isActive}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/35" />
              </div>
            </div>
          );
        })}

        {/* Persistent Content Overlay: Tagline, Subtext & Desktop Floating Search Bar */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-2 sm:pt-6 pb-8 md:pb-24">
          {/* Unified Tagline */}
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-7xl text-white font-light tracking-wide leading-tight drop-shadow-md mb-2 sm:mb-3">
            {heroContent.headline}
          </h1>

          {/* Subtext */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#CFD1CA] max-w-2xl font-light tracking-wide mb-2 sm:mb-4 leading-relaxed drop-shadow px-2 sm:px-0">
            {heroContent.subtext}
          </p>

          {/* Laptop / Desktop Only: Floating Search Bar Inside Hero */}
          <div className="hidden md:block w-full mt-6 md:mt-8 max-w-5xl mx-auto text-left relative z-40">
            {renderSearchForm('desktop')}
          </div>
        </div>

        {/* Bottom Bar: Indicators & Desktop Scroll Cue */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-8 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto" aria-label="Hero Slide Progress">
            {slides.map((slide, idx) => (
              <button
                key={`${slide.id}-dot-${idx}`}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-[#C5282F]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Laptop / Desktop Only: Scroll To Discover Cue */}
          <div className="hidden md:flex flex-col items-center text-white/70 mt-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium mb-1">
              Scroll To Discover
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Mobile Only: Search Bar Box below the Hero Section */}
      <div className="block md:hidden w-full bg-[#15181A] border-b border-[#2C3136] px-4 py-5 shadow-xl relative z-20">
        <div className="max-w-xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#C5282F] font-medium mb-3 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            <span>Search Prime Properties</span>
          </div>
          {renderSearchForm('mobile')}
        </div>
      </div>
    </>
  );
};
