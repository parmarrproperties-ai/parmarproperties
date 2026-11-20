import Link from 'next/link';

import type { LocationInfo } from '@/site/lib/supabase/locations';
import type { InsightArticle } from '@/site/lib/supabase/insights';
import type { Property } from '@/site/types/property';
import type { CommercialProperty } from '@/site/data/commercials';
import type { SegmentSummary } from '@/site/lib/location-insights';
import type { SegmentKind } from '@/lib/segments';

/** Written content for a location category page: summary, key facts, projects, guides and FAQs. */
export function LocationSegmentContent({
  location,
  kind,
  summary,
  properties,
  commercials,
  guides,
}: {
  location: LocationInfo;
  kind: SegmentKind;
  summary: SegmentSummary;
  properties: Property[];
  commercials: CommercialProperty[];
  guides: InsightArticle[];
}) {
  return (
    <section className="mt-16 pt-10 border-t border-[#CFD1CA] grid grid-cols-1 lg:grid-cols-3 gap-10 font-sans">
      <div className="lg:col-span-2 space-y-10">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light mb-4">
            About {summary.phrase} in {location.name}
          </h2>
          <div className="space-y-3 text-sm sm:text-[15px] text-[#3a3f42] leading-relaxed">
            {summary.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light mb-4">
            {kind === 'residential' ? 'Projects' : 'Spaces'} in {location.name}
          </h2>
          <ul className="divide-y divide-[#CFD1CA] border-y border-[#CFD1CA]">
            {kind === 'residential'
              ? properties.map((p) => (
                  <li key={p.id} className="py-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                    <Link href={`/properties/${p.slug}`} className="font-semibold hover:text-[#C5282F] transition-colors">
                      {p.title}
                    </Link>
                    <span className="text-[#5B605F]">
                      {[p.developerName, p.bhk, p.priceFormatted].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                ))
              : commercials.map((c) => (
                  <li key={c.id} className="py-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                    <span className="font-semibold">{c.title}</span>
                    <span className="text-[#5B605F]">
                      {[c.propertyType, c.carpetArea > 0 ? `${c.carpetArea.toLocaleString('en-IN')} sq ft` : '', c.priceFormatted]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
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

        {guides.length > 0 ? (
          <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C5282F] mb-4">
              Guides about {location.name}
            </h2>
            <ul className="space-y-3 text-sm">
              {guides.map((g) => (
                <li key={g.id}>
                  <Link href={`/market-intelligence/${g.slug}`} className="font-semibold hover:text-[#C5282F] transition-colors">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
