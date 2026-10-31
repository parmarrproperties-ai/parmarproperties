import type { Property } from '@/site/types/property';

export const PHONE_DISPLAY = '+91 (022) 6666 9733';
export const PHONE_TEL = 'tel:+912266669733';
export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick';
export const CTA = `inline-flex items-center justify-center gap-2 min-h-12 px-8 bg-brick hover:bg-brickHover text-white text-sm uppercase tracking-widest font-semibold transition-colors ${FOCUS}`;

const PLACEHOLDER = '/placeholder.png';

/** Everything a landing page needs, derived once so every layout shows the same facts. */
export function ppcData(property: Property) {
  const real = (property.images ?? []).filter((i) => i && i !== PLACEHOLDER);
  const date = property.possessionDate?.trim();
  const status =
    date && date.toLowerCase().includes(property.possession.toLowerCase().split(' ')[0])
      ? date
      : property.possession + (date ? ` · ${date}` : '');
  const place = property.subLocation?.toLowerCase().includes(property.location.toLowerCase())
    ? property.subLocation
    : [property.subLocation, property.location].filter(Boolean).join(', ');
  const facts = (
    [
      ['Location', place],
      ['Configurations', property.bhk],
      ['Status', status],
      ['Type', property.propertyType],
      ['MahaRERA', property.reraId],
    ] as [string, string][]
  ).filter(([, v]) => v);
  const mapsUrl =
    property.googleMapsUrl ||
    (property.coordinates ? `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}` : '');
  return {
    hero: real[0],
    gallery: real.slice(1, 6),
    all: real,
    variants: property.layoutVariants ?? [],
    plans: (property.floorPlans ?? []).filter((p) => p.image),
    status,
    place,
    facts,
    mapsUrl,
  };
}


export const DISCLAIMER =
  'Prices, areas and availability are indicative and subject to change. Please verify project registration on the MahaRERA website. Parmar Properties · MahaRERA A51900018442.';
