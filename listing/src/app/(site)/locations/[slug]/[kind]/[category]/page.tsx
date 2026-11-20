import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/site/components/seo/JsonLd';
import { LocationSegmentView } from '@/site/components/location/LocationSegmentView';
import { fetchLocationBySlug } from '@/site/lib/supabase/locations';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { fetchPublishedCommercials } from '@/site/lib/supabase/commercials';
import { fetchInsightsArticles } from '@/site/lib/supabase/insights';
import { guidesAbout, summariseCommercial, summariseResidential } from '@/site/lib/location-insights';
import { NOINDEX, breadcrumbJsonLd, pageMetadata } from '@/site/lib/seo';
import {
  commercialIn,
  duplicatesBuyPage,
  residentialIn,
  segmentCopy,
  segmentCounts,
} from '@/site/lib/location-segments';
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
  const [location, properties, commercials, articles] = await Promise.all([
    fetchLocationBySlug(slug),
    fetchPropertyCards(),
    fetchPublishedCommercials(),
    fetchInsightsArticles(),
  ]);
  if (!location) return null;
  const kind = params.kind;
  const counts = segmentCounts(properties, commercials, location.name);
  const items =
    kind === 'residential'
      ? { properties: residentialIn(properties, location.name, params.category as ResidentialCategory), commercials: [] }
      : { properties: [], commercials: commercialIn(commercials, location.name, params.category as CommercialCategory) };
  const duplicate =
    kind === 'residential' && duplicatesBuyPage(properties, location.name, params.category as ResidentialCategory);
  const summary =
    kind === 'residential'
      ? summariseResidential(location, params.category, items.properties)
      : summariseCommercial(location, params.category, items.commercials);
  const guides = guidesAbout(articles, location);
  return { location, kind, category: params.category, counts, duplicate, summary, guides, ...items };
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const data = await load(await props.params);
  if (!data) return { title: 'Page not found', robots: NOINDEX };
  const copy = segmentCopy(data.kind, data.category, data.location.name);
  const count = data.kind === 'residential' ? data.properties.length : data.commercials.length;
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    // A page that repeats Buy exactly points its canonical link at Buy.
    path: segmentPath(data.location.slug, data.kind, data.duplicate ? 'buy' : data.category),
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
        data={[
          ...(data.properties.length + data.commercials.length > 0
            ? [{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: data.summary.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: { '@type': 'Answer', text: f.answer },
                })),
              }]
            : []),
          breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Locations', path: '/locations' },
          { name: data.location.name, path: `/locations/${data.location.slug}` },
          { name: kindLabel, path: segmentPath(data.location.slug, data.kind, categoriesFor(data.kind)[0].slug) },
          { name: categoryLabel, path: segmentPath(data.location.slug, data.kind, data.category) },
          ]),
        ]}
      />
      <LocationSegmentView
        location={data.location}
        kind={data.kind}
        category={data.category}
        counts={data.counts}
        copy={copy}
        properties={data.properties}
        commercials={data.commercials}
        summary={data.summary}
        guides={data.guides}
      />
    </>
  );
}
