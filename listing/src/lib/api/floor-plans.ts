import type { FloorPlan } from "@/types";
import type { FloorPlanInput } from "@/lib/validations";

import { getSupabase, nullifyEmpty, throwOnError } from "./client";
import { deleteFile } from "./storage";

const TABLE = "floor_plans";

export async function listFloorPlans(
  propertyId: string
): Promise<FloorPlan[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading floor plans");
  return (data ?? []) as unknown as FloorPlan[];
}

export async function getNextFloorPlanOrder(
  propertyId: string
): Promise<number> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("display_order")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: false })
    .limit(1);

  throwOnError(error, "Loading floor plan order");
  const highest = (data?.[0]?.display_order as number | undefined) ?? -1;
  return highest + 1;
}

export async function createFloorPlan(
  propertyId: string,
  input: FloorPlanInput,
  files: {
    image?: { path: string; url: string } | null;
    document?: { path: string; url: string } | null;
  } = {}
): Promise<FloorPlan> {
  const [row] = await createFloorPlansBatch(propertyId, [
    { input, image: files.image ?? null, document: files.document ?? null },
  ]);
  return row;
}

/**
 * Batch-insert floor plan rows after media paths are already resolved.
 * Avoids per-row round trips during Add Property.
 */
export async function createFloorPlansBatch(
  propertyId: string,
  rows: Array<{
    input: FloorPlanInput;
    image?: { path: string; url: string } | null;
    document?: { path: string; url: string } | null;
  }>
): Promise<FloorPlan[]> {
  if (rows.length === 0) return [];

  const supabase = getSupabase();
  const payload = rows.map(({ input, image, document }) => {
    const base = nullifyEmpty(input);
    if (!base.configuration_id) base.configuration_id = null;
    return {
      ...base,
      property_id: propertyId,
      image_path: image?.path ?? null,
      image_url: image?.url ?? null,
      file_path: document?.path ?? null,
      file_url: document?.url ?? null,
    };
  });

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select(
      "id, property_id, configuration_id, name, plan_type, image_path, image_url, file_path, file_url, is_active, display_order, created_at, updated_at"
    );

  throwOnError(error, "Creating floor plans");
  return (data ?? []) as unknown as FloorPlan[];
}

export async function updateFloorPlan(
  id: string,
  input: FloorPlanInput,
  files: {
    image?: { path: string; url: string } | null;
    document?: { path: string; url: string } | null;
  } = {}
): Promise<FloorPlan> {
  const supabase = getSupabase();
  const payload = nullifyEmpty(input);
  if (!payload.configuration_id) payload.configuration_id = null;

  if (files.image !== undefined) {
    payload.image_path = files.image?.path ?? null;
    payload.image_url = files.image?.url ?? null;
  }
  if (files.document !== undefined) {
    payload.file_path = files.document?.path ?? null;
    payload.file_url = files.document?.url ?? null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating floor plan");
  return data as unknown as FloorPlan;
}

export async function deleteFloorPlan(plan: FloorPlan): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", plan.id);
  throwOnError(error, "Deleting floor plan");

  await deleteFile(plan.image_path);
  await deleteFile(plan.file_path);
}

export async function setFloorPlanActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from(TABLE)
    .update({ is_active: isActive })
    .eq("id", id);

  throwOnError(error, "Updating floor plan");
}

export async function reorderFloorPlans(ids: string[]): Promise<void> {
  const supabase = getSupabase();

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ display_order: -(index + 1) })
        .eq("id", id);
      throwOnError(error, "Reordering floor plans");
    })
  );

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ display_order: index + 1 })
        .eq("id", id);
      throwOnError(error, "Reordering floor plans");
    })
  );
}

export interface ReusableFloorPlanAsset {
  id: string;
  name: string;
  plan_type: FloorPlan["plan_type"];
  image_path: string;
  image_url: string;
  property_id: string;
}

/**
 * Existing floor-plan images admins can reuse on Add Property
 * (Select Existing for Master / Floor / configuration plans).
 * Paths are referenced as-is — no storage duplication.
 */
export async function listReusableFloorPlanAssets(
  planType: FloorPlan["plan_type"]
): Promise<ReusableFloorPlanAsset[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, name, plan_type, image_path, image_url, property_id")
    .eq("plan_type", planType)
    .eq("is_active", true)
    .not("image_url", "is", null)
    .order("updated_at", { ascending: false })
    .limit(60);

  throwOnError(error, "Loading reusable floor plan images");

  return ((data ?? []) as unknown as ReusableFloorPlanAsset[]).filter(
    (row) => Boolean(row.image_url || row.image_path)
  );
}
