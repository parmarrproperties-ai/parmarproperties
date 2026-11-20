import { notFound } from 'next/navigation';

import LocationPageClient from '@/site/components/location/LocationPageClient';
import { fetchCorridorSwitcherLocations, fetchLocationBySlug } from '@/site/lib/supabase/locations';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { fetchPublishedCommercials } from '@/site/lib/supabase/commercials';
import { segmentCounts } from '@/site/lib/location-segments';
import { fetchInsightsArticles } from '@/site/lib/supabase/insights';
import { guidesAbout } from '@/site/lib/location-insights';

// Supabase fetches are cached by Next; without this a CMS edit never shows.
export const revalidate = 60;

export default async function LocationPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  // Fetched on the server so the guide and its listings ship in the HTML for search engines.
  const [location, properties, corridor, commercials, articles] = await Promise.all([
    fetchLocationBySlug(slug.toLowerCase()),
    fetchPropertyCards(),
    fetchCorridorSwitcherLocations(slug.toLowerCase()),
    fetchPublishedCommercials(),
    fetchInsightsArticles(),
  ]);
  if (!location) notFound();
  return (
    <LocationPageClient
      key={slug}
      slug={slug}
      initialLocation={location}
      initialProperties={properties}
      initialCorridor={corridor}
      segmentCounts={segmentCounts(properties, commercials, location.name)}
      guides={guidesAbout(articles, location).map((g) => ({ slug: g.slug, title: g.title }))}
    />
  );
}
