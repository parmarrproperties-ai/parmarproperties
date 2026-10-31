import type { MetadataRoute } from 'next';

import { getSupabase } from '@/site/lib/supabase/client';
import { absoluteUrl } from '@/site/lib/seo';

export const revalidate = 3600;

type Row = { slug: string; updated_at?: string | null; cover_image?: string | null };

function rowsOrEmpty(table: string, result: { data: unknown; error: { message: string } | null }): Row[] {
  if (result.error) {
    console.error(`[sitemap] ${table} failed`, result.error.message);
    return [];
  }
  return (result.data ?? []) as Row[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabase();
  const [propertyResult, locationResult, articleResult] = supabase
    ? await Promise.all([
        supabase
          .from('properties')
          .select('slug, updated_at, cover_image')
          .eq('publication_status', 'published')
          .is('deleted_at', null),
        supabase.from('locations').select('slug, updated_at').eq('is_active', true),
        supabase.from('insights_articles').select('slug, updated_at').eq('status', 'published'),
      ])
    : [];
  const empty = { data: [], error: null };
  const properties = rowsOrEmpty('properties', propertyResult ?? empty);
  const locations = rowsOrEmpty('locations', locationResult ?? empty);
  const articles = rowsOrEmpty('insights_articles', articleResult ?? empty);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/properties'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/locations'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/commercials'), changeFrequency: 'weekly', priority: 0.6 },
    { url: absoluteUrl('/market-intelligence'), changeFrequency: 'weekly', priority: 0.6 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.4 },
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
    ...locations.map((row) => ({
      url: absoluteUrl(`/locations/${row.slug}`),
      lastModified: lastModified(row),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...articles.map((row) => ({
      url: absoluteUrl(`/market-intelligence/${row.slug}`),
      lastModified: lastModified(row),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
