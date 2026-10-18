import type { Metadata } from 'next';

import { JsonLd } from '@/site/components/seo/JsonLd';
import { fetchLocationBySlug } from '@/site/lib/supabase/locations';
import { NOINDEX, breadcrumbJsonLd, pageMetadata } from '@/site/lib/seo';

export const revalidate = 60;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const location = await fetchLocationBySlug(slug);
  if (!location) return { title: 'Location not found', robots: NOINDEX };
  return pageMetadata({
    title: `Luxury Apartments in ${location.name}, Mumbai: Prices & Area Guide`,
    description: [
      location.tagline ? `${location.name}: ${location.tagline}.` : `${location.name}, Mumbai.`,
      location.description,
      location.priceRange ? `Homes ${location.priceRange}.` : '',
    ].join(' '),
    path: `/locations/${location.slug}`,
    image: location.coverImage,
  });
}

export default async function LocationLayout(props: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const location = await fetchLocationBySlug(slug);
  return (
    <>
      {location ? (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Place',
              name: `${location.name}, Mumbai`,
              description: location.description,
              address: {
                '@type': 'PostalAddress',
                addressLocality: location.name,
                addressRegion: 'Maharashtra',
                addressCountry: 'IN',
              },
            },
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Locations', path: '/locations' },
              { name: location.name, path: `/locations/${location.slug}` },
            ]),
          ]}
        />
      ) : null}
      {props.children}
    </>
  );
}
