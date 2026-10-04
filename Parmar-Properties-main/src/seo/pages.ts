// ============================================================
// src/seo/pages.ts — Title and meta description for every static page.
// Titles: aim for 50–60 characters. Descriptions: 140–160 characters.
// (src/__tests__/seo/pages.test.ts checks these limits.)
// Blog post metadata comes from each post (see src/seo/blog.ts).
// ============================================================

import { servicePages } from "@/content/services";

export type PageMeta = { path: string; title: string; description: string; h1?: string };

export const pages = {
  home: {
    path: "/",
    title: "South Mumbai Luxury Real Estate Advisors | Parmar Properties",
    description:
      "Since 1981, Parmar Properties has helped 5,124+ families buy, sell and lease luxury homes in Worli, Malabar Hill and across South Mumbai. Talk to an advisor.",
  },
  about: {
    path: "/about",
    title: "About Us | Parmar Properties, South Mumbai Since 1981",
    description:
      "Meet the Parmar family behind Parmar Properties — South Mumbai real estate advisors since 1981, with 1,289+ residential and 328+ commercial deals closed.",
  },
  blog: {
    path: "/blog",
    title: "Mumbai Luxury Real Estate Blog & Buyer Guides | Parmar",
    description:
      "Market insights, location guides and buyer checklists for luxury property in Mumbai — Worli, Malabar Hill, Mahalaxmi, NRI buying, payment plans and more.",
  },
  services: {
    path: "/services",
    title: "Luxury Real Estate Services in South Mumbai | Parmar",
    description:
      "Buy, sell or lease luxury homes and commercial property in South Mumbai, or invest as an NRI, with Parmar Properties — trusted advisors since 1981.",
  },
  contact: {
    path: "/contact",
    title: "Contact Parmar Properties | Parel Office, Phone & WhatsApp",
    description:
      "Visit Parmar Properties at 208 Peninsula Centre, Parel, Mumbai 400012, call +91 22 6666 9733 or WhatsApp +91 93222 32899 to speak to a property advisor.",
  },
  faq: {
    path: "/faq",
    title: "Luxury Property FAQs: Buying, Selling & NRI | Parmar",
    description:
      "Answers to common questions on buying, selling and leasing luxury property in South Mumbai — MahaRERA checks, payment plans, NRI rules and our services.",
  },
  privacy: {
    path: "/privacy-policy",
    title: "Privacy Policy | Parmar Properties",
    description:
      "How Parmar Properties & Infrastructure Pvt. Ltd. collects, uses and protects personal information shared through parmarproperties.in and our advisors.",
  },
  terms: {
    path: "/terms-of-service",
    title: "Terms and Conditions | Parmar Properties",
    description:
      "Terms and conditions for using parmarproperties.in, including property listing disclaimers, user responsibilities, intellectual property and third-party links.",
  },
  newsletter: {
    path: "/newsletter-confirmed",
    title: "Subscription Confirmed | Parmar Properties",
    description: "Thank you for subscribing to Parmar Properties updates on South Mumbai luxury real estate.",
  },
  notFound: {
    path: "/404",
    title: "Page Not Found | Parmar Properties",
    description: "The page you are looking for does not exist. Explore South Mumbai luxury property services, buyer guides and contact details at Parmar Properties.",
  },
} satisfies Record<string, PageMeta>;

export const servicePageMeta = (slug: string): PageMeta | null => {
  const s = servicePages.find((p) => p.slug === slug);
  return s ? { path: `/services/${s.slug}`, title: s.seoTitle, description: s.seoDescription } : null;
};

/** Every static, indexable route — used by the prerender script and sitemap. */
export const staticRoutes: string[] = [
  "/", "/about", "/services", ...servicePages.map((s) => `/services/${s.slug}`),
  "/blog", "/faq", "/contact", "/privacy-policy", "/terms-of-service",
];
