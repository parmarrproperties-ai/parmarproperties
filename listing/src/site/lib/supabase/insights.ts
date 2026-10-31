import { getSupabase } from './client';

export interface InsightArticle {
  id: string;
  slug: string;
  category: string;
  categorySlug: 'location' | 'price' | 'buyer' | 'nri' | string;
  title: string;
  subtitle: string;
  description: string;
  readTime: string;
  tag: string;
  date: string;
  image?: string;
  author: {
    name: string;
    role: string;
    desk: string;
  };
  keyTakeaways: string[];
  sections: {
    heading: string;
    content: string[];
    tableData?: {
      headers: string[];
      rows: string[][];
    };
    highlight?: string;
  }[];
}

export function mapDbArticleToFrontend(row: Record<string, any>): InsightArticle {
  const rawSections = Array.isArray(row.sections) ? [...row.sections] : [];
  rawSections.sort(
    (a, b) => (a?.section_order ?? 0) - (b?.section_order ?? 0)
  );

  const sections = rawSections.map((sec: any) => ({
    heading: sec.heading,
    content: Array.isArray(sec.paragraphs) ? sec.paragraphs : [],
    tableData: sec.table_data
      ? {
          headers: sec.table_data.headers || [],
          rows: sec.table_data.rows || [],
        }
      : undefined,
    highlight: sec.highlight_quote || undefined,
  }));

  // Derive read time based on word count (Spec Section 3E)
  const totalWords =
    (row.description || '').split(/\s+/).length +
    sections.reduce(
      (acc: number, s: { content: string[] }) =>
        acc + s.content.join(' ').split(/\s+/).length,
      0
    );
  const readTime = `${Math.max(3, Math.ceil(totalWords / 180))} min read`;

  return {
    id: row.id,
    slug: row.slug,
    category: row.category_header || row.category?.name || 'MARKET INSIGHTS',
    categorySlug: row.category?.slug || 'location',
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    readTime,
    tag: row.tag || 'Analysis',
    date: row.date_tag || '2026 Benchmark',
    image: row.image_path || '/placeholder.png',
    author: {
      name: row.author_name || 'Advisory Research Desk',
      role: row.author_role || 'Head of Prime Residential Valuation',
      desk: row.author_desk || 'Parmar Properties Research',
    },
    keyTakeaways: Array.isArray(row.key_takeaways) ? row.key_takeaways : [],
    sections:
      sections.length > 0
        ? sections
        : [
            {
              heading: 'Executive Overview',
              content: [row.description || 'Detailed micro-market evaluation.'],
            },
          ],
  };
}

/**
 * Published Insights from CMS (`insights_articles`).
 * Never falls back to hardcoded article content.
 */
export async function fetchInsightsArticles(): Promise<InsightArticle[]> {
  const supabase = getSupabase();
  if (!supabase) {
    console.error(
      '[insights] Supabase is not configured; returning no published articles.'
    );
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('insights_articles')
      .select(
        '*, category:lookup_article_categories(name, slug), sections:article_sections(*)'
      )
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[insights] Failed to fetch published articles:', error.message);
      return [];
    }

    return (data ?? []).map(mapDbArticleToFrontend);
  } catch (err) {
    console.warn('[insights] Failed to fetch published articles:', err);
    return [];
  }
}

/**
 * Single published article by slug. Returns null when missing/unpublished.
 * Never substitutes a different static article.
 */
export async function fetchArticleBySlug(
  slug: string
): Promise<InsightArticle | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.error(
      `[insights] Supabase is not configured; cannot load article "${slug}".`
    );
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('insights_articles')
      .select(
        '*, category:lookup_article_categories(name, slug), sections:article_sections(*)'
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.warn(
        `[insights] Failed to fetch article "${slug}":`,
        error.message
      );
      return null;
    }

    if (!data) return null;
    return mapDbArticleToFrontend(data);
  } catch (err) {
    console.warn(`[insights] Failed to fetch article "${slug}":`, err);
    return null;
  }
}
