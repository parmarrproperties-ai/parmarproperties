import type { Metadata } from 'next';

import { JsonLd } from '@/site/components/seo/JsonLd';
import { fetchArticleBySlug } from '@/site/lib/supabase/insights';
import { NOINDEX, SITE_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from '@/site/lib/seo';

export const revalidate = 60;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return { title: 'Article not found', robots: NOINDEX };
  return pageMetadata({
    title: article.title,
    description: article.description || article.subtitle,
    path: `/market-intelligence/${article.slug}`,
    image: article.image,
    type: 'article',
  });
}

export default async function ArticleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const article = await fetchArticleBySlug(slug);
  const published =
    article?.date && !Number.isNaN(Date.parse(article.date)) ? new Date(article.date).toISOString() : undefined;
  return (
    <>
      {article ? (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: article.title,
              description: article.description || article.subtitle,
              ...(article.image ? { image: [absoluteUrl(article.image)] } : {}),
              ...(published ? { datePublished: published } : {}),
              author: { '@type': 'Person', name: article.author.name, jobTitle: article.author.role },
              publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
                logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.jpeg') },
              },
              mainEntityOfPage: absoluteUrl(`/market-intelligence/${article.slug}`),
            },
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Market Intelligence', path: '/market-intelligence' },
              { name: article.title, path: `/market-intelligence/${article.slug}` },
            ]),
          ]}
        />
      ) : null}
      {props.children}
    </>
  );
}
