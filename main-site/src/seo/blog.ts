// ============================================================
// src/seo/blog.ts — Per-post SEO: title, description, schema.
// Uses the post's own SEO fields when set in the admin editor,
// and falls back to the title / excerpt otherwise.
// ============================================================

import type { BlogPost } from "@/lib/types";
import type { SeoProps } from "./Seo";
import { blogPostingSchema, breadcrumbSchema, faqSchema, DEFAULT_AUTHOR } from "./schema";

const MAX_TITLE = 65;

export function postTitle(post: BlogPost): string {
  if (post.seo?.title) return post.seo.title;
  for (const suffix of [" | Parmar Properties", " | Parmar"]) {
    if (post.title.length + suffix.length <= MAX_TITLE) return post.title + suffix;
  }
  return post.title;
}

export function postDescription(post: BlogPost): string {
  return (post.seo?.description || post.excerpt || "").trim();
}

export function postAuthor(post: BlogPost) {
  return post.seo?.authorName
    ? { name: post.seo.authorName, role: post.seo.authorRole || "Parmar Properties" }
    : DEFAULT_AUTHOR;
}

export function postSeoProps(post: BlogPost): SeoProps {
  const path = `/blog/${post.slug}`;
  const faqs = post.seo?.faqs ?? [];
  return {
    title: postTitle(post),
    description: postDescription(post),
    path,
    type: "article",
    image: post.seo?.ogImageUrl || post.imageUrl || undefined,
    imageAlt: post.title,
    article: {
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      section: post.category || undefined,
      author: postAuthor(post).name,
    },
    jsonLd: [
      blogPostingSchema(post),
      breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path }]),
      ...(faqs.length ? [faqSchema(faqs)] : []),
    ],
  };
}
