import type { MarketIntelligence } from "@/types";
import type { MarketIntelligenceInput } from "@/lib/validations";

import { getSupabase, nullifyEmpty, throwOnError } from "./client";

const TABLE = "market_intelligence";

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export async function listMarketIntelligence(): Promise<MarketIntelligence[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  throwOnError(error, "Loading market intelligence");
  return (data ?? []) as unknown as MarketIntelligence[];
}

export async function getMarketIntelligence(
  id: string
): Promise<MarketIntelligence | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwOnError(error, "Loading market intelligence");
  return (data as unknown as MarketIntelligence) ?? null;
}

export async function getNextMarketOrder(): Promise<number> {
  const all = await listMarketIntelligence();
  return all.length + 1;
}

async function applyContiguousDisplayOrder(ids: string[]): Promise<void> {
  const supabase = getSupabase();

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ display_order: -(index + 1) })
        .eq("id", id);
      throwOnError(error, "Reordering metrics");
    })
  );

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ display_order: index + 1 })
        .eq("id", id);
      throwOnError(error, "Reordering metrics");
    })
  );
}

async function resequenceDisplayOrder(
  movingId: string | null,
  desiredOrder: number | null
): Promise<void> {
  const all = await listMarketIntelligence();
  const others = movingId ? all.filter((m) => m.id !== movingId) : all;
  const ids = others.map((m) => m.id);

  if (movingId) {
    const target = clampInt(
      desiredOrder && desiredOrder > 0 ? desiredOrder : ids.length + 1,
      1,
      ids.length + 1
    );
    ids.splice(target - 1, 0, movingId);
  }

  await applyContiguousDisplayOrder(ids);
}

export async function createMarketIntelligence(
  input: MarketIntelligenceInput
): Promise<MarketIntelligence> {
  const supabase = getSupabase();
  const desiredOrder =
    typeof input.display_order === "number" && input.display_order > 0
      ? input.display_order
      : null;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...nullifyEmpty(input), display_order: 0 })
    .select("*")
    .single();

  throwOnError(error, "Creating metric");
  const created = data as unknown as MarketIntelligence;

  await resequenceDisplayOrder(created.id, desiredOrder);
  return (await getMarketIntelligence(created.id)) ?? created;
}

export async function updateMarketIntelligence(
  id: string,
  input: MarketIntelligenceInput
): Promise<MarketIntelligence> {
  const supabase = getSupabase();
  const desiredOrder =
    typeof input.display_order === "number" && input.display_order > 0
      ? input.display_order
      : null;

  const payload = nullifyEmpty(input);
  delete payload.display_order;

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating metric");
  if (!data) {
    throw new Error("Updating metric failed: no row was updated.");
  }

  await resequenceDisplayOrder(id, desiredOrder);
  return (await getMarketIntelligence(id)) ?? (data as unknown as MarketIntelligence);
}

export async function deleteMarketIntelligence(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting metric");
  await resequenceDisplayOrder(null, null);
}

export async function setMarketIntelligenceActive(
  id: string,
  isActive: boolean
): Promise<MarketIntelligence> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_active: isActive })
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating metric");
  if (!data) {
    throw new Error(
      "Updating metric failed: no row was updated. Check admin permissions."
    );
  }
  return data as unknown as MarketIntelligence;
}

export async function reorderMarketIntelligence(ids: string[]): Promise<void> {
  await applyContiguousDisplayOrder(ids);
}
