/**
 * ============================================================================
 *               PARMAR PROPERTIES - BUY RESIDENCES CONTENT
 *                           (buy.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the BUY tab on the /properties page (/properties?tab=buy).
 * 
 * +--------------------------------------------------------------------------+
 * | [BREADCRUMB] Home • Mumbai Portfolio • BUY                               |
 * +--------------------------------------------------------------------------+
 * | [CATEGORY TABS]                                                          |
 * | [ BUY (Active) ]     | [ NEW LAUNCHES ]     | [ LUXURY COLLECTION ]      |
 * +--------------------------------------------------------------------------+
 * | [HEADER BANNER]                                                          |
 * | Title:    "Buy Mumbai Residences"                                        |
 * | Subtitle: "Explore the complete portfolio of hand-selected, verified..." |
 * +--------------------------------------------------------------------------+
 * | [FILTER & SORT BAR]                                                      |
 * | [Location V]  [BHK V]  [Property Type V]  [Possession V]  [Budget Slider]|
 * +--------------------------------------------------------------------------+
 * | [RESIDENCES GRID]                                                        |
 * | [Property 1]         [Property 2]          [Property 3]                  |
 * | [Property 4]         [Property 5]          [Property 6]                  |
 * +--------------------------------------------------------------------------+
 */

export const BUY_PAGE_CONTENT = {
  meta: {
    pageTitle: "Buy Mumbai Prime Residences | Ready & Under-Construction | Parmar Properties",
    pageDescription: "Curated portfolio of prime waterfront apartments, sky villas, and luxury residences available for purchase across Worli, Bandra, and South Mumbai.",
    canonicalPath: "/properties?tab=buy",
  },
  header: {
    breadcrumb: "BUY",
    tabLabel: "BUY",
    title: "Buy Mumbai Residences",
    subtitle: "Explore the complete portfolio of hand-selected, verified ready-to-move and under-construction residences across Mumbai’s prime corridors.",
    badge: "VERIFIED ACTIVE INVENTORY",
  },
  filters: {
    locationLabel: "Location",
    bhkLabel: "Bedrooms (BHK)",
    typeLabel: "Property Type",
    possessionLabel: "Possession Status",
    budgetLabel: "Max Budget",
    amenityLabel: "Key Amenities",
    sortByLabel: "Sort By",
  },
  sortOptions: [
    { label: "Featured Curated", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Area: Largest First", value: "area-desc" },
    { label: "Recently Added", value: "newest" },
  ],
  emptyState: {
    heading: "No Residences Match Your Exact Filter Criteria",
    subtext: "Try adjusting your budget slider or location filters to see more luxury listings, or contact our private advisory desk.",
    resetButtonText: "RESET ALL FILTERS",
    contactButtonText: "TALK TO OUR ADVISORY",
  },
};
