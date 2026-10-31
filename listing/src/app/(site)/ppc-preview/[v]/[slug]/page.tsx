import { notFound } from 'next/navigation';
import { fetchPropertyBySlug } from '@/site/lib/supabase/properties';
import { Cinematic } from '@/site/components/ppc/options/Cinematic';
import { Folio } from '@/site/components/ppc/options/Folio';
import { Split } from '@/site/components/ppc/options/Split';
import { Express } from '@/site/components/ppc/options/Express';
import { AdPreview } from '@/site/components/ppc/AdPreview';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

// Design exploration only: never served in production.
export default async function PpcPreview(props: { params: Promise<{ v: string; slug: string }> }) {
  const params = await props.params;
  if (process.env.NODE_ENV === 'production') notFound();
  const property = await fetchPropertyBySlug(params.slug);
  if (!property) notFound();
  switch (params.v) {
    case 'a': return <Cinematic property={property} />;
    case 'b': return <Folio property={property} />;
    case 'c': return <Split property={property} />;
    case 'd': return <Express property={property} />;
    case 'ad': return <AdPreview property={property} />;
    default: notFound();
  }
}
