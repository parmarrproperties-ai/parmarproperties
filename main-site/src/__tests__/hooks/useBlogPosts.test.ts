import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import '../setup/mockSupabase';
import { mockSupabase, makeQueryMock } from '../setup/mockSupabase';
import { mockPostRow, mockSection, mockBlogPost, allMockPosts } from '../setup/fixtures';
import type { PostRow, PostSectionRow } from '@/lib/types';

const { useBlogPosts, fetchPostBySlug, fetchMoreArticles } = await import('@/hooks/useBlogPosts');

function mockPostsAndSections(postRows: PostRow[], sectionRows: PostSectionRow[]) {
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === 'posts') return makeQueryMock({ data: postRows, error: null });
    if (table === 'post_sections') return makeQueryMock({ data: sectionRows, error: null });
    return makeQueryMock({ data: [], error: null });
  });
}

function mockPostsError(message: string) {
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === 'posts') return makeQueryMock({ data: null, error: { message } });
    return makeQueryMock({ data: [], error: null });
  });
}

describe('useBlogPosts()', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('starts in loading state', () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn(),
    });
    const { result } = renderHook(() => useBlogPosts());
    expect(result.current.loading).toBe(true);
    expect(result.current.posts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns posts after successful fetch', async () => {
    mockPostsAndSections([mockPostRow], [mockSection]);
    const { result } = renderHook(() => useBlogPosts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0].slug).toBe('mumbai-market-2025');
    expect(result.current.error).toBeNull();
  });

  it('attaches sections to the correct post', async () => {
    mockPostsAndSections([mockPostRow], [mockSection]);
    const { result } = renderHook(() => useBlogPosts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts[0].content?.sections).toHaveLength(1);
    expect(result.current.posts[0].content?.sections[0].title).toBe('The Market Overview');
  });

  it('returns empty posts array when no rows found', async () => {
    mockPostsAndSections([], []);
    const { result } = renderHook(() => useBlogPosts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toEqual([]);
  });

  it('sets error string on posts fetch failure', async () => {
    mockPostsError('Database connection refused');
    const { result } = renderHook(() => useBlogPosts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Database connection refused');
    expect(result.current.posts).toEqual([]);
  });
});

describe('fetchPostBySlug()', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns a mapped BlogPost for a valid published slug', async () => {
    mockPostsAndSections([mockPostRow], [mockSection]);
    const post = await fetchPostBySlug('mumbai-market-2025');
    expect(post).not.toBeNull();
    expect(post?.slug).toBe('mumbai-market-2025');
    expect(post?.content?.sections).toHaveLength(1);
  });

  it('returns null when slug is not found', async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'posts') return makeQueryMock({ data: null, error: { message: 'Not found' } });
      return makeQueryMock({ data: [], error: null });
    });
    const post = await fetchPostBySlug('non-existent-slug');
    expect(post).toBeNull();
  });

  it('returns null when Supabase returns null row', async () => {
    mockSupabase.from.mockImplementation(() => makeQueryMock({ data: null, error: null }));
    const post = await fetchPostBySlug('anything');
    expect(post).toBeNull();
  });

  it('works without sections', async () => {
    mockPostsAndSections([mockPostRow], []);
    const post = await fetchPostBySlug('mumbai-market-2025');
    expect(post?.content?.sections).toHaveLength(0);
  });
});

describe('fetchMoreArticles()', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('falls back to 3 most-recent other posts when no override', async () => {
    const otherRows = [
      { ...mockPostRow, id: 'p2', slug: 'p2', grid_order: 1 },
      { ...mockPostRow, id: 'p3', slug: 'p3', grid_order: 2 },
    ];
    mockPostsAndSections(otherRows, []);
    const more = await fetchMoreArticles(mockBlogPost);
    expect(more).toHaveLength(2);
  });

  it('uses override IDs when more_articles_override is set', async () => {
    const postWithOverride = { ...mockBlogPost, moreArticlesOverride: ['post-2', 'post-3'] };
    const overrideRows = [
      { ...mockPostRow, id: 'post-2', slug: 'buying-guide-2025' },
      { ...mockPostRow, id: 'post-3', slug: 'lifestyle-luxury' },
    ];
    mockPostsAndSections(overrideRows, []);
    const more = await fetchMoreArticles(postWithOverride);
    expect(more[0].id).toBe('post-2');
    expect(more[1].id).toBe('post-3');
  });

  it('returns empty array when no other posts exist', async () => {
    mockPostsAndSections([], []);
    const more = await fetchMoreArticles(mockBlogPost);
    expect(more).toEqual([]);
  });
});
