# Ranking Strategy: how parmarproperties.in can reach the top of property searches

Research date: 4 October 2026.

## 1. What is realistic

- **Broad searches** such as "property", "real estate", "flats for sale" or "property in Mumbai" are dominated by
  portals (99acres, MagicBricks, Housing.com, NoBroker), developers (Lodha, Rustomjee) and paid ads.
  No single advisory website can rank first for these "always". Results are also personalised by the
  searcher's location and history.
- **Winnable searches** are the ones Parmar Properties is genuinely the best answer for:
  - **Local + intent**, e.g. "real estate agent South Mumbai", "property consultant Parel", "luxury property advisor Worli".
    The Google Maps "local pack" at the top of these results is decided mostly by the Google Business Profile.
  - **Niche + luxury**, e.g. "luxury flats Malabar Hill", "4 BHK Worli sea view", "NRI buy property South Mumbai".
  - **Questions** buyers ask, e.g. "Worli vs Mahalaxmi", "what is a 20:80 payment plan", "can NRIs buy property in Mumbai".
    The blog and FAQ already target these, and they are what AI assistants quote.
  - **Brand**: "Parmar Properties". The site already ranks for this.
- The local competitors who rank for these searches (Gupta & Sen, The Smart Realtors, Samit Jhaveri Realtors,
  Narains Luxury Properties) win with **location pages that list real properties**, many reviews and long-standing
  directory listings, not with technical tricks.

## 2. What drives rankings (2026 research)

| Factor | Weight / evidence | Status |
|---|---|---|
| Google Business Profile: completeness, primary category, photos, posts | ~32% of local-pack ranking (Whitespark 2026 Local Search Ranking Factors) | **Not set up / not linked: owner action** |
| Reviews: count, rating, recency, keywords in reviews | ~20% of local-pack ranking | **Owner action** |
| On-page relevance: titles, content, schema | ~15% | **Done in code** |
| NAP consistency (same Name, Address, Phone everywhere) | Key prominence signal; AI assistants also depend on it | **Inconsistent: see §4** |
| Crawlable, fast pages (Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) | Tie-breaker between similar pages | Improved; see §3 |
| Backlinks and mentions from trusted sites | Prominence for Google; sources for AI answers | **Owner action** |
| RERA-compliant project/listing pages | Outperform generic pages for property searches (Indian real estate SEO guides) | **Needs your listings data** |

## 3. Done in code, with no visible text or design changes

- Every page pre-rendered with full HTML, a unique title and description, canonical URL, Open Graph tags and JSON-LD schema.
- Home page title and description now target "luxury property", "real estate", "flats", "Worli", "Malabar Hill" and "South Mumbai".
- Schema: RealEstateAgent with legal name, **CIN U70109MH2011PTC214909**, founding date and place, address,
  phones, email, 22 areas served, founders and a catalogue of services; Person, Service, FAQPage, BlogPosting and Breadcrumb schema.
- `hreflang="en-IN"`, geo meta tags, robots.txt that welcomes AI crawlers, sitemap.xml, and llms.txt with services and FAQ answers.
- **IndexNow**: each production deploy notifies Bing (whose index ChatGPT search uses), Yandex and others to recrawl every page.
- Google Search Console and Bing verification codes can be added in `src/seo/site.ts` or as Vercel environment
  variables (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`).
- Descriptive image alt text; screen-reader context for "Read More"/"Learn More" links.
- Speed: pages are hydrated instead of redrawn; the video loads only near the viewport; images below the fold are lazy-loaded;
  the logo is WebP. Home page (Lighthouse mobile): performance 59 → 70, LCP 7.4 s → 5.0 s, page weight 5.2 MB → 0.58 MB.
- Security headers (HSTS etc.) and long-term caching for assets.

## 4. Owner actions, in order of impact

1. **Deploy** the branch (merge to `main`).
2. **Google Business Profile** for "Parmar Properties", 208 Peninsula Centre, Dr. S S Rao Road, Parel, Mumbai 400012:
   - Primary category "Real estate agency" (secondary: "Real estate consultant").
   - Website set to https://www.parmarproperties.in, phone +91 22 6666 9733, opening hours, service areas (the 22 localities),
     services (Buy, Sell, Lease, NRI advisory), 20+ real photos (office, team, events), and a weekly post.
   - Then add the profile URL to `sameAs` in `src/seo/site.ts`.
3. **Reviews**: ask recent clients for Google reviews. A steady 2–4 per month beats a one-off burst. Reply to every review.
4. **Fix NAP inconsistencies** found during research:
   - Justdial lists "Parmar Properties" at **Byculla East** (Sussex Industrial Estate) and at **Charni Road / Kalbadevi**.
     Update those listings to the Parel office (or note them as branches if they are real).
   - Two Facebook pages exist: `facebook.com/ParmarPropertiesMumbai` and the one linked in the footer
     (`facebook.com/people/Parmar-Properties/61556751864965`). Merge them or pick one.
   - A third-party profile describes the business as covering "Mumbai, Panvel, Lonavala, and Alibaug". Align the descriptions.
   - Use the exact same name, address and phone on Justdial, Sulekha, thepropertist.com, 99acres / MagicBricks / Housing.com
     agent profiles, LinkedIn and Instagram.
5. **Search Console + Bing Webmaster Tools**: verify and submit `https://www.parmarproperties.in/sitemap.xml`.
6. **MahaRERA agent number**: add it to `rera` in `src/seo/site.ts`. It then appears in the schema (and the footer).
7. **Supabase migration + seed** (see SEO-IMPLEMENTATION-PLAN.md): switches on blog FAQs, sources and short search titles.
8. **Backlinks and mentions**: ask partner developers (Lodha, Godrej, Piramal, Rustomjee and others) to list Parmar Properties
   on their channel-partner pages; pitch market commentary to property journalists (Hindustan Times Real Estate,
   Economic Times Realty, Mid-day); keep publishing data-led posts that others will cite.

## 5. Needs your approval: these change what visitors see

These are the biggest remaining on-site gains. They were **not** done because the brief was not to change visible text:

- **Locality pages** (Worli, Malabar Hill, Mahalaxmi, Tardeo, Lower Parel, Cuffe Parade) with real market notes. Competitors rank with exactly these.
- **Listings / featured projects** with configuration, carpet area, possession date and MahaRERA ID (RealEstateListing schema).
- **Longer pillar posts** (1,500+ words) and question-style headings in posts.
- **Named testimonials** (with consent) instead of "Anonymous".
- Slightly darker grey for breadcrumb text (accessibility contrast warning in Lighthouse).
