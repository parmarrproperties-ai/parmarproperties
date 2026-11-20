import Link from 'next/link';

import type { LocationInfo } from '@/site/lib/supabase/locations';
import type { CrossLink } from '@/site/data/cross-links';

/** Links from a market guide to the location pages it is about, so readers can see what is for sale there. */
export function ArticleRelatedLocations({
  locations,
  readings = [],
}: {
  locations: LocationInfo[];
  /** Matching posts on the main site. */
  readings?: CrossLink[];
}) {
  if (locations.length === 0 && readings.length === 0) return null;
  return (
    <section className="bg-[#EDEEE9] px-4 sm:px-6 lg:px-8 pb-16" aria-label="Locations in this guide">
      <div className="max-w-7xl mx-auto border-t border-[#CFD1CA] pt-10">
        {readings.length > 0 ? (
          <div className="mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] block mb-2">
              Related reading
            </span>
            <ul className="space-y-2 font-sans text-sm sm:text-base">
              {readings.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="font-semibold underline underline-offset-4 hover:text-[#C5282F] transition-colors">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {locations.length > 0 ? (
          <>
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] block mb-2">
          In this guide
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#15181A] mb-6">See what is for sale</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((l) => (
            <li key={l.slug} className="bg-[#F7F7F4] border border-[#CFD1CA] p-5">
              <Link href={`/locations/${l.slug}`} className="font-serif text-xl hover:text-[#C5282F] transition-colors">
                {l.name}
              </Link>
              <p className="text-xs text-[#5B605F] mt-1 font-sans">{l.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.12em] font-semibold font-sans">
                <Link href={`/locations/${l.slug}/residential/buy`} className="hover:text-[#C5282F] transition-colors">
                  Residential
                </Link>
                <Link href={`/locations/${l.slug}/commercial/buy`} className="hover:text-[#C5282F] transition-colors">
                  Commercial
                </Link>
              </div>
            </li>
          ))}
        </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
