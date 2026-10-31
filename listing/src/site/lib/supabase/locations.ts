import { getSupabase } from './client';

export interface LocationInfo {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  priceRange: string;
  averageRate: string;
  lifestyle: string;
  keyEnclaves: string[];
  isPrimaryHome?: boolean;
  primaryOrder?: number | null;
  isFuture?: boolean;
  futureOrder?: number | null;
}

/**
 * Offline/dev fallback only — used when Supabase is not configured.
 * Never used to resurrect a location that the CMS marked inactive.
 */
export const FALLBACK_LOCATIONS: Record<string, LocationInfo> = {
  worli: {
    name: 'Worli',
    slug: 'worli',
    tagline: 'Mumbai’s Premier Sea-Facing Luxury Mile',
    description:
      'Home to iconic skyline towers, the Bandra-Worli Sea Link promenade, and coveted multi-acre gated sky residences. Worli commands premier capital appreciation and uninterrupted Arabian Sea horizons.',
    coverImage: '/placeholder.png',
    priceRange: '₹18 Cr - ₹75 Cr+',
    averageRate: '₹65,000 - ₹1,20,000 / sq.ft',
    lifestyle: 'Sea Link Promenade, High-Rise Sky Mansions, Michelin Dining',
    keyEnclaves: ['Worli Sea Face', 'Dr. Annie Besant Road', 'Pochkhanawala Road'],
  },
};

export function mapDbLocationToFrontend(row: Record<string, any>): LocationInfo {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-'),
    tagline: row.tagline || '',
    description: row.description || '',
    coverImage: row.cover_image || row.image_url || '/placeholder.png',
    priceRange: row.price_range || 'Price on Request',
    averageRate: row.average_rate || '₹65,000 - ₹1,20,000 / sq.ft',
    lifestyle: row.lifestyle || '',
    keyEnclaves: Array.isArray(row.key_enclaves) ? row.key_enclaves : [],
    isPrimaryHome: Boolean(row.is_primary_home),
    primaryOrder: typeof row.primary_order === 'number' ? row.primary_order : null,
    isFuture: Boolean(row.is_future),
    futureOrder: typeof row.future_order === 'number' ? row.future_order : null,
  };
}

function isPublishedActive(row: Record<string, any>): boolean {
  if (row.is_active === false) return false;
  if (row.publication_status && row.publication_status !== 'published') return false;
  return true;
}

/**
 * Canonical public location source: `locations` where is_active + published.
 * Empty CMS result means "no public locations" — never invent rows from fallbacks.
 */
export async function fetchLocations(): Promise<LocationInfo[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return Object.values(FALLBACK_LOCATIONS);
  }

  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Failed to fetch locations from Supabase:', error.message);
      return [];
    }

    return (data ?? []).filter(isPublishedActive).map(mapDbLocationToFrontend);
  } catch (err) {
    console.warn('Failed to fetch locations from Supabase:', err);
    return [];
  }
}

/** Names for location filter bars: "All" first, then active/published backend locations by sort_order. */
export async function fetchLocationFilterNames(): Promise<string[]> {
  const locations = await fetchLocations();
  return ['All', ...locations.map((l) => l.name)];
}

/**
 * Homepage "EXPLORE PROPERTIES" cards.
 * Uses Top 4 on Homepage (`is_primary_home`) + Top 4 Order (`primary_order`).
 * Independent of general Location Order (`sort_order`).
 * Never invents replacements when fewer than 4 are selected.
 */
export async function fetchPrimaryHomeLocations(): Promise<LocationInfo[]> {
  const locations = await fetchLocations();
  return locations
    .filter((l) => l.isPrimaryHome)
    .sort((a, b) => (a.primaryOrder ?? 99) - (b.primaryOrder ?? 99))
    .slice(0, 4);
}

/** Future locations strip — independent of homepage primary selection. */
export async function fetchFutureLocations(): Promise<LocationInfo[]> {
  const locations = await fetchLocations();
  return locations
    .filter((l) => l.isFuture)
    .sort((a, b) => (a.futureOrder ?? 99) - (b.futureOrder ?? 99));
}

/**
 * Location detail "SWITCH TO ANOTHER PRIME CORRIDOR".
 * All active+published locations except the current slug, by sort_order.
 */
export async function fetchCorridorSwitcherLocations(
  excludeSlug: string
): Promise<LocationInfo[]> {
  const locations = await fetchLocations();
  const current = excludeSlug.toLowerCase();
  return locations.filter((l) => l.slug.toLowerCase() !== current);
}

/**
 * Returns the location when it is active+published; otherwise null.
 * Does NOT fall back to hardcoded content for inactive/unpublished slugs.
 */
export async function fetchLocationBySlug(slug: string): Promise<LocationInfo | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return FALLBACK_LOCATIONS[slug] || null;
  }

  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data || !isPublishedActive(data)) {
      return null;
    }

    return mapDbLocationToFrontend(data);
  } catch (err) {
    console.warn(`Failed to fetch location ${slug} from Supabase:`, err);
    return null;
  }
}
