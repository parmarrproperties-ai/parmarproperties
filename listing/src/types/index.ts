export type PropertyStatus =
  | "active"
  | "inactive"
  | "sold_out"
  | "upcoming"
  | "ready_to_move"
  | "under_construction";

export type PropertyType =
  | "apartment"
  | "villa"
  | "penthouse"
  | "plot"
  | "commercial"
  | "duplex"
  | "other";

export type AvailabilityStatus =
  | "available"
  | "limited"
  | "sold_out"
  | "coming_soon";

export type FloorPlanType = "floor_plan" | "master_plan" | "configuration_plan";

export type InventoryStatus = "available" | "booked" | "hold" | "sold";

export type AdminRole = "admin" | "super_admin";

export interface AuditFields {
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface Profile extends AuditFields {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
}

export interface HeroSlide extends AuditFields {
  id: string;
  heading: string;
  supporting_text: string | null;
  cta_label: string | null;
  cta_url: string | null;
  image_path: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

export interface Location extends AuditFields {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  city: string | null;
  image_path: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  // Master columns (006)
  slug: string | null;
  cover_image: string | null;
  price_range: string | null;
  average_rate: string | null;
  lifestyle: string | null;
  key_enclaves: string[];
  is_primary_home: boolean;
  primary_order: number | null;
  is_future: boolean;
  future_order: number | null;
  publication_status: PublicationStatus;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  lookup_location_id: string | null;
}

export interface MarketIntelligence extends AuditFields {
  id: string;
  title: string;
  value: string;
  unit: string | null;
  description: string | null;
  change_percentage: number | null;
  source: string | null;
  is_active: boolean;
  display_order: number;
}

export type PublicationStatus = "draft" | "published" | "archived";

export type PropertyConfigPlanType = "master" | "floor" | "individual";
export type PropertyConfigVariant =
  | "1bhk"
  | "2bhk"
  | "3bhk"
  | "4bhk"
  | "5bhk"
  | "custom";

export type PropertyCollection = "buy" | "new-launches" | "luxury";

export interface Property extends AuditFields {
  id: string;
  /** @deprecated Prefer `title` (master). Kept for legacy Admin compatibility. */
  name: string;
  slug: string;
  /** @deprecated Prefer `property_type_id`. */
  property_type: PropertyType;
  /** Editorial micro-market page FK (legacy `locations`). */
  location_id: string | null;
  location_name: string | null;
  city: string | null;
  locality: string | null;
  location_details: string | null;
  tagline: string | null;
  description: string | null;
  project_overview: string | null;
  project_details: string | null;
  developer_name: string | null;
  developer_description: string | null;
  /** @deprecated Prefer `price` (₹ Cr). */
  price_amount: number | null;
  price_display: string | null;
  /** @deprecated Prefer `bhk_id`. */
  bhk: string | null;
  /** @deprecated Prefer `carpet_area_sqft`. */
  carpet_area: string | null;
  /** @deprecated Prefer `possession_date`. */
  possession: string | null;
  availability: AvailabilityStatus;
  /** @deprecated Prefer `publication_status` / `status_id`. */
  status: PropertyStatus;
  /** @deprecated Prefer `rera_id`. */
  rera_number: string | null;
  rera_qr_path: string | null;
  rera_qr_url: string | null;
  brochure_path: string | null;
  brochure_url: string | null;
  is_featured: boolean;
  featured_order: number | null;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  address: string | null;
  deleted_at: string | null;

  // —— Master schema columns (006) ——
  title: string | null;
  sub_location: string | null;
  /** Price in ₹ Crores. */
  price: number | null;
  bhk_id: string | null;
  carpet_area_sqft: number | null;
  super_area: number | null;
  property_type_id: string | null;
  status_id: string | null;
  possession_date: string | null;
  floor: string | null;
  recently_added: boolean;
  price_on_request: boolean;
  is_recommended: boolean;
  is_new_launch: boolean;
  /** Editorial Luxury Collection inclusion (also derived from price ≥ ₹25 Cr). */
  is_luxury_collection: boolean;
  launch_phase_id: string | null;
  cover_image: string | null;
  rera_id: string | null;
  rera_qr_image: string | null;
  highlights: string[];
  publication_status: PublicationStatus;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  /** FK → lookup_locations (master catalog). */
  lookup_location_id: string | null;
}

export interface PropertyImage extends AuditFields {
  id: string;
  property_id: string;
  path: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

export interface Configuration extends AuditFields {
  id: string;
  property_id: string;
  name: string;
  bhk: string | null;
  variant: string | null;
  carpet_area: string | null;
  possession: string | null;
  price: number | null;
  price_display: string | null;
  availability: AvailabilityStatus;
  status: string;
  display_order: number;
}

export interface PriceBreakdown extends AuditFields {
  id: string;
  configuration_id: string;
  label: string;
  amount: number;
  display_order: number;
}

export interface FloorPlan extends AuditFields {
  id: string;
  property_id: string;
  configuration_id: string | null;
  name: string;
  plan_type: FloorPlanType;
  image_path: string | null;
  image_url: string | null;
  file_path: string | null;
  file_url: string | null;
  is_active: boolean;
  display_order: number;
}

export interface Amenity extends AuditFields {
  id: string;
  name: string;
  icon: string | null;
  is_active: boolean;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  /** Legacy amenities catalog FK (nullable after 006). */
  amenity_id: string | null;
  /** Master lookup_amenities FK. */
  lookup_amenity_id: string | null;
  /**
   * Property-exclusive amenity label (migration 009). When set, FKs stay null
   * so the amenity never enters the global lookup catalogue.
   */
  custom_label: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  amenity?: Amenity;
  lookup_amenity?: LookupItem;
}

export interface PropertyConfiguration {
  id: string;
  property_id: string;
  plan_type: PropertyConfigPlanType;
  variant_code: PropertyConfigVariant;
  tab_label: string;
  title: string;
  area_range: string;
  carpet_area: string;
  price_indicator: string;
  tower_zone: string;
  image_path: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Cost-sheet line for a master matrix typology
 * (`property_configuration_price_breakdowns`).
 */
export interface PropertyConfigurationPriceBreakdown extends AuditFields {
  id: string;
  configuration_id: string;
  label: string;
  amount: number;
  display_order: number;
}

export interface PropertyConfigurationWithBreakdowns
  extends PropertyConfiguration {
  price_breakdowns?: PropertyConfigurationPriceBreakdown[];
}

export interface InventoryUnit extends AuditFields {
  id: string;
  property_id: string;
  configuration_id: string | null;
  unit_number: string;
  floor: string | null;
  facing: string | null;
  price: number | null;
  status: InventoryStatus;
  notes: string | null;
}

/**
 * Shared shape of every `lookup_*` catalogue added in 004.
 */
export interface LookupItem {
  id: string;
  slug: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  company_name: string | null;
  source_id: string;
  status_id: string | null;
  property_id: string | null;
  commercial_id: string | null;
  article_id: string | null;
  asset_class: string | null;
  budget_range: string | null;
  message: string | null;
  gate_type: string | null;
  is_otp_verified: boolean;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadWithRelations extends Lead {
  source?: LookupItem | null;
  status?: LookupItem | null;
  property?: Pick<Property, "id" | "name" | "slug" | "title"> | null;
  commercial?: Pick<CommercialProperty, "id" | "title" | "slug"> | null;
  article?: Pick<InsightsArticle, "id" | "title" | "slug"> | null;
  assignee?: Pick<Profile, "id" | "full_name" | "email"> | null;
}

export interface LeadFilters {
  search?: string;
  source_id?: string;
  status_id?: string;
  /** `"unassigned"`, or the id of an advisor. */
  assigned?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export interface SiteSetting extends AuditFields {
  id: string;
  key: string;
  value: Record<string, unknown>;
}

export interface BusinessSettings {
  business_name: string;
  phone: string;
  email: string;
  office_address: string;
  whatsapp: string;
  currency: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

/**
 * Singleton corporate branding (`site_branding`, MASTER_BACKEND_SPEC §A).
 * Global firm facts — not copied onto every property.
 */
export interface SiteBranding {
  id: number;
  brand_name: string;
  est_year: number;
  est_badge: string;
  brand_tagline: string;
  contact_landline: string;
  contact_mobile: string | null;
  whatsapp_number: string;
  contact_email: string;
  advisory_email: string;
  office_building: string;
  office_street: string;
  office_city_pin: string;
  working_hours: string;
  firm_rera_number: string;
  official_website: string;
  nav_cta_label: string;
  meta_title: string;
  meta_desc: string;
  social_links: Record<string, string>;
  updated_at: string;
}

/** `page_content` — one row per public route (MASTER_BACKEND_SPEC §B). */
export interface PageContent {
  id: string;
  title: string;
  subtitle: string | null;
  breadcrumb: string | null;
  badge: string | null;
  meta_title: string;
  meta_description: string;
  sections_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  updated_by?: string | null;
}

/** Commercial catalog (`commercial_properties`, MASTER_BACKEND_SPEC §C.5). */
export interface CommercialProperty extends AuditFields {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  hub_id: string;
  sub_location: string;
  price: number;
  carpet_area: number;
  commercial_type_id: string;
  floor: string;
  possession: string;
  grade_id: string | null;
  cover_image: string;
  rera_id: string;
  description: string;
  highlights: string[];
  status: PublicationStatus;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
}

export interface CommercialPropertyWithRelations extends CommercialProperty {
  hub?: LookupItem | null;
  commercial_type?: LookupItem | null;
  grade?: LookupItem | null;
}

export interface CommercialFilters {
  search?: string;
  status?: PublicationStatus | "";
  hub_id?: string;
  sort?: "newest" | "oldest" | "title" | "price" | "updated";
  page?: number;
  pageSize?: number;
}

/** Market Intelligence articles (`insights_articles`, §C.7). */
export interface InsightsArticle extends AuditFields {
  id: string;
  slug: string;
  category_header: string;
  category_id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  date_tag: string;
  image_path: string;
  author_name: string;
  author_role: string;
  author_desk: string;
  key_takeaways: string[];
  status: PublicationStatus;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
}

export interface ArticleSection {
  id: string;
  article_id: string;
  section_order: number;
  heading: string;
  paragraphs: string[];
  table_data: Record<string, unknown> | null;
  highlight_quote: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InsightsArticleWithRelations extends InsightsArticle {
  category?: LookupItem | null;
  sections?: ArticleSection[];
}

export interface InsightsFilters {
  search?: string;
  status?: PublicationStatus | "";
  category_id?: string;
  sort?: "newest" | "oldest" | "title" | "updated";
  page?: number;
  pageSize?: number;
}

export interface PropertyWithRelations extends Property {
  images?: PropertyImage[];
  configurations?: Configuration[];
  property_configurations?: PropertyConfiguration[];
  floor_plans?: FloorPlan[];
  property_amenities?: PropertyAmenity[];
  inventory_units?: InventoryUnit[];
  location?: Location | null;
}

export interface ConfigurationWithBreakdown extends Configuration {
  price_breakdowns?: PriceBreakdown[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PropertyFilters {
  search?: string;
  status?: PropertyStatus | "";
  property_type?: PropertyType | "";
  bhk?: string;
  featured?: "true" | "false" | "";
  availability?: AvailabilityStatus | "";
  /** Master publication filter. */
  publication_status?: PublicationStatus | "";
  /** Buy / New Launches / Luxury collection filter. */
  collection?: PropertyCollection | "";
  sort?: "newest" | "oldest" | "name" | "price" | "updated";
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  featuredProperties: number;
  availableUnits: number;
  recentlyUpdated: Property[];
  recentlyAdded: Property[];
}
