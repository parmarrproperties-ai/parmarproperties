import type { HeroSlide } from "@/types";
import type { HeroSlideInput } from "@/lib/validations";

import { getSupabase, nullifyEmpty, throwOnError } from "./client";
import { deleteFile } from "./storage";

const TABLE = "hero_slides";

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export async function listHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  throwOnError(error, "Loading hero slides");
  return (data ?? []) as unknown as HeroSlide[];
}

export async function getHeroSlide(id: string): Promise<HeroSlide | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwOnError(error, "Loading hero slide");
  return (data as unknown as HeroSlide) ?? null;
}

export async function getNextHeroOrder(): Promise<number> {
  const all = await listHeroSlides();
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
      throwOnError(error, "Reordering hero slides");
    })
  );

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ display_order: index + 1 })
        .eq("id", id);
      throwOnError(error, "Reordering hero slides");
    })
  );
}

async function resequenceDisplayOrder(
  movingId: string | null,
  desiredOrder: number | null
): Promise<void> {
  const all = await listHeroSlides();
  const others = movingId ? all.filter((s) => s.id !== movingId) : all;
  const ids = others.map((s) => s.id);

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

export async function createHeroSlide(
  input: HeroSlideInput,
  image?: { path: string; url: string } | null
): Promise<HeroSlide> {
  const supabase = getSupabase();
  const desiredOrder =
    typeof input.display_order === "number" && input.display_order > 0
      ? input.display_order
      : null;

  const payload = {
    ...nullifyEmpty(input),
    display_order: 0,
    image_path: image?.path ?? null,
    image_url: image?.url ?? null,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("*")
    .single();

  throwOnError(error, "Creating hero slide");
  const created = data as unknown as HeroSlide;

  await resequenceDisplayOrder(created.id, desiredOrder);
  return (await getHeroSlide(created.id)) ?? created;
}

export async function updateHeroSlide(
  id: string,
  input: HeroSlideInput,
  image?: { path: string; url: string } | null
): Promise<HeroSlide> {
  const supabase = getSupabase();
  const desiredOrder =
    typeof input.display_order === "number" && input.display_order > 0
      ? input.display_order
      : null;

  const payload: Record<string, unknown> = nullifyEmpty(input);
  delete payload.display_order;

  // `undefined` means "leave the current image alone"; null means "remove it".
  if (image !== undefined) {
    payload.image_path = image?.path ?? null;
    payload.image_url = image?.url ?? null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating hero slide");
  if (!data) {
    throw new Error("Updating hero slide failed: no row was updated.");
  }

  await resequenceDisplayOrder(id, desiredOrder);
  return (await getHeroSlide(id)) ?? (data as unknown as HeroSlide);
}

export async function deleteHeroSlide(slide: HeroSlide): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", slide.id);

  throwOnError(error, "Deleting hero slide");
  await deleteFile(slide.image_path);
  await resequenceDisplayOrder(null, null);
}

export async function setHeroSlideActive(
  id: string,
  isActive: boolean
): Promise<HeroSlide> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_active: isActive })
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating hero slide");
  if (!data) {
    throw new Error(
      "Updating hero slide failed: no row was updated. Check admin permissions."
    );
  }
  return data as unknown as HeroSlide;
}

/**
 * Persists a new order for the given ids, in array order (contiguous 1..n).
 */
export async function reorderHeroSlides(ids: string[]): Promise<void> {
  await applyContiguousDisplayOrder(ids);
}
