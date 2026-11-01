import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { PropertyCard } from '@/site/components/property/PropertyCard';
import { CommercialCard } from '@/site/components/commercial/CommercialCard';
import type { LocationInfo } from '@/site/lib/supabase/locations';
import type { Property } from '@/site/types/property';
import type { CommercialProperty } from '@/site/data/commercials';
import { kindTotal, type SegmentCounts } from '@/site/lib/location-segments';
import { categoriesFor, segmentPath, type SegmentKind } from '@/lib/segments';

const KIND_LABEL: Record<SegmentKind, string> = { residential: 'Residential', commercial: 'Commercial' };

/** First category of a kind that has listings, so the kind switch never lands on an empty tab. */
function firstFilledCategory(counts: SegmentCounts, kind: SegmentKind): string {
  const cats = categoriesFor(kind);
  const filled = cats.find((c) => (counts[kind] as Record<string, number>)[c.slug] > 0);
  return (filled ?? cats[0]).slug;
}

export function LocationSegmentView({
  location,
  kind,
  category,
  counts,
  copy,
  properties,
  commercials,
}: {
  location: LocationInfo;
  kind: SegmentKind;
  category: string;
  counts: SegmentCounts;
  copy: { heading: string; intro: string };
  properties: Property[];
  commercials: CommercialProperty[];
}) {
  const categories = categoriesFor(kind);
  const categoryCounts = counts[kind] as Record<string, number>;
  const currentLabel = categories.find((c) => c.slug === category)?.label ?? category;
  const itemCount = kind === 'residential' ? properties.length : commercials.length;
  const otherKind: SegmentKind = kind === 'residential' ? 'commercial' : 'residential';

  return (
    <div className="bg-[#EDEEE9] min-h-screen pt-28 md:pt-32 pb-20 text-[#15181A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#5B605F] font-sans mb-6">
          <Link href="/locations" className="hover:text-[#C5282F] transition-colors">Locations</Link>
          <span aria-hidden="true">•</span>
          <Link href={`/locations/${location.slug}`} className="hover:text-[#C5282F] transition-colors">{location.name}</Link>
          <span aria-hidden="true">•</span>
          <span>{KIND_LABEL[kind]}</span>
          <span aria-hidden="true">•</span>
          <span className="text-[#C5282F] font-semibold">{currentLabel}</span>
        </nav>

        {/* Heading */}
        <header className="mb-8 max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] block mb-2">
            {location.name} · {KIND_LABEL[kind]}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light leading-tight">{copy.heading}</h1>
          <p className="text-sm sm:text-base text-[#5B605F] mt-3 font-sans leading-relaxed">{copy.intro}</p>
        </header>

        {/* Residential / Commercial switch */}
        <div className="flex flex-wrap gap-3 mb-4" role="tablist" aria-label="Property type">
          {(['residential', 'commercial'] as SegmentKind[]).map((k) => {
            const active = k === kind;
            return (
              <Link
                key={k}
                role="tab"
                aria-selected={active}
                href={segmentPath(location.slug, k, active ? category : firstFilledCategory(counts, k))}
                className={`px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold font-sans border transition-colors ${
                  active
                    ? 'bg-[#15181A] text-white border-[#15181A]'
                    : 'bg-[#F7F7F4] text-[#15181A] border-[#CFD1CA] hover:border-[#15181A]'
                }`}
              >
                {KIND_LABEL[k]} <span className="opacity-60 ml-1">{kindTotal(counts, k)}</span>
              </Link>
            );
          })}
        </div>

        {/* Category tabs: Buy · New Launches · Luxury Collection / Buy · Pre-Lease · Rent */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-[#CFD1CA]" role="tablist" aria-label={`${KIND_LABEL[kind]} categories`}>
          {categories.map((c) => {
            const active = c.slug === category;
            return (
              <Link
                key={c.slug}
                role="tab"
                aria-selected={active}
                href={segmentPath(location.slug, kind, c.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.12em] font-semibold font-sans border transition-colors ${
                  active
                    ? 'bg-[#C5282F] text-white border-[#C5282F]'
                    : 'bg-white text-[#15181A] border-[#CFD1CA] hover:border-[#C5282F] hover:text-[#C5282F]'
                }`}
              >
                {c.label} <span className="opacity-70 ml-1">{categoryCounts[c.slug]}</span>
              </Link>
            );
          })}
        </div>

        {/* Listings */}
        {itemCount === 0 ? (
          <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] px-6">
            <h2 className="font-serif text-2xl font-light mb-2">
              No {currentLabel} {KIND_LABEL[kind].toLowerCase()} listings in {location.name} yet
            </h2>
            <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-6 font-sans">
              New listings are added regularly. Try another category, or speak to our advisors for private
              opportunities that are not yet public.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={segmentPath(location.slug, otherKind, firstFilledCategory(counts, otherKind))}
                className="px-5 py-2.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-[0.12em] font-semibold font-sans transition-colors"
              >
                View {KIND_LABEL[otherKind]} in {location.name}
              </Link>
              <Link
                href="/locations"
                className="px-5 py-2.5 border border-[#15181A] text-xs uppercase tracking-[0.12em] font-semibold font-sans hover:bg-[#15181A] hover:text-white transition-colors"
              >
                All locations
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kind === 'residential'
              ? properties.map((p, i) => <PropertyCard key={p.id} property={p} priority={i < 3} />)
              : commercials.map((c) => <CommercialCard key={c.id} property={c} />)}
          </div>
        )}

        <div className="mt-12">
          <Link
            href={`/locations/${location.slug}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold hover:text-[#C5282F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>About {location.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
