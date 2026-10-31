/**
 * ============================================================================
 *               PARMAR PROPERTIES - HOME PAGE CONTENT CONFIGURATION
 *                           (home.content.ts)
 * ============================================================================
 * 
 * 🏢 TARGET AUDIENCE: High-Net-Worth Individuals (HNIs), Ultra-HNIs, NRIs, Investors
 * 🎨 UI PALETTE: Sand/Stone (#EDEEE9), Deep Charcoal (#15181A), Crimson (#C5282F)
 * 
 * ----------------------------------------------------------------------------
 * 🗺️ BOSS & STAKEHOLDER VISUAL WIREFRAME MAP:
 * This diagram represents the exact layout of the Home Page from top to bottom.
 * Each numbered section below matches the corresponding section in this file.
 * ----------------------------------------------------------------------------
 * 
 * +--------------------------------------------------------------------------+
 * | [NAVIGATION BAR] (from common.content.ts)                                 |
 * | PARMAR PROPERTIES (Logo)  | Buy | Launches | Luxury | Commercials | [ADVISORY]|
 * +--------------------------------------------------------------------------+
 * |                                                                          |
 * | [SECTION 1: HERO CAROUSEL & SEARCH CONSOLE]                              |
 * | ------------------------------------------------------------------------ |
 * | Background: Full-width rotating hero photography (Worli, Bandra, etc.)  |
 * | Headline:   "MUMBAI'S FINEST ADDRESSES"                                  |
 * | Subtext:    "Curated residences, private opportunities..."               |
 * |                                                                          |
 * | +----------------------------------------------------------------------+ |
 * | | [SEARCH CONSOLE BAR] (Floating glass console at bottom of hero)      | |
 * | | [Location: Worli] | [BHK: Any] | [Budget Slider] | [Type] | [SEARCH] | |
 * | +----------------------------------------------------------------------+ |
 * +--------------------------------------------------------------------------+
 * |                                                                          |
 * | [SECTION 2: FEATURED PROPERTIES SHOWCASE]                                |
 * | ------------------------------------------------------------------------ |
 * | Title:    "FEATURED PROPERTIES"             [BUTTON: VIEW ALL RESIDENCES]|
 * | Subtitle: "Hand-curated prime residences across Mumbai..."               |
 * |                                                                          |
 * | [ Property Card 1 ]      [ Property Card 2 ]      [ Property Card 3 ]    |
 * | [ Property Card 4 ]      [ Property Card 5 ]      [ Property Card 6 ]    |
 * +--------------------------------------------------------------------------+
 * |                                                                          |
 * | [SECTION 3: EXPLORE BY LOCATION]                                         |
 * | ------------------------------------------------------------------------ |
 * | Tag:      "FILTERED BY LOCATION"                                         |
 * | Title:    "EXPLORE PROPERTIES"           [LINK: All Locations Directory] |
 * |                                                                          |
 * | [ Worli Card ]   [ Bandra Card ]   [ Juhu Card ]   [ Malabar Hill Card ] |
 * |                                                                          |
 * | [ FUTURE LOCATIONS STRIP: Sewri, Powai, Prabhadevi ...   -> View Upcoming]|
 * +--------------------------------------------------------------------------+
 * |                                                                          |
 * | [SECTION 4: PRIVATE OPPORTUNITIES (OFF-MARKET REGISTRY)]                 |
 * | ------------------------------------------------------------------------ |
 * | Badge:    "CONFIDENTIAL REAL ESTATE • OFF-MARKET"                        |
 * | Heading:  "PRIVATE OPPORTUNITIES"               [BUTTON: REQUEST ACCESS] |
 * | Copy:     "Not every landmark residence is publicly listed..."           |
 * | Modal:    OTP verification popup for discreet investor registration      |
 * +--------------------------------------------------------------------------+
 * |                                                                          |
 * | [SECTION 5: WHY PARMAR PROPERTIES (HERITAGE & TRUST)]                    |
 * | ------------------------------------------------------------------------ |
 * | Dark charcoal background container (#24282D)                             |
 * | Title:    "WHY PARMAR PROPERTIES"               [BUTTON: EXPLORE PORTFOLIO]|
 * |                                                                          |
 * | [01. SINCE 1981]       [02. CURATED INVENTORY]                           |
 * | Over 4 Decades Trust   Vetted & Trophy Assets                            |
 * |                                                                          |
 * | [03. MARKET INTELLIGENCE] [04. END-TO-END ADVISORY]                      |
 * | Micro-market data         Discreet white-glove viewings                  |
 * |                                                                          |
 * | Trust Counters: [40+ Years]  [100% Vetted]  [₹5,000+ Cr]  [1-on-1 Desk]  |
 * +--------------------------------------------------------------------------+
 * |                                                                          |
 * | [SECTION 6: MARKET INTELLIGENCE & RESEARCH]                              |
 * | ------------------------------------------------------------------------ |
 * | Badge:    "RESEARCH & ADVISORY DESK"                                     |
 * | Title:    "Market Intelligence"              [LINK: VIEW ALL INSIGHTS ->]|
 * |                                                                          |
 * | [ Worli Guide 2026 ]      [ Mahalaxmi vs Worli Guide ]                   |
 * | [ Buying Penthouse Guide ][ NRI Mumbai Property Guide ]                  |
 * +--------------------------------------------------------------------------+
 * | [FOOTER] (from common.content.ts)                                        |
 * +--------------------------------------------------------------------------+
 */

export interface HomePageContent {
  meta: {
    pageTitle: string;
    pageDescription: string;
    canonicalPath: string;
  };
  hero: {
    headline: string;
    subtext: string;
    slideDurationMs: number;
    slides: Array<{
      id: number;
      tagline: string;
      subtext: string;
      image: string;
      alt: string;
      _uiNote: string;
    }>;
    searchConsole: {
      locationFilter: {
        label: string;
        placeholder: string;
        options: Array<{ label: string; value: string }>;
      };
      bhkFilter: {
        label: string;
        options: Array<{ label: string; value: string }>;
      };
      budgetSlider: {
        label: string;
        minCrores: number;
        maxCrores: number;
        defaultCrores: number;
        stepCrores: number;
        minLabel: string;
        maxLabel: string;
        unlimitedLabel: string;
        currencySymbol: string;
      };
      categoryFilter?: {
        label: string;
        options: Array<{ label: string; value: string }>;
      };
      statusFilter?: {
        label: string;
        options: Array<{ label: string; value: string }>;
      };
      submitButton: {
        label: string;
        _uiVisual: string;
      };
    };
  };
  featuredProperties: {
    sectionId: string;
    tag: string;
    heading: string;
    subheading: string;
    viewAllButton: {
      text: string;
      link: string;
      _uiVisual: string;
    };
    maxDisplayCount: number;
  };
  locationSection: {
    sectionId: string;
    tag: string;
    heading: string;
    subheading: string;
    allLocationsLink: {
      text: string;
      link: string;
    };
    cards: Array<{
      name: string;
      slug: string;
      image: string;
      tagline: string;
      rate: string;
      buttonText: string;
      _uiNote: string;
    }>;
    futureLocationsStrip: {
      badge: string;
      description: string;
      actionText: string;
      link: string;
      _uiNote: string;
    };
  };
  privateOpportunities: {
    sectionId: string;
    badge: string;
    heading: string;
    paragraphs: string[];
    ctaButton: {
      text: string;
      disclaimer: string;
      _uiVisual: string;
    };
    leadModal: {
      badge: string;
      heading: string;
      description: string;
      step1Title: string;
      step1Placeholder: string;
      step1Button: string;
      step2Title: string;
      step2DemoCode: string;
      step2Button: string;
      step3Title: string;
      step3Button: string;
      successHeading: string;
      successMessage: string;
    };
  };
  whyParmar: {
    sectionId: string;
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    ctaButton: {
      text: string;
      link: string;
    };
    pillars: Array<{
      number: string;
      subtitle: string;
      title: string;
      description: string;
      badge: string;
      stamp: string;
      _uiVisual: string;
    }>;
    trustMetrics: Array<{
      value: string;
      label: string;
      sub: string;
    }>;
  };
  marketIntelligence: {
    sectionId: string;
    badge: string;
    heading: string;
    subheading: string;
    viewAllLink: {
      text: string;
      link: string;
    };
  };
}

export const HOME_PAGE_CONTENT: HomePageContent = {
  // ==========================================================================
  // [META / SEO INFORMATION]
  // Used by search engines, browser tab titles, and social share cards
  // ==========================================================================
  meta: {
    pageTitle: "Parmar Properties | Mumbai's Prime Real Estate Portfolio",
    pageDescription: "Curated portfolio of prime waterfront residences, penthouses, and sky villas across Worli, Bandra, Juhu, and South Mumbai.",
    canonicalPath: "/",
  },

  // ==========================================================================
  // [SECTION 1: HERO SECTION & SEARCH CONSOLE]
  // Visual location: The full-screen top banner when landing on the website
  // ==========================================================================
  hero: {
    // Main overlay heading rendered in elegant serif typography
    headline: "MUMBAI'S FINEST ADDRESSES",

    // Descriptive subtitle directly beneath the headline
    subtext: "Curated residences, private opportunities and investment properties across Mumbai's most sought after neighbourhoods",

    // Carousel rotation speed in milliseconds (2200ms = 2.2 seconds)
    slideDurationMs: 2200,

    // Three rotating high-resolution background slides
    slides: [
      {
        id: 1,
        tagline: "MUMBAI'S FINEST ADDRESSES",
        subtext: "Curated residences, private opportunities and investment properties across Mumbai's most sought after neighbourhoods",
        image: "/hero/hero-image-property-1.png",
        alt: "Luxury residence overlooking Mumbai coastal skyline",
        _uiNote: "Slide 1: Hero Image Property 1",
      },
      {
        id: 2,
        tagline: "MUMBAI'S FINEST ADDRESSES",
        subtext: "Curated residences, private opportunities and investment properties across Mumbai's most sought after neighbourhoods",
        image: "/hero/hero-image-property-2.png",
        alt: "Contemporary penthouse architecture in Mumbai",
        _uiNote: "Slide 2: Hero Image Property 2",
      },
      {
        id: 3,
        tagline: "MUMBAI'S FINEST ADDRESSES",
        subtext: "Curated residences, private opportunities and investment properties across Mumbai's most sought after neighbourhoods",
        image: "/hero/hero-image-property-3.png",
        alt: "Prime skyline property in Mumbai commercial and luxury hub",
        _uiNote: "Slide 3: Hero Image Property 3",
      },
    ],

    // Search console floating dock at the bottom of the hero banner
    searchConsole: {
      locationFilter: {
        label: "Location",
        placeholder: "Worli, Bandra, Juhu...",
        options: [
          { label: "All Prime Locations", value: "" },
          { label: "Worli Sea Face", value: "Worli" },
          { label: "Bandra West (Pali Hill)", value: "Bandra West" },
          { label: "Juhu Beachfront", value: "Juhu" },
          { label: "Lower Parel Towers", value: "Lower Parel" },
          { label: "Malabar Hill & Walkeshwar", value: "Malabar Hill" },
          { label: "Cuffe Parade & Colaba", value: "Cuffe Parade" },
        ],
      },
      bhkFilter: {
        label: "Bedrooms",
        options: [
          { label: "Any Configuration", value: "Any" },
          { label: "3 BHK Residence", value: "3 BHK" },
          { label: "4 BHK Sky Suite", value: "4 BHK" },
          { label: "5 BHK Sky Mansion", value: "5 BHK" },
        ],
      },
      budgetSlider: {
        label: "Max Budget",
        minCrores: 3,
        maxCrores: 60,
        defaultCrores: 60,
        stepCrores: 1,
        minLabel: "₹3 Cr",
        maxLabel: "₹60 Cr",
        unlimitedLabel: "₹60 Cr+",
        currencySymbol: "₹",
      },
      categoryFilter: {
        label: "Construction Status",
        options: [
          { label: "All Status", value: "All" },
          { label: "Resale", value: "Resale" },
          { label: "Pre Launch", value: "Pre Launch" },
          { label: "Under Construction", value: "Under Construction" },
          { label: "Ready to Move In", value: "Ready to Move In" },
        ],
      },
      statusFilter: {
        label: "Construction Status",
        options: [
          { label: "All Status", value: "All" },
          { label: "Resale", value: "Resale" },
          { label: "Pre Launch", value: "Pre Launch" },
          { label: "Under Construction", value: "Under Construction" },
          { label: "Ready to Move In", value: "Ready to Move In" },
        ],
      },
      submitButton: {
        label: "SEARCH",
        _uiVisual: "Red solid rectangular button (#C5282F) on right of search dock",
      },
    },
  },

  // ==========================================================================
  // [SECTION 2: FEATURED PROPERTIES]
  // Visual location: First white/sand card section below hero
  // ==========================================================================
  featuredProperties: {
    sectionId: "properties",
    tag: "CURATED COLLECTION",
    heading: "FEATURED PROPERTIES",
    subheading: "Hand-curated prime residences across Mumbai’s most coveted enclaves.",
    viewAllButton: {
      text: "VIEW ALL RESIDENCES",
      link: "/properties?tab=buy",
      _uiVisual: "Red button (#C5282F) at top right with an arrow icon",
    },
    maxDisplayCount: 6, // Renders the top 6 premier properties in a 3-column grid
  },

  // ==========================================================================
  // [SECTION 3: EXPLORE PROPERTIES BY LOCATION]
  // Visual location: 4 prominent neighbourhood photo cards + upcoming pipeline strip
  // ==========================================================================
  locationSection: {
    sectionId: "locations",
    tag: "FILTERED BY LOCATION",
    heading: "EXPLORE PROPERTIES",
    subheading: "Explore Mumbai’s premier residential micro-markets: from iconic waterfronts to cultural enclaves.",
    allLocationsLink: {
      text: "All Locations Directory",
      link: "/locations",
    },
    // The 4 key neighbourhood cards displayed on the homepage
    cards: [
      {
        name: "Worli",
        slug: "worli",
        image: "/properties/worli-aurum/cover.jpg",
        tagline: "Sea Face & Skyline Towers",
        rate: "From ₹18 Cr",
        buttonText: "EXPLORE PROPERTIES",
        _uiNote: "Card 1 of 4: South Mumbai seafront towers",
      },
      {
        name: "Bandra West",
        slug: "bandra-west",
        image: "/properties/bandra-palisades/cover.jpg",
        tagline: "Pali Hill & Coastal Enclaves",
        rate: "From ₹15 Cr",
        buttonText: "EXPLORE PROPERTIES",
        _uiNote: "Card 2 of 4: Western coastal heritage corridor",
      },
      {
        name: "Juhu",
        slug: "juhu",
        image: "/properties/juhu-solitaire/cover.jpg",
        tagline: "Beachfront Estates & Penthouses",
        rate: "From ₹20 Cr",
        buttonText: "EXPLORE PROPERTIES",
        _uiNote: "Card 3 of 4: Beachfront luxury estates",
      },
      {
        name: "Malabar Hill",
        slug: "malabar-hill",
        image: "/hero/hero-1-crisp.jpg",
        tagline: "Queens Necklace Panoramas",
        rate: "From ₹35 Cr",
        buttonText: "EXPLORE PROPERTIES",
        _uiNote: "Card 4 of 4: High-prestige South Mumbai ridge",
      },
    ],
    // The horizontal banner directly underneath the 4 location cards
    futureLocationsStrip: {
      badge: "FUTURE LOCATIONS :",
      description: "Sewri, Powai, Prabhadevi and upcoming enclaves",
      actionText: "View Upcoming",
      link: "/locations?tab=upcoming",
      _uiNote: "Clickable horizontal strip redirecting to upcoming pre-launch pipeline",
    },
  },

  // ==========================================================================
  // [SECTION 4: PRIVATE OPPORTUNITIES (OFF-MARKET REGISTRY)]
  // Visual location: High-trust confidential lead conversion section with lock icon
  // ==========================================================================
  privateOpportunities: {
    sectionId: "private-opportunities",
    badge: "CONFIDENTIAL REAL ESTATE • OFF-MARKET",
    heading: "PRIVATE OPPORTUNITIES",
    paragraphs: [
      "Not every landmark residence in Mumbai is publicly listed.",
      "Parmar Properties maintains a discreet, confidential registry of off-market trophy estates and private residences across Mumbai’s most exclusive enclaves.",
      "Access is granted strictly to verified private clients under mutual non-disclosure discretion.",
    ],
    ctaButton: {
      text: "REQUEST ACCESS",
      disclaimer: "Strict mutual non-disclosure required",
      _uiVisual: "Red solid CTA button with shield icon on right side",
    },
    // The 3-step OTP Verification Modal that opens when clicking 'REQUEST ACCESS'
    leadModal: {
      badge: "Private Client Advisory",
      heading: "REQUEST PRIVATE ACCESS",
      description: "Not every property is listed online. Enter your details to unlock off-market opportunities and private residences across Mumbai.",
      step1Title: "Enter Mobile Number",
      step1Placeholder: "98200 00000",
      step1Button: "GET OTP",
      step2Title: "4-Digit Verification Code",
      step2DemoCode: "Demo OTP: 4821",
      step2Button: "VERIFY OTP",
      step3Title: "Complete Details",
      step3Button: "CONFIRM & REQUEST ACCESS",
      successHeading: "Request Received",
      successMessage: "Your request for private access to our confidential listings has been registered. Our Senior Portfolio Director will contact you discreetly.",
    },
  },

  // ==========================================================================
  // [SECTION 5: WHY PARMAR PROPERTIES (HERITAGE & CREDIBILITY)]
  // Visual location: Dark luxury section (#24282D) with 4 pillars & 4 trust metrics
  // ==========================================================================
  whyParmar: {
    sectionId: "why-parmar",
    badge: "OUR LEGACY & STANDARDS",
    titlePrefix: "WHY",
    titleHighlight: "PARMAR PROPERTIES",
    subtitle: "Parmar Properties combines curated property discovery with decades of Mumbai real estate experience, hyper-local market intelligence, and discreet advisory.",
    ctaButton: {
      text: "EXPLORE PORTFOLIO",
      link: "/properties?tab=buy",
    },
    // The 4 core value pillars
    pillars: [
      {
        number: "01",
        subtitle: "OVER 4 DECADES OF TRUST",
        title: "SINCE 1981",
        description: "Four decades of continuous family-run integrity, unmatched relationship equity, and deep-rooted standing across Mumbai’s prime property corridors.",
        badge: "Generational Standing",
        stamp: "PARMAR STANDARD",
        _uiVisual: "Pillar 1: Award icon with gold trim on hover",
      },
      {
        number: "02",
        subtitle: "VETTED & TROPHY ASSETS",
        title: "CURATED INVENTORY",
        description: "Every home in our portfolio is personally hand-selected, verified for clear titles, superior layouts, panoramic vistas, and enduring luxury prestige.",
        badge: "100% Verified Titles",
        stamp: "PARMAR STANDARD",
        _uiVisual: "Pillar 2: Diamond Gem icon with verified title badge",
      },
      {
        number: "03",
        subtitle: "HYPER-LOCAL VALUATION DATA",
        title: "MARKET INTELLIGENCE",
        description: "Unrivaled micro-market data across Worli, Bandra, and South Mumbai, enabling confident decisions with transparent pricing and capital yield benchmarks.",
        badge: "Micro-Market Pricing",
        stamp: "PARMAR STANDARD",
        _uiVisual: "Pillar 3: Trending Chart icon with micro-market pricing badge",
      },
      {
        number: "04",
        subtitle: "DISCREET PRIVATE CONSULTATION",
        title: "END-TO-END ADVISORY",
        description: "Bespoke white-glove guidance through confidential viewings, legal due diligence, title scrutiny, structuring, and seamless final handover.",
        badge: "Confidential White-Glove",
        stamp: "PARMAR STANDARD",
        _uiVisual: "Pillar 4: Shield Check icon with white-glove advisory badge",
      },
    ],
    // 4 Key quantifiable metrics shown at bottom of Why Parmar section
    trustMetrics: [
      {
        value: "40+",
        label: "Years of Proven Heritage",
        sub: "Active in South & West Mumbai since 1981",
      },
      {
        value: "100%",
        label: "RERA & Title Due Diligence",
        sub: "Every listing undergoes strict legal vetting",
      },
      {
        value: "₹5,000+ Cr",
        label: "Portfolio Transaction Equity",
        sub: "High-value transactions advised discreetly",
      },
      {
        value: "1-on-1",
        label: "Bespoke Advisory Desk",
        sub: "Confidential viewings & direct promoter access",
      },
    ],
  },

  // ==========================================================================
  // [SECTION 6: MARKET INTELLIGENCE & RESEARCH]
  // Visual location: Bottom editorial preview section before footer
  // ==========================================================================
  marketIntelligence: {
    sectionId: "market-intelligence",
    badge: "RESEARCH & ADVISORY DESK",
    heading: "Market Intelligence",
    subheading: "Curated micro-market data, capital valuation trends, and strategic advisory to guide high-value property decisions across South & West Mumbai.",
    viewAllLink: {
      text: "VIEW ALL INSIGHTS ->",
      link: "/market-intelligence",
    },
  },
};
