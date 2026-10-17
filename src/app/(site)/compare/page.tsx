'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, Trash2, ArrowRight, Check } from 'lucide-react';
import { useCompareStore } from '@/site/store/compare';
import type { Property } from '@/site/types/property';
import { COMPARE_PAGE_CONTENT } from '@/site/data/content/compare.content';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';

export default function ComparePage() {
  const { header, emptyState } = COMPARE_PAGE_CONTENT;
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const compareIds = useCompareStore((s) => s.compareIds);
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare);
  const clearCompare = useCompareStore((s) => s.clearCompare);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;
    fetchPropertyCards().then((data) => {
      if (isMounted) setProperties(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const comparedProperties = mounted
    ? properties.filter((p) => compareIds.includes(p.id))
    : [];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#CFD1CA]">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#5B605F] font-semibold mb-2">
            <Link href="/" className="hover:underline">Home</Link> &bull; Portfolio Analysis
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#15181A]">
            {header.title} ({comparedProperties.length}/{header.maxCompareLimit || 4})
          </h1>
          <p className="text-sm text-[#5B605F] mt-1 font-sans">
            {header.subtitle}
          </p>
        </div>

        {comparedProperties.length > 0 && (
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              href="/properties"
              className="text-xs uppercase tracking-wider text-[#C5282F] hover:text-[#A31D23] font-semibold"
            >
              {header.addMoreButtonText}
            </Link>
            <button
              onClick={clearCompare}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C5282F] hover:text-[#A31D23] transition-colors font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              <span>{header.clearButtonText}</span>
            </button>
          </div>
        )}
      </div>

      {comparedProperties.length === 0 ? (
        <div className="text-center py-20 bg-[#F7F7F4] border border-[#CFD1CA] p-8 shadow-xs">
          <Scale className="w-12 h-12 text-[#5B605F] mx-auto mb-4 opacity-40" />
          <h2 className="font-serif text-2xl sm:text-3xl text-[#15181A] mb-2 font-light">
            {emptyState.heading}
          </h2>
          <p className="text-sm text-[#5B605F] max-w-md mx-auto mb-6">
            {emptyState.subtext}
          </p>
          <Link
            href={emptyState.browseButtonLink || '/properties'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <span>{emptyState.browseButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="overflow-x-auto bg-[#F7F7F4] border border-[#CFD1CA] shadow-xs -mx-2 sm:mx-0">
            <div className="sm:hidden px-3 pt-3 text-[11px] text-[#5B605F] font-mono">
              Scroll horizontally to compare residences &rarr;
            </div>
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#CFD1CA] bg-[#EDEEE9]">
                  <th className="p-4 text-xs uppercase tracking-wider text-[#5B605F] w-1/5">Specification</th>
                  {comparedProperties.map((p) => (
                    <th key={p.id} className="p-4 text-sm font-serif font-medium text-[#15181A] relative">
                      <div className="flex items-start justify-between gap-2">
                        <span className="line-clamp-1">{p.title}</span>
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="text-[#5B605F] hover:text-[#C5282F] p-1"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CFD1CA] text-xs sm:text-sm">
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Offered Price</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 font-serif text-lg font-bold text-[#15181A]">
                      {p.priceFormatted}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Location</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#15181A]">
                      {p.subLocation}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Property Type</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#15181A]">
                      {p.propertyType}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Configuration</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#15181A]">
                      {p.bhk}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Carpet Area</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#15181A]">
                      {p.carpetArea > 0 ? `${p.carpetArea} sq.ft` : 'Area on request'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Possession</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#15181A]">
                      {p.possession}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Elevation</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#15181A]">
                      {p.floor}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Key Privileges</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#5B605F]">
                      <ul className="space-y-1">
                        {p.amenities.slice(0, 4).map((a, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs">
                            <Check className="w-3 h-3 text-[#C5282F]" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">MahaRERA Registration</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4 text-xs font-mono text-[#5B605F]">
                      {p.reraId}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#5B605F] bg-[#EDEEE9]">Action</td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-4">
                      <Link
                        href={`/properties/${p.slug}`}
                        className="inline-block px-4 py-2 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                      >
                        View Residence &rarr;
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
