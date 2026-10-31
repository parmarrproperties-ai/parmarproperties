/**
 * ============================================================================
 *           PARMAR PROPERTIES - COMPARE RESIDENCES PAGE CONTENT
 *                         (compare.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the /compare page.
 * 
 * +--------------------------------------------------------------------------+
 * | [BREADCRUMB] Home • Portfolio Analysis                                   |
 * +--------------------------------------------------------------------------+
 * | [HEADER]                                                                 |
 * | Title:    "Compare Residences (X/4)"       [+ Add More] [Clear Compare]  |
 * | Subtitle: "Side-by-side structural, architectural, and financial..."    |
 * +--------------------------------------------------------------------------+
 * | [COMPARISON TABLE MATRIX]                                                |
 * | [Metric]         | [Property 1]       | [Property 2]                     |
 * | Price / Cost     | ₹24.50 Cr          | ₹36.00 Cr                        |
 * | Carpet Area      | 2,850 sq.ft        | 3,500 sq.ft                      |
 * | Price per Sq.Ft  | ₹85,964 / sq.ft    | ₹1,02,857 / sq.ft                |
 * | Configuration    | 4 BHK              | 4 BHK                            |
 * | Possession       | Ready to Move      | Ready to Move                    |
 * | Amenities        | [List]             | [List]                           |
 * +--------------------------------------------------------------------------+
 */

export const COMPARE_PAGE_CONTENT = {
  meta: {
    pageTitle: "Compare Prime Mumbai Residences | Side-by-Side Analysis | Parmar Properties",
    pageDescription: "Side-by-side financial, carpet area, configuration, and architectural specification comparison for prime Mumbai properties.",
    canonicalPath: "/compare",
  },
  header: {
    breadcrumb: "Home • Portfolio Analysis",
    title: "Compare Residences",
    maxCompareLimit: 4,
    subtitle: "Side-by-side structural, architectural, and financial comparison.",
    addMoreButtonText: "+ Add More",
    clearButtonText: "Clear Comparison",
  },
  emptyState: {
    heading: "No Residences Added to Comparison",
    subtext: "Select up to 4 properties from our portfolio to view a detailed side-by-side analysis of floor plans, carpet rates, and possession timelines.",
    browseButtonText: "BROWSE PROPERTIES PORTFOLIO",
    browseButtonLink: "/properties",
  },
  attributeLabels: {
    price: "Price",
    carpetArea: "Carpet Area",
    pricePerSqFt: "Carpet Rate",
    bhk: "Configuration",
    location: "Micro-Market Location",
    possession: "Possession Status",
    floor: "Floor / Level",
    reraId: "MahaRERA Registration",
    amenities: "Key Amenities",
  },
};
