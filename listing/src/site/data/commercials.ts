import type { CommercialDealType } from '@/lib/segments';

export interface CommercialProperty {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  location: string;
  subLocation: string;
  /** Buy, Pre-Lease or Rent. */
  dealType: CommercialDealType;
  /** Crore-equivalent of the amount (sorting and budget filters); show priceFormatted to visitors. */
  price: number;
  /** "₹36.50 Cr" for Buy, "₹3.50 Lakh / month" for Pre-Lease and Rent. */
  priceFormatted: string;
  carpetArea: number; // in sq ft
  propertyType: 'Grade-A Office' | 'Corporate HQ' | 'High-Street Retail' | 'Commercial Penthouse' | 'Boutique Office';
  possession: 'Ready to Move' | 'Immediate' | 'Under Construction';
  floor: string;
  coverImage: string;
  amenities: string[];
  reraId: string;
  highlights: string[];
  description: string;
}
