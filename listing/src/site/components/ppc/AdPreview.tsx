import React from 'react';
import type { Property } from '@/site/types/property';

/** Illustrative mock of a Google Search text ad for a property. Not produced by Google. */
export function AdPreview({ property, domain = 'parmarproperties.in' }: { property: Property; domain?: string }) {
  const h1 = `${property.title} | ${property.location} Residences`;
  const h2 = property.priceFormatted ? `From ${property.priceFormatted}` : 'Private Viewings';
  const desc = (property.tagline || property.description || '').slice(0, 90);
  const links = ['Request a callback', 'Floor plans', 'Amenities', 'Location'];
  const Ad = ({ narrow }: { narrow?: boolean }) => (
    <div className={`bg-white ${narrow ? 'p-4 rounded-2xl' : 'p-6'} border border-[#dfe1e5] font-[Arial,sans-serif] text-left`}>
      <p className="text-[12px] text-[#202124]"><span className="font-bold">Sponsored</span></p>
      <p className="mt-1 text-[14px] text-[#202124]">Parmar Properties <span className="text-[#5f6368]">· {domain}/{property.slug}</span></p>
      <p className="mt-1 text-[#1a0dab] text-[20px] leading-snug">{h1} | {h2}</p>
      <p className="mt-1 text-[14px] text-[#4d5156] leading-snug">{desc}. Luxury homes in South Mumbai. MahaRERA registered. Call for a private viewing.</p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[#1a0dab] text-[14px]">{links.map((l) => <span key={l}>{l}</span>)}</p>
    </div>
  );
  return (
    <div className="bg-[#f8f9fa] min-h-screen p-6 font-sans text-[#202124]">
      <p className="text-sm text-[#5f6368] mb-3">Illustrative mock-up of a Google Search ad. Not produced by Google.</p>
      <div className="max-w-2xl"><Ad /></div>
    </div>
  );
}

export function AdPreviewMobile({ property }: { property: Property }) {
  return (
    <div className="bg-[#f8f9fa] min-h-screen p-3">
      <p className="text-xs text-[#5f6368] mb-3">Illustrative mock-up of a Google Search ad. Not produced by Google.</p>
      <AdPreview property={property} />
    </div>
  );
}
