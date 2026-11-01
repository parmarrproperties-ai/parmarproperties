export interface CommercialProperty {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  location: string;
  subLocation: string;
  price: number; // in Cr
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
