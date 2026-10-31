import Link from 'next/link';

import { PropertyCard } from '@/site/components/property/PropertyCard';
import type { Property } from '@/site/types/property';

interface ListingFallbackProps {
  breadcrumb: string;
  title: string;
  subtitle: string;
  properties: Property[];
  /** Optional crawlable links rendered above the grid (e.g. location guides). */
  links?: Array<{ href: string; label: string }>;
}

/**
 * Server-rendered stand-in for pages whose interactive version waits for the
 * URL's search params in the browser. It gives search engines (and slow phones)
 * the real heading, intro and listing links instead of a "Loading…" line, and is
 * replaced by the interactive page as soon as it hydrates.
 */
export function ListingFallback({ breadcrumb, title, subtitle, properties, links }: ListingFallbackProps) {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A] w-full overflow-x-hidden">
      <div className="text-xs uppercase tracking-widest text-[#5B605F] font-semibold mb-3 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>&bull;</span>
        <span className="text-[#C5282F] font-bold">{breadcrumb}</span>
      </div>

      <div className="mb-10 pb-6 border-b border-[#CFD1CA]">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#15181A]">{title}</h1>
        <p className="text-xs sm:text-sm text-[#5B605F] mt-2 font-sans max-w-2xl leading-relaxed">{subtitle}</p>
      </div>

      {links && links.length > 0 ? (
        <nav aria-label="Locations" className="mb-8 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 border border-[#CFD1CA] text-xs uppercase tracking-wider text-[#15181A] hover:border-[#15181A]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard key={property.id} property={property} priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
