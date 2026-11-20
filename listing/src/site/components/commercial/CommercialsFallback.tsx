import Link from 'next/link';

import type { CommercialProperty } from '@/site/data/commercials';
import { COMMERCIALS_PAGE_CONTENT } from '@/site/data/content/commercials.content';
import { COMMERCIAL_CATEGORIES } from '@/lib/segments';

/** Plain, server-rendered version of the commercial page: what search engines read before the tabs load. */
export function CommercialsFallback({ commercials }: { commercials: CommercialProperty[] }) {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A] font-sans">
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light">{COMMERCIALS_PAGE_CONTENT.header.title}</h1>
      <p className="text-sm text-[#5B605F] mt-3 max-w-2xl leading-relaxed">{COMMERCIALS_PAGE_CONTENT.header.subtitle}</p>

      {COMMERCIAL_CATEGORIES.map((cat) => {
        const items = commercials.filter((c) => c.dealType === cat.dealType);
        return (
          <section key={cat.slug} className="mt-10">
            <h2 className="font-serif text-2xl font-light mb-3">
              <Link href={`/commercials?tab=${cat.slug}`} className="hover:text-[#C5282F] transition-colors">
                {cat.label}
              </Link>{' '}
              <span className="text-sm text-[#5B605F]">({items.length})</span>
            </h2>
            {items.length === 0 ? (
              <p className="text-sm text-[#5B605F]">No {cat.label.toLowerCase()} listings right now.</p>
            ) : (
              <ul className="divide-y divide-[#CFD1CA] border-y border-[#CFD1CA]">
                {items.map((c) => (
                  <li key={c.id} className="py-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                    <span className="font-semibold">{c.title}</span>
                    <span className="text-[#5B605F]">
                      {[c.location, c.propertyType, c.carpetArea > 0 ? `${c.carpetArea.toLocaleString('en-IN')} sq ft` : '', c.priceFormatted]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
