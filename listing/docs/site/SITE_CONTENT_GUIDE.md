# 📋 Parmar Properties - Complete Website Content Directory & Guide
*Master reference guide for your boss and stakeholders detailing all page-specific content files, what each controls, and how it appears in the UI.*

---

## 🗂️ Complete Directory of All Content Files (`data/content/`)

Every single page on the website now has its own dedicated, cleanly separated content file:

| # | Page / Feature | Content File Path | What It Controls in the UI |
| :---: | :--- | :--- | :--- |
| **1** | **Home Page** | [`data/content/home.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/home.content.ts) | Hero rotating carousel, search console filters, featured residences, 4 location showcase cards, private opportunities lead section, why parmar heritage pillars, and market intelligence preview |
| **2** | **BUY Tab** | [`data/content/buy.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/buy.content.ts) | `/properties?tab=buy` page title, verified active inventory description, filter labels, and empty search messages |
| **3** | **NEW LAUNCHES Tab** | [`data/content/new-launches.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/new-launches.content.ts) | `/properties?tab=new-launches` early access opportunities, construction-linked milestone payment copy, and pre-launch dossiers |
| **4** | **LUXURY COLLECTION Tab** | [`data/content/luxury-collection.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/luxury-collection.content.ts) | `/properties?tab=luxury-collection` ultra-luxury oceanfront sky villas, sprawling penthouses, and private estates |
| **5** | **Properties Hub** | [`data/content/properties.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/properties.content.ts) | Aggregates and synchronizes Buy, New Launches, and Luxury Collection into a unified portfolio view |
| **6** | **Locations** | [`data/content/locations.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/locations.content.ts) | `/locations` prime micro-market directories, neighbourhood filter tabs (Worli, Bandra, Juhu, Malabar Hill), and upcoming Sewri / Powai pipeline |
| **7** | **Commercials** | [`data/content/commercials.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/commercials.content.ts) | `/commercials` Grade-A office suites, whole floor plates, retail flagships, and Mumbai CBD hubs (BKC, Lower Parel, Nariman Point, Andheri East) |
| **8** | **Market Intelligence** | [`data/content/insights.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/insights.content.ts) | `/market-intelligence` research desk badge, micro-market guides, valuation benchmarks, and confidential advisory prompts |
| **9** | **About Us** | [`data/content/about.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/about.content.ts) | `/about` heritage established 1981, founder story (Vikram Parmar), 40+ years track record, MahaRERA compliance, and core values |
| **10** | **Compare** | [`data/content/compare.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/compare.content.ts) | `/compare` side-by-side residence analysis matrix, structural comparison parameters, and empty state guides |
| **11** | **Saved Portfolio** | [`data/content/saved.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/saved.content.ts) | `/saved` client bookmarked residences, cross-device sync prompt, and clear portfolio actions |
| **12** | **Global / Shared** | [`data/content/common.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/common.content.ts) | Sticky top navigation bar, Talk to Our Advisory modal form, footer address, landline phone numbers, and MahaRERA disclaimers |
| **13** | **Master Index** | [`data/content/index.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/index.ts) | Central module re-exporting every content file with 100% backward compatibility |

---

## 🎨 Visual Layout Maps for Each Specific Page

### 1. BUY Tab (`/properties?tab=buy`)
📄 Controlled by: **`data/content/buy.content.ts`**
```text
+-------------------------------------------------------------------------------+
| Breadcrumb: Home • Mumbai Portfolio • BUY                                     |
+-------------------------------------------------------------------------------+
| [ TABS: BUY (Active) | NEW LAUNCHES | LUXURY COLLECTION ]                     |
+-------------------------------------------------------------------------------+
| Title:    "Buy Mumbai Residences"                                             |
| Subtitle: "Explore the complete portfolio of hand-selected, verified..."      |
+-------------------------------------------------------------------------------+
| [ FILTERS BAR: Location | Configuration (BHK) | Property Type | Max Budget ]  |
+-------------------------------------------------------------------------------+
| [ VERIFIED RESIDENCES GRID (Cards 1 to N) ]                                   |
+-------------------------------------------------------------------------------+
```

---

### 2. NEW LAUNCHES Tab (`/properties?tab=new-launches`)
📄 Controlled by: **`data/content/new-launches.content.ts`**
```text
+-------------------------------------------------------------------------------+
| Breadcrumb: Home • Mumbai Portfolio • NEW LAUNCHES                            |
+-------------------------------------------------------------------------------+
| [ TABS: BUY | NEW LAUNCHES (Active) | LUXURY COLLECTION ]                     |
+-------------------------------------------------------------------------------+
| Title:    "New Launches & Pre-Launch"                                         |
| Subtitle: "Upcoming landmark towers, pre-launch Expression of Interest..."    |
+-------------------------------------------------------------------------------+
| [ INVESTOR ADVANTAGES: Pre-Launch Pricing • Milestones • Floor Selection ]    |
+-------------------------------------------------------------------------------+
| [ NEW LAUNCHES PROPERTY CARDS ]                                               |
+-------------------------------------------------------------------------------+
```

---

### 3. LUXURY COLLECTION Tab (`/properties?tab=luxury-collection`)
📄 Controlled by: **`data/content/luxury-collection.content.ts`**
```text
+-------------------------------------------------------------------------------+
| Breadcrumb: Home • Mumbai Portfolio • LUXURY COLLECTION                       |
+-------------------------------------------------------------------------------+
| [ TABS: BUY | NEW LAUNCHES | LUXURY COLLECTION (Active) ]                     |
+-------------------------------------------------------------------------------+
| Title:    "The Luxury Collection"                                             |
| Subtitle: "Publicly viewable signature trophy assets: oceanfront sky villas..."|
+-------------------------------------------------------------------------------+
| [ STANDARDS: Waterfront Horizons • Private Elevators • Diplomatic Security ]  |
+-------------------------------------------------------------------------------+
| [ TROPHY SKY VILLAS & PENTHOUSES SHOWCASE ]                                   |
+-------------------------------------------------------------------------------+
```

---

### 4. ABOUT US Page (`/about`)
📄 Controlled by: **`data/content/about.content.ts`**
```text
+-------------------------------------------------------------------------------+
| Badge:    "Our Heritage • Active Since 1981"                                  |
| Title:    "Parmar Properties"                                                 |
| Subtitle: "Mumbai’s premier discreet real estate advisory..."                 |
+-------------------------------------------------------------------------------+
| Heading:  "A Legacy of Discretion & Architectural Integrity"                  |
| Story:    Narrative paragraphs on 40+ years heritage                          |
| Founder:  Vikram Parmar, Founder & Principal Managing Director                |
+-------------------------------------------------------------------------------+
| [ METRICS: ₹5,000+ Cr Transacted | 40+ Years | 100% MahaRERA | 1-on-1 Desk ]  |
+-------------------------------------------------------------------------------+
| [ PILLARS: 1. Generational Trust | 2. Curated Exclusivity | 3. Legal Rigor ]  |
+-------------------------------------------------------------------------------+
| [ CTA: Ready to discuss your acquisition? -> TALK TO OUR ADVISORY ]           |
+-------------------------------------------------------------------------------+
```

---

### 5. COMPARE Page (`/compare`)
📄 Controlled by: **`data/content/compare.content.ts`**
```text
+-------------------------------------------------------------------------------+
| Title:    "Compare Residences (X/4)"             [+ Add More] [Clear Compare] |
| Subtitle: "Side-by-side structural, architectural, and financial comparison." |
+-------------------------------------------------------------------------------+
| [ COMPARISON MATRIX TABLE ]                                                   |
| Price | Carpet Area | Rate/sq.ft | Configuration | Possession | Amenities     |
+-------------------------------------------------------------------------------+
```

---

### 6. SAVED RESIDENCES Page (`/saved`)
📄 Controlled by: **`data/content/saved.content.ts`**
```text
+-------------------------------------------------------------------------------+
| Title:    "Saved Residences"                                [Clear Portfolio] |
| Subtitle: "Private collection of your bookmarked Mumbai luxury properties."   |
+-------------------------------------------------------------------------------+
| [ SHORTLISTED PROPERTY CARDS GRID ]                                           |
+-------------------------------------------------------------------------------+
```

---

## 💡 Instructions for Your Boss

When editing any file:
1. **Open the corresponding `.content.ts` file in any text editor.**
2. **Only edit text inside the quotes `""`.**
3. **Do not remove commas `,` or curly brackets `{}`.**
4. Once edited, saving and deploying immediately updates the entire website!
