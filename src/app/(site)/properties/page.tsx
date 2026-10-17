import PropertiesPageClient from '@/site/components/property/PropertiesPageClient';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';

// Supabase fetches are cached by Next; without this a publish/edit/unpublish never shows.
export const revalidate = 60;

export default async function PropertiesPage() {
  // Fetched on the server so cards and their cover images ship with the HTML.
  const properties = await fetchPropertyCards();
  return <PropertiesPageClient initialProperties={properties} />;
}
