import { getSupabase } from './client';

export interface LookupOption {
  id?: string;
  slug: string;
  name: string;
  displayOrder: number;
}

export async function fetchLookupBhk(): Promise<LookupOption[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [
      { slug: 'any', name: 'Any Configuration', displayOrder: -1 },
      { slug: '3-bhk', name: '3 BHK', displayOrder: 2 },
      { slug: '4-bhk', name: '4 BHK', displayOrder: 3 },
      { slug: '5-bhk', name: '5 BHK', displayOrder: 4 },
    ];
  }

  try {
    const { data, error } = await supabase
      .from('lookup_bhk')
      .select('id, slug, name, display_order, is_active')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { slug: 'any', name: 'Any Configuration', displayOrder: -1 },
        { slug: '3-bhk', name: '3 BHK', displayOrder: 2 },
        { slug: '4-bhk', name: '4 BHK', displayOrder: 3 },
        { slug: '5-bhk', name: '5 BHK', displayOrder: 4 },
      ];
    }

    return data.map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
      displayOrder: Number(row.display_order ?? 0),
    }));
  } catch (err) {
    console.warn('Failed to fetch lookup_bhk:', err);
    return [
      { slug: 'any', name: 'Any Configuration', displayOrder: -1 },
      { slug: '3-bhk', name: '3 BHK', displayOrder: 2 },
      { slug: '4-bhk', name: '4 BHK', displayOrder: 3 },
      { slug: '5-bhk', name: '5 BHK', displayOrder: 4 },
    ];
  }
}

export async function fetchLookupConstructionStatus(): Promise<LookupOption[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [
      { slug: 'ready-to-move', name: 'Ready to Move In', displayOrder: 0 },
      { slug: 'under-construction', name: 'Under Construction', displayOrder: 1 },
      { slug: 'pre-launch', name: 'Pre-Launch', displayOrder: 2 },
      { slug: 'luxury-collection', name: 'Luxury Collection', displayOrder: 3 },
      { slug: 'resale', name: 'Resale', displayOrder: 4 },
    ];
  }

  try {
    const { data, error } = await supabase
      .from('lookup_construction_status')
      .select('id, slug, name, display_order, is_active')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { slug: 'ready-to-move', name: 'Ready to Move In', displayOrder: 0 },
        { slug: 'under-construction', name: 'Under Construction', displayOrder: 1 },
        { slug: 'pre-launch', name: 'Pre-Launch', displayOrder: 2 },
        { slug: 'luxury-collection', name: 'Luxury Collection', displayOrder: 3 },
        { slug: 'resale', name: 'Resale', displayOrder: 4 },
      ];
    }

    return data.map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
      displayOrder: Number(row.display_order ?? 0),
    }));
  } catch (err) {
    console.warn('Failed to fetch lookup_construction_status:', err);
    return [
      { slug: 'ready-to-move', name: 'Ready to Move In', displayOrder: 0 },
      { slug: 'under-construction', name: 'Under Construction', displayOrder: 1 },
      { slug: 'pre-launch', name: 'Pre-Launch', displayOrder: 2 },
      { slug: 'luxury-collection', name: 'Luxury Collection', displayOrder: 3 },
      { slug: 'resale', name: 'Resale', displayOrder: 4 },
    ];
  }
}
