// ============================================================
// src/lib/types.ts — Canonical types for the blog system
// Mirrors the Supabase postgres schema 1-to-1.
// content.ts re-exports BlogPost for backward compatibility.
// ============================================================

// ─── Database shape (used by createClient<Database>) ────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: PostRow;
        Insert: Omit<PostRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PostRow, "id" | "created_at">>;
      };
      post_sections: {
        Row: PostSectionRow;
        Insert: Omit<PostSectionRow, "id">;
        Update: Partial<Omit<PostSectionRow, "id">>;
      };
    };
  };
}

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image_url: string;
  category: string | null;
  intro: string[];
  downloads: { label: string; href: string }[];
  featured: boolean;
  status: "draft" | "published";
  grid_order: number;
  more_articles_override: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PostSectionRow {
  id: string;
  post_id: string;
  order: number;
  title: string | null;
  paragraphs: string[];
  insight: string | null;
}

// ─── App-level BlogPost type (replaces the inline type in content.ts) ─

export type BlogPost = {
  // Core fields (mapped from PostRow)
  id: string;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  href: string; // derived: `/blog/${slug}`
  category: string | null;
  featured: boolean;
  status: "draft" | "published";
  gridOrder: number;
  moreArticlesOverride: string[] | null;
  // Rich content
  content?: {
    intro: string[];
    sections: {
      id: string;
      order: number;
      title?: string;
      paragraphs: string[];
      insight?: string;
    }[];
    downloads?: { label: string; href: string }[];
  };
};

// ─── Helpers ─────────────────────────────────────────────────

/** Map a raw Supabase PostRow + sections into the app-level BlogPost shape. */
export function mapPost(
  row: PostRow,
  sections: PostSectionRow[] = []
): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    date: row.date,
    title: row.title,
    excerpt: row.excerpt,
    imageUrl: row.image_url,
    href: `/blog/${row.slug}`,
    category: row.category,
    featured: row.featured,
    status: row.status,
    gridOrder: row.grid_order,
    moreArticlesOverride: row.more_articles_override,
    content: {
      intro: row.intro ?? [],
      sections: sections
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
          id: s.id,
          order: s.order,
          title: s.title ?? undefined,
          paragraphs: s.paragraphs ?? [],
          insight: s.insight ?? undefined,
        })),
      downloads: row.downloads?.length ? row.downloads : undefined,
    },
  };
}
