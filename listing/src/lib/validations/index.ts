import { z } from "zod";

/**
 * Number inputs report `""` when a user clears them, which `z.coerce.number()`
 * would read as `0`. Blank, null and NaN all mean "not set" here, so an optional
 * number column stays NULL instead of silently becoming zero.
 */
function optionalNumber<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (value) =>
      value === "" ||
      value === null ||
      value === undefined ||
      (typeof value === "number" && Number.isNaN(value))
        ? null
        : value,
    schema.nullable()
  );
}

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const heroSlideSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(200),
  supporting_text: z.string().max(500).optional().nullable(),
  cta_label: z.string().max(100).optional().nullable(),
  cta_url: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

/**
 * Micro-market pages. Master columns from 006 sit alongside the legacy ones,
 * which the API dual-writes.
 */
export const locationSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  tagline: z.string().max(250).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  city: z.string().max(120).optional().nullable(),
  price_range: z.string().max(50).optional().nullable(),
  average_rate: z.string().max(60).optional().nullable(),
  lifestyle: z.string().max(200).optional().nullable(),
  key_enclaves: z.array(z.string().min(1).max(120)).max(12).default([]),
  is_primary_home: z.boolean().default(false),
  primary_order: optionalNumber(z.coerce.number().int().min(1).max(4)),
  is_future: z.boolean().default(false),
  future_order: optionalNumber(z.coerce.number().int().min(1)),
  publication_status: z.enum(["draft", "published", "archived"]).default("published"),
  /** Canonical directory order (1-based contiguous after save). */
  sort_order: z.coerce.number().int().min(0).default(0),
  meta_title: z.string().max(120).optional().nullable(),
  meta_description: z.string().max(255).optional().nullable(),
  lookup_location_id: z.string().uuid().optional().nullable().or(z.literal("")),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const marketIntelligenceSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  value: z.string().min(1, "Value is required").max(80),
  unit: z.string().max(40).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  change_percentage: z.coerce.number().optional().nullable(),
  source: z.string().max(200).optional().nullable(),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  property_type: z.enum([
    "apartment",
    "villa",
    "penthouse",
    "plot",
    "commercial",
    "duplex",
    "other",
  ]),
  location_id: z.string().uuid().optional().nullable().or(z.literal("")),
  location_name: z.string().max(200).optional().nullable(),
  city: z.string().max(120).optional().nullable(),
  locality: z.string().max(120).optional().nullable(),
  location_details: z.string().max(1000).optional().nullable(),
  tagline: z.string().max(250).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  project_overview: z.string().max(10000).optional().nullable(),
  project_details: z.string().max(10000).optional().nullable(),
  developer_name: z.string().max(200).optional().nullable(),
  developer_description: z.string().max(5000).optional().nullable(),
  price_amount: z.coerce.number().min(0).optional().nullable(),
  price_display: z.string().max(120).optional().nullable(),
  bhk: z.string().max(40).optional().nullable(),
  carpet_area: z.string().max(80).optional().nullable(),
  possession: z.string().max(120).optional().nullable(),
  availability: z.enum(["available", "limited", "sold_out", "coming_soon"]),
  status: z.enum([
    "active",
    "inactive",
    "sold_out",
    "upcoming",
    "ready_to_move",
    "under_construction",
  ]),
  rera_number: z.string().max(120).optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  google_maps_url: z
    .string()
    .url("Enter a valid Google Maps URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  address: z.string().max(500).optional().nullable(),
});

/**
 * Master-spec property form (Phase 4–5). Dual-writes legacy columns in the API.
 */
export const masterPropertySchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  tagline: z.string().min(1, "Tagline is required").max(200),
  /** Project Overview body on the public Property Detail page. */
  description: z.string().min(1, "Project overview is required").max(10000),
  /** Optional on create — Add Property does not require highlights to save. */
  highlights: z.array(z.string().min(1).max(200)).max(8).default([]),
  /** Property-specific developer shown under Developer Overview. */
  developer_name: z.string().max(200).optional().nullable(),
  developer_description: z.string().max(10000).optional().nullable(),
  lookup_location_id: z.string().uuid("Select a location"),
  sub_location: z.string().min(1, "Sub-location is required").max(150),
  property_type_id: z.string().uuid("Select a property type"),
  /** Synced from the first configuration on create; optional on the form. */
  bhk_id: z.string().uuid().optional().nullable().or(z.literal("")),
  status_id: z.string().uuid("Select construction status"),
  /**
   * Optional on Add Property (fields are edit-only in the UI). Blank / NaN
   * must stay null — never coerce to 0 via z.coerce.number().
   */
  price: optionalNumber(
    z.coerce.number().gt(0, "Price must be greater than 0")
  ),
  carpet_area_sqft: optionalNumber(
    z.coerce.number().int().gt(0, "Carpet area must be greater than 0")
  ),
  super_area: optionalNumber(
    z.coerce.number().int().gt(0, "Super area must be greater than 0")
  ),
  possession_date: z.string().min(1, "Possession is required").max(50),
  /** Kept for legacy dual-write; no longer collected on Add Property. */
  floor: z.string().max(80).optional().nullable().or(z.literal("")),
  is_featured: z.boolean().default(false),
  /** Hide the numeric price on the public site and show "Price on Request". */
  price_on_request: z.boolean().default(false),
  recently_added: z.boolean().default(false),
  is_recommended: z.boolean().default(false),
  is_new_launch: z.boolean().default(false),
  is_luxury_collection: z.boolean().default(false),
  launch_phase_id: z.string().uuid().optional().nullable().or(z.literal("")),
  rera_id: z.string().min(1, "RERA number is required").max(50),
  latitude: optionalNumber(z.coerce.number().min(-90).max(90)),
  longitude: optionalNumber(z.coerce.number().min(-180).max(180)),
  publication_status: z.enum(["draft", "published", "archived"]).default("published"),
  sort_order: z.coerce.number().int().min(0).default(0),
  meta_title: z.string().max(120).optional().nullable(),
  meta_description: z.string().max(255).optional().nullable(),
  /** Optional link to editorial micro-market page (legacy locations). */
  location_id: z.string().uuid().optional().nullable().or(z.literal("")),
});

export const propertyConfigurationSchema = z.object({
  plan_type: z.enum(["master", "floor", "individual"], {
    required_error: "Select a plan type",
    invalid_type_error: "Select a valid plan type",
  }),
  variant_code: z.enum(["1bhk", "2bhk", "3bhk", "4bhk", "5bhk", "custom"], {
    required_error: "Select a variant code",
    invalid_type_error: "Select a valid variant code",
  }),
  tab_label: z.string().min(1, "Tab label is required").max(30),
  title: z.string().min(1, "Title / typology is required").max(100),
  area_range: z.string().max(60).default(""),
  carpet_area: z.string().max(50).default(""),
  price_indicator: z.string().max(60).default(""),
  tower_zone: z.string().max(100).default(""),
  image_path: z.string().max(2000).optional().default(""),
  display_order: z.coerce.number().int().min(0, "Display order must be 0 or greater").default(0),
});

/**
 * Inline Add Property configuration row. Maps onto property_configurations:
 * variant_code + optional custom_type → tab_label; title; area_range;
 * price_indicator.
 */
export const configurationDraftRowSchema = z
  .object({
    variant_code: z.enum(["1bhk", "2bhk", "3bhk", "4bhk", "5bhk", "custom"], {
      required_error: "Select BHK / Type",
      invalid_type_error: "Select a valid BHK / Type",
    }),
    custom_type: z.string().max(100).optional().default(""),
    title: z.string().max(100).optional().default(""),
    area_range: z.string().max(60).optional().default(""),
    price_indicator: z.string().max(60).optional().default(""),
  })
  .superRefine((row, ctx) => {
    if (row.variant_code === "custom" && !row.custom_type?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a custom type when Other is selected",
        path: ["custom_type"],
      });
    }

    const area = row.area_range?.trim() ?? "";
    if (!area) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Area range is required",
        path: ["area_range"],
      });
    } else if (/[a-zA-Z]{4,}/.test(area) && !/\d/.test(area)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Area range should include a number (sq.ft)",
        path: ["area_range"],
      });
    }

    if (!row.price_indicator?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price range is required",
        path: ["price_indicator"],
      });
    }
  });

export const configurationDraftListSchema = z
  .array(configurationDraftRowSchema)
  .min(1, "Add at least one configuration");

export const configurationSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  bhk: z.string().max(40).optional().nullable(),
  variant: z.string().max(120).optional().nullable(),
  carpet_area: z.string().max(80).optional().nullable(),
  possession: z.string().max(120).optional().nullable(),
  price: z.coerce.number().min(0).optional().nullable(),
  price_display: z.string().max(120).optional().nullable(),
  availability: z.enum(["available", "limited", "sold_out", "coming_soon"]),
  status: z.string().max(40).default("active"),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const priceBreakdownSchema = z.object({
  label: z.string().min(1, "Label is required").max(120),
  amount: z.coerce.number().min(0, "Amount must be 0 or greater"),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const floorPlanSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  plan_type: z.enum(["floor_plan", "master_plan", "configuration_plan"]),
  configuration_id: z.string().uuid().optional().nullable().or(z.literal("")),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const inventoryUnitSchema = z.object({
  unit_number: z.string().min(1, "Unit number is required").max(40),
  floor: z.string().max(40).optional().nullable(),
  facing: z.string().max(40).optional().nullable(),
  configuration_id: z.string().uuid().optional().nullable().or(z.literal("")),
  price: z.coerce.number().min(0).optional().nullable(),
  status: z.enum(["available", "booked", "hold", "sold"]),
  notes: z.string().max(1000).optional().nullable(),
});

export const amenitySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  icon: z.string().max(80).optional().nullable(),
  is_active: z.boolean().default(true),
});

export const businessSettingsSchema = z.object({
  business_name: z.string().min(1, "Business name is required").max(200),
  phone: z.string().max(40).optional().default(""),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  office_address: z.string().max(500).optional().default(""),
  whatsapp: z.string().max(40).optional().default(""),
  currency: z.string().min(1).max(10).default("INR"),
  social_links: z
    .object({
      facebook: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
    })
    .optional()
    .default({}),
});

export const siteBrandingSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required").max(100),
  est_year: z.coerce.number().int().min(1900).max(2100),
  est_badge: z.string().min(1).max(30),
  brand_tagline: z.string().min(1).max(200),
  contact_landline: z.string().min(1).max(30),
  contact_mobile: z.string().max(30).optional().nullable(),
  whatsapp_number: z
    .string()
    .min(10)
    .max(20)
    .regex(/^[0-9]{10,15}$/, "Digits only, 10–15 characters"),
  contact_email: z.string().email("Enter a valid email").max(120),
  advisory_email: z.string().email("Enter a valid email").max(120),
  office_building: z.string().min(1).max(150),
  office_street: z.string().min(1).max(150),
  office_city_pin: z.string().min(1).max(100),
  working_hours: z.string().min(1).max(100),
  firm_rera_number: z.string().min(1).max(50),
  official_website: z.string().url("Enter a valid URL").max(255),
  nav_cta_label: z.string().min(1).max(50),
  meta_title: z.string().min(1).max(100),
  meta_desc: z.string().min(1).max(255),
  social_links: z
    .object({
      linkedin: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      x: z.string().url().optional().or(z.literal("")),
      youtube: z.string().url().optional().or(z.literal("")),
    })
    .default({ linkedin: "", instagram: "", x: "" }),
});

export const pageContentSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  subtitle: z.string().max(2000).optional().nullable(),
  breadcrumb: z.string().max(100).optional().nullable(),
  badge: z.string().max(80).optional().nullable(),
  meta_title: z.string().min(1, "Meta title is required").max(120),
  meta_description: z.string().min(1, "Meta description is required").max(255),
  sections_data: z.record(z.unknown()).default({}),
});

export const commercialPropertySchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  tagline: z.string().min(1, "Tagline is required").max(200),
  lookup_location_id: z.string().uuid("Select a location"),
  deal_type: z.enum(["buy", "pre_lease", "rent"], { message: "Select Buy, Pre-Lease or Rent" }),
  sub_location: z.string().min(1, "Sub-location is required").max(150),
  price: z.coerce.number().gt(0, "Enter the amount, it must be greater than 0").max(9999.99, "Amount is too large"),
  carpet_area: z.coerce.number().int().gt(0, "Carpet area is required"),
  commercial_type_id: z.string().uuid("Select a commercial type"),
  floor: z.string().min(1, "Floor details are required").max(80),
  possession: z.string().min(1, "Possession is required").max(50),
  grade_id: z.string().uuid().optional().nullable().or(z.literal("")),
  cover_image: z.string().max(2000).optional().default(""),
  rera_id: z.string().max(50).optional().default(""),
  description: z.string().min(1, "Description is required").max(10000),
  highlights: z.array(z.string().min(1).max(200)).max(8).default([]),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  sort_order: z.coerce.number().int().min(0).default(0),
  meta_title: z.string().max(120).optional().nullable(),
  meta_description: z.string().max(255).optional().nullable(),
});

export const insightsArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  category_header: z.string().min(1, "Category header is required").max(80),
  category_id: z.string().uuid("Select a category"),
  subtitle: z.string().max(200).optional().default(""),
  description: z.string().min(1, "Description is required").max(2000),
  tag: z.string().max(50).optional().default(""),
  date_tag: z.string().max(50).optional().default(""),
  image_path: z.string().max(2000).optional().default(""),
  author_name: z.string().min(1).max(100).default("Advisory Research Desk"),
  author_role: z.string().max(100).optional().default(""),
  author_desk: z.string().max(100).optional().default("Parmar Properties Research"),
  key_takeaways: z.array(z.string().min(1).max(300)).max(8).default([]),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  sort_order: z.coerce.number().int().min(0).default(0),
  meta_title: z.string().max(120).optional().nullable(),
  meta_description: z.string().max(255).optional().nullable(),
});

export const articleSectionSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(150),
  paragraphs: z.array(z.string().min(1)).default([]),
  table_data: z
    .object({
      headers: z.array(z.string()).optional(),
      rows: z.array(z.array(z.string())).optional(),
    })
    .nullable()
    .optional(),
  highlight_quote: z.string().max(1000).optional().nullable(),
  section_order: z.coerce.number().int().min(0).default(0),
});

export const lookupItemSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  name: z.string().min(1, "Name is required").max(100),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type MarketIntelligenceInput = z.infer<typeof marketIntelligenceSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type MasterPropertyInput = z.infer<typeof masterPropertySchema>;
export type PropertyConfigurationInput = z.infer<typeof propertyConfigurationSchema>;
export type ConfigurationDraftRowInput = z.infer<typeof configurationDraftRowSchema>;
export type ConfigurationInput = z.infer<typeof configurationSchema>;
export type PriceBreakdownInput = z.infer<typeof priceBreakdownSchema>;
export type FloorPlanInput = z.infer<typeof floorPlanSchema>;
export type InventoryUnitInput = z.infer<typeof inventoryUnitSchema>;
export type AmenityInput = z.infer<typeof amenitySchema>;
export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>;
export type SiteBrandingInput = z.infer<typeof siteBrandingSchema>;
export type PageContentInput = z.infer<typeof pageContentSchema>;
export type CommercialPropertyInput = z.infer<typeof commercialPropertySchema>;
export type InsightsArticleInput = z.infer<typeof insightsArticleSchema>;
export type ArticleSectionInput = z.infer<typeof articleSectionSchema>;
export type LookupItemInput = z.infer<typeof lookupItemSchema>;
