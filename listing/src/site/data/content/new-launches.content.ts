/**
 * ============================================================================
 *           PARMAR PROPERTIES - NEW LAUNCHES & PRE-LAUNCH CONTENT
 *                       (new-launches.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the NEW LAUNCHES tab on the /properties page (/properties?tab=new-launches).
 * 
 * +--------------------------------------------------------------------------+
 * | [BREADCRUMB] Home • Mumbai Portfolio • NEW LAUNCHES                      |
 * +--------------------------------------------------------------------------+
 * | [CATEGORY TABS]                                                          |
 * | [ BUY ]              | [ NEW LAUNCHES (Active) ] | [ LUXURY COLLECTION ] |
 * +--------------------------------------------------------------------------+
 * | [HEADER BANNER]                                                          |
 * | Title:    "New Launches & Pre-Launch"                                    |
 * | Subtitle: "Upcoming landmark towers, pre-launch Expression of Interest..."|
 * +--------------------------------------------------------------------------+
 * | [INVESTOR ADVANTAGES BANNER]                                             |
 * | Pre-Launch Pricing • Construction Milestones • Priority Floor Allocation |
 * +--------------------------------------------------------------------------+
 * | [NEW LAUNCHES PROPERTY GRID]                                             |
 * | [Pre-Launch Tower 1]    [New Launch 2]        [Under-Construction 3]    |
 * +--------------------------------------------------------------------------+
 */

export const NEW_LAUNCHES_CONTENT = {
  meta: {
    pageTitle: "New Launches & Pre-Launch Mumbai Projects | Parmar Properties",
    pageDescription: "Exclusive early-stage allocations, construction-linked milestone payment structures, and priority floor selections across upcoming landmark towers in Mumbai.",
    canonicalPath: "/properties?tab=new-launches",
  },
  header: {
    breadcrumb: "NEW LAUNCHES",
    tabLabel: "NEW LAUNCHES",
    title: "New Launches & Pre-Launch",
    subtitle: "Upcoming landmark towers, pre-launch Expression of Interest (EOI) phases, and under-construction coastal residences with exclusive early investor advantages.",
    badge: "PRE-LAUNCH & EARLY ACCESS ALLOCATION",
  },
  investorHighlights: [
    {
      title: "Pre-Launch Price Advantage",
      description: "Secure inaugural pricing prior to public brochure release and tier escalations.",
    },
    {
      title: "Construction Milestones",
      description: "Flexible structured payment linked to verified MahaRERA slab completion.",
    },
    {
      title: "Priority Floor Selection",
      description: "Early access to select high-level panoramic sea-facing floorplates and sky foyers.",
    },
  ],
  filters: {
    locationLabel: "Location",
    bhkLabel: "Bedrooms (BHK)",
    typeLabel: "Property Type",
    possessionLabel: "Possession Timeline",
    budgetLabel: "Max Budget",
    amenityLabel: "Key Amenities",
    sortByLabel: "Sort By",
  },
  sortOptions: [
    { label: "Featured Launches", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Recently Announced", value: "newest" },
  ],
  emptyState: {
    heading: "No Pre-Launch Properties In Selected Criteria",
    subtext: "Early allocation dossiers are added weekly. Speak to our advisory desk for private pre-notification allocations.",
    resetButtonText: "RESET ALL FILTERS",
    contactButtonText: "REQUEST PRE-LAUNCH DOSSIER",
  },
};
