import MarketIntelligenceClient from '@/site/components/insights/MarketIntelligenceClient';
import { fetchInsightsArticles } from '@/site/lib/supabase/insights';

// Supabase fetches are cached by Next; without this a CMS edit never shows.
export const revalidate = 60;

export default async function MarketIntelligencePage() {
  // Fetched on the server so article titles and summaries ship in the HTML.
  const articles = await fetchInsightsArticles();
  return <MarketIntelligenceClient initialArticles={articles} />;
}
