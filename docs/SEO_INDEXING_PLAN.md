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
| Internal linking | **Done**: every main-site page links to the 12 locations that have listings (footer "Popular locations"); each location page links to its guides; each guide links to the locations it covers; location pages link to all six category pages |
| Blog post and guide on the same topic ("Worli vs Mahalaxmi") | **Done**: each now links to the other, so they read as a pair instead of competing. Same for the Worli and NRI pairs. The pairs are listed in `main-site/src/content/crossLinks.ts` and `listing/src/site/data/cross-links.ts` |
| Missing locations | **Done (21 Nov)**: Mahalaxmi (published), Parel, Mahim West, Dadar West, Dadar East, Matunga West, Gamdevi and Mazgaon were created and published from the real listing data (price band from your listings, streets from your listings, a photo from one of your projects). No per-square-foot rate was invented; the page says "On request" until you enter one in the admin |
| Pages visible in raw HTML | Location, category, property and guide pages already were. The commercial page is now too |
| `/listing/about` | Left as it is. It overlaps with the main-site `/about`; if you want one version only, say so and I will redirect it |

### Phase 3 and 4: your steps (Search Console and outside the site)

See "Your steps" below.

## Your steps

**Done on 20 Nov (by Claude in the browser):** both sitemaps submitted (22 and 43 URLs read), Validate fix started on the 5 reasons, removal request for `/code-theme.com/` submitted, indexing requested for all 10 pages.

**For reference, the steps that were done:**

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

- ~~Create and publish the locations that have properties but no public page~~ Done. You can improve their text in the admin under Locations (description, tagline, average rate, cover photo).
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
| Baseline (20 Nov) | 22 | 74 | 33 (28 days), 378 impressions | Validations started 20 Nov for 5 reasons; removal submitted; 10 pages requested |
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
- The main-site footer lists the 12 locations that have listings by hand (`main-site/src/content/content.ts`, `footer.popularLocations`). Add a line there when a location gets its first listing. Powai, Prabhadevi, Juhu, Cuffe Parade and Bandra West are not in it until they have listings.
- Pages that are empty on purpose (`noindex`, not in the sitemap): `/listing/commercials`, locations with no listings, and category pages with no listings. They switch to indexable by themselves once something is published, within about a minute.

---

# Keyword plan: what was done on the site (22 Nov 2026)

Based on your Search Console queries and the keyword list. No search-volume data was available, so nothing below is ranked by volume.

## Done

| Keyword idea | What changed |
|---|---|
| "luxury flats in [area]" on location pages | Location pages now use it in the title, the H1 and the description, for example "Luxury Flats in Worli, Mumbai". A location only gets "Luxury" when your own data supports it (it has a Luxury Collection listing, or its price band starts at ₹10 Cr or more). Others say "Flats in Parel, Mumbai" |
| "flats for sale in [area]", "new launch in [area]", "ultra luxury apartments in [area]" | Category page titles, headings and descriptions use these exact phrasings, and the written content and FAQs use them too |
| Budget keywords ("flats above 10 crore", "5 to 10 crore flats", "flats under 5 crore", "flats above 25 crore") | **Four new pages** at `/listing/budget/<band>`, each built from the real listings in that price band (price range, locations, configurations, possession, developers, FAQ with FAQPage schema). They are in the sitemap, linked from the footer of both sites, and empty or duplicate bands are `noindex` automatically |
| NRI cluster (documents, power of attorney, NRE vs NRO, OCI, stamp duty, TDS, repatriation) | `/services/nri` now answers each of these, with a "Read next" list linking the blog guide, the market guide and the budget pages. Answers are kept general and say to confirm with a lawyer and chartered accountant |
| Buyer-guide cluster | `/services/buy` links to the two matching blog guides and the budget pages |
| "rera number" (you rank position 1) | The main-site footer now shows the MahaRERA agent registration (`A51900018442`, the same number the listing site already shows), the About page has a Company details block with a link to the MahaRERA website, and the number is in the organization markup |
| Other "Parmar" businesses confusing Google | The About page now states the legal name, trading name, address and registration clearly; the organization markup already carried `sameAs`, `alternateName` and the CIN |
| Internal links with keyword anchors | Footer "Flats by budget" row on both sites; budget pages link to location pages and to each flat |

## Not done, and why

| Item | Why | What is needed |
|---|---|---|
| Rewrite the title and description of the page that ranks #5 for "how to buy a house in mumbai"; expand the pages ranking 19 to 45 | I do not know which page ranks. Blog posts are edited in the blog admin (SEO panel), not in code | The browser task asks Search Console which page ranks for each query. Then I draft the new titles, descriptions and extra sections |
| Data-led articles ("South Mumbai property rates per sq ft 2026", "Mumbai real estate market forecast 2026", rental yield, redevelopment) | These need verified figures and sources. I will not invent numbers | Share the figures and sources you trust, or tell me which published reports to summarise |
| Location pages for Tardeo, Nepean Sea Road, Altamount Road, Pedder Road, Walkeshwar, Colaba, Samruddhimarg | None has a published listing yet (Tardeo has 3 drafts). An empty location page is `noindex` and adds nothing | Publish listings there first; then I create the location page |
| Per-sq-ft rate answers ("What is the price per sq ft in Worli?") | Your listings give a starting price and one area per configuration, which is not a reliable rate | Enter the average rate in the admin for each location, or share a source |
| Pune pages, UrbanDhan finance pages | Separate scope | Decide whether you want them |
| Volumes and difficulty | No Keyword Planner access | Check in Google Keyword Planner (free) before committing to new content |
