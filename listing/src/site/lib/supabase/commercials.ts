import { getSupabase } from './client';
import type { CommercialProperty } from '@/site/data/commercials';
import { formatCommercialAmount, type CommercialDealType } from '@/lib/segments';

export function mapDbCommercialToFrontend(dbRow: Record<string, any>): CommercialProperty {
  // Stored as crores for Buy, lakh per month for Pre-Lease and Rent.
  const amount = Number(dbRow.price) || 0;
  const dealType: CommercialDealType =
    dbRow.deal_type === 'rent' || dbRow.deal_type === 'pre_lease' ? dbRow.deal_type : 'buy';

  return {
    id: dbRow.id,
    slug: dbRow.slug,
    title: dbRow.title,
    tagline: dbRow.tagline || '',
    location: dbRow.location?.name || dbRow.hub?.name || '',
    subLocation: dbRow.sub_location || '',
    dealType,
    // Crore-equivalent, so the budget filter and price sort work across deal types.
    price: dealType === 'buy' ? amount : amount / 100,
    priceFormatted: formatCommercialAmount(amount, dealType),
    carpetArea: Number(dbRow.carpet_area) || 0,
    propertyType: (dbRow.commercial_type?.name || 'Grade-A Office') as any,
    possession: (dbRow.possession || 'Ready to Move') as any,
    floor: dbRow.floor || '',
    coverImage: dbRow.cover_image || '/placeholder.png',
    amenities: Array.isArray(dbRow.highlights) ? dbRow.highlights : [],
    reraId: dbRow.rera_id || '',
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
      .select(
        '*, location:lookup_locations(name), hub:lookup_commercial_hubs(name), commercial_type:lookup_commercial_types(name)',
      )
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
