# Parmar Properties — Backend Content & Attribute Specification

> **Purpose:** This specification defines all content, configuration, and data attributes editable via the Backend CMS / Database (e.g. Supabase, Strapi, Custom Admin Panel).
> 
> For each field, the exact UI input type (Text, Dropdown, Checkbox, Number, Media Upload, Multi-Select, Rich Text) and expected values are provided.

---

## Table of Contents
1. [Common Attributes (Global / Across All Pages)](#1-common-attributes-global--across-all-pages)
2. [Page-Wise Content Attributes](#2-page-wise-content-attributes)
   - [2.1 Home Page (`/`)](#21-home-page-)
   - [2.2 Buy Portfolio Page (`/properties?tab=buy`)](#22-buy-portfolio-page-propertiestabby)
   - [2.3 New Launches Page (`/properties?tab=new-launches`)](#23-new-launches-page-propertiestabnew-launches)
   - [2.4 Luxury Collection Page (`/properties?tab=luxury-collection`)](#24-luxury-collection-page-propertiestabluxury-collection)
   - [2.5 Commercials Page (`/commercials`)](#25-commercials-page-commercials)
   - [2.6 Location Micro-Market Pages (`/locations` & `/locations/[slug]`)](#26-location-micro-market-pages-locations--locationsslug)
   - [2.7 Market Intelligence / Insights (`/market-intelligence` & `/[slug]`)](#27-market-intelligence--insights-market-intelligence--slug)
   - [2.8 About Us Page (`/about`)](#28-about-us-page-about)
   - [2.9 Contact Page (`/contact`)](#29-contact-page-contact)
3. [Core Entity Schemas (Database Collections)](#3-core-entity-schemas-database-collections)
   - [3.1 Residential Property Schema](#31-residential-property-schema)
   - [3.2 Commercial Property Schema](#32-commercial-property-schema)
   - [3.3 Market Intelligence Article Schema](#33-market-intelligence-article-schema)
   - [3.4 Location Micro-Market Schema](#34-location-micro-market-schema)
   - [3.5 Lead & Inquiries Schema](#35-lead--inquiries-schema)
4. [Input Control Types Reference Summary](#4-input-control-types-reference-summary)

---

## 1. Common Attributes (Global / Across All Pages)

These attributes apply site-wide to the layout (Navbar, Footer, Modals, SEO defaults, and Contact Channels).

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Name** | `brandName` | Text | Max 50 chars | `"PARMAR PROPERTIES"` |
| **Established Year Badge** | `estYearBadge` | Text | Max 15 chars | `"EST. 1981"` |
| **Primary Contact Phone** | `contactPhone` | Text (Phone) | E.164 or formatted | `"+91 (022) 6666 9733"` |
| **Secondary / Mobile Phone**| `mobilePhone` | Text (Phone) | Formatted string | `"+91 98200 12345"` |
| **Official Email** | `contactEmail` | Text (Email) | Valid email format | `"concierge@parmarproperties.com"` |
| **Corporate Office Address**| `officeAddress` | Textarea | Max 200 chars | `"Peninsula Center, 208, Doctor SS Rao Marg, Parel, Mumbai 400012"` |
| **WhatsApp Direct Link** | `whatsappNumber` | Text | Digits only | `"919820012345"` (links to wa.me) |
| **MahaRERA Firm Registration**| `firmReraNumber`| Text | Format: A51... | `"A51900018420"` |
| **Working Hours** | `workingHours` | Text | Max 50 chars | `"Mon – Sat: 9:30 AM – 7:30 PM IST"` |
| **Navbar Navigation Links** | `navbarLinks` | List of Objects | Array of `{ label, path }` | Primary menu: Buy, New Launches, Luxury, Commercials, Locations, Insights |
| **Footer Tagline** | `footerTagline` | Text | Max 150 chars | `"Mumbai's premier bespoke luxury real estate advisory and investment desk since 1981."` |
| **Copyright Notice** | `copyrightNotice` | Text | Year auto-updated | `"© 2026 Parmar Properties Advisory LLP. All rights reserved."` |
| **Social Links** | `socialLinks` | Object | URLs | LinkedIn, Instagram, YouTube, X (Twitter) |
| **Default Meta Title** | `defaultMetaTitle`| Text | 50–60 chars | `"Parmar Properties \| Mumbai's Prime Real Estate Portfolio"` |
| **Default Meta Description**| `defaultMetaDesc` | Textarea | 140–160 chars | `"Curated portfolio of prime waterfront residences, penthouses, and sky villas across Mumbai."` |

---

## 2. Page-Wise Content Attributes

### 2.1 Home Page (`/`)

#### A. Hero Carousel & Tagline
| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Main Headline** | `hero.headline` | Text | Max 60 chars | `"MUMBAI'S FINEST ADDRESSES"` |
| **Hero Subtext** | `hero.subtext` | Textarea | Max 150 chars | `"Curated residences, private opportunities and investment properties across Mumbai's most sought after neighbourhoods"` |
| **Slide Auto-Play Interval**| `hero.slideDurationMs`| Number | 3000 to 10000 (ms) | `5000` (5 seconds) |
| **Hero Carousel Slides** | `hero.slides` | Array of Objects | Repeatable (Min 3) | Array of slide items: |
| &bull; *Slide Image* | `image` | Media Upload | WebP / JPG, min 1920×1080 | High-resolution Mumbai skyline photograph |
| &bull; *Slide Tagline* | `tagline` | Text | Max 40 chars | e.g. `"Worli Sea Face Trophy Sky Villas"` |
| &bull; *Slide Subtext* | `subtext` | Text | Max 60 chars | e.g. `"Panoramic Arabian Sea & Sea Link Panoramas"` |
| &bull; *Alt Description* | `alt` | Text | Max 80 chars | SEO accessibility text |

#### B. Hero Search Console Controls
| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Location Options** | `search.locationOptions` | Multi-select / List | Text strings | `['All Prime Locations', 'Worli', 'Bandra West', 'Juhu', 'Lower Parel', 'Malabar Hill', 'Cuffe Parade']` |
| **Bedrooms (BHK) Options** | `search.bhkOptions` | Multi-select / List | Text strings | `['Any Configuration', '3 BHK', '4 BHK', '5 BHK']` |
| **Min Budget Limit** | `search.budgetMinCrores`| Number | Stepped integer | `3` (in ₹ Crores) |
| **Max Budget Limit** | `search.budgetMaxCrores`| Number | Stepped integer | `60` (in ₹ Crores, 60+ is unlimited) |
| **Construction Status Options**| `search.statusOptions`| List of Objects | `{ label, value, targetTab }` | `['All Status', 'Ready to Move In', 'Under Construction', 'Pre-Launch', 'Luxury Collection', 'Resale']` |

#### C. Featured Residences Section
| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Section Tag / Badge** | `featured.tag` | Text | Max 30 chars | `"CURATED COLLECTION"` |
| **Heading** | `featured.heading` | Text | Max 50 chars | `"FEATURED PROPERTIES"` |
| **Subheading** | `featured.subheading` | Text | Max 120 chars | `"Hand-curated prime residences across Mumbai’s most coveted enclaves."` |
| **Max Display Count** | `featured.maxCount` | Number (Dropdown) | `3`, `6`, `9`, `12` | `6` (2 rows of 3 columns) |
| **Featured Properties IDs** | `featured.propertyIds` | Multi-select (Relation) | Select from Property Table | Select the 6 specific properties shown on the home page |

#### D. Explore Properties (Filtered by Location)
| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Section Tag** | `locations.tag` | Text | Max 30 chars | `"FILTERED BY LOCATION"` |
| **Heading** | `locations.heading` | Text | Max 50 chars | `"EXPLORE PROPERTIES"` |
| **Subheading** | `locations.subheading`| Text | Max 140 chars | `"Explore Mumbai’s premier residential micro-markets: from iconic waterfronts to cultural enclaves."` |
| **Primary 4 Location Cards** | `locations.primaryCards` | Multi-select (Relation) | 4 Locations | Worli, Bandra West, Juhu, Malabar Hill |
| **Future Locations Bar Label**| `locations.futureBarLabel`| Text | Max 30 chars | `"FUTURE LOCATIONS :"` |
| **Future Locations Enclaves** | `locations.futureEnclaves`| List of Objects | Repeatable `{ name, slug }` | `['Sewri', 'Powai', 'Prabhadevi', 'Lower Parel', 'Cuffe Parade']` |

#### E. Why Parmar Properties (Pillars & Metrics)
| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Badge** | `why.badge` | Text | Max 40 chars | `"ESTABLISHED 1981 • FOUR DECADES"` |
| **Main Title** | `why.title` | Text | Max 60 chars | `"THE BENCHMARK IN MUMBAI REAL ESTATE"` |
| **Subtitle** | `why.subtitle` | Textarea | Max 160 chars | Explaining bespoke advisory and discretion |
| **Trust Metrics** | `why.metrics` | Array of Objects (4 items) | Repeatable | Counters: `{ value, label, subtext }` |
| &bull; *Metric 1* | `metrics[0]` | Object | `value: "40+ Years"` | `label: "Market Leadership"`, `subtext: "Generational Expertise"` |
| &bull; *Metric 2* | `metrics[1]` | Object | `value: "100%"` | `label: "Title Vetted"`, `subtext: "Clear Legal Assurance"` |
| &bull; *Metric 3* | `metrics[2]` | Object | `value: "₹5,000+ Cr"` | `label: "Transactions Facilitated"`, `subtext: "Discreet Closures"` |
| &bull; *Metric 4* | `metrics[3]` | Object | `value: "1-on-1"` | `label: "Principal Advisory"`, `subtext: "Single Point of Contact"` |
| **Pillars of Excellence** | `why.pillars` | Array of Objects (4 items) | Repeatable | `{ number, title, description, badge }` |

---

### 2.2 Buy Portfolio Page (`/properties?tab=buy`)

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Breadcrumb Text** | `buy.breadcrumb` | Text | Max 40 chars | `"Ready Residences"` |
| **Page Title** | `buy.title` | Text | Max 60 chars | `"BUY RESIDENCES IN MUMBAI"` |
| **Page Subtitle** | `buy.subtitle` | Textarea | Max 180 chars | `"Explore ready-to-move-in luxury apartments, sky villas, and duplexes across prime Mumbai neighbourhoods."` |
| **Tab Label** | `buy.tabLabel` | Text | Max 25 chars | `"BUY RESIDENCES"` |
| **Locality Filter Options** | `buy.localityOptions` | Multi-select / List | Text strings | Worli, Bandra West, Juhu, Lower Parel, Prabhadevi, Powai, Malabar Hill, Cuffe Parade, BKC, Khar, Sewri |
| **Configuration (BHK) Filter**| `buy.bhkOptions` | Multi-select / List | Text strings | `['All', '3 BHK', '4 BHK', '5 BHK', '6+ BHK / Penthouse']` |
| **Default Price Range Min** | `buy.minBudgetDefault`| Number | Stepped integer | `10` (₹10 Cr) |
| **Default Price Range Max** | `buy.maxBudgetDefault`| Number | Stepped integer | `60` (₹60 Cr+) |
| **Construction Status Filter**| `buy.statusOptions` | Multi-select / List | Text strings | `['All Status', 'Ready to Move In / Resale', 'Under Construction', 'Pre-Launch / New Launch']` |
| **Signature Amenities Filter**| `buy.amenityOptions` | Multi-select / List | Text strings | Infinity Pool, Private Elevator, Smart Home, Sea Balconies, Concierge, EV Bays |
| **Sort Options** | `buy.sortOptions` | Multi-select / List | Text strings | Featured Curated, Price: Low to High, Price: High to Low, Carpet Area, Recently Added |

---

### 2.3 New Launches Page (`/properties?tab=new-launches`)

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Breadcrumb Text** | `newLaunches.breadcrumb` | Text | Max 40 chars | `"New & Upcoming Launches"` |
| **Page Title** | `newLaunches.title` | Text | Max 60 chars | `"NEW RESIDENTIAL LAUNCHES"` |
| **Page Subtitle** | `newLaunches.subtitle` | Textarea | Max 180 chars | `"First-access to pre-launch allocations, priority booking windows, and high-growth developments."` |
| **Tab Label** | `newLaunches.tabLabel` | Text | Max 25 chars | `"NEW LAUNCHES"` |
| **EOI Banner Active** | `newLaunches.showEoiBanner`| Checkbox (Boolean) | `true` / `false` | Enable/disable the pulsing EOI banner |
| **EOI Banner Title** | `newLaunches.eoiTitle` | Text | Max 50 chars | `"Pre-Launch EOI Window Open:"` |
| **EOI Banner Subtitle** | `newLaunches.eoiSubtitle` | Text | Max 150 chars | `"Priority floor allocation, launch phase payment flexibilities & MahaRERA approved milestones."` |
| **EOI CTA Button Text** | `newLaunches.eoiButtonText`| Text | Max 30 chars | `"Register Pre-Launch EOI &rarr;"` |

---

### 2.4 Luxury Collection Page (`/properties?tab=luxury-collection`)

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Breadcrumb Text** | `luxury.breadcrumb` | Text | Max 40 chars | `"The Luxury Collection"` |
| **Page Title** | `luxury.title` | Text | Max 60 chars | `"THE LUXURY COLLECTION"` |
| **Page Subtitle** | `luxury.subtitle` | Textarea | Max 180 chars | `"Ultra-luxury trophy residences, expansive penthouses, and signature sea-facing estates above ₹25 Cr."` |
| **Tab Label** | `luxury.tabLabel` | Text | Max 25 chars | `"LUXURY COLLECTION"` |
| **Minimum Threshold Filter**| `luxury.minPriceFilter` | Number | Integer | `25` (₹25 Cr minimum threshold) |
| **Private Desk Alert Box** | `luxury.deskAlertText` | Textarea | Max 160 chars | Notice informing clients that confidential assets require verified NDA access |

---

### 2.5 Commercials Page (`/commercials`)

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Breadcrumb Text** | `commercials.breadcrumb` | Text | Max 40 chars | `"Commercial Assets"` |
| **Page Title** | `commercials.title` | Text | Max 60 chars | `"COMMERCIAL REAL ESTATE"` |
| **Page Subtitle** | `commercials.subtitle` | Textarea | Max 180 chars | `"Grade-A corporate headquarters, boutique office suites, and pre-leased assets in prime Mumbai CBD corridors."` |
| **Commercial Hubs Filter** | `commercials.hubs` | Multi-select / List | Text strings | BKC, Lower Parel, Worli, Nariman Point, Bandra West, Powai |
| **Capital Budget Slider Min**| `commercials.minPrice` | Number | Integer | `15` (₹15 Cr) |
| **Capital Budget Slider Max**| `commercials.maxPrice` | Number | Integer | `65` (₹65 Cr+) |
| **Inquiry Modal Heading** | `commercials.modalTitle`| Text | Max 50 chars | `"Commercial Acquisition Desk"` |
| **Inquiry Modal Subtitle**| `commercials.modalSub` | Textarea | Max 120 chars | Notice regarding lease schedules, cap rates, and floor plans |

---

### 2.6 Location Micro-Market Pages (`/locations` & `/locations/[slug]`)

Each Mumbai Micro-Market (e.g., Worli, Bandra West, Juhu, Prabhadevi, Powai, Sewri, etc.) has:

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Location Name** | `name` | Text | Max 40 chars | e.g. `"Worli"`, `"Sewri"`, `"Prabhadevi"` |
| **URL Slug** | `slug` | Text (Slug) | Regex: `^[a-z0-9-]+$` | e.g. `"worli"`, `"sewri"`, `"lower-parel"` |
| **Cover Photo** | `coverImage` | Media Upload | WebP / JPG, min 1920×800 | Full-bleed hero banner photo |
| **Tagline** | `tagline` | Text | Max 80 chars | e.g. `"Mumbai’s Premier Sea-Facing Luxury Mile"` |
| **Editorial Description** | `description` | Textarea | Max 300 chars | Overview of infrastructure, luxury towers, and lifestyle |
| **Price Band Range** | `priceRange` | Text | Max 30 chars | e.g. `"₹18 Cr - ₹75 Cr+"` |
| **Average Capital Rate** | `averageRate` | Text | Max 35 chars | e.g. `"₹65,000 - ₹1,20,000 / sq.ft"` |
| **Lifestyle Highlights** | `lifestyle` | Text | Max 100 chars | e.g. `"Sea Link Promenade, High-Rise Sky Mansions, Michelin Dining"` |
| **Key Enclaves / Streets** | `keyEnclaves` | Multi-select / Tags | Array of strings | e.g. `["Worli Sea Face", "Dr. Annie Besant Road", "Pochkhanawala Road"]` |
| **Is Active / Featured** | `isFeatured` | Checkbox (Boolean) | `true` / `false` | Featured on home page primary 4 cards |

---

### 2.7 Market Intelligence / Insights (`/market-intelligence` & `/[slug]`)

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Badge** | `insights.badge` | Text | Max 40 chars | `"RESEARCH & ADVISORY DESK"` |
| **Main Heading** | `insights.heading` | Text | Max 50 chars | `"MARKET INTELLIGENCE"` |
| **Subheading** | `insights.subheading` | Textarea | Max 160 chars | `"Data-backed insights, micro-market pricing analyses, and legal guidance for Mumbai real estate acquisitions."` |
| **Articles List** | `articles` | Collection (Relation) | See Schema 3.3 | Articles displayed as cards and detail pages |

---

### 2.8 About Us Page (`/about`)

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `about.title` | Text | Max 60 chars | `"FOUR DECADES OF DISCREET EXCELLENCE"` |
| **Hero Subtitle** | `about.subtitle` | Textarea | Max 180 chars | Brand history summary since 1981 |
| **Founders / Leadership** | `about.leaders` | Array of Objects | Repeatable | `{ name, role, bio, photoUrl }` |
| **Milestones Timeline** | `about.timeline` | Array of Objects | Repeatable | `{ year, title, description }` |
| **Core Values** | `about.values` | Array of Objects | Repeatable | `{ title, description, icon }` |

---

### 2.9 Contact Page (`/contact`)

| Attribute Name | Backend Key | Control Type | Options / Validation | Description & Default Value |
| :--- | :--- | :--- | :--- | :--- |
| **Headline** | `contact.title` | Text | Max 50 chars | `"CONNECT WITH OUR PRINCIPAL DESK"` |
| **Subtitle** | `contact.subtitle` | Textarea | Max 150 chars | Invitation for private property consultations |
| **Direct Department Desks** | `contact.desks` | Array of Objects | Repeatable | `{ title, contactPerson, email, phone }` |
| &bull; *Private Client Desk*| `desks[0]` | Object | HNW / Family Office | e.g. `private@parmarproperties.com` |
| &bull; *Commercial Desk* | `desks[1]` | Object | Grade-A Leases & Sales | e.g. `commercial@parmarproperties.com` |
| &bull; *NRI Advisory Desk* | `desks[2]` | Object | Cross-Border & FEMA | e.g. `nri@parmarproperties.com` |

---

## 3. Core Entity Schemas (Database Collections)

### 3.1 Residential Property Schema (`properties` table)

| Field Name | Database Column | Backend UI Control Type | Field Validation & Constraints |
| :--- | :--- | :--- | :--- |
| **Property ID** | `id` | Text (Read-Only) | Auto-generated UID / Slug (`prop-1`) |
| **URL Slug** | `slug` | Text (Slug) | Unique, lowercase (`the-aurum-sea-residence-worli`) |
| **Property Title** | `title` | Text | Max 100 characters |
| **Tagline / Catchphrase** | `tagline` | Text | Max 120 characters |
| **Micro-Market (Location)**| `location` | Dropdown (Single Select) | Options: `Worli`, `Bandra West`, `Juhu`, `Lower Parel`, `Prabhadevi`, `Powai`, `Malabar Hill`, `Cuffe Parade`, `BKC`, `Khar West`, `Sewri` |
| **Exact Sub-Location** | `subLocation` | Text | e.g. `"Worli Sea Face, South Mumbai"` |
| **Price (in ₹ Crores)** | `price` | Number (Decimal) | e.g. `32.50` (numeric for slider filtering) |
| **Formatted Price Label** | `priceFormatted` | Text | e.g. `"₹32.50 Cr"` |
| **Bedrooms (BHK)** | `bhk` | Dropdown (Single Select) | Options: `3 BHK`, `4 BHK`, `5 BHK`, `6+ BHK / Penthouse` |
| **Carpet Area (sq.ft)** | `carpetArea` | Number (Integer) | e.g. `3850` |
| **Super Built-Up Area** | `superArea` | Number (Integer) | e.g. `4900` |
| **Property Type** | `propertyType` | Dropdown (Single Select) | Options: `Sea-Facing Apartment`, `Penthouse`, `Sky Villa`, `Duplex`, `Luxury Estate` |
| **Construction Status** | `possession` | Dropdown (Single Select) | Options: `Ready to Move`, `Under Construction`, `Pre-Launch`, `Immediate` |
| **Possession Date / Target**| `possessionDate` | Text | e.g. `"Ready to Move"`, `"Q4 2027"`, `"Dec 2026"` |
| **Floor Level Description**| `floor` | Text | e.g. `"42nd Floor of 58"` |
| **Featured on Home Page** | `featured` | Checkbox (Boolean) | `true` = Featured in home showcase |
| **Recently Added Flag** | `recentlyAdded` | Checkbox (Boolean) | `true` = Shows "Recently Added" badge |
| **Recommended Flag** | `recommended` | Checkbox (Boolean) | `true` = Editorial pick badge |
| **Is New Launch** | `isNewLaunch` | Checkbox (Boolean) | `true` = Appears on New Launches tab |
| **Is Luxury Collection** | `isLuxuryCollection` | Checkbox (Boolean) | `true` = Appears on Luxury Collection tab (₹25 Cr+) |
| **Cover Image** | `coverImage` | Media Upload (Single) | Recommended: 1600×1000px, WebP format |
| **Photo Gallery Images** | `images` | Media Upload (Multiple) | Array of image URLs (min 3 images) |
| **Amenities List** | `amenities` | Multi-Select / Tags | e.g. `["Private Elevator", "Infinity Sky Pool", "Concierge & Valet", "Sea-Facing Balconies", "Smart Home"]` |
| **Editorial Description** | `description` | Textarea / Rich Text | 2 to 4 paragraphs detailing architectural highlights |
| **Key Bullet Highlights** | `highlights` | List of Strings | 3–5 bullet points (e.g. `"180° Arabian Sea View"`) |
| **MahaRERA Registration No.**| `reraId` | Text | e.g. `"P51900028192"` |
| **Coordinates (Latitude)** | `coordinates.lat` | Number (Float) | e.g. `19.0144` |
| **Coordinates (Longitude)**| `coordinates.lng` | Number (Float) | e.g. `72.8159` |
| **Architectural Floor Plans**| `floorPlans` | Array of Objects | Repeatable: `{ title, area, description }` |

---

### 3.2 Commercial Property Schema (`commercial_properties` table)

| Field Name | Database Column | Backend UI Control Type | Field Validation & Constraints |
| :--- | :--- | :--- | :--- |
| **Property ID** | `id` | Text (Read-Only) | Auto-generated (`comm-1`) |
| **URL Slug** | `slug` | Text (Slug) | Unique, lowercase (`one-bkc-corporate-pavilion`) |
| **Commercial Title** | `title` | Text | Max 100 characters |
| **Tagline** | `tagline` | Text | Max 120 characters |
| **Commercial Hub** | `location` | Dropdown (Single Select) | Options: `BKC`, `Lower Parel`, `Worli`, `Nariman Point`, `Bandra West`, `Powai` |
| **Sub-Location** | `subLocation` | Text | e.g. `"G Block, Bandra Kurla Complex"` |
| **Price (in ₹ Crores)** | `price` | Number (Decimal) | Numeric for slider (`42.0`) |
| **Formatted Price Label** | `priceFormatted` | Text | e.g. `"₹42.00 Cr"` |
| **Carpet Area (sq.ft)** | `carpetArea` | Number (Integer) | e.g. `8500` |
| **Floor Level** | `floor` | Text | e.g. `"14th Floor Single Plate"` |
| **Possession / Handover** | `possession` | Dropdown (Single Select) | Options: `Immediate Occupancy`, `Warm Shell Handover`, `Pre-Leased (6.8% Cap Rate)` |
| **Commercial Grade** | `grade` | Dropdown (Single Select) | Options: `Grade-A+`, `LEED Platinum`, `Boutique HQ` |
| **Cover Image** | `coverImage` | Media Upload | WebP / JPG format |
| **MahaRERA Number** | `reraId` | Text | e.g. `"P51800018420"` |

---

### 3.3 Market Intelligence Article Schema (`insights_articles` table)

| Field Name | Database Column | Backend UI Control Type | Field Validation & Constraints |
| :--- | :--- | :--- | :--- |
| **Article ID** | `id` | Text (Read-Only) | Slug format (`worli-guide-2026`) |
| **Article Slug** | `slug` | Text (Slug) | Unique lowercase string |
| **Category Header** | `category` | Text | e.g. `"WORLI PROPERTY GUIDE 2026"` |
| **Category Bucket** | `categorySlug` | Dropdown (Single Select) | Options: `location`, `price`, `buyer`, `nri` |
| **Article Title** | `title` | Text | Max 120 characters |
| **Subtitle** | `subtitle` | Text | Max 160 characters |
| **Summary Description** | `description` | Textarea | Max 250 characters |
| **Estimated Read Time** | `readTime` | Text | e.g. `"5 min read"` |
| **Pill Tag** | `tag` | Text | e.g. `"Price Analysis"`, `"Macro Trends"` |
| **Publication Date Tag** | `date` | Text | e.g. `"Q1 2026 Benchmark"` |
| **Author Name** | `author.name` | Text | e.g. `"Advisory Research Desk"` |
| **Author Role** | `author.role` | Text | e.g. `"Head of Prime Residential Valuation"` |
| **Author Desk** | `author.desk` | Text | e.g. `"Parmar Properties Research"` |
| **Key Takeaways List** | `keyTakeaways` | List of Strings | 3 to 5 bullet points |
| **Article Sections** | `sections` | Array of Objects | Repeatable: `{ heading, content (paragraphs), tableData, highlight }` |
| &bull; *Section Heading* | `heading` | Text | Section title |
| &bull; *Paragraph Content* | `content` | Rich Text / Markdown | Array of paragraph strings |
| &bull; *Comparison Table* | `tableData` | Key-Value / Table Grid | Optional `{ headers: [], rows: [[]] }` |
| &bull; *Highlight Quote* | `highlight` | Textarea | Optional pull-quote box |

---

### 3.4 Location Micro-Market Schema (`locations` table)

| Field Name | Database Column | Backend UI Control Type | Field Validation & Constraints |
| :--- | :--- | :--- | :--- |
| **Enclave Name** | `name` | Text | e.g. `"Prabhadevi"` |
| **URL Slug** | `slug` | Text (Slug) | Unique (`prabhadevi`) |
| **Cover Photo** | `coverImage` | Media Upload | 1920×1080px WebP |
| **Tagline** | `tagline` | Text | e.g. `"Refined Coastal Grandeur Near Siddhivinayak"` |
| **Full Description** | `description` | Textarea | 2–3 paragraphs |
| **Price Band Range** | `priceRange` | Text | e.g. `"₹18 Cr - ₹55 Cr+"` |
| **Capital Rate Range** | `averageRate` | Text | e.g. `"₹62,000 - ₹1,05,000 / sq.ft"` |
| **Lifestyle Attributes** | `lifestyle` | Text | e.g. `"Beachfront Promenade, Temple Heritage"` |
| **Key Corridors & Enclaves**| `keyEnclaves` | Multi-Select / Tags | e.g. `["Siddhivinayak Horizon", "Kirti College Seafront"]` |
| **Is Future / Upcoming** | `isFuture` | Checkbox (Boolean) | `false` = Active corridor, `true` = Pipeline corridor |

---

### 3.5 Lead & Inquiries Schema (`leads` table)

| Field Name | Database Column | Backend UI Control Type | Field Validation & Constraints |
| :--- | :--- | :--- | :--- |
| **Lead ID** | `id` | UUID (Read-Only) | Auto-generated primary key |
| **Created Timestamp** | `created_at` | Date / Time (Read-Only) | ISO Timestamp |
| **Lead Full Name** | `full_name` | Text | Captured from form |
| **Phone Number** | `phone` | Text (Phone) | E.164 with country code |
| **Email Address** | `email` | Text (Email) | Validated email address |
| **Interested Property / Enclave**| `property_reference` | Text / Relation | Associated property slug or title |
| **Inquiry Source Channel** | `source` | Dropdown | `Hero Search`, `Property Card`, `Private Desk`, `Commercial Dossier`, `Schedule Viewing` |
| **Budget Range Indicated** | `budget_range` | Text | e.g. `"₹15 Cr – ₹30 Cr"` |
| **Buyer Status** | `buyer_profile` | Dropdown | `Direct Buyer`, `Family Office Principal`, `Broker / Agent`, `NRI Client` |
| **Status Workflow** | `lead_status` | Dropdown (Admin Workflow) | `New`, `Assigned`, `Contacted`, `Site Visit Scheduled`, `Negotiation`, `Closed / Won`, `Disqualified` |
| **Assigned Advisor** | `assigned_to` | Dropdown (Admin Users) | Select from Parmar internal advisory team |

---

## 4. Input Control Types Reference Summary

When building the Admin Panel / CMS input forms, use this control matrix:

| Control Type | Best Used For | Examples from Parmar Listing |
| :--- | :--- | :--- |
| **Text (Single Line)** | Short titles, names, badges, telephone numbers, RERA IDs | Property Title, RERA No, Phone Number, Breadcrumbs |
| **Textarea (Plain)** | Brief summaries, card subtitles, meta descriptions | Micro-market descriptions, Meta description, Hero subtext |
| **Rich Text Editor (WYSIWYG)**| Long-form editorial articles, legal disclosures | Market Intelligence article sections, Property descriptions |
| **Number (Decimal / Int)** | Monetary figures (in ₹ Cr), carpet areas (sq.ft) | Property Price (`32.5`), Carpet Area (`3850`), Slide duration (`5000`) |
| **Dropdown (Single Select)**| Discrete categories with one mutually exclusive selection | BHK (`3 BHK`, `4 BHK`), Construction Status (`Ready to Move`, `Under Construction`) |
| **Checkbox (Boolean Toggle)**| On / Off flags | `featured: true`, `recentlyAdded: false`, `isNewLaunch: true`, `isLuxuryCollection: true` |
| **Multi-Select / Tags** | Multiple selections from predefined or dynamic lists | Amenities, Key Enclaves, Locality filters |
| **Media Upload** | Image assets (drag-and-drop with auto-WebP compression)| Cover photo, photo gallery array, slide images |
| **Key-Value / Table Data** | Structured comparison matrices | Comparison table rows in Market Intelligence guides |
