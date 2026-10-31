import type {
  Configuration,
  ConfigurationWithBreakdown,
  PriceBreakdown,
} from "@/types";
import type { ConfigurationInput, PriceBreakdownInput } from "@/lib/validations";

import { getSupabase, nullifyEmpty, throwOnError } from "./client";

const TABLE = "configurations";
const BREAKDOWN_TABLE = "price_breakdowns";

export async function listConfigurations(
  propertyId: string
): Promise<Configuration[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading configurations");
  return (data ?? []) as unknown as Configuration[];
}

/**
 * Configurations with their price breakdown rows attached.
 */
export async function listConfigurationsWithBreakdowns(
  propertyId: string
): Promise<ConfigurationWithBreakdown[]> {
  const supabase = getSupabase();
  const configurations = await listConfigurations(propertyId);
  if (configurations.length === 0) return [];

  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .select("*")
    .in(
      "configuration_id",
      configurations.map((c) => c.id)
    )
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading price breakdowns");
  const breakdowns = (data ?? []) as unknown as PriceBreakdown[];

  return configurations.map((configuration) => ({
    ...configuration,
    price_breakdowns: breakdowns.filter(
      (row) => row.configuration_id === configuration.id
    ),
  }));
}

export async function createConfiguration(
  propertyId: string,
  input: ConfigurationInput
): Promise<Configuration> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...nullifyEmpty(input), property_id: propertyId })
    .select("*")
    .single();

  throwOnError(error, "Creating configuration");
  return data as unknown as Configuration;
}

export async function updateConfiguration(
  id: string,
  input: ConfigurationInput
): Promise<Configuration> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(nullifyEmpty(input))
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating configuration");
  return data as unknown as Configuration;
}

export async function deleteConfiguration(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting configuration");
}

export async function getNextConfigurationOrder(
  propertyId: string
): Promise<number> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("display_order")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: false })
    .limit(1);

  throwOnError(error, "Loading configuration order");
  const highest = (data?.[0]?.display_order as number | undefined) ?? -1;
  return highest + 1;
}

export async function reorderConfigurations(ids: string[]): Promise<void> {
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

// ---------------------------------------------------------------- breakdowns

export async function listPriceBreakdowns(
  configurationId: string
): Promise<PriceBreakdown[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .select("*")
    .eq("configuration_id", configurationId)
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading price breakdown");
  return (data ?? []) as unknown as PriceBreakdown[];
}

export async function createPriceBreakdown(
  configurationId: string,
  input: PriceBreakdownInput
): Promise<PriceBreakdown> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .insert({ ...nullifyEmpty(input), configuration_id: configurationId })
    .select("*")
    .single();

  throwOnError(error, "Adding price line");
  return data as unknown as PriceBreakdown;
}

export async function updatePriceBreakdown(
  id: string,
  input: PriceBreakdownInput
): Promise<PriceBreakdown> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(BREAKDOWN_TABLE)
    .update(nullifyEmpty(input))
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating price line");
  return data as unknown as PriceBreakdown;
}

export async function deletePriceBreakdown(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(BREAKDOWN_TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting price line");
}

/**
 * Replaces every price line for a configuration with the supplied rows.
 */
export async function savePriceBreakdowns(
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
