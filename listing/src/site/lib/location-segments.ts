import type { Property } from '@/site/types/property';
import type { CommercialProperty } from '@/site/data/commercials';
import {
  COMMERCIAL_CATEGORIES,
  RESIDENTIAL_CATEGORIES,
  type CommercialCategory,
  type ResidentialCategory,
  type SegmentKind,
} from '@/lib/segments';

/**
 * Splits a location's listings into Residential (Buy, New Launches, Luxury Collection)
 * and Commercial (Buy, Pre-Lease, Rent). Listings match a location by its name from the
 * shared location list, so the location page, the category pages and the sitemap agree.
 */
export const sameLocation = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function residentialIn(
  properties: Property[],
  locationName: string,
  category: ResidentialCategory,
): Property[] {
  const inLocation = properties.filter((p) => sameLocation(p.location, locationName));
  if (category === 'new-launches') return inLocation.filter((p) => p.isNewLaunch);
  if (category === 'luxury-collection') return inLocation.filter((p) => p.isLuxuryCollection);
  return inLocation; // Buy: every verified residence in the location
}

export function commercialIn(
  commercials: CommercialProperty[],
  locationName: string,
  category: CommercialCategory,
): CommercialProperty[] {
  const dealType = COMMERCIAL_CATEGORIES.find((c) => c.slug === category)?.dealType ?? 'buy';
  return commercials.filter((c) => sameLocation(c.location, locationName) && c.dealType === dealType);
}

export type SegmentCounts = {
  residential: Record<ResidentialCategory, number>;
  commercial: Record<CommercialCategory, number>;
};

export function segmentCounts(
  properties: Property[],
  commercials: CommercialProperty[],
  locationName: string,
): SegmentCounts {
  const residential = {} as SegmentCounts['residential'];
  for (const c of RESIDENTIAL_CATEGORIES) residential[c.slug] = residentialIn(properties, locationName, c.slug).length;
  const commercial = {} as SegmentCounts['commercial'];
  for (const c of COMMERCIAL_CATEGORIES) commercial[c.slug] = commercialIn(commercials, locationName, c.slug).length;
  return { residential, commercial };
}

/** Listings in a kind. Residential Buy already holds every residence, so it is the total. */
export function kindTotal(counts: SegmentCounts, kind: SegmentKind): number {
  if (kind === 'residential') return counts.residential.buy;
  return Object.values(counts.commercial).reduce((sum, n) => sum + n, 0);
}

/** Heading and search-result copy for one location / kind / category page. */
export function segmentCopy(kind: SegmentKind, category: string, loc: string) {
  const key = `${kind}/${category}`;
  const table: Record<string, { heading: string; title: string; description: string; intro: string }> = {
    'residential/buy': {
      heading: `Residences for Sale in ${loc}`,
      title: `Luxury Apartments for Sale in ${loc}, Mumbai`,
      description: `Browse verified luxury apartments and residences for sale in ${loc}, Mumbai. Prices, floor plans and MahaRERA details from Parmar Properties.`,
      intro: `Verified residences currently available to buy in ${loc}.`,
    },
    'residential/new-launches': {
      heading: `New Launches in ${loc}`,
      title: `New Launch Apartments in ${loc}, Mumbai`,
      description: `New launch and pre-launch residential projects in ${loc}, Mumbai, with prices, configurations and MahaRERA details. Enquire with Parmar Properties.`,
      intro: `New and pre-launch residential projects in ${loc}.`,
    },
    'residential/luxury-collection': {
      heading: `Luxury Collection in ${loc}`,
      title: `Luxury Collection Residences in ${loc}, Mumbai`,
      description: `Hand-picked luxury collection residences in ${loc}, Mumbai. View photos, floor plans and enquire with Parmar Properties.`,
      intro: `Hand-picked luxury residences in ${loc}.`,
    },
    'commercial/buy': {
      heading: `Commercial Property for Sale in ${loc}`,
      title: `Commercial Property for Sale in ${loc}, Mumbai`,
      description: `Offices, retail and commercial spaces for sale in ${loc}, Mumbai. Carpet areas, prices and MahaRERA details from Parmar Properties.`,
      intro: `Offices and commercial spaces available to buy in ${loc}.`,
    },
    'commercial/pre-lease': {
      heading: `Pre-Lease Commercial Space in ${loc}`,
      title: `Pre-Lease Commercial Space in ${loc}, Mumbai`,
      description: `Pre-lease offices and commercial spaces in ${loc}, Mumbai. Secure space before completion with Parmar Properties.`,
      intro: `Commercial space you can pre-lease in ${loc} before completion.`,
    },
    'commercial/rent': {
      heading: `Commercial Space for Rent in ${loc}`,
      title: `Commercial Space for Rent in ${loc}, Mumbai`,
      description: `Offices and commercial spaces for rent in ${loc}, Mumbai. Monthly rent, carpet area and floor details from Parmar Properties.`,
      intro: `Offices and commercial spaces available to rent in ${loc}.`,
    },
  };
  return table[key];
}
