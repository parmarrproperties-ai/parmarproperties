/**
 * ============================================================================
 *           PARMAR PROPERTIES - PROPERTIES LISTING PAGE CONTENT
 *                         (properties.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the /properties page, unifying BUY, NEW LAUNCHES, and LUXURY COLLECTION.
 * 
 * For individual page files, see:
 * - buy.content.ts
 * - new-launches.content.ts
 * - luxury-collection.content.ts
 */

import { BUY_PAGE_CONTENT } from './buy.content';
import { NEW_LAUNCHES_CONTENT } from './new-launches.content';
import { LUXURY_COLLECTION_CONTENT } from './luxury-collection.content';

export * from './buy.content';
export * from './new-launches.content';
export * from './luxury-collection.content';

export const PROPERTIES_PAGE_CONTENT = {
  meta: {
    pageTitle: "Properties Portfolio | Buy, New Launches & Luxury | Parmar Properties",
    pageDescription: "Explore luxury sea-facing residences, penthouses, and sky villas across Mumbai's most prestigious neighbourhoods.",
    canonicalPath: "/properties",
  },
  tabs: {
    buy: {
      id: "buy",
      label: BUY_PAGE_CONTENT.header.tabLabel,
      title: BUY_PAGE_CONTENT.header.title,
      description: BUY_PAGE_CONTENT.header.subtitle,
    },
    newLaunches: {
      id: "new-launches",
      label: NEW_LAUNCHES_CONTENT.header.tabLabel,
      title: NEW_LAUNCHES_CONTENT.header.title,
      description: NEW_LAUNCHES_CONTENT.header.subtitle,
    },
    luxuryCollection: {
      id: "luxury-collection",
      label: LUXURY_COLLECTION_CONTENT.header.tabLabel,
      title: LUXURY_COLLECTION_CONTENT.header.title,
      description: LUXURY_COLLECTION_CONTENT.header.subtitle,
    },
  },
  filterLabels: {
    location: "Location",
    configuration: "Bedrooms (BHK)",
    propertyType: "Property Type",
    possession: "Possession Status",
    budget: "Budget Range",
    amenities: "Key Amenities",
    sortBy: "Sort By",
  },
  sortOptions: [
    { label: "Featured Listings", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Area: Largest First", value: "area-desc" },
    { label: "Recently Added", value: "newest" },
  ],
  emptyState: BUY_PAGE_CONTENT.emptyState,
};
