/**
 * ============================================================================
 *           PARMAR PROPERTIES - COMMERCIAL REAL ESTATE CONTENT
 *                        (commercials.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the /commercials page (Corporate Offices, Whole Floors, Retail).
 * 
 * +--------------------------------------------------------------------------+
 * | [HERO HEADER BANNER]                                                     |
 * | Badge: "INSTITUTIONAL & CORPORATE ASSETS"                                |
 * | Title: "Commercial Real Estate Portfolio"                                |
 * | Subtitle: "Grade-A corporate office suites, full floor-plates..."         |
 * +--------------------------------------------------------------------------+
 * | [COMMERCIAL ASSET TYPE TABS]                                             |
 * | [All] | [Grade-A Office] | [Whole Floor Plate] | [Retail Flagship] ...   |
 * +--------------------------------------------------------------------------+
 * | [KEY COMMERCIAL HUBS STRIP]                                              |
 * | [ BKC Financial Hub ] [ Lower Parel Towers ] [ Nariman Point Banking ]   |
 * +--------------------------------------------------------------------------+
 * | [COMMERCIAL ASSETS GRID]                                                 |
 * | [BKC Financial Tower] [Worli Apex Corporate] [Lower Parel One Center]   |
 * +--------------------------------------------------------------------------+
 */

export const COMMERCIALS_PAGE_CONTENT = {
  meta: {
    pageTitle: "Prime Commercial Real Estate | BKC, Lower Parel, Worli | Parmar Properties",
    pageDescription: "Grade-A commercial office suites, full floor-plates, and retail flagships across Mumbai's prime CBD and business corridors.",
    canonicalPath: "/commercials",
  },
  header: {
    badge: "INSTITUTIONAL & CORPORATE ASSETS",
    title: "Commercial Real Estate Portfolio",
    subtitle: "Grade-A corporate office suites, full floor-plates, and retail flagships across Mumbai's prime CBD and secondary business corridors.",
  },
  typeFilters: [
    "All Commercial",
    "Grade-A Office",
    "Whole Floor Plate",
    "Retail Flagship",
    "Pre-Leased Commercial",
    "IT Park Campus",
  ],
  hubs: [
    {
      name: "Bandra Kurla Complex (BKC)",
      desc: "Mumbai's premier financial hub with blue-chip tenants and institutional yields.",
    },
    {
      name: "Lower Parel & Worli",
      desc: "Corporate headquarters, boutique media houses, and high-density luxury retail.",
    },
    {
      name: "Nariman Point & Fort",
      desc: "Heritage banking district, consulates, and maritime legal chambers.",
    },
    {
      name: "Andheri East & MIDC",
      desc: "Transit-oriented IT corridors with high liquidity and mid-ticket commercial suites.",
    },
  ],
};
