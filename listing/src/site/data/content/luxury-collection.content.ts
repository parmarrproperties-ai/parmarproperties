/**
 * ============================================================================
 *           PARMAR PROPERTIES - THE LUXURY COLLECTION CONTENT
 *                     (luxury-collection.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the LUXURY COLLECTION tab on the /properties page (/properties?tab=luxury-collection).
 * 
 * +--------------------------------------------------------------------------+
 * | [BREADCRUMB] Home • Mumbai Portfolio • LUXURY COLLECTION                 |
 * +--------------------------------------------------------------------------+
 * | [CATEGORY TABS]                                                          |
 * | [ BUY ]              | [ NEW LAUNCHES ]     | [ LUXURY COLLECTION (Active)]|
 * +--------------------------------------------------------------------------+
 * | [HEADER BANNER]                                                          |
 * | Title:    "The Luxury Collection"                                        |
 * | Subtitle: "Publicly viewable signature trophy assets: oceanfront sky..." |
 * +--------------------------------------------------------------------------+
 * | [CURATION STANDARDS BADGES]                                              |
 * | Waterfront Views • Private Elevators • Sky Mansions • Sovereign Security |
 * +--------------------------------------------------------------------------+
 * | [TROPHY RESIDENCES SHOWCASE GRID]                                        |
 * | [Worli Aurum Penthouse] [Bandra Palisades Villa] [Juhu Beach Solitaire] |
 * +--------------------------------------------------------------------------+
 */

export const LUXURY_COLLECTION_CONTENT = {
  meta: {
    pageTitle: "The Luxury Collection | Ultra-Prime Penthouses & Sky Villas | Parmar Properties",
    pageDescription: "Signature trophy residences, multi-generational beach estates, and oceanfront penthouses commanding Mumbai's most prestigious horizons.",
    canonicalPath: "/properties?tab=luxury-collection",
  },
  header: {
    breadcrumb: "LUXURY COLLECTION",
    tabLabel: "LUXURY COLLECTION",
    title: "The Luxury Collection",
    subtitle: "Publicly viewable signature trophy assets: oceanfront sky villas, sprawling penthouses, and private estates curated for discerning connoisseurs.",
    badge: "ULTRA-LUXURY TROPHY PORTFOLIO",
  },
  standards: [
    { title: "Waterfront Horizons", desc: "Unobstructed Arabian Sea & Queen's Necklace vistas." },
    { title: "Private Access", desc: "Keycard-controlled direct elevators and private sky foyers." },
    { title: "Generational Scale", desc: "Super-prime floorplates exceeding 3,000 to 10,000+ sq.ft." },
    { title: "Diplomatic Security", desc: "24/7 biometric perimeters and discreet concierge desks." },
  ],
  filters: {
    locationLabel: "Prime Enclave",
    bhkLabel: "Bedrooms (BHK)",
    typeLabel: "Trophy Type",
    possessionLabel: "Status",
    budgetLabel: "Max Budget",
    amenityLabel: "Signature Amenities",
    sortByLabel: "Sort By",
  },
  sortOptions: [
    { label: "Curated Showcase", value: "featured" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Area: Largest First", value: "area-desc" },
    { label: "Recently Unveiled", value: "newest" },
  ],
  emptyState: {
    heading: "No Trophy Assets In Selected Range",
    subtext: "Our most exclusive multi-acre estates and signature sky villas are held under confidential non-disclosure. Inquire with our Managing Director.",
    resetButtonText: "VIEW ALL SIGNATURE ASSETS",
    contactButtonText: "REQUEST PRIVATE CLIENT DOSSIER",
  },
};
