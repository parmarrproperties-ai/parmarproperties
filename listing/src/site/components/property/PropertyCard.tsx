'use client';

import React, { useState } from 'react';
import Image from "@/components/ui/image";
import Link from 'next/link';
import { MapPin, Maximize2, BedDouble, ArrowRight } from 'lucide-react';
import { Property } from '@/site/types/property';

interface PropertyCardProps {
  property: Property;
  /** Load the cover immediately; set for cards visible on first paint. */
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, priority = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-[#F7F7F4] rounded-none border border-[#CFD1CA] hover:border-[#15181A] hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 ease-out flex flex-col overflow-hidden will-change-transform relative">
      {/* Top interactive accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C5282F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

      {/* Property Image Container */}
      <div className="relative aspect-16/10 w-full bg-[#EDEEE9] overflow-hidden">
        {!imgError && property.coverImage ? (
          <Image
            src={property.coverImage}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[#EDEEE9] flex flex-col items-center justify-center p-6 text-center">
            <span className="font-serif text-base text-[#15181A] font-medium">
              {property.title}
            </span>
            <span className="text-[11px] text-[#5B605F] uppercase tracking-wider mt-1">
              {property.location} &bull; {property.propertyType}
            </span>
          </div>
        )}



        {/* Bottom Left Price Badge - Increased size and prominence */}
        <div className="absolute bottom-0 left-0 bg-[#15181A] text-white px-4 py-2 sm:px-5 sm:py-2.5 z-10 shadow-lg">
          <span className="font-sans text-sm sm:text-base md:text-lg font-extrabold tracking-wide text-white">
            {property.priceFormatted}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#5B605F] mb-2 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#C5282F]" />
            <span>{property.subLocation}</span>
          </div>

          <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#15181A] group-hover:text-[#C5282F] transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          <p className="text-xs text-[#5B605F] line-clamp-2 mb-5 font-sans leading-relaxed">
            {property.tagline}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-3 border-y border-[#CFD1CA] text-[11px] sm:text-xs text-[#15181A]">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <BedDouble className="w-3.5 h-3.5 text-[#5B605F] shrink-0" />
              <span className="truncate">{property.bhk}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <Maximize2 className="w-3.5 h-3.5 text-[#5B605F] shrink-0" />
              <span className="truncate">{property.carpetArea > 0 ? `${property.carpetArea} sq.ft` : property.areaText ? (/^[\d.,\s–-]+$/.test(property.areaText) ? `${property.areaText} sq.ft` : property.areaText) : 'Area on request'}</span>
            </div>
            <div className="text-right text-[#5B605F] truncate text-[10px] sm:text-[11px] min-w-0">
              {property.possession}
            </div>
          </div>
        </div>

        {/* Card Footer: RERA number above, full-width horizontal action button */}
        <div className="pt-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#5B605F] font-sans">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#5B605F]">MahaRERA</span>
            <span className="font-mono font-medium">{property.reraId}</span>
          </div>
          <Link
            href={`/properties/${property.slug}`}
            className="w-full py-2.5 px-4 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs font-sans uppercase tracking-[0.12em] font-semibold text-center transition-all flex items-center justify-center gap-2 hover:shadow-md active:scale-98"
          >
            <span>View Residence</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};
