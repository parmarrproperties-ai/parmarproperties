import { getSupabase } from './client';
import { HOME_PAGE_CONTENT } from '@/site/data/content/home.content';
import { HERO_SLIDES, type HeroSlideData } from '@/site/lib/constants';
import { fetchHomePageContent } from './page-content';
import { fetchLookupBhk, fetchLookupConstructionStatus } from './lookups';

export interface HeroCmsSlide extends HeroSlideData {
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export interface HeroFilterOption {
  label: string;
  val: string;
  slug?: string;
  tab?: 'buy' | 'new-launches' | 'luxury-collection';
}

export interface HeroCmsContent {
  headline: string;
  subtext: string;
  slideDurationMs: number;
  slides: HeroCmsSlide[];
  locationOptions: HeroFilterOption[];
  bhkOptions: HeroFilterOption[];
  statusOptions: HeroFilterOption[];
  budgetMin: number;
  budgetMax: number;
  budgetStep: number;
}

function mapHeroSlide(row: Record<string, any>, index: number): HeroCmsSlide {
  const image = row.image_url || row.image_path || HERO_SLIDES[index]?.image || HERO_SLIDES[0].image;
  return {
    id: typeof row.display_order === 'number' ? row.display_order + 1 : index + 1,
    image,
    tagline: row.heading || HERO_SLIDES[index]?.tagline || HERO_SLIDES[0].tagline,
    subtext: row.supporting_text || HERO_SLIDES[index]?.subtext || HERO_SLIDES[0].subtext,
    alt: row.heading || HERO_SLIDES[index]?.alt || `Hero slide ${index + 1}`,
    ctaLabel: row.cta_label ?? null,
    ctaUrl: row.cta_url ?? null,
  };
}

function statusTab(slug: string): 'buy' | 'new-launches' | 'luxury-collection' {
  if (slug === 'luxury-collection') return 'luxury-collection';
  if (slug === 'pre-launch' || slug === 'under-construction') return 'new-launches';
  return 'buy';
}

function bhkFilterValue(name: string, slug: string): string {
  if (slug === 'any') return 'Any';
  // Properties page matches with `p.bhk.includes(selectedBhk)`.
  if (slug === '6-plus-bhk') return '6';
  return name;
}

export async function fetchHeroContent(): Promise<HeroCmsContent> {
  const home = await fetchHomePageContent();
  const [bhkLookups, statusLookups] = await Promise.all([
    fetchLookupBhk(),
    fetchLookupConstructionStatus(),
  ]);

  const bhkOptions: HeroFilterOption[] = [
    { label: 'Any Configuration', val: 'Any', slug: 'any' },
    ...bhkLookups
      .filter((item) => item.slug !== 'any')
      .map((item) => ({
        label: item.name,
        val: bhkFilterValue(item.name, item.slug),
        slug: item.slug,
      })),
  ];

  const statusOptions: HeroFilterOption[] = [
    { label: 'All Status', val: 'All', slug: 'all', tab: 'buy' },
    ...statusLookups.map((item) => ({
      label: item.name,
      val: item.name,
      slug: item.slug,
      tab: statusTab(item.slug),
    })),
  ];

  const fallback: HeroCmsContent = {
    headline: home.heroHeadline,
    subtext: home.heroSubtext,
    slideDurationMs: home.heroSlideDurationMs,
    slides: HERO_SLIDES,
    locationOptions: HOME_PAGE_CONTENT.hero.searchConsole.locationFilter.options.map((o) => ({
      label: o.label,
      val: o.value,
    })),
    bhkOptions,
    statusOptions,
    budgetMin: home.searchMinBudgetCr,
    budgetMax: home.searchMaxBudgetCr,
    budgetStep: home.searchBudgetStepCr || 1,
  };

  const supabase = getSupabase();
  if (!supabase) return fallback;

  try {
    const [slidesRes, locationsRes] = await Promise.all([
      supabase
        .from('hero_slides')
        .select(
          'heading, supporting_text, cta_label, cta_url, image_path, image_url, is_active, display_order'
        )
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      supabase
        .from('locations')
        .select('name, slug, is_active, publication_status, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);

    const slides =
      !slidesRes.error && slidesRes.data && slidesRes.data.length > 0
        ? slidesRes.data.map(mapHeroSlide)
        : HERO_SLIDES;

    // Successful CMS read wins even when the active set is empty — never revive
    // hardcoded location names that Admin marked inactive.
    const locationOptions = !locationsRes.error
      ? [
          { label: 'All Prime Locations', val: '' },
          ...(locationsRes.data ?? [])
            .filter((l) => !l.publication_status || l.publication_status === 'published')
            .map((l) => ({
              label: l.name as string,
              val: l.name as string,
              slug: l.slug as string,
            })),
        ]
      : fallback.locationOptions;

    return {
      headline: home.heroHeadline || slides[0]?.tagline || fallback.headline,
      subtext: home.heroSubtext || slides[0]?.subtext || fallback.subtext,
      slideDurationMs: home.heroSlideDurationMs || fallback.slideDurationMs,
      slides,
      locationOptions,
      bhkOptions,
      statusOptions,
      budgetMin: home.searchMinBudgetCr,
      budgetMax: home.searchMaxBudgetCr,
      budgetStep: home.searchBudgetStepCr || 1,
    };
  } catch (err) {
    console.warn('Failed to fetch hero content from Supabase, using fallback:', err);
    return fallback;
  }
}
