import PropertiesPageClient from '@/site/components/property/PropertiesPageClient';
import { JsonLd } from '@/site/components/seo/JsonLd';
import { ListingFallback } from '@/site/components/seo/ListingFallback';
import { BUY_PAGE_CONTENT } from '@/site/data/content';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from '@/site/lib/seo';

// Supabase fetches are cached by Next; without this a publish/edit/unpublish never shows.
export const revalidate = 60;

// Tabs and filters are query strings on this one URL, so they all canonicalise here.
export const metadata = pageMetadata({
  title: 'Luxury Flats & Apartments for Sale in South Mumbai',
  description:
    'Browse verified luxury apartments, penthouses and new launches for sale in Worli, Malabar Hill, Prabhadevi, Lower Parel, Mahalaxmi, Dadar and across South Mumbai. Prices, floor plans and MahaRERA details.',
  path: '/properties',
});

export default async function PropertiesPage() {
  // Fetched on the server so cards and their cover images ship with the HTML.
  const properties = await fetchPropertyCards();
  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd(
            'Properties for sale in South Mumbai',
            properties.map((p) => ({ name: p.title, path: `/properties/${p.slug}` }))
          ),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Properties', path: '/properties' },
          ]),
        ]}
      />
      <PropertiesPageClient
        initialProperties={properties}
        fallback={
          <ListingFallback
            breadcrumb="BUY"
            title={BUY_PAGE_CONTENT.header.title}
            subtitle={BUY_PAGE_CONTENT.header.subtitle}
            properties={properties}
          />
        }
      />
    </>
  );
}
