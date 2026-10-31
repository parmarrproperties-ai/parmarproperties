/**
 * ============================================================================
 *           PARMAR PROPERTIES - SAVED RESIDENCES PAGE CONTENT
 *                         (saved.content.ts)
 * ============================================================================
 * 
 * 🗺️ BOSS & STAKEHOLDER UI WIREFRAME:
 * Controls the /saved page (client portfolio bookmarks).
 * 
 * +--------------------------------------------------------------------------+
 * | [BREADCRUMB] Home • Client Portfolio                                     |
 * +--------------------------------------------------------------------------+
 * | [HEADER]                                                                 |
 * | Title:    "Saved Residences"                   [Clear Portfolio Button]  |
 * | Subtitle: "Private collection of your bookmarked Mumbai luxury..."       |
 * +--------------------------------------------------------------------------+
 * | [SAVED RESIDENCES GRID]                                                  |
 * | [Bookmarked Property 1]  [Bookmarked Property 2]  [Bookmarked Property 3]|
 * +--------------------------------------------------------------------------+
 * | [BOTTOM COMPARE BAR] (Floating bar if multiple items saved)              |
 * +--------------------------------------------------------------------------+
 */

export const SAVED_PAGE_CONTENT = {
  meta: {
    pageTitle: "Saved Residences & Portfolio Bookmarks | Parmar Properties",
    pageDescription: "Your private collection of shortlisted luxury residences, sky villas, and penthouses across Mumbai.",
    canonicalPath: "/saved",
  },
  header: {
    breadcrumb: "Home • Client Portfolio",
    title: "Saved Residences",
    subtitle: "Private collection of your bookmarked Mumbai luxury properties.",
    clearButtonText: "Clear Portfolio",
  },
  guestNotice: {
    badge: "PRIVATE SESSION",
    title: "Saved on This Device",
    description: "Your shortlisted properties are currently saved in this browser. They stay on this device until you clear your browser data.",
  },
  emptyState: {
    heading: "No Residences Saved Yet",
    subtext: "Explore our collection and click the bookmark ribbon icon on any residence to save it to your private portfolio for easy reference.",
    browseButtonText: "BROWSE ALL PROPERTIES",
    browseButtonLink: "/properties?tab=buy",
  },
};
