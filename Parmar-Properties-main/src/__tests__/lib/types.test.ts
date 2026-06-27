import { describe, it, expect } from 'vitest';
import { mapPost } from '@/lib/types';
import { mockPostRow, mockSection } from '../setup/fixtures';

describe('mapPost()', () => {
  it('maps core PostRow fields correctly', () => {
    const post = mapPost(mockPostRow, []);
    expect(post.id).toBe('post-1');
    expect(post.slug).toBe('mumbai-market-2025');
    expect(post.imageUrl).toBe(mockPostRow.image_url);
    expect(post.href).toBe('/blog/mumbai-market-2025');
    expect(post.gridOrder).toBe(mockPostRow.grid_order);
    expect(post.moreArticlesOverride).toBeNull();
  });

  it('derives href from slug', () => {
    const post = mapPost({ ...mockPostRow, slug: 'test-slug' }, []);
    expect(post.href).toBe('/blog/test-slug');
  });

  it('produces an empty sections array when no sections provided', () => {
    const post = mapPost(mockPostRow, []);
    expect(post.content?.sections).toHaveLength(0);
  });

  it('maps sections and sorts them by order ascending', () => {
    const sec2 = { ...mockSection, id: 'sec-2', order: 2, title: 'Second' };
    const sec1 = { ...mockSection, id: 'sec-1', order: 1, title: 'First' };
    const post = mapPost(mockPostRow, [sec2, sec1]);
    expect(post.content?.sections[0].title).toBe('First');
    expect(post.content?.sections[1].title).toBe('Second');
  });

  it('converts null section title to undefined', () => {
    const noTitle = { ...mockSection, title: null };
    const post = mapPost(mockPostRow, [noTitle]);
    expect(post.content?.sections[0].title).toBeUndefined();
  });

  it('converts null section insight to undefined', () => {
    const noInsight = { ...mockSection, insight: null };
    const post = mapPost(mockPostRow, [noInsight]);
    expect(post.content?.sections[0].insight).toBeUndefined();
  });

  it('sets downloads to undefined when the array is empty', () => {
    const post = mapPost({ ...mockPostRow, downloads: [] }, []);
    expect(post.content?.downloads).toBeUndefined();
  });

  it('preserves downloads when non-empty', () => {
    const dl = [{ label: 'Report', href: '/r.pdf' }];
    const post = mapPost({ ...mockPostRow, downloads: dl }, []);
    expect(post.content?.downloads).toEqual(dl);
  });

  it('uses empty array for intro when PostRow.intro is null', () => {
    // @ts-ignore — testing defensive null handling at runtime
    const post = mapPost({ ...mockPostRow, intro: null }, []);
    expect(post.content?.intro).toEqual([]);
  });
});
