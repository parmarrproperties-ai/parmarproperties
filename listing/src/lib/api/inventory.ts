import type { InventoryStatus, InventoryUnit } from "@/types";
import type { InventoryUnitInput } from "@/lib/validations";

import { getSupabase, nullifyEmpty, throwOnError } from "./client";

const TABLE = "inventory_units";

export async function listInventoryUnits(
  propertyId: string
): Promise<InventoryUnit[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("property_id", propertyId)
    .order("unit_number", { ascending: true });

  throwOnError(error, "Loading inventory");
  return (data ?? []) as unknown as InventoryUnit[];
}

export async function createInventoryUnit(
  propertyId: string,
  input: InventoryUnitInput
): Promise<InventoryUnit> {
  const supabase = getSupabase();
  const payload = nullifyEmpty(input);
  if (!payload.configuration_id) payload.configuration_id = null;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...payload, property_id: propertyId })
    .select("*")
    .single();

  throwOnError(error, "Creating unit");
  return data as unknown as InventoryUnit;
}

export async function updateInventoryUnit(
  id: string,
  input: InventoryUnitInput
): Promise<InventoryUnit> {
  const supabase = getSupabase();
  const payload = nullifyEmpty(input);
  if (!payload.configuration_id) payload.configuration_id = null;

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating unit");
  return data as unknown as InventoryUnit;
}

export async function deleteInventoryUnit(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting unit");
}

export async function setInventoryUnitStatus(
  id: string,
  status: InventoryStatus
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  throwOnError(error, "Updating unit status");
}

/**
 * Creates several units at once, e.g. "A-101 … A-110" on one floor.
 */
export async function bulkCreateInventoryUnits(
  propertyId: string,
  units: InventoryUnitInput[]
): Promise<number> {
  if (units.length === 0) return 0;

  const supabase = getSupabase();
  const rows = units.map((unit) => {
    const payload = nullifyEmpty(unit);
    if (!payload.configuration_id) payload.configuration_id = null;
    return { ...payload, property_id: propertyId };
  });

  const { data, error } = await supabase.from(TABLE).insert(rows).select("id");
  throwOnError(error, "Adding units");
  return (data ?? []).length;
}

export type InventorySummary = Record<InventoryStatus, number> & {
  total: number;
};

export function summarizeInventory(units: InventoryUnit[]): InventorySummary {
  const summary: InventorySummary = {
    available: 0,
    booked: 0,
    hold: 0,
    sold: 0,
    total: units.length,
  };

  for (const unit of units) {
    summary[unit.status] += 1;
  }

  return summary;
}
