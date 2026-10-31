/**
 * ============================================================================
 *           PARMAR PROPERTIES - LOCATIONS DIRECTORY CONTENT
 *                         (locations.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the /locations page and micro-market neighbourhood dossiers.
 * 
 * +--------------------------------------------------------------------------+
 * | [HERO HEADER BANNER]                                                     |
 * | Badge: "FILTERED BY LOCATION"                                            |
 * | Title: "Explore Properties by Location"                                  |
 * | Subtitle: "Explore Mumbai's premier residential micro-markets..."        |
 * +--------------------------------------------------------------------------+
 * | [NEIGHBOURHOOD FILTER TABS]                                              |
 * | [All] | [Worli] | [Bandra West] | [Juhu] | [Malabar Hill] | [Upcoming]   |
 * +--------------------------------------------------------------------------+
 * | [LOCATION SHOWCASE CARDS]                                                |
 * | [ Worli Sea Face ]     [ Bandra West / Pali Hill ]  [ Juhu Beachfront ]  |
 * +--------------------------------------------------------------------------+
 * | [FUTURE & UPCOMING LOCATIONS PIPELINE]                                   |
 * | Badge: "FUTURE ENCLAVES • PRE-LAUNCH PIPELINE"                           |
 * | Sewri (Atal Setu) | Powai Vista | Prabhadevi Horizon | Cuffe Bay Reserve |
 * +--------------------------------------------------------------------------+
 */

export const LOCATIONS_PAGE_CONTENT = {
  meta: {
    pageTitle: "Mumbai Prime Locations Directory | Worli, Bandra, Juhu | Parmar Properties",
    pageDescription: "Explore micro-market trends and luxury residences across Worli, Bandra West, Juhu, Malabar Hill, Lower Parel, and upcoming corridors.",
    canonicalPath: "/locations",
  },
  header: {
    sectionLabel: "FILTERED BY LOCATION",
    title: "Explore Properties by Location",
    subtitle: "Explore Mumbai’s premier residential micro-markets: from the iconic waterfronts of Worli and Juhu to the cultural heritage of Bandra West and upcoming eastern corridors.",
  },
  filterTabs: [
    "All",
    "Worli",
    "Bandra West",
    "Juhu",
    "Malabar Hill",
    "Lower Parel",
    "Cuffe Parade",
    "BKC",
    "Upcoming",
  ],
  upcomingPipeline: {
    badge: "FUTURE ENCLAVES • PRE-LAUNCH PIPELINE",
    title: "Upcoming Location Pipeline",
    subtitle: "Sewri • Powai • Prabhadevi • Pre-Launch Pipeline",
    description: "We do not have active handovers in these enclaves yet. Pre-notification dossiers and early allocations are currently in confidential structuring.",
    statusBadge: "UPCOMING",
    watermarkLabel: "UPCOMING ENCLAVE",
    actionButtonLabel: "EXPRESS INTEREST & UNLOCK",
    properties: [
      {
        id: "up-sewri",
        title: "The Baypoint Promenade",
        tagline: "Upcoming Eastern Seafront Corridor Facing Atal Setu (MTHL)",
        location: "Sewri",
        subLocation: "Sewri Seafront Promenade, Eastern Waterfront",
        priceFormatted: "From ₹12.80 Cr",
        bhk: "3 & 4 BHK",
        carpetArea: 2100,
        propertyType: "Sea-Facing Apartment",
        coverImage: "/properties/lower-parel-pavilion/cover.jpg",
        status: "Upcoming / Future Pipeline",
      },
      {
        id: "up-powai",
        title: "Powai Vista Ridge",
        tagline: "Upcoming Hillside Sanctuary Overlooking Powai Lake",
        location: "Powai",
        subLocation: "Hiranandani Gardens & Lakefront, Powai",
        priceFormatted: "From ₹15.50 Cr",
        bhk: "3 & 4 BHK",
        carpetArea: 2300,
        propertyType: "Duplex Villa",
        coverImage: "/properties/powai-lake/cover.jpg",
        status: "Upcoming / Future Pipeline",
      },
      {
        id: "up-prabhadevi",
        title: "Siddhivinayak Horizon",
        tagline: "Upcoming High-Rise Coastal Tower Near Sea Link",
        location: "Prabhadevi",
        subLocation: "Prabhadevi Coastal Mile, South Mumbai",
        priceFormatted: "From ₹24.50 Cr",
        bhk: "4 BHK",
        carpetArea: 2950,
        propertyType: "Sea-Facing Apartment",
        coverImage: "/properties/prabhadevi-verve/cover.jpg",
        status: "Upcoming / Future Pipeline",
      },
      {
        id: "up-cuffe",
        title: "Cuffe Bay Reserve",
        tagline: "Rare Upcoming Trophy Development in South Mumbai",
        location: "Cuffe Parade",
        subLocation: "Cuffe Parade Promontory",
        priceFormatted: "From ₹38.00 Cr",
        bhk: "4 & 5 BHK",
        carpetArea: 3800,
        propertyType: "Penthouse",
        coverImage: "/properties/bandra-palisades/cover.jpg",
        status: "Upcoming / Future Pipeline",
      },
    ],
  },
};
