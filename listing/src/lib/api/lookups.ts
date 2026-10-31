import type { LookupItem } from "@/types";

import { getSupabase, throwOnError } from "./client";

const LOOKUP_TABLES = [
  "lookup_locations",
  "lookup_bhk",
  "lookup_construction_status",
  "lookup_property_types",
  "lookup_commercial_types",
  "lookup_commercial_hubs",
  "lookup_commercial_grades",
  "lookup_amenities",
  "lookup_article_categories",
  "lookup_lead_sources",
  "lookup_lead_statuses",
] as const;

export type LookupTable = (typeof LOOKUP_TABLES)[number];

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

async function listLookup(
  table: LookupTable,
  activeOnly = true
): Promise<LookupItem[]> {
  const supabase = getSupabase();
  let query = supabase
    .from(table)
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  throwOnError(error, `Loading ${table.replace(/_/g, " ")}`);
  return (data ?? []) as unknown as LookupItem[];
}

/**
 * Writes contiguous unique display_order values (1..n) for the given id
 * sequence. Two-phase update avoids mid-swap collisions.
 */
async function applyContiguousDisplayOrder(
  table: LookupTable,
  ids: string[]
): Promise<void> {
  const supabase = getSupabase();
  const label = table.replace(/_/g, " ");

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(table)
        .update({ display_order: -(index + 1) })
        .eq("id", id);
      throwOnError(error, `Reordering ${label}`);
    })
  );

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(table)
        .update({ display_order: index + 1 })
        .eq("id", id);
      throwOnError(error, `Reordering ${label}`);
    })
  );
}

/**
 * Inserts/moves `movingId` to 1-based `desiredOrder` among all rows and
 * renumbers everyone 1..n so duplicates are impossible.
 */
async function resequenceDisplayOrder(
  table: LookupTable,
  movingId: string | null,
  desiredOrder: number | null
): Promise<void> {
  const all = await listLookup(table, false);
  const others = movingId ? all.filter((item) => item.id !== movingId) : all;
  const ids = others.map((item) => item.id);

  if (movingId) {
    const target = clampInt(
      desiredOrder && desiredOrder > 0 ? desiredOrder : ids.length + 1,
      1,
      ids.length + 1
    );
    ids.splice(target - 1, 0, movingId);
  }

  await applyContiguousDisplayOrder(table, ids);
}

export const listLookupLocations = (activeOnly = true) =>
  listLookup("lookup_locations", activeOnly);
export const listLookupBhk = (activeOnly = true) =>
  listLookup("lookup_bhk", activeOnly);
export const listLookupConstructionStatus = (activeOnly = true) =>
  listLookup("lookup_construction_status", activeOnly);
export const listLookupPropertyTypes = (activeOnly = true) =>
  listLookup("lookup_property_types", activeOnly);
export const listLookupAmenities = (activeOnly = true) =>
  listLookup("lookup_amenities", activeOnly);
export const listLookupCommercialTypes = (activeOnly = true) =>
  listLookup("lookup_commercial_types", activeOnly);
export const listLookupCommercialHubs = (activeOnly = true) =>
  listLookup("lookup_commercial_hubs", activeOnly);
export const listLookupCommercialGrades = (activeOnly = true) =>
  listLookup("lookup_commercial_grades", activeOnly);
export const listLookupArticleCategories = (activeOnly = true) =>
  listLookup("lookup_article_categories", activeOnly);

export async function createLookupItem(
  table: LookupTable,
  input: { slug: string; name: string; display_order?: number; is_active?: boolean }
): Promise<LookupItem> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(table)
    .insert({
      slug: input.slug,
      name: input.name,
      // Temporary placeholder; resequenced immediately after insert.
      display_order: 0,
      is_active: input.is_active ?? true,
    })
    .select("*")
    .single();

  throwOnError(error, `Creating ${table.replace(/_/g, " ")}`);
  const created = data as unknown as LookupItem;

  if (table === "lookup_locations") {
    await syncEditorialActiveFromLookup(created, input.is_active ?? true);
  }

  await resequenceDisplayOrder(
    table,
    created.id,
    input.display_order && input.display_order > 0 ? input.display_order : null
  );

  const refreshed = await listLookup(table, false);
  return refreshed.find((item) => item.id === created.id) ?? created;
}

export async function updateLookupItem(
  table: LookupTable,
  id: string,
  input: { slug: string; name: string; display_order?: number; is_active?: boolean }
): Promise<LookupItem> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(table)
    .update({
      slug: input.slug,
      name: input.name,
      is_active: input.is_active ?? true,
    })
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, `Updating ${table.replace(/_/g, " ")}`);
  if (!data) {
    throw new Error(
      `Updating ${table.replace(/_/g, " ")} failed: no row was updated.`
    );
  }

  if (table === "lookup_locations") {
    await syncEditorialActiveFromLookup(
      data as unknown as LookupItem,
      input.is_active ?? true
    );
  }

  await resequenceDisplayOrder(
    table,
    id,
    input.display_order && input.display_order > 0 ? input.display_order : null
  );

  const refreshed = await listLookup(table, false);
  return refreshed.find((item) => item.id === id) ?? (data as unknown as LookupItem);
}

/**
 * Keep editorial `locations` visibility in lockstep with the catalogue Active
 * toggle so Admin Active OFF cannot leave a published public location behind.
 */
async function syncEditorialActiveFromLookup(
  lookup: LookupItem,
  isActive: boolean
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("locations")
    .update({
      is_active: isActive,
      publication_status: isActive ? "published" : "draft",
    })
    .or(`lookup_location_id.eq.${lookup.id},slug.eq.${lookup.slug}`);

  throwOnError(error, "Syncing editorial location visibility");
}

export async function setLookupItemActive(
  table: LookupTable,
  id: string,
  isActive: boolean
): Promise<LookupItem> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(table)
    .update({ is_active: isActive })
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, `Updating ${table.replace(/_/g, " ")}`);
  if (!data) {
    throw new Error(
      `Updating ${table.replace(/_/g, " ")} failed: no row was updated. Check admin permissions.`
    );
  }

  const saved = data as unknown as LookupItem;
  if (table === "lookup_locations") {
    await syncEditorialActiveFromLookup(saved, isActive);
  }
  return saved;
}

export async function deleteLookupItem(
  table: LookupTable,
  id: string
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(table).delete().eq("id", id);
  throwOnError(error, `Deleting ${table.replace(/_/g, " ")}`);
  await resequenceDisplayOrder(table, null, null);
}

/** Normalize display_order to unique contiguous 1..n within a lookup table. */
export async function repairLookupOrdering(table: LookupTable): Promise<void> {
  await resequenceDisplayOrder(table, null, null);
}

export async function listPropertyFormLookups() {
  const [locations, bhk, statuses, types, amenities, launchPhases] =
    await Promise.all([
      listLookupLocations(),
      listLookupBhk(),
      listLookupConstructionStatus(),
      listLookupPropertyTypes(),
      listLookupAmenities(),
      listLookupConstructionStatus(),
    ]);

  return {
    locations,
    bhk: bhk.filter((item) => item.slug !== "any"),
    statuses,
    types,
    amenities,
    launchPhases: launchPhases.filter((item) =>
      ["pre-launch", "under-construction"].includes(item.slug)
    ),
  };
}
