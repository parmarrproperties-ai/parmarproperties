import HomePageClient from '@/site/components/home/HomePageClient';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';

// Supabase fetches are cached by Next; without this a publish/edit/unpublish never shows.
export const revalidate = 60;

export default async function HomePage() {
  // Fetched on the server so featured cards and their cover images ship with the HTML.
  const properties = await fetchPropertyCards();
  return <HomePageClient initialProperties={properties} />;
}
