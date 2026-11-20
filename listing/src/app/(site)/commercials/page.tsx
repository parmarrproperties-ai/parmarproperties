import CommercialsClient from '@/site/components/commercial/CommercialsClient';
import { CommercialsFallback } from '@/site/components/commercial/CommercialsFallback';
import { fetchPublishedCommercials } from '@/site/lib/supabase/commercials';

// Supabase fetches are cached by Next; without this a CMS edit never shows.
export const revalidate = 60;

export default async function CommercialsPage() {
  const commercials = await fetchPublishedCommercials();
  return (
    <CommercialsClient initialCommercials={commercials} fallback={<CommercialsFallback commercials={commercials} />} />
  );
}
