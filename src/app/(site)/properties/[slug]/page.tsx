import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyDetailClient } from '@/site/components/property/PropertyDetailClient';
import {
  fetchPropertyBySlug,
  fetchPropertyCards,
  fetchPublishedPropertySlugs,
  pickSimilarProperties,
} from '@/site/lib/supabase/properties';

// Supabase fetches are cached by Next; without this a publish/edit/unpublish never shows.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchPublishedPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const property = await fetchPropertyBySlug(params.slug);
  if (!property) return {};
  return {
    title: property.metaTitle || `${property.title} | Parmar Properties`,
    description: property.metaDescription || property.tagline || undefined,
  };
}

export default async function PropertyDetailPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const property = await fetchPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  const catalog = await fetchPropertyCards();
  const similarProperties = pickSimilarProperties(property, catalog);

  return (
    <PropertyDetailClient property={property} similarProperties={similarProperties} />
  );
}
