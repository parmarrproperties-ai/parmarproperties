# 📋 Parmar Properties - Boss & Stakeholder UI Content Guide
*A visual, non-technical companion guide showing exactly where each piece of content in `data/content/home.content.ts` appears on the website.*

---

## 🎯 Quick Overview

All textual copy, titles, descriptions, button labels, and filter configurations for the Home Page are centralized in:
📂 **[`data/content/home.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/home.content.ts)**

> [!TIP]
> **Live Visual Content Map in the Browser**:
> When running the site, look at the bottom-left corner of your browser. You will see a small badge: **`[ ⚡ Boss Content Guide ]`**.
> Clicking it opens an interactive on-screen map highlighting each section and showing its exact code path in real time!

---

## 🗺️ Visual Home Page Wireframe Map

Below is a schematic diagram of the Home Page from top to bottom, with direct pointers to the variables in `home.content.ts`:

```text
+-----------------------------------------------------------------------------------------------+
| [NAVIGATION BAR] (from data/content/common.content.ts)                                        |
| PARMAR PROPERTIES (Logo)  | Buy | Launches | Luxury | Commercials | [TALK TO OUR ADVISORY]   |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
| [SECTION 1: HERO CAROUSEL & SEARCH CONSOLE]                                                   |
| 📍 Variable: HOME_PAGE_CONTENT.hero                                                           |
|                                                                                               |
|   Headline:   "MUMBAI'S FINEST ADDRESSES"  <-- hero.headline                                  |
|   Subtext:    "Curated residences, private opportunities..." <-- hero.subtext                 |
|   Rotation:   2.2 seconds per slide        <-- hero.slideDurationMs                           |
|                                                                                               |
|   [ 3 Rotating High-Resolution Slides: hero.slides[0], [1], [2] ]                             |
|                                                                                               |
|   +---------------------------------------------------------------------------------------+   |
|   | [SEARCH CONSOLE DOCK] <-- hero.searchConsole                                          |   |
|   | [Location Filter]  | [BHK Filter]  | [Budget Slider: ₹3Cr - ₹60Cr] | [Type] | [SEARCH]|   |
|   +---------------------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
| [SECTION 2: FEATURED PROPERTIES SHOWCASE]                                                     |
| 📍 Variable: HOME_PAGE_CONTENT.featuredProperties                                             |
|                                                                                               |
|   Heading:    "FEATURED PROPERTIES"                                <-- featuredProperties.heading
|   Subheading: "Hand-curated prime residences across Mumbai..."     <-- featuredProperties.subheading
|   Button:     [VIEW ALL RESIDENCES ->]                             <-- featuredProperties.viewAllButton.text
|                                                                                               |
|   [ Property Card 1 ]        [ Property Card 2 ]        [ Property Card 3 ]                   |
|   [ Property Card 4 ]        [ Property Card 5 ]        [ Property Card 6 ]                   |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
| [SECTION 3: EXPLORE PROPERTIES BY LOCATION]                                                   |
| 📍 Variable: HOME_PAGE_CONTENT.locationSection                                                |
|                                                                                               |
|   Tag:        "FILTERED BY LOCATION"                               <-- locationSection.tag    |
|   Heading:    "EXPLORE PROPERTIES"                                 <-- locationSection.heading|
|   Link:       [All Locations Directory ->]                         <-- locationSection.allLocationsLink
|                                                                                               |
|   [ Worli Card ]     [ Bandra West Card ]   [ Juhu Card ]       [ Malabar Hill Card ]         |
|   (Sea Face)         (Pali Hill)            (Beachfront)        (Queens Necklace)             |
|   From ₹18 Cr        From ₹15 Cr            From ₹20 Cr         From ₹35 Cr                   |
|                                                                                               |
|   +---------------------------------------------------------------------------------------+   |
|   | [FUTURE LOCATIONS PIPELINE STRIP] <-- locationSection.futureLocationsStrip            |   |
|   | "FUTURE LOCATIONS : Sewri, Powai, Prabhadevi..."                   [View Upcoming ->] |   |
|   +---------------------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
| [SECTION 4: PRIVATE OPPORTUNITIES (OFF-MARKET REGISTRY)]                                      |
| 📍 Variable: HOME_PAGE_CONTENT.privateOpportunities                                           |
|                                                                                               |
|   Badge:      "CONFIDENTIAL REAL ESTATE • OFF-MARKET"              <-- privateOpportunities.badge
|   Heading:    "PRIVATE OPPORTUNITIES"                              <-- privateOpportunities.heading
|   Copy:       "Not every landmark residence in Mumbai is publicly listed..."                  |
|   Button:     [🛡️ REQUEST ACCESS]                                  <-- privateOpportunities.ctaButton.text
|   Popup Form: 3-step OTP Verification Modal                        <-- privateOpportunities.leadModal
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
| [SECTION 5: WHY PARMAR PROPERTIES (HERITAGE & TRUST)]                                         |
| 📍 Variable: HOME_PAGE_CONTENT.whyParmar                                                      |
|                                                                                               |
|   Badge:      "OUR LEGACY & STANDARDS"                             <-- whyParmar.badge        |
|   Title:      "WHY PARMAR PROPERTIES"                              <-- whyParmar.titlePrefix  |
|   Subtitle:   "Parmar Properties combines curated property..."     <-- whyParmar.subtitle     |
|   Button:     [EXPLORE PORTFOLIO ->]                               <-- whyParmar.ctaButton    |
|                                                                                               |
|   Pillar 01: [OVER 4 DECADES OF TRUST | SINCE 1981]                <-- whyParmar.pillars[0]   |
|   Pillar 02: [VETTED & TROPHY ASSETS  | CURATED INVENTORY]         <-- whyParmar.pillars[1]   |
|   Pillar 03: [MICRO-MARKET DATA       | MARKET INTELLIGENCE]       <-- whyParmar.pillars[2]   |
|   Pillar 04: [DISCREET CONSULTATION   | END-TO-END ADVISORY]       <-- whyParmar.pillars[3]   |
|                                                                                               |
|   Trust Counters:                                                                             |
|   [40+ Years]         [100% Due Diligence]   [₹5,000+ Cr Equity]   [1-on-1 Advisory Desk]     |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
| [SECTION 6: MARKET INTELLIGENCE & RESEARCH]                                                   |
| 📍 Variable: HOME_PAGE_CONTENT.marketIntelligence                                             |
|                                                                                               |
|   Badge:      "RESEARCH & ADVISORY DESK"                           <-- marketIntelligence.badge
|   Heading:    "Market Intelligence"                                <-- marketIntelligence.heading
|   Subheading: "Curated micro-market data, capital valuation..."    <-- marketIntelligence.subheading
|   Link:       [VIEW ALL INSIGHTS ->]                               <-- marketIntelligence.viewAllLink
|                                                                                               |
|   [ Worli Property Guide 2026 ]             [ Mahalaxmi vs Worli Guide ]                      |
|   [ Buying a Penthouse in Mumbai ]          [ NRI Mumbai Property Guide ]                     |
+-----------------------------------------------------------------------------------------------+
| [FOOTER] (from data/content/common.content.ts)                                                |
| Address: Peninsula Center, Lower Parel, Mumbai | Phone: +91 (022) 4988 7700                   |
+-----------------------------------------------------------------------------------------------+
```

---

## 📑 Section-by-Section Quick Reference Table

| UI Section | Visual Appearance on Screen | Variable to Edit in `home.content.ts` |
| :--- | :--- | :--- |
| **Hero Headline** | Large serif white heading in main carousel | `hero.headline` |
| **Hero Subtitle** | Descriptive paragraph beneath headline | `hero.subtext` |
| **Hero Slide 1, 2, 3** | Tagline, images, and descriptions for each photo | `hero.slides[0..2]` |
| **Search Console** | Dropdowns for Location, Configuration, Budget, Category | `hero.searchConsole` |
| **Featured Properties** | Title, subtitle, and top-right red action button | `featuredProperties.heading`, `.subheading`, `.viewAllButton` |
| **Location Cards** | Worli, Bandra West, Juhu, and Malabar Hill image cards | `locationSection.cards` |
| **Future Locations Bar** | Gray bar below location cards mentioning upcoming corridors | `locationSection.futureLocationsStrip` |
| **Private Opportunities** | Confidential lead section with lock icon and OTP modal | `privateOpportunities.heading`, `.paragraphs`, `.leadModal` |
| **Why Parmar Header** | Dark background header with red glowing badge | `whyParmar.badge`, `.titlePrefix`, `.titleHighlight` |
| **4 Value Pillars** | 01 Since 1981, 02 Curated Inventory, 03 Market Intelligence, 04 Advisory | `whyParmar.pillars` |
| **4 Trust Counters** | 40+ Years, 100% Diligence, ₹5,000+ Cr, 1-on-1 Desk | `whyParmar.trustMetrics` |
| **Market Intelligence** | Research article previews section before footer | `marketIntelligence.badge`, `.heading`, `.viewAllLink` |

---

## 🗂️ Complete Directory of All Content Files

Every page now has its own dedicated content file in `data/content/`:

1. **[`data/content/home.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/home.content.ts)**: Home Page content.
2. **[`data/content/properties.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/properties.content.ts)**: Properties listing page (`/properties`), tabs (Buy, New Launches, Luxury), filters, and sort options.
3. **[`data/content/locations.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/locations.content.ts)**: Locations directory (`/locations`), micro-market guides, and pre-launch pipeline.
4. **[`data/content/commercials.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/commercials.content.ts)**: Commercial real estate (`/commercials`), Grade-A offices, and Mumbai CBD hubs.
5. **[`data/content/insights.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/insights.content.ts)**: Market Intelligence (`/market-intelligence`) and research articles.
6. **[`data/content/common.content.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/common.content.ts)**: Site-wide Navigation bar, Advisory Consultation Modal, Footer, Office Address, and Contact details.
7. **[`data/content/index.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar%20Properties%20Listing/data/content/index.ts)**: Central hub exporting everything together.
