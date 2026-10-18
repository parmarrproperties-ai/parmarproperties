# Parmar Properties — Architecture & Data Mapping Map 🗺️

This document explains the technical mapping between **Frontend TypeScript components**, **Backend Admin forms**, and the **Supabase PostgreSQL database**.

> **Path note (2026-10-13):** `Frontend/` and `backend/` were merged into one app; see the path map in `AGENTS.md`. Types now live in `src/site/types` (public) and `src/types` (admin).

---

## 1. Database Table Directory

| Table Name | Defined in Migration | Used For | RLS Permissions |
| :--- | :--- | :--- | :--- |
| `properties` | `001`, `006`, `007`, `010` | Residential listings (Buy, New Launches, Luxury) | Public: `SELECT` where `publication_status='published' AND deleted_at IS NULL` (`010`); Admin: CRUD |
| `property_images` | `001`, `010` | Gallery photos for residential listings | Public: `SELECT` if parent published (`010`); Admin: CRUD |
| `property_configurations` | `006` | Floor plans & 2/3/4/5 BHK variants per property | Public: `SELECT` if parent published; Admin: CRUD |
| `price_breakdowns` | `001`, `008`, `010` | Legacy cost-sheet lines on `configurations` | Public: `SELECT` if parent published (`010`); Admin: CRUD |
| `property_configuration_price_breakdowns` | `008` | Master cost-sheet lines on `property_configurations` | Public: `SELECT` if parent published; Admin: CRUD |
| `commercial_properties` | `005` | Commercial listings (Offices, HQs, Retail) | Public: `SELECT` published; Admin: CRUD |
| `locations` | `001`, `006` | Micro-market editorial guides (Worli, Bandra, etc.) | Public: `SELECT` active; Admin: CRUD |
| `insights_articles` | `005` | Market Intelligence research reports | Public: `SELECT` published; Admin: CRUD |
| `article_sections` | `005` | Structured paragraphs, tables & quotes per article | Public: `SELECT`; Admin: CRUD |
| `leads` | `004`, `005` | Consolidated inquiry inbox from all website forms | **Public: no direct insert** (017). Visitors write only via `POST /api/leads` → `submit_lead()` (016, SECURITY DEFINER, always unverified/unassigned); Admin: SELECT/UPDATE |
| `lead_rate_events` | `016` | Rate-limit ledger for `submit_lead()` (hashed IP, phone, time; rows older than 1 day pruned) | RLS on, no policies: only `submit_lead()` touches it |
| `hero_slides` | `001` | Home page full-bleed carousel slides | Public: `SELECT` active; Admin: CRUD |
| `site_branding` | `005` | Singleton company info, MahaRERA ID, contacts, address | Public: `SELECT`; Admin: CRUD |
| `page_content` | `004` | Per-route headlines, badges, subtitles & JSON sections | Public: `SELECT`; Admin: CRUD |
| `lookup_*` | `004`, `005` | Standard options (`bhk`, `property_types`, `hubs`, etc.) | Public: `SELECT`; Admin: CRUD |

---

## 2. Model Mapping (Frontend CamelCase ↔ Backend Snake_Case)

### A. Residential Properties

| Frontend Property Model ([`property.ts`](file:///c:/Users/Sayli/OneDrive/Desktop/Parmar-properties-listing/Frontend/types/property.ts)) | Supabase Database Column (`properties`) | Type | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key |
| `slug` | `slug` | `VARCHAR(120)` | Unique URL slug |
| `title` | `title` | `VARCHAR(150)` | Listing title (e.g., *Worli Aurum Sky Villa*) |
| `tagline` | `tagline` | `VARCHAR(200)` | Subtitle badge |
| `location` | `location_id` / `locality` | `UUID` / `VARCHAR` | Foreign key to `locations(id)` |
| `subLocation` | `sub_location` | `VARCHAR(150)` | Micro-enclave (e.g., *Worli Sea Face*) |
| `price` | `price` | `NUMERIC(10,2)` | In Crores INR (e.g., `18.50`) |
| `priceFormatted` | Computed | `string` | Formatted as `₹${price} Cr` |
| `bhk` | `bhk_id` / `bhk` | `VARCHAR` | Configuration string (e.g., *4 BHK*) |
| `carpetArea` | `carpet_area_sqft` | `INTEGER` | Square footage |
| `superArea` | `super_area` | `INTEGER` | Super built-up area |
| `propertyType` | `property_type_id` | `UUID` | Links to `lookup_property_types` |
| `possession` | `status_id` / `possession`| `VARCHAR` | *Ready to Move*, *Under Construction*, etc. |
| `possessionDate` | `possession_date` | `VARCHAR(50)` | Estimated delivery date |
| `floor` | `floor` | `VARCHAR(50)` | e.g., *Levels 45–52* |
| `featured` | `is_featured` | `BOOLEAN` | Shows on home page featured grid |
| `recentlyAdded` | `recently_added` | `BOOLEAN` | New arrival badge |
| `recommended` | `is_recommended` | `BOOLEAN` | Advisory recommendation |
| `isNewLaunch` | `is_new_launch` | `BOOLEAN` | Controls inclusion in `/properties?tab=new-launches` |
| `isLuxuryCollection`| `is_luxury_collection` | `BOOLEAN` | Controls inclusion in `/properties?tab=luxury-collection` |
| `coverImage` | `cover_image` | `TEXT` | Primary card image URL |
| `images` | `property_images.url` | `TEXT[]` | One-to-many relationship |
| `amenities` | `property_amenities` | `TEXT[]` | Many-to-many to `lookup_amenities` |
| `description` | `description` | `TEXT` | Architectural narrative |
| `highlights` | `highlights` | `TEXT[]` | Bullet point highlights |
| `reraId` | `rera_id` | `VARCHAR(80)` | MahaRERA Registration number |
| `coordinates` | `latitude`, `longitude` | `NUMERIC` | Leaflet map coordinates |
| `floorPlans` | `property_configurations` | `JSON/Relation` | Floor plan diagrams and layout variants |

---

### B. Leads Table Mapping (6 Ingestion Points)

> **Since 2026-10-18:** all 6 forms call `submitLead()` (`src/site/lib/supabase/leads.ts`), which POSTs to `src/app/api/leads/route.ts` (zod validation, same-origin check, burst limit). That route calls `submit_lead(p_lead jsonb, p_ip_hash text)`: max 5 per IP per hour, 3 per phone per 10 minutes. It optionally emails staff via Resend, including when the DB save fails.

All 6 forms on the website insert into the unified `leads` table:

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(120),
  company_name VARCHAR(120),
  source_id UUID NOT NULL REFERENCES lookup_lead_sources(id),
  status_id UUID REFERENCES lookup_lead_statuses(id),
  property_id UUID REFERENCES properties(id),
  commercial_id UUID REFERENCES commercial_properties(id),
  article_id UUID REFERENCES insights_articles(id),
  asset_class VARCHAR(80),
  budget_range VARCHAR(80),
  message TEXT,
  gate_type VARCHAR(50),
  is_otp_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

| Website Touchpoint | Form Location | Ingestion Source Slug (`lookup_lead_sources`) |
| :--- | :--- | :--- |
| **Navbar Advisory Modal** | Header "Talk to Advisory" button | `navbar_advisory` |
| **Property Sticky Sidebar Form** | `/properties/[slug]` sidebar | `property_sidebar_inquiry` |
| **Property Gated Unlock Modal** | `/properties/[slug]` brochure/floorplan click | `property_gate_modal` |
| **Private Opportunities Gate** | Home page `/` OTP form | `private_opportunities_otp` |
| **Commercial Dossier Modal** | `/commercials` "Inquire Commercial" button | `commercial_card_modal` |
| **Market Intelligence Form** | `/market-intelligence/[slug]` consultation box | `article_consultation_modal` |

---

## 3. The Hybrid Fallback Pattern (Safe Wiring)

To guarantee that the public website **never displays a white screen or crashes** even if Supabase is offline or not configured yet, all queries must implement this fallback structure:

```typescript
// Example: Frontend/lib/supabase/properties.ts
import { supabase, isSupabaseConfigured } from './client';
import { PROPERTIES } from '@/data/properties';
import { Property } from '@/types/property';

export async function getProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    return PROPERTIES; // Safe fallback to local data
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('publication_status', 'published')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PROPERTIES;
    }

    return data.map(mapSupabasePropertyToFrontend);
  } catch (err) {
    console.warn('Supabase query failed, falling back to static data:', err);
    return PROPERTIES;
  }
}
```

> **profiles (012, not applied):** `handle_new_user()` inserts `role='admin'`, `is_active=false`; `is_admin()` needs `is_active=true`, so new signups are locked out until promoted. Policies from 003 unchanged. Frontend `PropertyType` now includes `'Apartment'` (default).

> **properties (014):** new column `price_on_request boolean default false`; when true the public site shows "Price on Request" and ignores the numeric price.
