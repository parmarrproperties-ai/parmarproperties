'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from "@/components/ui/image";
import {
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Filter,
  Building2,
  MapPin,
  Maximize2,
  Briefcase,
  CheckCircle2,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';
import type { CommercialProperty } from '@/site/data/commercials';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';
import { ScrollProgressBar } from '@/site/components/ui/ScrollProgressBar';
import { PrivateOpportunities } from '@/site/components/property/PrivateOpportunities';
import { COMMERCIALS_PAGE_CONTENT } from '@/site/data/content/commercials.content';
import { submitLead } from '@/site/lib/supabase/leads';
import { fetchPublishedCommercials } from '@/site/lib/supabase/commercials';

function CommercialCard({ property }: { property: CommercialProperty }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ nameOrCompany: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="group bg-[#F7F7F4] border border-[#CFD1CA] hover:border-[#15181A] hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 ease-out flex flex-col overflow-hidden will-change-transform relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C5282F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

      {/* Image Container */}
      <div className="relative aspect-16/10 w-full bg-[#EDEEE9] overflow-hidden">
        <Image
          src={property.coverImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />



        {/* Price Badge */}
        <div className="absolute bottom-0 left-0 bg-[#15181A] text-white px-3.5 py-1.5 z-10">
          <span className="font-serif text-xs sm:text-sm font-medium tracking-wide">
            {property.priceFormatted}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#5B605F] mb-2 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#C5282F]" />
            <span>{property.subLocation}</span>
          </div>

          <h3 className="font-serif text-xl font-normal text-[#15181A] group-hover:text-[#C5282F] transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          <p className="text-xs text-[#5B605F] line-clamp-2 mb-5 font-sans leading-relaxed">
            {property.tagline}
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#CFD1CA] text-xs text-[#15181A]">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#5B605F]" />
              <span>{property.carpetArea > 0 ? `${property.carpetArea.toLocaleString()} sq.ft` : 'Area on request'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#5B605F]" />
              <span className="truncate">{property.floor}</span>
            </div>
            <div className="text-right text-[#5B605F] truncate text-[11px]">
              {property.possession}
            </div>
          </div>
        </div>

        <div className="pt-4 mt-auto border-t border-[#CFD1CA]/60 flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-wider text-[#5B605F] font-mono flex items-center justify-between">
            <span>MahaRERA:</span>
            <span className="font-semibold text-[#15181A]">{(property as any).reraId || 'P51900018420'}</span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2.5 px-4 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs font-sans uppercase tracking-[0.12em] font-semibold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <span>INQUIRE COMMERCIAL</span>
          </button>
        </div>
      </div>

      {/* Commercial Inquiry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#F7F7F4] border border-[#CFD1CA] p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#5B605F] hover:text-[#15181A]"
            >
              ✕
            </button>
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C5282F] mx-auto" />
                <h4 className="font-serif text-xl text-[#15181A]">Acquisition Dossier Requested</h4>
                <p className="text-xs text-[#5B605F]">
                  Our Commercial Advisory Director will contact your desk regarding <strong>{property.title}</strong> within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setModalOpen(false);
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#15181A] text-white text-xs uppercase font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-center space-y-3 mb-4">
                  <h3 className="font-serif text-2xl text-[#15181A]">Commercial Acquisition Desk</h3>
                  <p className="text-xs text-[#5B605F]">
                    Receive detailed lease schedules, capital cap rates &amp; architectural floor plans for <strong>{property.title}</strong>.
                  </p>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    try {
                      await submitLead({
                        fullName: leadForm.nameOrCompany,
                        companyName: leadForm.nameOrCompany,
                        phone: leadForm.phone,
                        commercialId: property.id,
                        sourceSlug: 'commercial_card_modal',
                        message: `Commercial inquiry for ${property.title} (${property.priceFormatted}) in ${property.location}`,
                      });
                    } catch (err) {
                      console.warn('Commercial lead submit error:', err);
                    } finally {
                      setSubmitting(false);
                      setSubmitted(true);
                    }
                  }}
                  className="space-y-3 text-left text-xs"
                >
                  <div>
                    <label className="block uppercase tracking-wider font-semibold mb-1">Company / Full Name</label>
                    <input
                      required
                      type="text"
                      value={leadForm.nameOrCompany}
                      onChange={(e) => setLeadForm({ ...leadForm, nameOrCompany: e.target.value })}
                      placeholder="e.g. Goldman Sachs Asset Desk"
                      className="w-full p-2.5 bg-white border border-[#CFD1CA] text-xs outline-none focus:border-[#C5282F]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold mb-1">Official Mobile / Work Phone</label>
                    <input
                      required
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full p-2.5 bg-white border border-[#CFD1CA] text-xs outline-none focus:border-[#C5282F]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#C5282F] hover:bg-[#A31D23] disabled:opacity-60 text-white text-xs uppercase tracking-widest font-semibold cursor-pointer mt-2"
                  >
                    {submitting ? 'Submitting Inquiry...' : 'Request Commercial Dossier'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CommercialsContent() {
  const [commercials, setCommercials] = useState<CommercialProperty[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(15);
  const [maxPrice, setMaxPrice] = useState<number>(65);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortOptions = [
    { val: 'featured', label: 'Featured Curated' },
    { val: 'price-asc', label: 'Price: Low to High' },
    { val: 'price-desc', label: 'Price: High to Low' },
    { val: 'area-desc', label: 'Carpet Area: Largest First' },
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

  useEffect(() => {
    fetchPublishedCommercials().then(setCommercials);
  }, []);

  const resetFilters = () => {
    setSelectedLocality('All');
    setMinPrice(15);
    setMaxPrice(65);
    setSortBy('featured');
  };

  const filteredProperties = useMemo(() => {
    let list = commercials.filter((p) => {
      if (selectedLocality !== 'All' && p.location !== selectedLocality) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area-desc') {
      list.sort((a, b) => b.carpetArea - a.carpetArea);
    }

    return list;
  }, [commercials, selectedLocality, minPrice, maxPrice, sortBy]);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A]">
      <ScrollProgressBar />

      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-widest text-[#5B605F] font-semibold mb-3 flex items-center gap-1.5">
        <Link href="/" className="hover:underline">Home</Link>
        <span>&bull;</span>
        <span className="text-[#C5282F] font-bold">COMMERCIALS</span>
      </div>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-[#CFD1CA]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#15181A]">
              {COMMERCIALS_PAGE_CONTENT.header.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B605F] mt-2 font-sans max-w-2xl leading-relaxed">
              {COMMERCIALS_PAGE_CONTENT.header.subtitle}
            </p>
          </div>

          {/* Quick Sort & Mobile Filter Button (Matching Buy Page Style) */}
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
                aria-label="Sort commercial properties"
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
                    <span>Sort Commercials</span>
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
      </div>

      {/* Main Grid with Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6 space-y-6 shadow-xs sticky top-24 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-[#CFD1CA]">
              <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#15181A] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C5282F]" />
                Filter Commercials
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-[#C5282F] hover:text-[#A31D23] flex items-center gap-1 font-semibold uppercase tracking-wider cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Locality */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-2 font-sans">
                Commercial Hub
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full p-2.5 bg-[#EDEEE9] border border-[#CFD1CA] text-xs font-medium text-[#15181A] focus:outline-none focus:border-[#C5282F]"
              >
                <option value="All">All Commercial Hubs</option>
                <option value="BKC">Bandra Kurla Complex (BKC)</option>
                <option value="Lower Parel">Lower Parel &amp; Senapati Bapat Marg</option>
                <option value="Worli">Worli Coastal Commercial</option>
                <option value="Nariman Point">Nariman Point &amp; Marine Drive</option>
                <option value="Bandra West">Bandra West &amp; Pali Hill</option>
                <option value="Powai">Powai Business Park</option>
              </select>
            </div>

            {/* 2-Way Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-3 font-sans">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#15181A]">
                  Capital Budget Range
                </label>
                <span className="text-xs font-sans font-extrabold text-[#C5282F] tabular-nums tracking-wide">
                  ₹{minPrice} Cr &ndash; {maxPrice >= 65 ? '₹65 Cr+' : `₹${maxPrice} Cr`}
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
                    left: `${((minPrice - 15) / (65 - 15)) * 100}%`,
                    width: `${((maxPrice - minPrice) / (65 - 15)) * 100}%`,
                  }}
                />

                {/* Min Value Thumb Slider */}
                <input
                  type="range"
                  min="15"
                  max="65"
                  step="2"
                  value={minPrice}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), maxPrice - 2);
                    setMinPrice(val);
                  }}
                  aria-label="Minimum Commercial Budget"
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                />

                {/* Max Value Thumb Slider */}
                <input
                  type="range"
                  min="15"
                  max="65"
                  step="2"
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), minPrice + 2);
                    setMaxPrice(val);
                  }}
                  aria-label="Maximum Commercial Budget"
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-30 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-[#5B605F] mt-2 font-sans font-semibold tabular-nums">
                <span>₹{minPrice} Cr</span>
                <span>{maxPrice >= 65 ? '₹65 Cr+' : `₹${maxPrice} Cr`}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xs sm:max-w-sm bg-[#EDEEE9] h-full p-5 sm:p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#CFD1CA]">
                <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#15181A]">Filter Commercials</span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-[#15181A]" />
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold mb-2">Hub</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F4] border border-[#CFD1CA] text-xs font-medium"
                >
                  <option value="All">All Commercial Hubs</option>
                  <option value="BKC">BKC</option>
                  <option value="Lower Parel">Lower Parel</option>
                  <option value="Worli">Worli</option>
                  <option value="Nariman Point">Nariman Point</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-3 font-sans">
                  <span className="font-semibold">Budget Range</span>
                  <span className="text-[#C5282F] font-bold tabular-nums">
                    ₹{minPrice} Cr &ndash; {maxPrice >= 65 ? '₹65 Cr+' : `₹${maxPrice} Cr`}
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
                      left: `${((minPrice - 15) / (65 - 15)) * 100}%`,
                      width: `${((maxPrice - minPrice) / (65 - 15)) * 100}%`,
                    }}
                  />

                  {/* Min Value Thumb Slider */}
                  <input
                    type="range"
                    min="15"
                    max="65"
                    step="2"
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 2);
                      setMinPrice(val);
                    }}
                    aria-label="Minimum Commercial Budget"
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                  />

                  {/* Max Value Thumb Slider */}
                  <input
                    type="range"
                    min="15"
                    max="65"
                    step="2"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 2);
                      setMaxPrice(val);
                    }}
                    aria-label="Maximum Commercial Budget"
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-30 h-full m-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5282F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5282F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-[#5B605F] mt-2 font-sans font-semibold tabular-nums">
                  <span>₹{minPrice} Cr</span>
                  <span>{maxPrice >= 65 ? '₹65 Cr+' : `₹${maxPrice} Cr`}</span>
                </div>
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

        {/* Right Commercial Cards Grid */}
        <main className="lg:col-span-9">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8">
              <Building2 className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40" />
              <h3 className="font-serif text-2xl text-[#15181A] mb-2 font-light">
                No Commercial Assets Found
              </h3>
              <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-6">
                Try widening your budget filter to see other commercial suites.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-[#C5282F] text-white text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, idx) => (
                <ScrollReveal key={property.id} animation="fade-up" delay={(idx % 3) * 100}>
                  <CommercialCard property={property} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* PRIVATE OPPORTUNITIES SECTION AT BOTTOM */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-24">
        <PrivateOpportunities minimal={true} />
      </div>
    </div>
  );
}

export default function CommercialsPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs">Loading Commercial Real Estate...</div>}>
      <CommercialsContent />
    </Suspense>
  );
}
