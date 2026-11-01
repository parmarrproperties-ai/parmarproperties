/**
 * How every location is split on the public site:
 *
 *   Location
 *   ├── Residential: Buy · New Launches · Luxury Collection
 *   └── Commercial:  Buy · Pre-Lease · Rent
 *
 * Shared by the admin (commercial deal type) and the public location pages.
 */
export type SegmentKind = "residential" | "commercial";

export type CommercialDealType = "buy" | "pre_lease" | "rent";
export type ResidentialCategory = "buy" | "new-launches" | "luxury-collection";
export type CommercialCategory = "buy" | "pre-lease" | "rent";

export const RESIDENTIAL_CATEGORIES: { slug: ResidentialCategory; label: string }[] = [
  { slug: "buy", label: "Buy" },
  { slug: "new-launches", label: "New Launches" },
  { slug: "luxury-collection", label: "Luxury Collection" },
];

export const COMMERCIAL_CATEGORIES: { slug: CommercialCategory; label: string; dealType: CommercialDealType }[] = [
  { slug: "buy", label: "Buy", dealType: "buy" },
  { slug: "pre-lease", label: "Pre-Lease", dealType: "pre_lease" },
  { slug: "rent", label: "Rent", dealType: "rent" },
];

export const COMMERCIAL_DEAL_TYPES: { value: CommercialDealType; label: string }[] = COMMERCIAL_CATEGORIES.map(
  (c) => ({ value: c.dealType, label: c.label }),
);

export function dealTypeLabel(value: string | null | undefined): string {
  return COMMERCIAL_DEAL_TYPES.find((d) => d.value === value)?.label ?? "Buy";
}

/**
 * The commercial price column holds crores for Buy listings and lakh per month for
 * Pre-Lease and Rent listings (numeric(6,2), so a rent never needs more than 2 decimals).
 */
export function formatCommercialAmount(amount: number | null | undefined, dealType: string | null | undefined): string {
  if (amount == null || !(Number(amount) > 0)) return "Price on Request";
  const value = Number(amount).toFixed(2);
  return dealType === "rent" || dealType === "pre_lease" ? `₹${value} Lakh / month` : `₹${value} Cr`;
}

export function isSegmentKind(value: string): value is SegmentKind {
  return value === "residential" || value === "commercial";
}

export function categoriesFor(kind: SegmentKind): { slug: string; label: string }[] {
  return kind === "residential" ? RESIDENTIAL_CATEGORIES : COMMERCIAL_CATEGORIES;
}

export function isCategoryOf(kind: SegmentKind, slug: string): boolean {
  return categoriesFor(kind).some((c) => c.slug === slug);
}

/** Path of a segment page, relative to the site (basePath is added by Next.js). */
export function segmentPath(locationSlug: string, kind: SegmentKind, category: string): string {
  return `/locations/${locationSlug}/${kind}/${category}`;
}
