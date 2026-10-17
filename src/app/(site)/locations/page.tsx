import LocationsPageClient from '@/site/components/location/LocationsPageClient';
import { ListingFallback } from '@/site/components/seo/ListingFallback';
import { LOCATIONS_PAGE_CONTENT } from '@/site/data/content/locations.content';
import { fetchLocations } from '@/site/lib/supabase/locations';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';

// Supabase fetches are cached by Next; without this a CMS edit never shows.
export const revalidate = 60;

export default async function LocationsPage() {
  // The interactive page reads ?location= in the browser; ship crawlable guides and listings meanwhile.
  const [locations, properties] = await Promise.all([fetchLocations(), fetchPropertyCards()]);
  return (
    <LocationsPageClient
      fallback={
        <ListingFallback
          breadcrumb="LOCATIONS"
          title={LOCATIONS_PAGE_CONTENT.header.title}
          subtitle={LOCATIONS_PAGE_CONTENT.header.subtitle}
          properties={properties}
          links={locations.map((location) => ({
            href: `/locations/${location.slug}`,
            label: `Luxury apartments in ${location.name}`,
          }))}
        />
      }
    />
  );
}
