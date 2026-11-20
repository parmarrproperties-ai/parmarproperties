import Link from 'next/link';

import { PropertyCard } from '@/site/components/property/PropertyCard';
import type { Property } from '@/site/types/property';
import type { LocationInfo } from '@/site/lib/supabase/locations';
import type { SegmentSummary } from '@/site/lib/location-insights';
import { BUDGET_BANDS, budgetPath, type BudgetBand } from '@/site/lib/budget-pages';

/** A budget page: the flats in a price band, with the same written content blocks as location pages. */
export function BudgetBandView({
  band,
  properties,
  counts,
  summary,
  locations,
}: {
  band: BudgetBand;
  properties: Property[];
  counts: Record<string, number>;
  summary: SegmentSummary;
  /** Locations that have flats in this band, with how many. */
  locations: { location: LocationInfo; count: number }[];
}) {
  return (
    <div className="bg-[#EDEEE9] min-h-screen pt-28 md:pt-32 pb-20 text-[#15181A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#5B605F] font-sans mb-6">
          <Link href="/properties" className="hover:text-[#C5282F] transition-colors">Properties</Link>
          <span aria-hidden="true">•</span>
          <span>By budget</span>
          <span aria-hidden="true">•</span>
          <span className="text-[#C5282F] font-semibold">{band.label}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] block mb-2">Flats by budget</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light leading-tight">{band.heading}</h1>
          <p className="text-sm sm:text-base text-[#5B605F] mt-3 font-sans leading-relaxed">
            Verified flats {band.phrase} in Mumbai, with prices, floor plans and MahaRERA details.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-[#CFD1CA]" role="tablist" aria-label="Budget">
          {BUDGET_BANDS.map((b) => {
            const active = b.slug === band.slug;
            return (
              <Link
                key={b.slug}
                role="tab"
                aria-selected={active}
                href={budgetPath(b.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.12em] font-semibold font-sans border transition-colors ${
                  active ? 'bg-[#C5282F] text-white border-[#C5282F]' : 'bg-white text-[#15181A] border-[#CFD1CA] hover:border-[#C5282F] hover:text-[#C5282F]'
                }`}
              >
                {b.label} <span className="opacity-70 ml-1">{counts[b.slug] ?? 0}</span>
              </Link>
            );
          })}
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] px-6">
            <h2 className="font-serif text-2xl font-light mb-2">No flats {band.phrase} right now</h2>
            <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-6 font-sans">
              Try another budget, or speak to our advisors about private opportunities that are not yet public.
            </p>
            <Link href="/properties" className="px-5 py-2.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-[0.12em] font-semibold font-sans transition-colors">
              All properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <PropertyCard key={p.id} property={p} priority={i < 3} />
            ))}
          </div>
        )}

        {properties.length > 0 ? (
          <section className="mt-16 pt-10 border-t border-[#CFD1CA] grid grid-cols-1 lg:grid-cols-3 gap-10 font-sans">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-light mb-4">About {summary.phrase}</h2>
                <div className="space-y-3 text-sm sm:text-[15px] text-[#3a3f42] leading-relaxed">
                  {summary.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-light mb-4">Flats {band.phrase}</h2>
                <ul className="divide-y divide-[#CFD1CA] border-y border-[#CFD1CA]">
                  {properties.map((p) => (
                    <li key={p.id} className="py-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                      <Link href={`/properties/${p.slug}`} className="font-semibold hover:text-[#C5282F] transition-colors">
                        {p.title}
                      </Link>
                      <span className="text-[#5B605F]">{[p.location, p.bhk, p.priceFormatted].filter(Boolean).join(' · ')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-light mb-4">Frequently asked questions</h2>
                <dl className="space-y-5">
                  {summary.faqs.map((f) => (
                    <div key={f.question}>
                      <dt className="font-semibold text-[15px] mb-1">{f.question}</dt>
                      <dd className="text-sm text-[#3a3f42] leading-relaxed">{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6">
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C5282F] mb-4">At a glance</h2>
                <dl className="space-y-3 text-sm">
                  {summary.facts.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <dt className="text-[11px] uppercase tracking-wider text-[#5B605F]">{f.label}</dt>
                      <dd className="font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {locations.length > 0 ? (
                <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C5282F] mb-4">By location</h2>
                  <ul className="space-y-3 text-sm">
                    {locations.map(({ location, count }) => (
                      <li key={location.slug} className="flex items-baseline justify-between gap-3">
                        <Link href={`/locations/${location.slug}`} className="font-semibold hover:text-[#C5282F] transition-colors">
                          {location.name}
                        </Link>
                        <span className="text-[#5B605F]">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </section>
        ) : null}
      </div>
    </div>
  );
}
