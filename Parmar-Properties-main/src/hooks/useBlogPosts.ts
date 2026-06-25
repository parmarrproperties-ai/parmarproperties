// ============================================================
// src/hooks/useBlogPosts.ts — Live Supabase data hooks
// ============================================================

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { mapPost } from "@/lib/types";
import type { BlogPost, PostRow } from "@/lib/types";

// ─── useBlogPosts ──────────────────────────────────────────
// Returns all published posts ordered by grid_order, with their sections.

export function useBlogPosts(): {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
} {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      // Fetch all published posts
      const { data: postRows, error: postErr } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("grid_order", { ascending: true });

      if (postErr) {
        if (!cancelled) setError(postErr.message);
        setLoading(false);
        return;
      }
      if (!postRows?.length) {
        if (!cancelled) { setPosts([]); setLoading(false); }
        return;
      }

      // Fetch all sections for those posts in one query
      const postIds = postRows.map((p) => p.id);
      const { data: sectionRows, error: secErr } = await supabase
        .from("post_sections")
        .select("*")
        .in("post_id", postIds)
        .order("order", { ascending: true });

      if (secErr) {
        if (!cancelled) setError(secErr.message);
        setLoading(false);
        return;
      }

      const sectionsByPost = (sectionRows ?? []).reduce<
        Record<string, typeof sectionRows>
      >((acc, s) => {
        if (!acc[s.post_id]) acc[s.post_id] = [];
        acc[s.post_id].push(s);
        return acc;
      }, {});

      const mapped = postRows.map((row) =>
        mapPost(row, sectionsByPost[row.id] ?? [])
      );

      if (!cancelled) {
        setPosts(mapped);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}

// ─── useAllPostsAdmin ──────────────────────────────────────
// Returns ALL posts (draft + published) for the admin dashboard.

export function useAllPostsAdmin(): {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: postRows, error: postErr } = await supabase
        .from("posts")
        .select("*")
        .order("grid_order", { ascending: true });

      if (postErr) {
        if (!cancelled) setError(postErr.message);
        setLoading(false);
        return;
      }
      if (!postRows?.length) {
        if (!cancelled) { setPosts([]); setLoading(false); }
        return;
      }

      const postIds = postRows.map((p) => p.id);
      const { data: sectionRows } = await supabase
        .from("post_sections")
        .select("*")
        .in("post_id", postIds)
        .order("order", { ascending: true });

      const sectionsByPost = (sectionRows ?? []).reduce<
        Record<string, typeof sectionRows>
      >((acc, s) => {
        if (!acc[s.post_id]) acc[s.post_id] = [];
        acc[s.post_id].push(s);
        return acc;
      }, {});

      const mapped = postRows.map((row) =>
        mapPost(row, sectionsByPost[row.id] ?? [])
      );

      if (!cancelled) {
        setPosts(mapped);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick]);

  return { posts, loading, error, refetch: () => setTick((t) => t + 1) };
}

export function useCategoriesAdmin() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("category")
        .not("category", "is", null);
      
      if (!cancelled && data) {
        const unique = Array.from(new Set(data.map((d) => d.category as string))).filter(Boolean).sort();
        setCategories(unique);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [tick]);

  return { categories, loading, refetchCategories: () => setTick((t) => t + 1) };
}

export async function deleteCategoryAdmin(category: string) {
  await supabase.from("posts").delete().eq("category", category);
}

export async function editCategoryAdmin(oldName: string, newName: string) {
  await supabase.from("posts").update({ category: newName }).eq("category", oldName);
}

// ─── fetchPostBySlug ──────────────────────────────────────
// Async helper — call once on mount in BlogPostDetail.
// Returns null if not found.

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data: row, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !row) return null;

  const { data: sectionRows } = await supabase
    .from("post_sections")
    .select("*")
    .eq("post_id", row.id)
    .order("order", { ascending: true });

  return mapPost(row, sectionRows ?? []);
}

// ─── fetchPostBySlugAdmin ──────────────────────────────────
// Admin-only helper that loads drafts and published posts.
export async function fetchPostBySlugAdmin(slug: string): Promise<BlogPost | null> {
  const { data: row, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !row) return null;

  const { data: sectionRows } = await supabase
    .from("post_sections")
    .select("*")
    .eq("post_id", row.id)
    .order("order", { ascending: true });

  return mapPost(row as PostRow, sectionRows ?? []);
}

// ─── fetchMoreArticles ────────────────────────────────────
// Returns the "More Articles" posts for a given post:
//   - uses more_articles_override if set (up to 3 pinned post IDs)
//   - falls back to the 3 most recent other published posts

export async function fetchMoreArticles(post: BlogPost): Promise<BlogPost[]> {
  if (post.moreArticlesOverride?.length) {
    const ids = post.moreArticlesOverride.slice(0, 3);
    const { data: rows } = await supabase
      .from("posts")
      .select("*")
      .in("id", ids)
      .eq("status", "published");

    if (rows?.length) {
      const postIds = rows.map((r) => r.id);
      const { data: sectionRows } = await supabase
        .from("post_sections")
        .select("*")
        .in("post_id", postIds);

      const sectionsByPost = (sectionRows ?? []).reduce<
        Record<string, typeof sectionRows>
      >((acc, s) => {
        if (!acc[s.post_id]) acc[s.post_id] = [];
        acc[s.post_id].push(s);
        return acc;
      }, {});

      // Return in the same order as the override list
      return ids
        .map((id) => rows.find((r) => r.id === id))
        .filter(Boolean)
        .map((r) => mapPost(r!, sectionsByPost[r!.id] ?? []));
    }
  }

  // Fallback: most recent other published posts
  const { data: rows } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .neq("id", post.id)
    .order("date", { ascending: false })
    .limit(3);

  if (!rows?.length) return [];

  const postIds = rows.map((r) => r.id);
  const { data: sectionRows } = await supabase
    .from("post_sections")
    .select("*")
    .in("post_id", postIds);

  const sectionsByPost = (sectionRows ?? []).reduce<
    Record<string, typeof sectionRows>
  >((acc, s) => {
    if (!acc[s.post_id]) acc[s.post_id] = [];
    acc[s.post_id].push(s);
    return acc;
  }, {});

  return rows.map((r) => mapPost(r, sectionsByPost[r.id] ?? []));
}
