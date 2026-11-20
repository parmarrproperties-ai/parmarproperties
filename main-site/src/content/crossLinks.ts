/**
 * Blog posts and the listing-site guides that cover the same topic. Each page links to the
 * other, so the two are read as a pair instead of competing for the same search.
 * Keys are blog post slugs.
 */
export type CrossLink = { label: string; href: string };

export const listingGuidesForPost: Record<string, CrossLink[]> = {
  "worli-vs-mahalaxmi-a-practical-guide-for-luxury-homebuyers": [
    { label: "Mahalaxmi vs Worli: the market guide", href: "/listing/market-intelligence/mahalaxmi-vs-worli" },
    { label: "Homes for sale in Worli", href: "/listing/locations/worli" },
    { label: "Homes for sale in Mahalaxmi", href: "/listing/locations/mahalaxmi" },
  ],
  "why-worli-continues-to-lead-mumbai-s-luxury-housing-market": [
    { label: "Worli guide 2026", href: "/listing/market-intelligence/worli-guide-2026" },
    { label: "Homes for sale in Worli", href: "/listing/locations/worli" },
  ],
  "the-nri-guide-to-buying-property-in-mumbai-in-2026": [
    { label: "NRI property guide for Mumbai", href: "/listing/market-intelligence/nri-mumbai-property" },
    { label: "Browse properties", href: "/listing/properties" },
  ],
};
