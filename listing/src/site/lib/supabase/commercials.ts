import { getSupabase } from './client';
import type { CommercialProperty } from '@/site/data/commercials';

export function mapDbCommercialToFrontend(dbRow: Record<string, any>): CommercialProperty {
  const price = Number(dbRow.price) || 0;
  const priceFormatted = `₹${price.toFixed(2)} Cr`;

  return {
    id: dbRow.id,
    slug: dbRow.slug,
    title: dbRow.title,
    tagline: dbRow.tagline || '',
    location: dbRow.hub?.name || dbRow.hub_id || 'BKC',
    subLocation: dbRow.sub_location || '',
    price,
    priceFormatted,
    carpetArea: Number(dbRow.carpet_area) || 0,
    propertyType: (dbRow.commercial_type?.name || 'Grade-A Office') as any,
    possession: (dbRow.possession || 'Ready to Move') as any,
    floor: dbRow.floor || '',
    coverImage: dbRow.cover_image || '/placeholder.png',
    amenities: Array.isArray(dbRow.highlights) ? dbRow.highlights : [],
    reraId: dbRow.rera_id || 'P51900018420',
    highlights: Array.isArray(dbRow.highlights) ? dbRow.highlights : [],
    description: dbRow.description || '',
  };
}

export async function fetchPublishedCommercials(): Promise<CommercialProperty[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('commercial_properties')
      .select('*, hub:lookup_commercial_hubs(name), commercial_type:lookup_commercial_types(name)')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map(mapDbCommercialToFrontend);
  } catch (err) {
    console.warn('Failed to fetch commercials from Supabase:', err);
    return [];
  }
}
