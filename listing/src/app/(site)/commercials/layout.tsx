import type { Metadata } from 'next';

import { pageMetadata } from '@/site/lib/seo';
import { fetchPublishedCommercials } from '@/site/lib/supabase/commercials';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const commercials = await fetchPublishedCommercials();
  return pageMetadata({
    title: 'Commercial Property: Buy, Pre-Lease, Rent',
    description:
      'Grade-A office floors, corporate HQ spaces and premium retail to buy, pre-lease or rent in BKC, Lower Parel, Worli and South Mumbai, advised by Parmar Properties since 1981.',
    path: '/commercials',
    // Empty until the first commercial listing is published: keep it out of search until then.
    noindex: commercials.length === 0,
  });
}

export default function CommercialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
