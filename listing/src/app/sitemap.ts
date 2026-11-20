import type { MetadataRoute } from 'next';

import { getSupabase } from '@/site/lib/supabase/client';
import { absoluteUrl } from '@/site/lib/seo';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { fetchPublishedCommercials } from '@/site/lib/supabase/commercials';
import { duplicatesBuyPage, locationTotal, segmentCounts } from '@/site/lib/location-segments';
import { COMMERCIAL_CATEGORIES, RESIDENTIAL_CATEGORIES, segmentPath } from '@/lib/segments';
import { BUDGET_BANDS, budgetPath, duplicatesBand, inBand } from '@/site/lib/budget-pages';

export const revalidate = 3600;

type Row = { slug: string; name?: string; updated_at?: string | null; cover_image?: string | null };

function rowsOrEmpty(table: string, result: { data: unknown; error: { message: string } | null }): Row[] {
  if (result.error) {
    console.error(`[sitemap] ${table} failed`, result.error.message);
    return [];
  }
  return (result.data ?? []) as Row[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabase();
  const [propertyResult, articleResult] = supabase
    ? await Promise.all([
        supabase
          .from('properties')
          .select('slug, updated_at, cover_image')
          .eq('publication_status', 'published')
          .is('deleted_at', null),
        supabase.from('insights_articles').select('slug, updated_at').eq('status', 'published'),
      ])
    : [];
  const empty = { data: [], error: null };

  // Residential / Commercial category pages are listed only when they have listings.
  const [cards, commercials, segmentLocationResult] = supabase
    ? await Promise.all([
        fetchPropertyCards(),
        fetchPublishedCommercials(),
        supabase
          .from('locations')
          .select('slug, name, updated_at')
          .eq('is_active', true)
          .eq('publication_status', 'published'),
      ])
    : [[], [], empty];
  const segmentLocations = rowsOrEmpty('locations (categories)', segmentLocationResult);
  // A location page is listed only when something is published in it.
  const locationsWithListings = segmentLocations.filter(
    (loc) => loc.name && locationTotal(segmentCounts(cards, commercials, loc.name)) > 0,
  );
  const segmentPages: MetadataRoute.Sitemap = segmentLocations.flatMap((loc) => {
    if (!loc.name) return [];
    const counts = segmentCounts(cards, commercials, loc.name);
    const lastMod = loc.updated_at ? new Date(loc.updated_at) : undefined;
    return [
      ...RESIDENTIAL_CATEGORIES.filter(
        (c) => counts.residential[c.slug] > 0 && !duplicatesBuyPage(cards, loc.name ?? '', c.slug),
      ).map((c) => ({
        url: absoluteUrl(segmentPath(loc.slug, 'residential', c.slug)),
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...COMMERCIAL_CATEGORIES.filter((c) => counts.commercial[c.slug] > 0).map((c) => ({
        url: absoluteUrl(segmentPath(loc.slug, 'commercial', c.slug)),
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ];
  });
  // Budget pages are listed when they hold flats and are not a copy of a wider band.
  const budgetPages: MetadataRoute.Sitemap = BUDGET_BANDS.filter(
    (b) => inBand(cards, b).length > 0 && !duplicatesBand(cards, b),
  ).map((b) => ({
    url: absoluteUrl(budgetPath(b.slug)),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  const properties = rowsOrEmpty('properties', propertyResult ?? empty);
  const articles = rowsOrEmpty('insights_articles', articleResult ?? empty);

  // Pages with nothing on them yet stay out of the sitemap (they are also noindex).
  const hasCommercials = commercials.length > 0;
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/properties'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/locations'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/market-intelligence'), changeFrequency: 'weekly', priority: 0.6 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.4 },
    ...(hasCommercials ? [{ url: absoluteUrl('/commercials'), changeFrequency: 'weekly' as const, priority: 0.6 }] : []),
  ];

  const lastModified = (row: Row) => (row.updated_at ? new Date(row.updated_at) : undefined);

  return [
    ...staticPages,
    ...properties.map((row) => ({
      url: absoluteUrl(`/properties/${row.slug}`),
      lastModified: lastModified(row),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      ...(row.cover_image ? { images: [absoluteUrl(row.cover_image)] } : {}),
    })),
    ...locationsWithListings.map((row) => ({
      url: absoluteUrl(`/locations/${row.slug}`),
      lastModified: lastModified(row),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...segmentPages,
    ...budgetPages,
    ...articles.map((row) => ({
      url: absoluteUrl(`/market-intelligence/${row.slug}`),
      lastModified: lastModified(row),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
