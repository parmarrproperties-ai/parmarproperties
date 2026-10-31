export type MumbaiLocality =
  | 'Worli'
  | 'Bandra West'
  | 'Juhu'
  | 'Powai'
  | 'Lower Parel'
  | 'Prabhadevi'
  | 'Khar West'
  | 'Malabar Hill'
  | 'Cuffe Parade'
  | 'BKC'
  | 'Sewri';

export type PropertyType = 'Penthouse' | 'Apartment' | 'Sea-Facing Apartment' | 'Duplex' | 'Sky Villa' | 'Luxury Estate';

export type PropertyCategory = 'buy' | 'new-launches' | 'luxury-collection';

export interface PropertyLayoutVariant {
  id: string;
  tabLabel: string;
  title: string;
  area: string;
  carpetArea: string;
  price: string;
  tower: string;
  image: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  location: MumbaiLocality;
  subLocation: string;
  price: number; // in Crores INR (e.g. 18.5)
  priceFormatted: string; // e.g. "₹18.50 Cr"
  bhk: string; // e.g. "4 BHK"
  carpetArea: number; // in sq ft
  /** First configuration's area as typed in the admin (may be a range or note). */
  areaText?: string;
  metaTitle?: string;
  metaDescription?: string;
  superArea: number; // in sq ft
  propertyType: PropertyType;
  possession: 'Ready to Move' | 'Under Construction' | 'Immediate' | 'Pre-Launch';
  possessionDate?: string;
  floor: string;
  featured: boolean;
  recentlyAdded: boolean;
  recommended: boolean;
  isNewLaunch?: boolean;
  isLuxuryCollection?: boolean;
  launchPhase?: 'Pre-Launch EOI' | 'New Launch' | 'Under Construction' | 'Ready Possession';
  completionYear?: string;
  images: string[];
  coverImage: string;
  amenities: string[];
  description: string;
  highlights: string[];
  reraId: string;
  reraQrImage?: string;
  brochureUrl?: string;
  developerName?: string;
  developerDescription?: string;
  googleMapsUrl?: string;
  layoutVariants?: PropertyLayoutVariant[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  floorPlans?: {
    title: string;
    area: string;
    description: string;
    image?: string;
  }[];
}
