import { getSupabase } from './client';
import { HOME_PAGE_CONTENT } from '@/site/data/content/home.content';

export interface HomeWhyPillar {
  number: string;
  subtitle: string;
  title: string;
  description: string;
  badge: string;
}

export interface HomeTrustMetric {
  value: string;
  label: string;
  sub: string;
}

export interface HomePageCms {
  heroHeadline: string;
  heroSubtext: string;
  heroSlideDurationMs: number;
  searchMinBudgetCr: number;
  searchMaxBudgetCr: number;
  searchBudgetStepCr: number;
  whyBadge: string;
  whyTitlePrefix: string;
  whyTitleHighlight: string;
  whySubtitle: string;
  whyCtaText: string;
  whyCtaLink: string;
  whyPillars: HomeWhyPillar[];
  whyTrustMetrics: HomeTrustMetric[];
  miBadge: string;
  miHeading: string;
  miSubheading: string;
  miViewAllText: string;
  miViewAllLink: string;
}

const FALLBACK_HOME_CMS: HomePageCms = {
  heroHeadline: HOME_PAGE_CONTENT.hero.headline,
  heroSubtext: HOME_PAGE_CONTENT.hero.subtext,
  heroSlideDurationMs: HOME_PAGE_CONTENT.hero.slideDurationMs,
  searchMinBudgetCr: HOME_PAGE_CONTENT.hero.searchConsole.budgetSlider.minCrores,
  searchMaxBudgetCr: HOME_PAGE_CONTENT.hero.searchConsole.budgetSlider.maxCrores,
  searchBudgetStepCr: HOME_PAGE_CONTENT.hero.searchConsole.budgetSlider.stepCrores || 1,
  whyBadge: HOME_PAGE_CONTENT.whyParmar.badge,
  whyTitlePrefix: HOME_PAGE_CONTENT.whyParmar.titlePrefix,
  whyTitleHighlight: HOME_PAGE_CONTENT.whyParmar.titleHighlight,
  whySubtitle: HOME_PAGE_CONTENT.whyParmar.subtitle,
  whyCtaText: HOME_PAGE_CONTENT.whyParmar.ctaButton.text,
  whyCtaLink: HOME_PAGE_CONTENT.whyParmar.ctaButton.link,
  whyPillars: HOME_PAGE_CONTENT.whyParmar.pillars.map((p) => ({
    number: p.number,
    subtitle: p.subtitle,
    title: p.title,
    description: p.description,
    badge: p.badge,
  })),
  whyTrustMetrics: HOME_PAGE_CONTENT.whyParmar.trustMetrics.map((m) => ({
    value: m.value,
    label: m.label,
    sub: m.sub,
  })),
  miBadge: HOME_PAGE_CONTENT.marketIntelligence.badge,
  miHeading: HOME_PAGE_CONTENT.marketIntelligence.heading,
  miSubheading: HOME_PAGE_CONTENT.marketIntelligence.subheading,
  miViewAllText: HOME_PAGE_CONTENT.marketIntelligence.viewAllLink.text,
  miViewAllLink: HOME_PAGE_CONTENT.marketIntelligence.viewAllLink.link,
};

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function mapPillars(value: unknown): HomeWhyPillar[] {
  if (!Array.isArray(value) || value.length === 0) return FALLBACK_HOME_CMS.whyPillars;
  return value.map((raw, idx) => {
    const row = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const fallback = FALLBACK_HOME_CMS.whyPillars[idx] || FALLBACK_HOME_CMS.whyPillars[0];
    return {
      number: asString(row.number, fallback.number),
      subtitle: asString(row.subtitle, fallback.subtitle),
      title: asString(row.title, fallback.title),
      description: asString(row.description, fallback.description),
      badge: asString(row.badge, fallback.badge),
    };
  });
}

function mapMetrics(value: unknown): HomeTrustMetric[] {
  if (!Array.isArray(value) || value.length === 0) return FALLBACK_HOME_CMS.whyTrustMetrics;
  return value.map((raw, idx) => {
    const row = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const fallback = FALLBACK_HOME_CMS.whyTrustMetrics[idx] || FALLBACK_HOME_CMS.whyTrustMetrics[0];
    return {
      value: asString(row.value, fallback.value),
      label: asString(row.label, fallback.label),
      sub: asString(row.sub, fallback.sub),
    };
  });
}

export function mapHomePageContent(row: Record<string, any> | null | undefined): HomePageCms {
  const sections = (row?.sections_data || {}) as Record<string, unknown>;
  return {
    heroHeadline: asString(sections.hero_headline ?? row?.title, FALLBACK_HOME_CMS.heroHeadline),
    heroSubtext: asString(sections.hero_subtext ?? row?.subtitle, FALLBACK_HOME_CMS.heroSubtext),
    heroSlideDurationMs: asNumber(sections.hero_slide_duration_ms, FALLBACK_HOME_CMS.heroSlideDurationMs),
    searchMinBudgetCr: asNumber(sections.search_min_budget_cr, FALLBACK_HOME_CMS.searchMinBudgetCr),
    searchMaxBudgetCr: asNumber(sections.search_max_budget_cr, FALLBACK_HOME_CMS.searchMaxBudgetCr),
    searchBudgetStepCr: asNumber(sections.search_budget_step_cr, FALLBACK_HOME_CMS.searchBudgetStepCr),
    whyBadge: asString(sections.why_badge, FALLBACK_HOME_CMS.whyBadge),
    whyTitlePrefix: asString(sections.why_title_prefix, FALLBACK_HOME_CMS.whyTitlePrefix),
    whyTitleHighlight: asString(sections.why_title_highlight, FALLBACK_HOME_CMS.whyTitleHighlight),
    whySubtitle: asString(sections.why_subtitle, FALLBACK_HOME_CMS.whySubtitle),
    whyCtaText: asString(sections.why_cta_text, FALLBACK_HOME_CMS.whyCtaText),
    whyCtaLink: asString(sections.why_cta_link, FALLBACK_HOME_CMS.whyCtaLink),
    whyPillars: mapPillars(sections.why_pillars),
    whyTrustMetrics: mapMetrics(sections.why_trust_metrics),
    miBadge: asString(sections.mi_badge, FALLBACK_HOME_CMS.miBadge),
    miHeading: asString(sections.mi_heading, FALLBACK_HOME_CMS.miHeading),
    miSubheading: asString(sections.mi_subheading, FALLBACK_HOME_CMS.miSubheading),
    miViewAllText: asString(sections.mi_view_all_text, FALLBACK_HOME_CMS.miViewAllText),
    miViewAllLink: asString(sections.mi_view_all_link, FALLBACK_HOME_CMS.miViewAllLink),
  };
}

export async function fetchHomePageContent(): Promise<HomePageCms> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_HOME_CMS;

  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('id, title, subtitle, badge, sections_data')
      .eq('id', 'home')
      .maybeSingle();

    if (error || !data) return FALLBACK_HOME_CMS;
    return mapHomePageContent(data);
  } catch (err) {
    console.warn('Failed to fetch home page_content from Supabase, using fallback:', err);
    return FALLBACK_HOME_CMS;
  }
}
