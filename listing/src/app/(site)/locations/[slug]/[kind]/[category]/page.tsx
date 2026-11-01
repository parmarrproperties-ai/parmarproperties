import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/site/components/seo/JsonLd';
import { LocationSegmentView } from '@/site/components/location/LocationSegmentView';
import { fetchLocationBySlug } from '@/site/lib/supabase/locations';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { fetchPublishedCommercials } from '@/site/lib/supabase/commercials';
import { NOINDEX, breadcrumbJsonLd, pageMetadata } from '@/site/lib/seo';
import { commercialIn, residentialIn, segmentCopy, segmentCounts } from '@/site/lib/location-segments';
import {
  categoriesFor,
  isCategoryOf,
  isSegmentKind,
  segmentPath,
  type CommercialCategory,
  type ResidentialCategory,
} from '@/lib/segments';

// Supabase fetches are cached by Next; without this a CMS edit never shows.
export const revalidate = 60;

type Params = { slug: string; kind: string; category: string };

async function load(params: Params) {
  const slug = params.slug.toLowerCase();
  if (!isSegmentKind(params.kind) || !isCategoryOf(params.kind, params.category)) return null;
  const [location, properties, commercials] = await Promise.all([
    fetchLocationBySlug(slug),
    fetchPropertyCards(),
    fetchPublishedCommercials(),
  ]);
  if (!location) return null;
  const kind = params.kind;
  const counts = segmentCounts(properties, commercials, location.name);
  const items =
    kind === 'residential'
      ? { properties: residentialIn(properties, location.name, params.category as ResidentialCategory), commercials: [] }
      : { properties: [], commercials: commercialIn(commercials, location.name, params.category as CommercialCategory) };
  return { location, kind, category: params.category, counts, ...items };
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const data = await load(await props.params);
  if (!data) return { title: 'Page not found', robots: NOINDEX };
  const copy = segmentCopy(data.kind, data.category, data.location.name);
  const count = data.kind === 'residential' ? data.properties.length : data.commercials.length;
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: segmentPath(data.location.slug, data.kind, data.category),
    image: data.location.coverImage,
    // Pages with nothing listed yet are kept out of search results until they have listings.
    noindex: count === 0,
  });
}

export default async function LocationSegmentPage(props: { params: Promise<Params> }) {
  const data = await load(await props.params);
  if (!data) notFound();
  const copy = segmentCopy(data.kind, data.category, data.location.name);
  const kindLabel = data.kind === 'residential' ? 'Residential' : 'Commercial';
  const categoryLabel = categoriesFor(data.kind).find((c) => c.slug === data.category)?.label ?? data.category;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Locations', path: '/locations' },
          { name: data.location.name, path: `/locations/${data.location.slug}` },
          { name: kindLabel, path: segmentPath(data.location.slug, data.kind, categoriesFor(data.kind)[0].slug) },
          { name: categoryLabel, path: segmentPath(data.location.slug, data.kind, data.category) },
        ])}
      />
      <LocationSegmentView
        location={data.location}
        kind={data.kind}
        category={data.category}
        counts={data.counts}
        copy={copy}
        properties={data.properties}
        commercials={data.commercials}
      />
    </>
  );
}
