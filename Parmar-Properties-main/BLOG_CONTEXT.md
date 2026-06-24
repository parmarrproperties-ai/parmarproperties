# Blog Section — Agent Handover & Context

This document provides a comprehensive overview of the Blog system implemented for Parmar Properties.

## ─── Architecture ──────────────────────────────────────────────

The blog system is divided into three main components:

1.  **`src/pages/BlogPage.tsx` (Listing Page)**:
    *   Displays a featured post at the top (with a carousel-like switcher).
    *   Includes a search bar and category filters (Buying, Investments, Lifestyle, etc.).
    *   Renders a grid of blog posts with "Read More" links.
    *   **Layout**: Uses a clean, borderless design with consistent spacing.

2.  **`src/pages/BlogPostDetail.tsx` (Detail Page)**:
    *   **Dynamic Routing**: Accessible via `/blog/:slug`.
    *   **Two-Column Layout**:
        *   **Left**: Sticky meta-information (Date, Title, Social Share).
        *   **Right**: Rich content (Intro, Sections with headings, Insights, and Downloads).
    *   **"More Articles"**: A bottom section displaying three related posts.

3.  **`src/sections/BlogSection/index.tsx` (Homepage Preview)**:
    *   Displays the latest 3 posts on the main landing page.
    *   Matches the homepage's "luxurious" aesthetic with animated headings.

## ─── Content System ───────────────────────────────────────────

All blog data is centralized in **`src/content/content.ts`**.

### `BlogPost` Type Extension
The `BlogPost` type was extended to support detailed content:
```typescript
type BlogPost = {
  date: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  href: string;
  category?: string;
  content?: {
    intro: string[];
    sections: {
      title?: string;
      paragraphs: string[];
      insight?: string;
    }[];
    downloads?: { label: string; href: string }[];
  };
};
```

## ─── Design & Animations ──────────────────────────────────────

*   **Typography**: Primarily uses `Instrument Sans` with specific tracking (`tracking-[-0.06em]`) and leading for headings.
*   **Motion**:
    *   **`ScrollReveal`**: Used for all section and card entries.
    *   **`ScrollScrubRevealText`**: Used for word-by-word reveal animations on headings.
*   **Navbar Behavior**: The `Header` component automatically detects the route. It stays transparent on the homepage top but switches to a solid white background (`bg-white/95`) on all blog pages for better readability.

## ─── Key Logic ────────────────────────────────────────────────

*   **Scroll Management**: Every blog page uses a `useEffect` hook to scroll to the top (`window.scrollTo(0, 0)`) upon mounting or route change.
*   **Search & Filter**: Implemented using React `useState` and standard array filtering in `BlogPage.tsx`.

## ─── Future Tasks / TODOs ─────────────────────────────────────

*   [ ] **Real Data**: Replace Unsplash placeholder images with actual property/market photography.
*   [ ] **Social Sharing**: The share buttons in `BlogPostDetail.tsx` are currently visual stubs; they need integration with sharing APIs.
*   [ ] **Pagination**: If the blog grows significantly, implement pagination for the `BlogPage` grid.
*   [ ] **SEO**: Ensure each blog post has unique meta tags (can be integrated into `App.tsx` or via a dedicated SEO component).
