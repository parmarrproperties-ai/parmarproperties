import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mockBlogPost, allMockPosts } from '../setup/fixtures';

vi.mock('@/hooks/useBlogPosts', () => ({ fetchPostBySlug: vi.fn(), fetchMoreArticles: vi.fn() }));
vi.mock('@/sections/Header/index', () => ({ Header: () => <header data-testid="header" /> }));
vi.mock('@/sections/Footer/index', () => ({ Footer: () => <footer data-testid="footer" /> }));
vi.mock('@/components/ScrollReveal', () => ({ ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/components/ScrollScrubRevealText', () => ({ ScrollScrubRevealText: ({ text }: { text: string }) => <span>{text}</span> }));

import { fetchPostBySlug, fetchMoreArticles } from '@/hooks/useBlogPosts';
import { BlogPostDetail } from '@/pages/BlogPostDetail';

const mockFetchPost = fetchPostBySlug as ReturnType<typeof vi.fn>;
const mockFetchMore = fetchMoreArticles as ReturnType<typeof vi.fn>;

function renderDetail(slug = 'mumbai-market-2025') {
  return render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes><Route path="/blog/:slug" element={<BlogPostDetail />} /></Routes>
    </MemoryRouter>
  );
}

describe('BlogPostDetail — loading state', () => {
  beforeEach(() => {
    mockFetchPost.mockReturnValue(new Promise(() => {}));
    mockFetchMore.mockReturnValue(new Promise(() => {}));
  });

  it('renders the loading skeleton', () => {
    const { container } = renderDetail();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('does not render the post title during loading', () => {
    renderDetail();
    expect(screen.queryByText(mockBlogPost.title)).not.toBeInTheDocument();
  });
});

describe('BlogPostDetail — not found', () => {
  beforeEach(() => { mockFetchPost.mockResolvedValue(null); mockFetchMore.mockResolvedValue([]); });

  it('shows "Post not found"', async () => {
    renderDetail('unknown-slug');
    await waitFor(() => expect(screen.getByText(/post not found/i)).toBeInTheDocument());
  });

  it('shows a "Back to Blog" link', async () => {
    renderDetail('unknown-slug');
    await waitFor(() => expect(screen.getByRole('link', { name: /back to blog/i })).toHaveAttribute('href', '/blog'));
  });
});

describe('BlogPostDetail — loaded', () => {
  beforeEach(() => {
    mockFetchPost.mockResolvedValue(mockBlogPost);
    mockFetchMore.mockResolvedValue([allMockPosts[1], allMockPosts[2]]);
  });

  it('renders the post title', async () => {
    renderDetail();
    await waitFor(() => expect(screen.getAllByText(mockBlogPost.title).length).toBeGreaterThanOrEqual(1));
  });

  it('renders intro paragraphs', async () => {
    renderDetail();
    await waitFor(() => expect(screen.getByText('The market is evolving rapidly.')).toBeInTheDocument());
  });

  it('renders section title and paragraphs', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('The Market Overview')).toBeInTheDocument();
      expect(screen.getByText('Mumbai residential prices rose 8% YoY.')).toBeInTheDocument();
    });
  });

  it('renders insight block', async () => {
    renderDetail();
    await waitFor(() => expect(screen.getByText(/invest before q3/i)).toBeInTheDocument());
  });

  it('renders downloads section', async () => {
    renderDetail();
    await waitFor(() => expect(screen.getByRole('link', { name: 'Full Report PDF' })).toHaveAttribute('href', '/reports/mumbai-2025.pdf'));
  });

  it('renders "More Articles" heading', async () => {
    renderDetail();
    await waitFor(() => expect(screen.getByText(/more articles/i)).toBeInTheDocument());
  });

  it('renders more articles cards', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText(allMockPosts[1].title)).toBeInTheDocument();
      expect(screen.getByText(allMockPosts[2].title)).toBeInTheDocument();
    });
  });

  it('renders a "See All Blogs" link to /blog', async () => {
    renderDetail();
    await waitFor(() => expect(screen.getByRole('link', { name: /see all blogs/i })).toHaveAttribute('href', '/blog'));
  });
});

describe('BlogPostDetail — scroll to top', () => {
  it('calls window.scrollTo on mount', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    mockFetchPost.mockResolvedValue(mockBlogPost);
    mockFetchMore.mockResolvedValue([]);
    renderDetail();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
  });
});
