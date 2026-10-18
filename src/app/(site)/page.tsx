import HomePageClient from '@/site/components/home/HomePageClient';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';
import { SITE_NAME, pageMetadata } from '@/site/lib/seo';

// Supabase fetches are cached by Next; without this a publish/edit/unpublish never shows.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: `Luxury Apartments & Real Estate in South Mumbai | ${SITE_NAME}`,
  absoluteTitle: true,
  description:
    'Mumbai real estate advisors since 1981. Verified luxury apartments, penthouses and new launches in Worli, Malabar Hill, Prabhadevi, Lower Parel and South Mumbai, with MahaRERA-checked listings.',
  path: '/',
});

export default async function HomePage() {
  // Fetched on the server so featured cards and their cover images ship with the HTML.
  const properties = await fetchPropertyCards();
  return <HomePageClient initialProperties={properties} />;
}
