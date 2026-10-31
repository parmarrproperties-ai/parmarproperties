import type { BusinessSettings, SiteBranding, SiteSetting } from "@/types";
import type {
  BusinessSettingsInput,
  SiteBrandingInput,
} from "@/lib/validations";

import { getSupabase, throwOnError } from "./client";

const TABLE = "site_settings";
const BRANDING_TABLE = "site_branding";
export const BUSINESS_SETTINGS_KEY = "business";

export const defaultBusinessSettings: BusinessSettings = {
  business_name: "Parmar Properties",
  phone: "",
  email: "",
  office_address: "",
  whatsapp: "",
  currency: "INR",
  social_links: {},
};

export async function getSetting(key: string): Promise<SiteSetting | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("key", key)
    .maybeSingle();

  throwOnError(error, "Loading settings");
  return (data as unknown as SiteSetting) ?? null;
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const setting = await getSetting(BUSINESS_SETTINGS_KEY);
  if (!setting) return defaultBusinessSettings;

  return {
    ...defaultBusinessSettings,
    ...(setting.value as Partial<BusinessSettings>),
    social_links: {
      ...defaultBusinessSettings.social_links,
      ...((setting.value as Partial<BusinessSettings>)?.social_links ?? {}),
    },
  };
}

export async function saveBusinessSettings(
  input: BusinessSettingsInput
): Promise<BusinessSettings> {
  const supabase = getSupabase();
  const existing = await getSetting(BUSINESS_SETTINGS_KEY);
  const value = input as unknown as Record<string, unknown>;

  if (existing) {
    const { error } = await supabase
      .from(TABLE)
      .update({ value })
      .eq("id", existing.id);
    throwOnError(error, "Saving settings");
  } else {
    const { error } = await supabase
      .from(TABLE)
      .insert({ key: BUSINESS_SETTINGS_KEY, value });
    throwOnError(error, "Saving settings");
  }

  return getBusinessSettings();
}

/**
 * Currency code used across the admin for money formatting.
 */
export async function getCurrency(): Promise<string> {
  const settings = await getBusinessSettings();
  return settings.currency || "INR";
}

/**
 * Global corporate branding for the public site (firm RERA, office, contacts).
 * Singleton row `id = 1`. Returns null if the table has not been seeded yet.
 */
export async function getSiteBranding(): Promise<SiteBranding | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BRANDING_TABLE)
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  throwOnError(error, "Loading site branding");
  return (data as unknown as SiteBranding) ?? null;
}

/**
 * Updates the site_branding singleton and dual-writes overlapping fields into
 * legacy `site_settings.business` so older Admin consumers stay consistent.
 */
export async function saveSiteBranding(
  input: SiteBrandingInput
): Promise<SiteBranding> {
  const supabase = getSupabase();
  const payload = {
    brand_name: input.brand_name,
    est_year: input.est_year,
    est_badge: input.est_badge,
    brand_tagline: input.brand_tagline,
    contact_landline: input.contact_landline,
    contact_mobile: input.contact_mobile || null,
    whatsapp_number: input.whatsapp_number,
    contact_email: input.contact_email,
    advisory_email: input.advisory_email,
    office_building: input.office_building,
    office_street: input.office_street,
    office_city_pin: input.office_city_pin,
    working_hours: input.working_hours,
    firm_rera_number: input.firm_rera_number,
    official_website: input.official_website,
    nav_cta_label: input.nav_cta_label,
    meta_title: input.meta_title,
    meta_desc: input.meta_desc,
    social_links: input.social_links ?? {},
  };

  const { data, error } = await supabase
    .from(BRANDING_TABLE)
    .update(payload)
    .eq("id", 1)
    .select("*")
    .single();

  throwOnError(error, "Saving site branding");

  // Dual-write legacy business settings for overlapping contact fields.
  const officeAddress = [
    input.office_building,
    input.office_street,
    input.office_city_pin,
  ]
    .filter(Boolean)
    .join(", ");

  await saveBusinessSettings({
    business_name: input.brand_name,
    phone: input.contact_landline,
    email: input.contact_email,
    office_address: officeAddress,
    whatsapp: input.whatsapp_number,
    currency: (await getBusinessSettings()).currency || "INR",
    social_links: {
      linkedin: input.social_links?.linkedin ?? "",
      instagram: input.social_links?.instagram ?? "",
      twitter: input.social_links?.x ?? "",
    },
  });

  return data as unknown as SiteBranding;
}
