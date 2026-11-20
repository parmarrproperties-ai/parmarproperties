import type { Property } from '@/site/types/property';

/**
 * Budget pages: the way buyers search ("flats above 10 crore"). Each one lists the published
 * flats whose asking price falls in the band, so it has its own content and its own listings.
 * Prices on request are left out, because there is no figure to place them by.
 */
export interface BudgetBand {
  slug: string;
  /** Short label for links, e.g. "Above ₹10 Cr". */
  label: string;
  heading: string;
  title: string;
  /** Reads after "flats", e.g. "above ₹10 crore". */
  phrase: string;
  /** Lower bound in crore (inclusive) and upper bound (exclusive). */
  min: number;
  max: number;
}

export const BUDGET_BANDS: BudgetBand[] = [
  { slug: 'flats-under-5-crore', label: 'Under ₹5 Cr', heading: 'Flats Under ₹5 Crore in Mumbai', title: 'Flats Under ₹5 Crore in Mumbai', phrase: 'under ₹5 crore', min: 0, max: 5 },
  { slug: 'flats-5-to-10-crore', label: '₹5 to ₹10 Cr', heading: '₹5 to ₹10 Crore Flats in Mumbai', title: '₹5 to ₹10 Crore Flats in Mumbai', phrase: 'between ₹5 and ₹10 crore', min: 5, max: 10 },
  { slug: 'flats-above-10-crore', label: 'Above ₹10 Cr', heading: 'Flats Above ₹10 Crore in Mumbai', title: 'Flats Above ₹10 Crore in Mumbai', phrase: 'above ₹10 crore', min: 10, max: Infinity },
  { slug: 'flats-above-25-crore', label: 'Above ₹25 Cr', heading: 'Flats Above ₹25 Crore in Mumbai', title: 'Flats Above ₹25 Crore in Mumbai', phrase: 'above ₹25 crore', min: 25, max: Infinity },
];

export const bandBySlug = (slug: string) => BUDGET_BANDS.find((b) => b.slug === slug) ?? null;

export const budgetPath = (slug: string) => `/budget/${slug}`;

export function inBand(properties: Property[], band: BudgetBand): Property[] {
  return properties.filter(
    (p) => p.price > 0 && p.priceFormatted !== 'Price on Request' && p.price >= band.min && p.price < band.max,
  );
}

/** "Above ₹25 Cr" holding exactly the same flats as "Above ₹10 Cr" is a duplicate of it. */
export function duplicatesBand(properties: Property[], band: BudgetBand): BudgetBand | null {
  if (band.slug !== 'flats-above-25-crore') return null;
  const wider = BUDGET_BANDS.find((b) => b.slug === 'flats-above-10-crore')!;
  const mine = inBand(properties, band);
  const theirs = inBand(properties, wider);
  return mine.length > 0 && mine.length === theirs.length ? wider : null;
}
