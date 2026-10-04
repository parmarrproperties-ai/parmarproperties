// ============================================================
// src/seo/schema.ts — JSON-LD (schema.org) builders.
// ============================================================

import { site, absoluteUrl, SITE_URL } from "./site";
import type { BlogPost } from "@/lib/types";

export type JsonLd = Record<string, unknown>;
export type Faq = { question: string; answer: string };

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const postalAddress = () => ({ "@type": "PostalAddress", ...site.address });

/** Reference to the organization entity (use inside other schemas). */
export const orgRef = () => ({ "@id": ORG_ID });

export const organizationSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "Organization"],
  "@id": ORG_ID,
  name: site.name,
  legalName: site.legalName,
  alternateName: site.alternateName,
  slogan: site.slogan,
  description: site.description,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: absoluteUrl(site.logoPath) },
  image: absoluteUrl(site.defaultOgImagePath),
  foundingDate: site.foundingDate,
  email: site.email,
  telephone: site.officePhone,
  address: postalAddress(),
  hasMap: site.mapsUrl,
  areaServed: site.areaServed.map((name) => ({ "@type": "Place", name: `${name}, Mumbai` })),
  knowsAbout: site.knowsAbout,
  founder: { "@type": "Person", name: site.founders[0].name },
  employee: site.founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.jobTitle })),
  contactPoint: [
    { "@type": "ContactPoint", telephone: site.officePhone, contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Hindi", "Marathi", "Gujarati"] },
    ...site.phones.map((telephone) => ({ "@type": "ContactPoint", telephone, contactType: "sales", areaServed: ["IN", "AE", "GB", "US", "SG"] })),
  ],
  ...(site.rera ? { identifier: { "@type": "PropertyValue", propertyID: "MahaRERA", value: site.rera } } : {}),
  sameAs: site.sameAs,
});

export const websiteSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: site.name,
  description: site.description,
  inLanguage: "en-IN",
  publisher: orgRef(),
});

export const webPageSchema = (opts: { type?: string; path: string; title: string; description: string }): JsonLd => ({
  "@context": "https://schema.org",
  "@type": opts.type || "WebPage",
  "@id": `${absoluteUrl(opts.path)}#webpage`,
  url: absoluteUrl(opts.path),
  name: opts.title,
  description: opts.description,
  inLanguage: "en-IN",
  isPartOf: { "@id": WEBSITE_ID },
  about: orgRef(),
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqSchema = (faqs: Faq[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

export const personSchemas = (): JsonLd[] =>
  site.founders.map((f) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: f.name,
    jobTitle: f.jobTitle,
    description: f.description,
    worksFor: orgRef(),
    url: absoluteUrl("/about"),
  }));

export const serviceSchema = (opts: { name: string; path: string; description: string; serviceType: string }): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: opts.name,
  serviceType: opts.serviceType,
  description: opts.description,
  url: absoluteUrl(opts.path),
  provider: orgRef(),
  areaServed: { "@type": "City", name: "Mumbai" },
});

export const DEFAULT_AUTHOR = { name: "Parmar Properties Advisory Team", role: "South Mumbai real estate advisors" };

export const blogPostingSchema = (post: BlogPost): JsonLd => {
  const path = `/blog/${post.slug}`;
  const author = post.seo?.authorName
    ? { "@type": "Person", name: post.seo.authorName, jobTitle: post.seo.authorRole || undefined, worksFor: orgRef(), url: absoluteUrl("/about") }
    : { "@type": "Organization", name: DEFAULT_AUTHOR.name, url: absoluteUrl("/about"), parentOrganization: orgRef() };
  const words = [
    ...(post.content?.intro ?? []),
    ...(post.content?.sections ?? []).flatMap((s) => [s.title ?? "", ...s.paragraphs, s.insight ?? ""]),
  ].join(" ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(path)}#article`,
    mainEntityOfPage: absoluteUrl(path),
    headline: post.title.slice(0, 110),
    description: post.seo?.description || post.excerpt,
    image: post.seo?.ogImageUrl || post.imageUrl ? [post.seo?.ogImageUrl || post.imageUrl] : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    articleSection: post.category || undefined,
    inLanguage: "en-IN",
    wordCount: words || undefined,
    author,
    publisher: orgRef(),
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
    about: { "@type": "Place", name: "Mumbai" },
    citation: post.seo?.sources?.length ? post.seo.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })) : undefined,
  };
};

export const blogSchema = (posts: BlogPost[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/blog#blog`,
  url: absoluteUrl("/blog"),
  name: "Parmar Properties Blog — Mumbai Luxury Real Estate Insights",
  publisher: orgRef(),
  inLanguage: "en-IN",
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: absoluteUrl(`/blog/${p.slug}`),
    datePublished: p.date,
    dateModified: p.updatedAt || p.date,
    image: p.imageUrl || undefined,
  })),
});
