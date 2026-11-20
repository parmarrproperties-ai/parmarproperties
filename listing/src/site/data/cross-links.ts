/**
 * Market guides and the blog posts on the main site that cover the same topic.
 * Each page links to the other, so the two are read as a pair instead of competing for the
 * same search. Keys are market guide slugs.
 */
export type CrossLink = { label: string; href: string };

const MAIN = 'https://www.parmarproperties.in';

export const blogPostsForGuide: Record<string, CrossLink[]> = {
  'mahalaxmi-vs-worli': [
    { label: 'Worli vs Mahalaxmi: a practical guide for luxury homebuyers', href: `${MAIN}/blog/worli-vs-mahalaxmi-a-practical-guide-for-luxury-homebuyers` },
  ],
  'worli-guide-2026': [
    { label: "Why Worli continues to lead Mumbai's luxury housing market", href: `${MAIN}/blog/why-worli-continues-to-lead-mumbai-s-luxury-housing-market` },
  ],
  'nri-mumbai-property': [
    { label: 'The NRI guide to buying property in Mumbai in 2026', href: `${MAIN}/blog/the-nri-guide-to-buying-property-in-mumbai-in-2026` },
  ],
};
