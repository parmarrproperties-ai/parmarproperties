import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { allMockPosts } from '../setup/fixtures';

vi.mock('@/hooks/useBlogPosts', () => ({ useBlogPosts: vi.fn() }));
vi.mock('@/components/ScrollReveal', () => ({ ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/components/ScrollScrubRevealText', () => ({ ScrollScrubRevealText: ({ text }: { text: string }) => <span>{text}</span> }));
vi.mock('@/content/content', () => ({
  blog: {
    heading: { main: 'Our Blog', accent: 'Insights' },
    subheading: 'Read the latest.',
    ctaButton: { label: 'View All Posts' },
  },
}));

import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogSection } from '@/sections/BlogSection/index';

const mockUseBlogPosts = useBlogPosts as ReturnType<typeof vi.fn>;

function renderSection() {
  return render(<MemoryRouter><BlogSection /></MemoryRouter>);
}

describe('BlogSection — loading', () => {
  beforeEach(() => { mockUseBlogPosts.mockReturnValue({ posts: [], loading: true, error: null }); });

  it('renders skeleton cards', () => {
    const { container } = renderSection();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('BlogSection — with posts', () => {
  beforeEach(() => { mockUseBlogPosts.mockReturnValue({ posts: allMockPosts, loading: false, error: null }); });

  it('renders up to 3 posts', () => {
    renderSection();
    expect(screen.getByText(allMockPosts[0].title)).toBeInTheDocument();
    expect(screen.getByText(allMockPosts[1].title)).toBeInTheDocument();
    expect(screen.getByText(allMockPosts[2].title)).toBeInTheDocument();
  });

  it('renders at most 3 posts even when more are available', () => {
    const fourPosts = [...allMockPosts, { ...allMockPosts[0], id: 'p4', title: 'Fourth Post', featured: false, gridOrder: 99 }];
    mockUseBlogPosts.mockReturnValue({ posts: fourPosts, loading: false, error: null });
    renderSection();
    expect(screen.queryByText('Fourth Post')).not.toBeInTheDocument();
  });

  it('renders a "View All Posts" CTA linking to /blog', () => {
    renderSection();
    expect(screen.getByRole('link', { name: /view all posts/i })).toHaveAttribute('href', '/blog');
  });
});
