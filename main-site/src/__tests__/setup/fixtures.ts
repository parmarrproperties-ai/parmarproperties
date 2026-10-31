import type { BlogPost, PostRow, PostSectionRow } from '@/lib/types';

export const mockSection: PostSectionRow = {
  id: 'sec-1',
  post_id: 'post-1',
  order: 0,
  title: 'The Market Overview',
  paragraphs: ['Mumbai residential prices rose 8% YoY.', 'Supply constraints remain.'],
  insight: 'Invest before Q3 for best yields.',
};

export const mockPostRow: PostRow = {
  id: 'post-1',
  slug: 'mumbai-market-2025',
  title: 'Mumbai Market 2025',
  date: '2025-01-15',
  excerpt: 'A deep dive into the Mumbai real-estate market.',
  image_url: 'https://example.com/img.jpg',
  category: 'Investments',
  intro: ['The market is evolving rapidly.'],
  downloads: [],
  featured: true,
  status: 'published',
  grid_order: 0,
  more_articles_override: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-15T00:00:00Z',
};

export const mockBlogPost: BlogPost = {
  id: 'post-1',
  slug: 'mumbai-market-2025',
  title: 'Mumbai Market 2025',
  date: '2025-01-15',
  excerpt: 'A deep dive into the Mumbai real-estate market.',
  imageUrl: 'https://example.com/img.jpg',
  href: '/blog/mumbai-market-2025',
  category: 'Investments',
  featured: true,
  status: 'published',
  gridOrder: 0,
  moreArticlesOverride: null,
  content: {
    intro: ['The market is evolving rapidly.'],
    sections: [
      {
        id: 'sec-1',
        order: 0,
        title: 'The Market Overview',
        paragraphs: ['Mumbai residential prices rose 8% YoY.'],
        insight: 'Invest before Q3 for best yields.',
      },
    ],
    downloads: [{ label: 'Full Report PDF', href: '/reports/mumbai-2025.pdf' }],
  },
};

export const mockBlogPost2: BlogPost = {
  id: 'post-2',
  slug: 'buying-guide-2025',
  title: 'Buying Guide 2025',
  date: '2025-02-20',
  excerpt: 'Everything you need to know before buying.',
  imageUrl: 'https://example.com/img2.jpg',
  href: '/blog/buying-guide-2025',
  category: 'Buying',
  featured: false,
  status: 'published',
  gridOrder: 1,
  moreArticlesOverride: null,
  content: { intro: ['Buying is a big step.'], sections: [], downloads: undefined },
};

export const mockBlogPost3: BlogPost = {
  id: 'post-3',
  slug: 'lifestyle-luxury',
  title: 'Luxury Lifestyle Trends',
  date: '2025-03-10',
  excerpt: 'How the ultra-premium segment is shifting.',
  imageUrl: 'https://example.com/img3.jpg',
  href: '/blog/lifestyle-luxury',
  category: 'Lifestyle',
  featured: false,
  status: 'published',
  gridOrder: 2,
  moreArticlesOverride: null,
  content: { intro: ['Luxury is redefining itself.'], sections: [], downloads: undefined },
};

export const allMockPosts = [mockBlogPost, mockBlogPost2, mockBlogPost3];
