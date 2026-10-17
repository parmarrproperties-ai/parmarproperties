import { getSupabase, isSupabaseConfigured } from './client';
import type {
  MumbaiLocality,
  Property,
  PropertyLayoutVariant,
  PropertyType,
} from '@/site/types/property';

/**
 * Relations for public cards/detail.
 * Avoid selecting columns that may be missing until later migrations
 * (e.g. property_amenities.custom_label from 009) so the whole query
 * does not fail on older remotes.
 */
const PUBLISHED_PROPERTY_SELECT = `
  *,
  property_images (*),
  property_configurations (*),
  lookup_locations ( id, name, slug ),
  lookup_bhk ( id, name, slug ),
  lookup_property_types ( id, name, slug ),
  lookup_construction_status!properties_status_id_fkey ( id, name, slug ),
  property_amenities (
    lookup_amenity_id,
    amenity_id,
    custom_label,
    lookup_amenities ( name )
  )
`;

/**
 * Card/list projection: everything PropertyCard, filters, sorting and Compare
 * read, without galleries, long copy or floor-plan images (~5x smaller).
 */
const PROPERTY_CARD_SELECT = `
  id, slug, title, name, tagline, locality, sub_location,
  price, price_amount, price_display, price_on_request,
  carpet_area_sqft, carpet_area, super_area, possession_date, possession, floor,
  is_featured, recently_added, is_recommended, is_new_launch, is_luxury_collection,
  cover_image, rera_id, rera_number, sort_order, updated_at,
  property_configurations ( variant_code, tab_label, title, area_range, carpet_area, price_indicator, display_order ),
  lookup_locations ( id, name, slug ),
  lookup_bhk ( id, name, slug ),
  lookup_property_types ( id, name, slug ),
  lookup_construction_status!properties_status_id_fkey ( id, name, slug ),
  property_amenities ( custom_label, lookup_amenities ( name ) )
`;

const PUBLISHED_PROPERTY_SELECT_MINIMAL = `
  *,
  property_images (*),
  property_configurations (*)
`;

function logSupabaseError(
  context: string,
  error: { message?: string; code?: string; details?: string; hint?: string } | null
) {
  if (!error) return;
  console.error(`[properties] ${context}`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

function mapRows(data: unknown): Property[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => mapDbPropertyToFrontend(row as Record<string, unknown>));
}

function normalizeLocality(name: string | null | undefined): MumbaiLocality {
  const known: MumbaiLocality[] = [
    'Worli',
    'Bandra West',
    'Juhu',
    'Powai',
    'Lower Parel',
    'Prabhadevi',
    'Khar West',
    'Malabar Hill',
    'Cuffe Parade',
    'BKC',
    'Sewri',
  ];
  if (!name) return 'Worli';
  const match = known.find(
    (loc) => loc.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(loc.toLowerCase())
  );
  return match ?? (name as MumbaiLocality);
}

function mapPossession(
  possessionDate: string | null | undefined,
  constructionStatusName: string | null | undefined
): Property['possession'] {
  const source = `${possessionDate ?? ''} ${constructionStatusName ?? ''}`.toLowerCase();
  if (source.includes('pre') || source.includes('launch')) return 'Pre-Launch';
  if (source.includes('under') || source.includes('construction')) return 'Under Construction';
  if (source.includes('immediate')) return 'Immediate';
  if (source.includes('ready') || source.includes('move')) return 'Ready to Move';
  if (possessionDate?.trim()) return 'Under Construction';
  return 'Ready to Move';
}

function mapPropertyType(name: string | null | undefined): PropertyType {
  const allowed: PropertyType[] = [
    'Penthouse',
    'Apartment',
    'Sea-Facing Apartment',
    'Duplex',
    'Sky Villa',
    'Luxury Estate',
  ];
  if (name && allowed.includes(name as PropertyType)) {
    return name as PropertyType;
  }
  if (name?.toLowerCase().includes('penthouse')) return 'Penthouse';
  if (name?.toLowerCase().includes('villa')) return 'Sky Villa';
  if (name?.toLowerCase().includes('duplex')) return 'Duplex';
  return 'Apartment';
}

/** ["3 BHK","4 BHK"] -> "3 & 4 BHK"; anything else is joined as typed. */
function joinBhkLabels(labels: string[]): string {
  const uniq = labels.filter((l, i) => l && labels.indexOf(l) === i);
  if (uniq.length === 0) return '';
  if (!uniq.every((l) => /^[\d.]+ BHK$/.test(l))) return uniq.join(', ');
  const nums = uniq.map((l) => l.replace(' BHK', ''));
  const last = nums.pop();
  return `${nums.length ? `${nums.join(', ')} & ` : ''}${last} BHK`;
}

function variantToBhkLabel(variant: string): string {
  const map: Record<string, string> = {
    '1bhk': '1 BHK',
    '2bhk': '2 BHK',
    '3bhk': '3 BHK',
    '4bhk': '4 BHK',
    '5bhk': '5 BHK',
    custom: 'Custom',
  };
  return map[variant] ?? variant;
}

/**
 * Maps a Supabase `properties` row (with nested relations) to the Frontend `Property` type.
 */
export function mapDbPropertyToFrontend(dbRow: Record<string, unknown>): Property {
  const lookupLocation = dbRow.lookup_locations as
    | { name?: string; slug?: string }
    | null
    | undefined;
  const lookupBhk = dbRow.lookup_bhk as { name?: string; slug?: string } | null | undefined;
  const lookupType = dbRow.lookup_property_types as
    | { name?: string; slug?: string }
    | null
    | undefined;
  const lookupStatus = dbRow.lookup_construction_status as
    | { name?: string; slug?: string }
    | null
    | undefined;

  const priceRaw =
    dbRow.price != null && dbRow.price !== ''
      ? Number(dbRow.price)
      : dbRow.price_amount != null
        ? Number(dbRow.price_amount) / 10_000_000
        : 0;
  const price = Number.isFinite(priceRaw) ? priceRaw : 0;
  const priceFormatted = dbRow.price_on_request
    ? 'Price on Request'
    : price > 0
      ? `₹${price.toFixed(2)} Cr`
      : typeof dbRow.price_display === 'string' && dbRow.price_display
        ? dbRow.price_display
        : 'Price on Request';

  const images: string[] = [];
  const propertyImages = dbRow.property_images as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(propertyImages) && propertyImages.length > 0) {
    [...propertyImages]
      .sort(
        (a, b) =>
          (Number(a.display_order) || 0) - (Number(b.display_order) || 0)
      )
      .forEach((img) => {
        if (typeof img.url === 'string' && img.url) images.push(img.url);
      });
  }
  const coverFromRow =
    typeof dbRow.cover_image === 'string' ? dbRow.cover_image : '';
  if (images.length === 0 && coverFromRow) images.push(coverFromRow);

  const floorPlans: { title: string; area: string; description: string; image?: string }[] =
    [];
  const layoutVariants: PropertyLayoutVariant[] = [];
  const configurations = dbRow.property_configurations as
    | Array<Record<string, unknown>>
    | undefined;

  if (Array.isArray(configurations) && configurations.length > 0) {
    [...configurations]
      .sort(
        (a, b) =>
          (Number(a.display_order) || 0) - (Number(b.display_order) || 0)
      )
      .forEach((cfg) => {
        const title =
          (typeof cfg.title === 'string' && cfg.title) ||
          (typeof cfg.tab_label === 'string' && cfg.tab_label) ||
          'Floor Plan';
        const area =
          (typeof cfg.area_range === 'string' && cfg.area_range) ||
          (typeof cfg.carpet_area === 'string' && cfg.carpet_area) ||
          '';
        floorPlans.push({
          title,
          area,
          description:
            (typeof cfg.tower_zone === 'string' && cfg.tower_zone) ||
            (typeof cfg.price_indicator === 'string' && cfg.price_indicator) ||
            '',
          image:
            typeof cfg.image_path === 'string' && cfg.image_path
              ? cfg.image_path
              : undefined,
        });

        const variantCode =
          typeof cfg.variant_code === 'string' ? cfg.variant_code : 'custom';
        layoutVariants.push({
          id: variantCode,
          tabLabel:
            (typeof cfg.tab_label === 'string' && cfg.tab_label) ||
            variantToBhkLabel(variantCode),
          title,
          area: area || (cfg.carpet_area ? `${cfg.carpet_area} sq.ft` : 'Area on request'),
          carpetArea:
            typeof cfg.carpet_area === 'string' && cfg.carpet_area
              ? `${cfg.carpet_area} Sq.Ft`
              : area,
          price:
            (typeof cfg.price_indicator === 'string' && cfg.price_indicator) ||
            'Price on Request',
          tower:
            (typeof cfg.tower_zone === 'string' && cfg.tower_zone) ||
            '—',
          image:
            (typeof cfg.image_path === 'string' && cfg.image_path) ||
            '/placeholder.png',
        });
      });
  }

  const highlights = Array.isArray(dbRow.highlights)
    ? (dbRow.highlights as string[]).filter(Boolean)
    : [];

  const amenityLinks = dbRow.property_amenities as
    | Array<{
        custom_label?: string | null;
        lookup_amenities?: { name?: string } | null;
      }>
    | undefined;
  const linkedAmenities: string[] = [];
  if (Array.isArray(amenityLinks)) {
    amenityLinks.forEach((row) => {
      if (row.custom_label?.trim()) linkedAmenities.push(row.custom_label.trim());
      else if (row.lookup_amenities?.name) linkedAmenities.push(row.lookup_amenities.name);
    });
  }
  const amenitiesList = linkedAmenities;

  const carpetRaw =
    dbRow.carpet_area_sqft != null
      ? Number(dbRow.carpet_area_sqft)
      : dbRow.carpet_area != null
        ? Number(dbRow.carpet_area)
        : 0;
  const carpetArea = Number.isFinite(carpetRaw) && carpetRaw > 0 ? carpetRaw : 0;
  const superRaw = dbRow.super_area != null ? Number(dbRow.super_area) : 0;
  const superArea = Number.isFinite(superRaw) && superRaw > 0 ? superRaw : 0;

  const firstConfigVariant =
    configurations?.[0] && typeof configurations[0].variant_code === 'string'
      ? configurations[0].variant_code
      : null;

  const localityName =
    lookupLocation?.name ||
    (typeof dbRow.locality === 'string' && dbRow.locality) ||
    (typeof dbRow.location_name === 'string' && dbRow.location_name) ||
    (typeof dbRow.sub_location === 'string' && dbRow.sub_location) ||
    'Worli';

  const possessionDate =
    typeof dbRow.possession_date === 'string'
      ? dbRow.possession_date
      : typeof dbRow.possession === 'string'
        ? dbRow.possession
        : undefined;

  return {
    id: String(dbRow.id),
    slug: String(dbRow.slug),
    title:
      (typeof dbRow.title === 'string' && dbRow.title) ||
      (typeof dbRow.name === 'string' && dbRow.name) ||
      'Prime Mumbai Residence',
    tagline: typeof dbRow.tagline === 'string' ? dbRow.tagline : '',
    metaTitle: typeof dbRow.meta_title === 'string' ? dbRow.meta_title : undefined,
    metaDescription: typeof dbRow.meta_description === 'string' ? dbRow.meta_description : undefined,
    location: normalizeLocality(localityName),
    subLocation:
      (typeof dbRow.sub_location === 'string' && dbRow.sub_location) ||
      (typeof dbRow.locality === 'string' && dbRow.locality) ||
      '',
    price,
    priceFormatted,
    bhk:
      joinBhkLabels(layoutVariants.map((v) => v.tabLabel)) ||
      lookupBhk?.name ||
      (typeof dbRow.bhk === 'string' && dbRow.bhk) ||
      (firstConfigVariant ? variantToBhkLabel(firstConfigVariant) : ''),
    carpetArea,
    areaText: layoutVariants[0]?.area !== 'Area on request' ? layoutVariants[0]?.area : undefined,
    superArea,
    propertyType: mapPropertyType(
      lookupType?.name ||
        (typeof dbRow.property_type === 'string' ? dbRow.property_type : null)
    ),
    possession: mapPossession(possessionDate, lookupStatus?.name),
    possessionDate,
    floor:
      (typeof dbRow.floor === 'string' && dbRow.floor) || '',
    featured: Boolean(dbRow.is_featured),
    recentlyAdded: Boolean(dbRow.recently_added),
    recommended: Boolean(dbRow.is_recommended),
    isNewLaunch: Boolean(dbRow.is_new_launch),
    isLuxuryCollection: Boolean(dbRow.is_luxury_collection),
    coverImage:
      coverFromRow || images[0] || '/placeholder.png',
    images:
      images.length > 0
        ? images
        : [coverFromRow || '/placeholder.png'],
    amenities: amenitiesList,
    description:
      (typeof dbRow.description === 'string' && dbRow.description) ||
      (typeof dbRow.project_overview === 'string' && dbRow.project_overview) ||
      '',
    highlights,
    reraId:
      (typeof dbRow.rera_id === 'string' && dbRow.rera_id) ||
      (typeof dbRow.rera_number === 'string' && dbRow.rera_number) ||
      '',
    reraQrImage:
      (typeof dbRow.rera_qr_image === 'string' && dbRow.rera_qr_image) ||
      (typeof dbRow.rera_qr_url === 'string' && dbRow.rera_qr_url) ||
      undefined,
    brochureUrl:
      typeof dbRow.brochure_url === 'string' ? dbRow.brochure_url : undefined,
    developerName:
      typeof dbRow.developer_name === 'string'
        ? dbRow.developer_name
        : undefined,
    developerDescription:
      typeof dbRow.developer_description === 'string'
        ? dbRow.developer_description
        : undefined,
    googleMapsUrl:
      typeof dbRow.google_maps_url === 'string'
        ? dbRow.google_maps_url
        : undefined,
    layoutVariants: layoutVariants.length > 0 ? layoutVariants : undefined,
    coordinates:
      dbRow.latitude != null && dbRow.longitude != null
        ? {
            lat: Number(dbRow.latitude),
            lng: Number(dbRow.longitude),
          }
        : undefined,
    floorPlans: floorPlans.length > 0 ? floorPlans : undefined,
  };
}

function publishedBaseFilter(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  select: string
) {
  // Source of truth after migration 006: publication_status + deleted_at.
  // Admin create dual-writes is_active from publication_status, and RLS still
  // gates anon SELECT on is_active=true AND deleted_at IS NULL.
  return supabase
    .from('properties')
    .select(select)
    .eq('publication_status', 'published')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });
}

export async function fetchPublishedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    console.error(
      '[properties] Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart `npm run dev`.'
    );
    return [];
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error('[properties] getSupabase() returned null despite configured env.');
    return [];
  }

  try {
    const primary = await publishedBaseFilter(supabase, PUBLISHED_PROPERTY_SELECT);

    if (primary.error) {
      logSupabaseError('fetchPublishedProperties primary select failed', primary.error);

      const fallback = await publishedBaseFilter(
        supabase,
        PUBLISHED_PROPERTY_SELECT_MINIMAL
      );

      if (fallback.error) {
        logSupabaseError('fetchPublishedProperties minimal select failed', fallback.error);

        const bare = await supabase
          .from('properties')
          .select('*')
          .eq('publication_status', 'published')
          .is('deleted_at', null)
          .order('sort_order', { ascending: true });

        if (bare.error) {
          logSupabaseError('fetchPublishedProperties bare select failed', bare.error);
          return [];
        }

        return mapRows(bare.data);
      }

      return mapRows(fallback.data);
    }

    return mapRows(primary.data);
  } catch (err) {
    console.error('[properties] fetchPublishedProperties threw:', err);
    return [];
  }
}

/**
 * Published listings for cards and lists (home, catalogue, locations, compare,
 * saved, similar). Use fetchPropertyBySlug for a full detail page.
 */
export async function fetchPropertyCards(): Promise<Property[]> {
  const supabase = isSupabaseConfigured() ? getSupabase() : null;
  if (!supabase) return fetchPublishedProperties();

  try {
    const { data, error } = await publishedBaseFilter(supabase, PROPERTY_CARD_SELECT);
    if (error) {
      logSupabaseError('fetchPropertyCards failed; falling back to full select', error);
      return fetchPublishedProperties();
    }
    return mapRows(data);
  } catch (err) {
    console.error('[properties] fetchPropertyCards threw:', err);
    return fetchPublishedProperties();
  }
}

export async function fetchPublishedPropertySlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    console.error('[properties] fetchPublishedPropertySlugs: Supabase not configured.');
    return [];
  }
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('properties')
    .select('slug')
    .eq('publication_status', 'published')
    .is('deleted_at', null);

  if (error) {
    logSupabaseError('fetchPublishedPropertySlugs failed', error);
    return [];
  }
  return (data ?? []).map((row) => row.slug as string);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) {
    console.error('[properties] fetchPropertyBySlug: Supabase not configured.');
    return null;
  }

  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select(PUBLISHED_PROPERTY_SELECT)
      .eq('slug', slug)
      .eq('publication_status', 'published')
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      logSupabaseError(`fetchPropertyBySlug(${slug}) primary failed`, error);
      const { data: fallback, error: fallbackError } = await supabase
        .from('properties')
        .select(PUBLISHED_PROPERTY_SELECT_MINIMAL)
        .eq('slug', slug)
        .eq('publication_status', 'published')
        .is('deleted_at', null)
        .maybeSingle();

      if (fallbackError) {
        logSupabaseError(`fetchPropertyBySlug(${slug}) minimal failed`, fallbackError);
        return null;
      }
      if (!fallback) return null;
      return mapDbPropertyToFrontend(fallback as unknown as Record<string, unknown>);
    }

    if (!data) return null;
    return mapDbPropertyToFrontend(data as unknown as Record<string, unknown>);
  } catch (err) {
    console.error(`[properties] fetchPropertyBySlug(${slug}) threw:`, err);
    return null;
  }
}

export function pickSimilarProperties(
  property: Property,
  catalog: Property[],
  limit = 3
): Property[] {
  return catalog
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.location === property.location ||
          p.propertyType === property.propertyType)
    )
    .slice(0, limit);
}

/** Homepage featured grid: prefer `featured` flags, then fill from catalog order. */
export function selectFeaturedProperties(
  catalog: Property[],
  maxCount: number
): Property[] {
  const featured = catalog.filter((p) => p.featured);
  const source = featured.length > 0 ? featured : catalog;
  return source.slice(0, Math.max(0, maxCount));
}
