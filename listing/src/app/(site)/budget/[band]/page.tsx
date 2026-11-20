import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/site/components/seo/JsonLd';
import { BudgetBandView } from '@/site/components/location/BudgetBandView';
import { fetchLocations } from '@/site/lib/supabase/locations';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { NOINDEX, breadcrumbJsonLd, itemListJsonLd, pageMetadata } from '@/site/lib/seo';
import { BUDGET_BANDS, bandBySlug, budgetPath, duplicatesBand, inBand } from '@/site/lib/budget-pages';
import { sameLocation } from '@/site/lib/location-segments';
import { summariseBudget } from '@/site/lib/location-insights';

// Supabase fetches are cached by Next; without this a CMS edit never shows.
export const revalidate = 60;

async function load(slug: string) {
  const band = bandBySlug(slug);
  if (!band) return null;
  const [all, locations] = await Promise.all([fetchPropertyCards(), fetchLocations()]);
  const properties = inBand(all, band).sort((a, b) => a.price - b.price);
  const counts = Object.fromEntries(BUDGET_BANDS.map((b) => [b.slug, inBand(all, b).length]));
  const duplicateOf = duplicatesBand(all, band);
  const summary = summariseBudget(band.phrase, properties);
  const byLocation = locations
    .map((location) => ({ location, count: properties.filter((p) => sameLocation(p.location, location.name)).length }))
    .filter((l) => l.count > 0)
    .sort((a, b) => b.count - a.count);
  return { band, properties, counts, duplicateOf, summary, byLocation };
}

export async function generateMetadata(props: { params: Promise<{ band: string }> }): Promise<Metadata> {
  const data = await load((await props.params).band);
  if (!data) return { title: 'Page not found', robots: NOINDEX };
  const { band, properties } = data;
  const price = data.summary.facts.find((f) => f.label === 'Price range')?.value;
  return pageMetadata({
    title: band.title,
    description: properties.length
      ? `${properties.length} verified flats ${band.phrase} in Mumbai${price ? `, priced ${price}` : ''}. Prices, floor plans and MahaRERA details from Parmar Properties.`
      : `Flats ${band.phrase} in Mumbai from Parmar Properties: prices, floor plans and MahaRERA details.`,
    // A band that repeats a wider one exactly points its canonical link at that one.
    path: budgetPath((data.duplicateOf ?? band).slug),
    noindex: properties.length === 0,
  });
}

export default async function BudgetBandPage(props: { params: Promise<{ band: string }> }) {
  const data = await load((await props.params).band);
  if (!data) notFound();
  const { band, properties, counts, summary, byLocation } = data;
  return (
    <>
      <JsonLd
        data={[
          ...(properties.length > 0
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: summary.faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.question,
                    acceptedAnswer: { '@type': 'Answer', text: f.answer },
                  })),
                },
                itemListJsonLd(
                  band.heading,
                  properties.map((p) => ({ name: p.title, path: `/properties/${p.slug}` })),
                ),
              ]
            : []),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Properties', path: '/properties' },
            { name: band.heading, path: budgetPath(band.slug) },
          ]),
        ]}
      />
      <BudgetBandView band={band} properties={properties} counts={counts} summary={summary} locations={byLocation} />
    </>
  );
}
