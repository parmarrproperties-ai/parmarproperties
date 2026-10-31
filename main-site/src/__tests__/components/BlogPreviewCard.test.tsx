import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../setup/renderWithProviders';
import { BlogPreviewCard, BlogPreviewCardSkeleton } from '@/components/BlogPreviewCard';
import { mockBlogPost } from '../setup/fixtures';

describe('BlogPreviewCard — row variant', () => {
  it('renders title and excerpt', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="row" />);
    expect(screen.getByText(mockBlogPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockBlogPost.excerpt)).toBeInTheDocument();
  });

  it('renders the post date', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="row" />);
    expect(screen.getByText(mockBlogPost.date)).toBeInTheDocument();
  });

  it('renders a "Read More" link pointing to the correct href', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="row" />);
    expect(screen.getByRole('link', { name: /read more/i })).toHaveAttribute('href', mockBlogPost.href);
  });

  it('renders the post image with correct alt text', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="row" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', mockBlogPost.title);
    expect(img).toHaveAttribute('src', mockBlogPost.imageUrl);
  });

  it('shows skeleton when loading=true and does not render post fields', () => {
    const { container } = renderWithProviders(
      <BlogPreviewCard post={mockBlogPost} variant="row" loading />
    );
    expect(screen.queryByText(mockBlogPost.title)).not.toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('BlogPreviewCard — grid variant', () => {
  it('renders title and excerpt', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="grid" />);
    expect(screen.getByText(mockBlogPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockBlogPost.excerpt)).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="grid" />);
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
  });

  it('renders image with lazy loading', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="grid" />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  it('Read More link has correct href', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="grid" />);
    expect(screen.getByRole('link', { name: /read more/i })).toHaveAttribute('href', mockBlogPost.href);
  });
});

describe('BlogPreviewCard — article variant', () => {
  it('renders the post title as a link', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="article" />);
    const links = screen.getAllByRole('link');
    const titleLink = links.find((l) => l.textContent?.includes(mockBlogPost.title));
    expect(titleLink).toBeDefined();
    expect(titleLink).toHaveAttribute('href', mockBlogPost.href);
  });

  it('renders formatted date', () => {
    renderWithProviders(<BlogPreviewCard post={mockBlogPost} variant="article" />);
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
  });
});

describe('BlogPreviewCardSkeleton', () => {
  it('renders count skeleton cards for row variant', () => {
    const { container } = renderWithProviders(<BlogPreviewCardSkeleton variant="row" count={3} />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(3);
  });

  it('renders count skeleton cards for grid variant', () => {
    const { container } = renderWithProviders(<BlogPreviewCardSkeleton variant="grid" count={6} />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(6);
  });

  it('renders count skeleton cards for article variant', () => {
    const { container } = renderWithProviders(<BlogPreviewCardSkeleton variant="article" count={3} />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(3);
  });
});
