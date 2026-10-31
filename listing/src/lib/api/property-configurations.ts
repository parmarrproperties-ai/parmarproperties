import type {
  PropertyConfiguration,
  PropertyConfigurationPriceBreakdown,
  PropertyConfigurationWithBreakdowns,
} from "@/types";
import type {
  PriceBreakdownInput,
  PropertyConfigurationInput,
} from "@/lib/validations";

import { getSupabase, throwOnError } from "./client";
import { resolvePublicUrl } from "./storage";

const TABLE = "property_configurations";
const BREAKDOWN_TABLE = "property_configuration_price_breakdowns";

/**
 * Every text column on this table is NOT NULL with an empty-string default, so
 * blanks are written as `""` rather than nulled out.
 */
function toPayload(input: PropertyConfigurationInput): Record<string, unknown> {
  return {
    plan_type: input.plan_type,
    variant_code: input.variant_code,
    tab_label: input.tab_label,
    title: input.title,
    area_range: input.area_range ?? "",
    carpet_area: input.carpet_area ?? "",
    price_indicator: input.price_indicator ?? "",
    tower_zone: input.tower_zone ?? "",
    image_path: input.image_path ?? "",
    display_order: input.display_order ?? 0,
  };
}

export async function listPropertyConfigurations(
  propertyId: string
): Promise<PropertyConfiguration[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading property configurations");
  return (data ?? []) as unknown as PropertyConfiguration[];
}

/**
 * Matrix typologies with their master price-breakdown line items attached.
 */
export async function listPropertyConfigurationsWithBreakdowns(
  propertyId: string
): Promise<PropertyConfigurationWithBreakdowns[]> {
  const configurations = await listPropertyConfigurations(propertyId);
  if (configurations.length === 0) return [];

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .select("*")
    .in(
      "configuration_id",
      configurations.map((row) => row.id)
    )
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading configuration price breakdowns");
  const breakdowns =
    (data ?? []) as unknown as PropertyConfigurationPriceBreakdown[];

  return configurations.map((configuration) => ({
    ...configuration,
    price_breakdowns: breakdowns.filter(
      (row) => row.configuration_id === configuration.id
    ),
  }));
}

export async function getNextPropertyConfigurationOrder(
  propertyId: string
): Promise<number> {
  const rows = await listPropertyConfigurations(propertyId);
  if (rows.length === 0) return 0;
  return Math.max(...rows.map((row) => row.display_order)) + 1;
}

export async function createPropertyConfiguration(
  propertyId: string,
  input: PropertyConfigurationInput
): Promise<PropertyConfiguration> {
  const [row] = await createPropertyConfigurationsBatch(propertyId, [input]);
  return row;
}

/**
 * Single round-trip insert for multiple configuration matrix rows.
 * Used by Add Property after layout images have been resolved.
 */
export async function createPropertyConfigurationsBatch(
  propertyId: string,
  inputs: PropertyConfigurationInput[]
): Promise<PropertyConfiguration[]> {
  if (inputs.length === 0) return [];

  const supabase = getSupabase();
  const rows = inputs.map((input) => ({
    property_id: propertyId,
    ...toPayload(input),
  }));

  const { data, error } = await supabase
    .from(TABLE)
    .insert(rows)
    .select("id, property_id, plan_type, variant_code, tab_label, title, area_range, carpet_area, price_indicator, tower_zone, image_path, display_order, created_at, updated_at");

  throwOnError(error, "Creating configurations");
  return (data ?? []) as unknown as PropertyConfiguration[];
}

export async function updatePropertyConfiguration(
  id: string,
  input: PropertyConfigurationInput
): Promise<PropertyConfiguration> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(toPayload(input))
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating configuration");
  return data as unknown as PropertyConfiguration;
}

export async function deletePropertyConfiguration(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting configuration");
}

export async function reorderPropertyConfigurations(
  ids: string[]
): Promise<void> {
  const supabase = getSupabase();
  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ display_order: index })
        .eq("id", id);
      throwOnError(error, "Reordering configurations");
    })
  );
}

export interface ReusableConfigurationLayoutAsset {
  id: string;
  title: string;
  tab_label: string;
  variant_code: string;
  image_path: string;
  image_url: string;
  property_id: string;
}

/**
 * Individual layout images already stored on property_configurations.image_path.
 * Used by Add Property → Select Existing for Individual Layout.
 */
export async function listReusableConfigurationLayoutAssets(): Promise<
  ReusableConfigurationLayoutAsset[]
> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, title, tab_label, variant_code, image_path, property_id")
    .neq("image_path", "")
    .not("image_path", "is", null)
    .order("updated_at", { ascending: false })
    .limit(60);

  throwOnError(error, "Loading reusable configuration layouts");

  return ((data ?? []) as Array<{
    id: string;
    title: string;
    tab_label: string;
    variant_code: string;
    image_path: string;
    property_id: string;
  }>)
    .filter((row) => Boolean(row.image_path?.trim()))
    .map((row) => ({
      ...row,
      image_url: resolvePublicUrl(row.image_path) ?? row.image_path,
    }));
}

// ---------------------------------------------------------------- breakdowns

export async function listPropertyConfigurationPriceBreakdowns(
  configurationId: string
): Promise<PropertyConfigurationPriceBreakdown[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .select("*")
    .eq("configuration_id", configurationId)
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading configuration price breakdown");
  return (data ?? []) as unknown as PropertyConfigurationPriceBreakdown[];
}

export async function createPropertyConfigurationPriceBreakdown(
  configurationId: string,
  input: PriceBreakdownInput
): Promise<PropertyConfigurationPriceBreakdown> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .insert({
      configuration_id: configurationId,
      label: input.label,
      amount: input.amount,
      display_order: input.display_order ?? 0,
    })
    .select("*")
    .single();

  throwOnError(error, "Adding price line");
  return data as unknown as PropertyConfigurationPriceBreakdown;
}

export async function updatePropertyConfigurationPriceBreakdown(
  id: string,
  input: PriceBreakdownInput
): Promise<PropertyConfigurationPriceBreakdown> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .update({
      label: input.label,
      amount: input.amount,
      display_order: input.display_order ?? 0,
    })
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating price line");
  return data as unknown as PropertyConfigurationPriceBreakdown;
}

export async function deletePropertyConfigurationPriceBreakdown(
  id: string
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(BREAKDOWN_TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting price line");
}

export async function reorderPropertyConfigurationPriceBreakdowns(
  ids: string[]
): Promise<void> {
  const supabase = getSupabase();
  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(BREAKDOWN_TABLE)
        .update({ display_order: index })
        .eq("id", id);
      throwOnError(error, "Reordering price lines");
    })
  );
}

/**
 * Replaces every price line for a master property_configuration.
 */
export async function savePropertyConfigurationPriceBreakdowns(
  configurationId: string,
  rows: PriceBreakdownInput[]
): Promise<void> {
  const supabase = getSupabase();

  const { error: deleteError } = await supabase
    .from(BREAKDOWN_TABLE)
    .delete()
    .eq("configuration_id", configurationId);

  throwOnError(deleteError, "Saving price breakdown");
  if (rows.length === 0) return;

  const { error } = await supabase.from(BREAKDOWN_TABLE).insert(
    rows.map((row, index) => ({
      configuration_id: configurationId,
      label: row.label,
      amount: row.amount,
      display_order: row.display_order ?? index,
    }))
  );

  throwOnError(error, "Saving price breakdown");
}
