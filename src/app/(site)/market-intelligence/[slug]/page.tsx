import { notFound } from 'next/navigation';

import ArticleDetailClient from '@/site/components/insights/ArticleDetailClient';
import { fetchArticleBySlug, fetchInsightsArticles } from '@/site/lib/supabase/insights';

// Supabase fetches are cached by Next; without this a CMS edit never shows.
export const revalidate = 60;

export default async function ArticleDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  // Fetched on the server so the full article text ships in the HTML for search engines.
  const [article, allArticles] = await Promise.all([fetchArticleBySlug(slug), fetchInsightsArticles()]);
  if (!article) notFound();
  return <ArticleDetailClient key={slug} slug={slug} initialArticle={article} initialAllArticles={allArticles} />;
}
