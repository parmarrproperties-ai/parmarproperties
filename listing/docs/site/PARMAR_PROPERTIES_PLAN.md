# Parmar Properties: Implementation Plan

> Premium, minimal, image-focused, **light-themed** real-estate website for **Parmar Properties**, a Mumbai-based company.
> Users can discover, explore, save, compare, and enquire about properties.

---

## 0. Project Rules (read first, every agent must follow)

1. **Light theme only.** Premium, but never dark-themed.
2. **Animation is minimal everywhere except the hero.** Only subtle hover and fade transitions elsewhere.
3. **Hero scroll-lock logic must be implemented exactly as specified in Phase 2.**
4. **Mobile-first, responsive, accessible (WCAG AA), SEO-friendly, fast on Android and Windows.**
5. Respect `prefers-reduced-motion` everywhere.
6. Work **one phase at a time**. After each phase, verify in the browser and show the result before continuing.
7. Company name is always written **Parmar Properties**.

---

## 1. Decisions to Confirm

| # | Topic | Assumption in this plan | Change it here |
|---|-------|-------------------------|----------------|
| 1 | Slide timing | The original brief said "100-150 ms", which would flash images too fast to read the tagline. Assumed **~4 seconds per slide**. | `SLIDE_DURATION_MS` in `/lib/constants.ts` |
| 2 | Scroll lock length | 3 slides x 4s = ~12s locked. Longer means higher bounce risk. | `SLIDE_DURATION_MS` |
| 3 | Skip intro link | **Off** by default (the brief says strictly non-scrollable). | `ALLOW_SKIP_INTRO` in `/lib/constants.ts` |
| 4 | Revisits | `heroCompleted` is stored in `sessionStorage`, so returning to Home in the same session is **not** locked again. | `PERSIST_HERO_COMPLETED` in `/lib/constants.ts` |
| 5 | Backend | Start with local data (JSON + browser storage). Add accounts and a database in Phase 8. | n/a |

---

## 2. Recommended Stack

- **Next.js (App Router) + TypeScript**: SEO, image optimization, speed
- **Tailwind CSS** with design tokens for the light premium theme
- **next/image + next/font**: performance
- **Zustand** (persisted to localStorage): Saved, Compare, Recently Viewed
- **CSS transitions** for all animation (no heavy animation library)
- **Later:** Supabase (auth, saved sync, enquiries) and Resend (enquiry emails)

---

## 3. Project Structure

```
/app
  page.tsx                       Home
  properties/page.tsx            Listing + filters
  properties/[slug]/page.tsx     Property detail
  compare/page.tsx
  saved/page.tsx
  about/page.tsx
  contact/page.tsx
/components
  layout/    Navbar, Footer, MobileMenu
  hero/      HeroCarousel, HeroSlide
  property/  PropertyCard, Gallery, FilterBar, EnquiryForm, CompareBar
/data
  properties.ts                  Typed seed data
/public
  hero/                          hero-1.jpg, hero-2.jpg, hero-3.jpg
  properties/<slug>/             Property galleries
/store/                          saved, compare, recent
/lib/                            filters, seo, constants
```

**Hero images:** place the three luxury property images in `/public/hero/` as `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`.

---

## 4. Design System (Light, Premium)

- **Palette:** warm off-white background `#FAF8F5`, charcoal text `#1C1C1C`, one accent (muted gold or deep green), thin neutral borders
- **Typography:** serif display font for headings (Cormorant Garamond or Playfair Display), clean sans for body (Inter or DM Sans)
- **Feel:** generous whitespace, large photography, thin lines, no heavy shadows, minimal motion
- **Accessibility:** WCAG AA contrast, visible focus states, semantic HTML, alt text on all images

---

## Phase 1: Foundation

- Scaffold Next.js + Tailwind. Set up fonts, design tokens, and the global layout.
- Build the **Navbar**:
  - Logo, Home, Properties, Compare, Saved (with count badge), About, Contact
  - Transparent over the hero, turning solid white after the hero unlocks
  - Mobile drawer menu
- Build the **Footer**:
  - Brand blurb, quick links, Mumbai office address, phone, email, social links, RERA/legal line
- Create the `Property` TypeScript type and **12-15 seed properties** across Mumbai localities (Bandra, Juhu, Worli, Powai, Andheri, Thane, and so on).

**Done when:** the layout renders responsively with working navigation on all routes.

---

## Phase 2: Hero (the critical piece)

### Behavior spec

- Three **full-bleed** background images (`100vw x 100svh`, no padding), each with its tagline written on the image:
  1. **"Find Your Home"**
  2. **"Discover Different Living"**
  3. **"Invest With Confidence"**
- Slides **crossfade one after another** on a timer (`SLIDE_DURATION_MS`), and the tagline fades in with its image.
- A dark gradient overlay behind the text keeps it readable.
- **"Explore Properties"** button links to `/properties`.
- Slide indicator dots are visual only.

### Scroll-lock logic

- On mount, set `overflow: hidden` on `html` and `body`, and block wheel, touch-move, and keyboard scroll keys (Space, PageDown, PageUp, Home, End, arrow keys) while `locked = true`.
- Track how many slides have been shown. When the carousel **returns to slide 1 after showing all three**, set `locked = false` and remove the blocks.
- After unlock, the carousel **keeps rotating**, but the page scrolls normally.
- At unlock, fade in a subtle "Scroll" cue so users know they can move on.
- Store `heroCompleted` in `sessionStorage` so revisits in the same session are not locked again.

### Safeguards

- The lock is JS-only, so page content stays in the DOM and search engines can still read it.
- With `prefers-reduced-motion`, use instant swaps and unlock immediately.
- Preload only the first hero image. Serve WebP or AVIF at sensible sizes for mobile.
- Use `100svh` instead of `100vh` to avoid the Android address-bar jump.
- Clean up all event listeners on unmount, so navigating away never leaves the site locked.

**Done when:** the lock holds during the first cycle, releases exactly when slide 1 returns, and rotation continues after unlock on both desktop and mobile.

---

## Phase 3: Home Page Sections (below the hero)

In order:

1. Featured Properties
2. Recently Added
3. Recommended
4. Recently Viewed (hidden if empty)
5. Explore by Location (Mumbai area tiles)
6. About Parmar Properties teaser
7. Testimonials
8. Final CTA banner

All property sections use the shared `PropertyCard` with a **save (heart)** button and an **Add to compare** toggle.

---

## Phase 4: Properties Listing (`/properties`)

- **Filters:** location, BHK, budget range, property type, area (sq ft), availability (ready or under construction), amenities
- Sync filters to **URL query params** so results are shareable and SEO-friendly
- Sorting: newest, price low-high, price high-low
- Mobile filter drawer
- Card grid with lazy-loaded images and an empty state

---

## Phase 5: Property Detail (`/properties/[slug]`)

- Image gallery with lightbox
- Price, BHK configurations, key facts, description
- Amenities grid and floor plans
- Embedded map (Google Maps or OpenStreetMap)
- Similar Properties
- Sticky **Enquire** button opening a form (name, phone, email, message, property prefilled)
- Records the visit into Recently Viewed
- Dynamic metadata plus JSON-LD structured data

---

## Phase 6: Saved and Compare

**Saved (`/saved`)**
- Grid of saved properties with remove
- Persists locally, and syncs once the user logs in (Phase 8)

**Compare (`/compare`)**
- Users select properties on the Properties page
- Floating **Compare bar** appears once properties are selected (limit 3 or 4)
- Side-by-side table: price, area, BHK, location, amenities, availability
- Highlight differences, remove buttons, horizontal scroll on mobile

---

## Phase 7: About and Contact

**About (`/about`)** (short page)
- Brief company story, values, key numbers, founder note, Mumbai focus

**Contact (`/contact`)**
- All contact details, map, and an enquiry form with validation
- WhatsApp click-to-chat button
- Form posts to an API route that emails the team and stores the enquiry

---

## Phase 8: Optional Accounts and Sync

- Supabase auth (email or Google)
- Tables for saved properties and recently viewed
- On login, **merge local state into the account** so nothing is lost

---

## Phase 9: Polish

- **SEO:** sitemap, robots, per-page metadata, Open Graph images, local business schema for Mumbai
- **Performance:** target Lighthouse 90+ on mobile, with proper image sizing and font subsetting
- **Testing:** mid-range Android phone, Windows Chrome and Edge, keyboard navigation, screen reader pass

---

## Working with Antigravity

- Keep the **Project Rules** (section 0) in a rules file such as `AGENTS.md` so every agent follows them.
- Run **one phase per task**, and have the agent verify with the browser tool. Test Phase 2's lock and unlock behavior especially carefully.
- Keep hero images at the exact paths listed in section 3.

---

## Kickoff Prompt (paste into Antigravity)

> Build "Parmar Properties", a premium, light-themed, Mumbai real-estate website using Next.js (App Router), TypeScript and Tailwind. Follow `PARMAR_PROPERTIES_PLAN.md` phase by phase, starting with Phase 1 (foundation) and Phase 2 (hero). The hero has 3 full-bleed images in `/public/hero` with taglines "Find Your Home", "Discover Different Living", "Invest With Confidence", crossfading on a configurable timer. Scrolling is locked until all three slides have shown and slide 1 returns; then scrolling unlocks while the rotation continues. Include an "Explore Properties" button linking to `/properties`. Keep all other animation minimal. Stop after Phase 2 and show me a browser-tested result before continuing.
