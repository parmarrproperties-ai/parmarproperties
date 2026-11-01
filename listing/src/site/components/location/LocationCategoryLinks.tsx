import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { SegmentCounts } from '@/site/lib/location-segments';
import { COMMERCIAL_CATEGORIES, RESIDENTIAL_CATEGORIES, segmentPath, type SegmentKind } from '@/lib/segments';

const GROUPS: { kind: SegmentKind; title: string; categories: { slug: string; label: string }[] }[] = [
  { kind: 'residential', title: 'Residential', categories: RESIDENTIAL_CATEGORIES },
  { kind: 'commercial', title: 'Commercial', categories: COMMERCIAL_CATEGORIES },
];

/** The two ways to browse a location: Residential and Commercial, each split into its categories. */
export function LocationCategoryLinks({
  locationName,
  locationSlug,
  counts,
}: {
  locationName: string;
  locationSlug: string;
  counts: SegmentCounts;
}) {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" aria-label={`Browse ${locationName}`}>
      <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] mb-1 block">
        Browse {locationName}
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#15181A] mb-8">Residential &amp; Commercial</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GROUPS.map((group) => {
          const groupCounts = counts[group.kind] as Record<string, number>;
          return (
            <div key={group.kind} className="bg-[#F7F7F4] border border-[#CFD1CA] p-6">
              <h3 className="font-serif text-2xl font-light text-[#15181A] mb-4">{group.title}</h3>
              <ul className="divide-y divide-[#CFD1CA]">
                {group.categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={segmentPath(locationSlug, group.kind, c.slug)}
                      className="group flex items-center justify-between py-3 text-sm font-sans text-[#15181A] hover:text-[#C5282F] transition-colors"
                    >
                      <span className="uppercase tracking-[0.12em] text-xs font-semibold">{c.label}</span>
                      <span className="flex items-center gap-3 text-xs text-[#5B605F]">
                        {groupCounts[c.slug]} {groupCounts[c.slug] === 1 ? 'listing' : 'listings'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
