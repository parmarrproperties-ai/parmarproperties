import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { allMockPosts, mockBlogPost, mockBlogPost2, mockBlogPost3 } from '../setup/fixtures';

vi.mock('@/hooks/useBlogPosts', () => ({ useBlogPosts: vi.fn() }));
vi.mock('@/sections/Header/index', () => ({ Header: () => <header data-testid="header" /> }));
vi.mock('@/components/ScrollReveal', () => ({ ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/components/ScrollScrubRevealText', () => ({ ScrollScrubRevealText: ({ text }: { text: string }) => <span>{text}</span> }));

import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogPage } from '@/pages/BlogPage';

const mockUseBlogPosts = useBlogPosts as ReturnType<typeof vi.fn>;

function renderBlogPage() {
  return render(<MemoryRouter initialEntries={['/blog']}><BlogPage /></MemoryRouter>);
}

describe('BlogPage — loading state', () => {
  beforeEach(() => { mockUseBlogPosts.mockReturnValue({ posts: [], loading: true, error: null }); });

  it('renders the page heading', () => {
    renderBlogPage();
    expect(screen.getByRole('heading', { name: /blog & resources/i })).toBeInTheDocument();
  });

  it('renders skeleton cards while loading', () => {
    const { container } = renderBlogPage();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('does not render any post titles while loading', () => {
    renderBlogPage();
    expect(screen.queryByText(mockBlogPost.title)).not.toBeInTheDocument();
  });
});

describe('BlogPage — with posts', () => {
  beforeEach(() => { mockUseBlogPosts.mockReturnValue({ posts: allMockPosts, loading: false, error: null }); });

  it('renders category filter buttons including "All"', () => {
    renderBlogPage();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Investments' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buying' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lifestyle' })).toBeInTheDocument();
  });

  it('renders "Read More" links for grid posts', () => {
    renderBlogPage();
    expect(screen.getAllByRole('link', { name: /read more/i }).length).toBeGreaterThanOrEqual(1);
  });
});

describe('BlogPage — search', () => {
  beforeEach(() => { mockUseBlogPosts.mockReturnValue({ posts: allMockPosts, loading: false, error: null }); });

  it('filters posts by title when user types', async () => {
    const user = userEvent.setup();
    renderBlogPage();
    await user.type(screen.getByPlaceholderText('Search'), 'Mumbai');
    expect(screen.queryByText(mockBlogPost2.title)).not.toBeInTheDocument();
  });

  it('shows "No posts found" when search matches nothing', async () => {
    const user = userEvent.setup();
    renderBlogPage();
    await user.type(screen.getByPlaceholderText('Search'), 'xyznotexist99');
    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
  });
});

describe('BlogPage — category filters', () => {
  beforeEach(() => { mockUseBlogPosts.mockReturnValue({ posts: allMockPosts, loading: false, error: null }); });

  it('clicking a category filters grid to that category only', async () => {
    const user = userEvent.setup();
    renderBlogPage();
    await user.click(screen.getByRole('button', { name: 'Buying' }));
    expect(screen.getByText(mockBlogPost2.title)).toBeInTheDocument();
    expect(screen.queryByText(mockBlogPost3.title)).not.toBeInTheDocument();
  });
});

describe('BlogPage — empty state', () => {
  it('shows "No posts found" when DB returns no posts', () => {
    mockUseBlogPosts.mockReturnValue({ posts: [], loading: false, error: null });
    renderBlogPage();
    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
  });
});

describe('BlogPage — featured carousel', () => {
  beforeEach(() => { mockUseBlogPosts.mockReturnValue({ posts: allMockPosts, loading: false, error: null }); });

  it('renders prev/next carousel buttons when multiple posts exist', () => {
    renderBlogPage();
    expect(screen.getByLabelText('Previous featured post')).toBeInTheDocument();
    expect(screen.getByLabelText('Next featured post')).toBeInTheDocument();
  });

  it('hides carousel buttons when filtering by category', async () => {
    const user = userEvent.setup();
    renderBlogPage();
    await user.click(screen.getByRole('button', { name: 'Buying' }));
    expect(screen.queryByLabelText('Previous featured post')).not.toBeInTheDocument();
  });
});
