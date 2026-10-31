import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PpcLanding } from '@/site/components/ppc/PpcLanding';
import { fetchPropertyBySlug } from '@/site/lib/supabase/properties';

export const revalidate = 60;

// Ad landing pages must not compete with the main site in search results.
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const property = await fetchPropertyBySlug(params.slug);
  if (!property) return { robots: { index: false, follow: false } };
  return {
    title: property.metaTitle || `${property.title} | Parmar Properties`,
    description: property.metaDescription || property.tagline || undefined,
    robots: { index: false, follow: false },
  };
}

export default async function ProjectLandingPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const property = await fetchPropertyBySlug(params.slug);
  if (!property) notFound();
  return <PpcLanding property={property} />;
}
