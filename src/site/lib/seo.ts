import type { Metadata } from 'next';

/**
 * Site-wide SEO settings and helpers. Canonical URLs, Open Graph, robots and
 * JSON-LD all derive from here so every page stays consistent.
 *
 * NEXT_PUBLIC_SITE_URL      the public origin used for canonicals and the sitemap.
 * NEXT_PUBLIC_ALLOW_INDEXING "true" lets search engines index the site. Leave it
 *                            unset on preview/staging domains so they stay out of Google.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://parmarproperties-lisitng.vercel.app'
).replace(/\/+$/, '');

export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export const SITE_NAME = 'Parmar Properties';
export const DEFAULT_OG_IMAGE = '/logo.jpeg';

export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Parmar Properties',
  foundingDate: '1981',
  telephone: '+91-22-6666-9733',
  email: 'contact@parmarproperties.com',
  reraNumber: 'A51900018442',
  streetAddress: 'Peninsula Center, 208, Doctor SS Rao Marg, Parel',
  locality: 'Mumbai',
  region: 'Maharashtra',
  postalCode: '400012',
  country: 'IN',
  openingHours: 'Mo-Su 10:00-18:30',
} as const;

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Trims to a search-snippet-friendly length at a word boundary. */
export function clampDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
}

interface PageMetadataInput {
  /** Page title without the brand; the layout template appends " | Parmar Properties". */
  title: string;
  description: string;
  path: string;
  image?: string | null;
  /** Use when the stored title already carries the brand. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
  noindex = false,
  type = 'website',
}: PageMetadataInput): Metadata {
  const desc = clampDescription(description);
  const ogImage = image && !image.endsWith('/placeholder.png') ? image : DEFAULT_OG_IMAGE;
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    // Absolute so nested layouts can't drop the brand suffix from the template.
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_IN',
      title: fullTitle,
      description: desc,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Pages that must never appear in search (tools, personal lists, ad landing pages). */
export const NOINDEX: Metadata['robots'] = { index: false, follow: false };

// ---------------------------------------------------------------------------
// Structured data (schema.org JSON-LD)
// ---------------------------------------------------------------------------

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    foundingDate: BUSINESS.foundingDate,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    openingHours: BUSINESS.openingHours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    areaServed: [
      'South Mumbai', 'Worli', 'Malabar Hill', 'Prabhadevi', 'Lower Parel', 'Mahalaxmi',
      'Dadar', 'Parel', 'Byculla', 'Sewri', 'Tardeo', 'Girgaon', 'Cuffe Parade',
    ].map((name) => ({ '@type': 'Place', name })),
    identifier: { '@type': 'PropertyValue', name: 'MahaRERA', value: BUSINESS.reraNumber },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListJsonLd(name: string, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(item.path),
      name: item.name,
    })),
  };
}
