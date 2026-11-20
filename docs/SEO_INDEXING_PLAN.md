# Parmar Properties: SEO indexing plan (merged)

Site: https://www.parmarproperties.in/ · Source: Google Search Console, Page indexing report (data as of 16 Nov 2026) · Checked against the live site on 20 Nov 2026.

## Where we started

| Metric | Value |
|---|---|
| Indexed pages | 22 |
| Not indexed pages | 74 |
| Web search clicks (31 Oct to 18 Nov) | 33 |

| Reason (Search Console) | Pages | What it really is |
|---|---|---|
| Discovered, currently not indexed | 50 | Google knows the URL, has not crawled it yet. New domain, low authority, thin or repetitive pages |
| Duplicate without user-selected canonical | 14 | Old `/code-theme.com/html/findhouses/...` template URLs. **Live today they return a real 404 with `noindex`**, so they only need Google to recrawl them |
| Crawled, currently not indexed | 5 | Google read the page and chose not to index it. Thin content |
| Soft 404 | 2 | Pages that return 200 but look empty: `/listing/commercials` and locations with no listings |
| Not found (404) | 2 | Almost certainly the 109 sample property pages that were deleted. 404 is the correct answer |
| Page with redirect | 1 | `https://www.parmarproperties.in/listing/` (with a trailing slash) redirects to `/listing`, yet it was the canonical and sitemap address |

## What was checked on the live site

- `robots.txt` allows everything except admin, API, compare, saved, ad pages and the PPC landing pages. `/listing/` is **not** blocked.
- Both sitemaps are served and list only 200-status URLs, except the `/listing/` redirect above.
- Property pages are healthy (525 to 575 words each, unique title and description).
- Location and category pages were thin: Residential Buy and Luxury Collection pages had 170 to 215 words, mostly a grid of cards. In Worli, Malabar Hill and Sewri the Luxury Collection page listed exactly the same properties as Buy.
- Five locations (Powai, Prabhadevi, Juhu, Cuffe Parade, Bandra West) have no listings yet, so they say "No Published Listings".
- `/listing/commercials` sent almost no content in its HTML (98 words); everything was drawn by JavaScript.
- Some titles were 65 to 97 characters.

## Status

### Phase 1: clean up

| Task | Status |
|---|---|
| 1.1 Template junk (`/code-theme.com/...`) | Already 404 + `noindex` on the live site. **Do not block them in `robots.txt`**: Google must be able to crawl them to see the 404. Use Search Console, Removals (see "Your steps") to speed it up |
| 1.2 404s | Correct as they are (deleted sample properties) |
| 1.2 Soft 404s | **Fixed in this change**: `/listing/commercials` and any location with no listings are `noindex` and out of the sitemap until they have something. Commercial page content is now sent in the HTML |
| 1.2 Page with redirect | **Fixed**: the listing home is `/listing` everywhere (canonical, sitemap, schema), never `/listing/` |
| 1.3 Clean the sitemap | **Fixed**: only pages that have content. Duplicates of Buy, empty locations and the empty commercial page are left out. The listing sitemap went from 51 to 43 URLs |
| 1.4 Canonical tags | Every page points at its own absolute `www` address. Luxury Collection and New Launches pages that repeat Buy exactly point their canonical at Buy. Non-www already redirects to www (308) |

### Phase 2: content quality (done for the pages we control)

| Task | Status |
|---|---|
| Unique title under 60 characters, description under 155 | **Done**. Titles are fitted automatically: brand added while it fits, otherwise dropped |
| One H1 with area and intent | Already in place on location and category pages |
| 400 to 600 words, unique | **Done for category pages** (now 400 to 475 words), built from the real listings (price range, configurations, possession, developers) plus the location's own description. Location pages with listings are 290 to 330 words, plus the new links and guides |
| No copy-paste between `/buy` and `/luxury-collection` | **Done**: identical pages are merged by canonical, the rest read differently because they are built from different listings |
| FAQ block with `FAQPage` schema | **Done** on every category page that has listings |
| `RealEstateAgent` on the home page, `Article` on guides | Already in place |
| Internal linking | **Done**: every main-site page now links to nine location pages (footer "Popular locations"); each location page links to its guides; each guide links to the locations it covers; location pages link to all six category pages |
| Pages visible in raw HTML | Location, category, property and guide pages already were. The commercial page is now too |
| `/listing/about` | Left as it is. It overlaps with the main-site `/about`; if you want one version only, say so and I will redirect it |

### Phase 3 and 4: your steps (Search Console and outside the site)

See "Your steps" below.

## Your steps

**Right after this is live (about 15 minutes):**

1. Search Console, **Sitemaps**: resubmit `sitemap.xml` and `listing/sitemap.xml`.
2. Search Console, **Page indexing**: open each reason (Duplicate, Not found, Soft 404, Page with redirect, Crawled) and click **Validate fix**. Do not start validation for "Discovered": it is already running and rechecks by itself.
3. Search Console, **Removals**, New request: add the prefix `https://www.parmarproperties.in/code-theme.com/` to hide the 14 template URLs while Google recrawls them.
4. Search Console, **URL Inspection**, **Request indexing**: about 5 a day, in this order.
   1. `https://www.parmarproperties.in/listing`
   2. `https://www.parmarproperties.in/listing/properties`
   3. `https://www.parmarproperties.in/listing/locations/worli`
   4. `https://www.parmarproperties.in/listing/locations/worli/residential/buy`
   5. `https://www.parmarproperties.in/listing/locations/sewri/residential/buy`
   6. `https://www.parmarproperties.in/listing/locations/malabar-hill/residential/buy`
   7. `https://www.parmarproperties.in/listing/locations/lower-parel/residential/buy`
   8. `https://www.parmarproperties.in/listing/market-intelligence/worli-guide-2026`
   9. `https://www.parmarproperties.in/listing/market-intelligence/mahalaxmi-vs-worli`
   10. `https://www.parmarproperties.in/listing/market-intelligence`

**In the admin (this is what moves the numbers most):**

- Create and publish the locations that have properties but no public page: Mahalaxmi (a draft that needs publishing), Parel, Mahim West, Dadar West, Dadar East, Matunga West, Gamdevi, Mazgaon. Each becomes a location page plus its category pages.
- Publish real commercial listings (Buy, Pre-Lease, Rent). Until then the commercial pages stay out of search on purpose.
- Add listings to Powai, Prabhadevi, Juhu, Cuffe Parade and Bandra West so those pages can be indexed.
- Complete the 21 draft properties so they can be published.

**Authority (week 2 onward). This is the slowest part and matters most for a new domain:**

- [ ] Claim and complete the Google Business Profile: address, category, photos and posts.
- [ ] Link the website from the Instagram, LinkedIn, YouTube and Threads profiles.
- [ ] List the firm on MagicBricks, 99acres, Housing.com, Justdial and RERA agent listings.
- [ ] Share each market-intelligence article on LinkedIn and Instagram with a link back.
- [ ] Get 3 to 5 relevant backlinks (guest posts, developer or builder partner pages, local listings).
- [ ] Publish 1 to 2 new market-intelligence articles a week on topics people search, for example "best areas to buy a luxury apartment in South Mumbai", "NRI property buying guide Mumbai", "Worli vs Lower Parel price per sq ft".

## Tracking

Check Search Console weekly.

| Week | Indexed | Not indexed | Clicks | Notes |
|---|---|---|---|---|
| Baseline (20 Nov) | 22 | 74 | 33 (19 days) | |
| Week 1 | | | | |
| Week 2 | | | | |
| Week 3 | | | | |
| Week 4 | | | | |

Targets by the end of week 4:

- Not indexed pages under 15, with the template URLs gone.
- Indexed pages 70 or more.
- Every reason in Page indexing shows Validation: Passed or Started.

## Notes

- Indexing is slow for new domains. Expect 2 to 6 weeks before the "Discovered" pages move, even with all of this done.
- The main-site footer lists nine locations by hand (`main-site/src/content/content.ts`, `footer.popularLocations`). Add a line there when you publish a new location.
- Pages that are empty on purpose (`noindex`, not in the sitemap): `/listing/commercials`, locations with no listings, and category pages with no listings. They switch to indexable by themselves once something is published, within about a minute.
