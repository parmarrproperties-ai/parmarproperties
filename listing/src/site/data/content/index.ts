/**
 * ============================================================================
 *           PARMAR PROPERTIES - CENTRAL CONTENT REPOSITORY INDEX
 *                          (data/content/index.ts)
 * ============================================================================
 * 
 * Aggregates all modular, page-specific content files:
 * 
 * 1. home.content.ts              -> Home Page sections, hero carousel, why parmar
 * 2. buy.content.ts               -> /properties?tab=buy (Buy Mumbai Residences)
 * 3. new-launches.content.ts      -> /properties?tab=new-launches (New & Pre-Launch)
 * 4. luxury-collection.content.ts -> /properties?tab=luxury-collection (Signature Trophy Assets)
 * 5. properties.content.ts        -> Properties listing hub & aggregator
 * 6. locations.content.ts         -> /locations directory & micro-market pipeline
 * 7. commercials.content.ts       -> /commercials corporate suites & CBD hubs
 * 8. insights.content.ts          -> /market-intelligence research & advisory
 * 9. about.content.ts             -> /about heritage, leadership & credentials
 * 10. compare.content.ts          -> /compare side-by-side residence analysis
 * 11. saved.content.ts            -> /saved private portfolio bookmarks
 * 12. common.content.ts           -> Site-wide header navigation, footer & contacts
 */

export * from './home.content';
export * from './common.content';
export * from './buy.content';
export * from './new-launches.content';
export * from './luxury-collection.content';
export * from './properties.content';
export * from './locations.content';
export * from './commercials.content';
export * from './insights.content';
export * from './about.content';
export * from './compare.content';
export * from './saved.content';

// Backwards-compatible aliases for legacy imports
import { HOME_PAGE_CONTENT } from './home.content';
import { LOCATIONS_PAGE_CONTENT } from './locations.content';
import { INSIGHTS_PAGE_CONTENT } from './insights.content';

export const HERO_CONTENT = HOME_PAGE_CONTENT.hero;
export const FEATURED_SECTION_CONTENT = HOME_PAGE_CONTENT.featuredProperties;
export const LOCATION_SECTION_CONTENT = {
  ...HOME_PAGE_CONTENT.locationSection,
  featuredLocations: HOME_PAGE_CONTENT.locationSection.cards,
  locationFilterTabs: LOCATIONS_PAGE_CONTENT.filterTabs,
};
export const UPCOMING_PIPELINE_CONTENT = LOCATIONS_PAGE_CONTENT.upcomingPipeline;
export const PRIVATE_OPPORTUNITIES_CONTENT = {
  badge: HOME_PAGE_CONTENT.privateOpportunities.badge,
  title: HOME_PAGE_CONTENT.privateOpportunities.heading,
  lines: HOME_PAGE_CONTENT.privateOpportunities.paragraphs,
  buttonLabel: HOME_PAGE_CONTENT.privateOpportunities.ctaButton.text,
  disclaimer: HOME_PAGE_CONTENT.privateOpportunities.ctaButton.disclaimer,
  modal: HOME_PAGE_CONTENT.privateOpportunities.leadModal,
};
export const WHY_PARMAR_CONTENT = HOME_PAGE_CONTENT.whyParmar;
export const INSIGHTS_SECTION_CONTENT = {
  badge: INSIGHTS_PAGE_CONTENT.header.badge,
  title: "Market Intelligence",
  subtitle: INSIGHTS_PAGE_CONTENT.header.subtitle,
  ctaButtonText: INSIGHTS_PAGE_CONTENT.ctaButtonText,
  ctaButtonLink: "/market-intelligence",
  readArticleButtonLabel: INSIGHTS_PAGE_CONTENT.readArticleButtonLabel,
  executiveTakeawayLabel: INSIGHTS_PAGE_CONTENT.executiveTakeawayLabel,
  advisoryPrompt: INSIGHTS_PAGE_CONTENT.advisoryPrompt,
};
