import { describe, it, expect, afterEach, vi } from 'vitest';

// GSAP's ScrollTrigger needs window.matchMedia, which jsdom does not provide.
vi.mock('gsap', () => {
  const timeline = () => ({ fromTo: () => timeline(), kill: () => {}, scrollTrigger: { kill: () => {} } });
  return { default: { registerPlugin: () => {}, timeline } };
});
vi.mock('gsap/ScrollTrigger', () => ({ default: {} }));
import { render } from '@testing-library/react';
import { pages, servicePageMeta, staticRoutes } from '@/seo/pages';
import { servicePages } from '@/content/services';
import { renderHeadTags, Seo } from '@/seo/Seo';
import { postTitle, postDescription, postSeoProps } from '@/seo/blog';
import { blogPostingSchema, faqSchema } from '@/seo/schema';
import { ScrollScrubRevealText } from '@/components/ScrollScrubRevealText';
import { SplitTextReveal } from '@/components/SplitTextReveal';
import { mockBlogPost as mockPost } from '../setup/fixtures';
import type { BlogPost } from '@/lib/types';

const post = (overrides: Partial<BlogPost> = {}): BlogPost => ({ ...mockPost, ...overrides });

describe('static page metadata', () => {
  const indexable = Object.entries(pages).filter(([key]) => !['notFound', 'newsletter'].includes(key));
  const all = [
    ...indexable.map(([, m]) => m),
    ...servicePages.map((s) => servicePageMeta(s.slug)!),
  ];

  it.each(all.map((m) => [m.path, m]))('%s has a title of at most 65 characters', (_, m) => {
    expect(m.title.length).toBeGreaterThanOrEqual(25);
    expect(m.title.length).toBeLessThanOrEqual(65);
  });

  it.each(all.map((m) => [m.path, m]))('%s has a 120–160 character description', (_, m) => {
    expect(m.description.length).toBeGreaterThanOrEqual(120);
    expect(m.description.length).toBeLessThanOrEqual(160);
  });

  it('uses a unique title and description on every page', () => {
    expect(new Set(all.map((m) => m.title)).size).toBe(all.length);
    expect(new Set(all.map((m) => m.description)).size).toBe(all.length);
  });

  it('lists every service page as a static route', () => {
    for (const s of servicePages) expect(staticRoutes).toContain(`/services/${s.slug}`);
  });
});

describe('renderHeadTags', () => {
  it('writes an absolute canonical URL, Open Graph and Twitter tags', () => {
    const html = renderHeadTags({ ...pages.about });
    expect(html).toContain('<link data-seo rel="canonical" href="https://www.parmarproperties.in/about">');
    expect(html).toContain('property="og:url" content="https://www.parmarproperties.in/about"');
    expect(html).toContain('property="og:image" content="https://www.parmarproperties.in/og-default.jpg"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });

  it('marks noindex pages and leaves out their canonical', () => {
    const html = renderHeadTags({ ...pages.notFound, noindex: true });
    expect(html).toContain('content="noindex, follow"');
    expect(html).not.toContain('rel="canonical"');
  });

  it('escapes JSON-LD so content cannot close the script tag', () => {
    const html = renderHeadTags({ ...pages.faq, jsonLd: [faqSchema([{ question: '</script><b>?', answer: 'a & b' }])] });
    expect(html).not.toContain('</script><b>');
    expect(html).toContain('\\u003c/script\\u003e');
  });
});

describe('<Seo> in the browser', () => {
  afterEach(() => document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove()));

  it('sets the document title and replaces previous managed tags', () => {
    const { rerender } = render(<Seo {...pages.home} />);
    expect(document.title).toBe(pages.home.title);
    rerender(<Seo {...pages.contact} />);
    expect(document.title).toBe(pages.contact.title);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://www.parmarproperties.in/contact');
  });
});

describe('per-post SEO', () => {
  it('appends the brand when the title is short enough', () => {
    expect(postTitle(post({ title: 'Worli Guide' }))).toBe('Worli Guide | Parmar Properties');
  });

  it('keeps long titles unchanged', () => {
    const title = 'A very long blog post title that is already well beyond sixty-five characters long';
    expect(postTitle(post({ title }))).toBe(title);
  });

  it('prefers the SEO title and description set in the admin', () => {
    const p = post({ seo: { title: 'Custom title', description: 'Custom description', faqs: [], sources: [] } });
    expect(postTitle(p)).toBe('Custom title');
    expect(postDescription(p)).toBe('Custom description');
  });

  it('builds BlogPosting schema with the team as default author', () => {
    const schema = blogPostingSchema(post()) as Record<string, any>;
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.author['@type']).toBe('Organization');
    expect(schema.mainEntityOfPage).toBe(`https://www.parmarproperties.in/blog/${mockPost.slug}`);
  });

  it('uses a named Person author and adds FAQPage schema when set', () => {
    const p = post({
      seo: { authorName: 'Ankit Parmar', authorRole: 'Director', faqs: [{ question: 'Q?', answer: 'A.' }], sources: [] },
    });
    const props = postSeoProps(p);
    const types = props.jsonLd!.map((s) => s['@type']);
    expect(types).toEqual(['BlogPosting', 'BreadcrumbList', 'FAQPage']);
    expect((props.jsonLd![0] as any).author).toMatchObject({ '@type': 'Person', name: 'Ankit Parmar' });
  });
});

describe('animated text renders each word once', () => {
  it('ScrollScrubRevealText', () => {
    const { container } = render(<ScrollScrubRevealText text="Who We Are" as="h2" />);
    expect(container.textContent).toBe('Who We Are');
    expect(container.querySelectorAll('[data-text]')).toHaveLength(3);
  });

  it('SplitTextReveal', () => {
    const { container } = render(<SplitTextReveal text="Access. Influence. Legacy." />);
    expect(container.textContent).toBe('Access. Influence. Legacy.');
  });
});
