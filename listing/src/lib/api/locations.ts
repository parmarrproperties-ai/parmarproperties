import type { Location } from "@/types";
import type { LocationInput } from "@/lib/validations";

import { getSupabase, nullifyEmpty, throwOnError } from "./client";
import { deleteFile } from "./storage";

const TABLE = "locations";
const MAX_HOME_PRIMARY = 4;

export async function listLocations(): Promise<Location[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  throwOnError(error, "Loading locations");
  return (data ?? []) as unknown as Location[];
}

export async function listActiveLocations(): Promise<Location[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  throwOnError(error, "Loading locations");
  return (data ?? []) as unknown as Location[];
}

export async function getLocation(id: string): Promise<Location | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwOnError(error, "Loading location");
  return (data as unknown as Location) ?? null;
}

export async function isLocationSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = getSupabase();
  let query = supabase.from(TABLE).select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  throwOnError(error, "Checking the slug");
  return (data ?? []).length === 0;
}

export async function getNextLocationOrder(): Promise<number> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  throwOnError(error, "Loading location order");
  const highest = (data?.[0]?.sort_order as number | undefined) ?? 0;
  return highest + 1;
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

async function writeOrderPair(
  id: string,
  sortOrder: number
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from(TABLE)
    .update({
      sort_order: sortOrder,
      display_order: sortOrder,
    })
    .eq("id", id);
  throwOnError(error, "Updating location order");
}

/**
 * Reassigns contiguous sort_order / display_order values 1..n for the given
 * id sequence. Used after inserts, moves, and deletes.
 */
export async function applyContiguousSortOrder(ids: string[]): Promise<void> {
  // Two-phase write avoids mid-swap collisions if a uniqueness constraint exists.
  await Promise.all(ids.map((id, index) => writeOrderPair(id, -(index + 1))));
  await Promise.all(ids.map((id, index) => writeOrderPair(id, index + 1)));
}

/**
 * Inserts `movingId` at 1-based `desiredOrder` among all locations and
 * renumbers everyone 1..n so duplicates are impossible.
 */
async function resequenceSortOrder(
  movingId: string | null,
  desiredOrder: number | null
): Promise<void> {
  const all = await listLocations();
  const others = movingId ? all.filter((l) => l.id !== movingId) : all;
  const ids = others.map((l) => l.id);

  if (movingId) {
    const target = clampInt(
      desiredOrder ?? ids.length + 1,
      1,
      ids.length + 1
    );
    ids.splice(target - 1, 0, movingId);
  }

  await applyContiguousSortOrder(ids);
}

/**
 * Master columns from 006 are written alongside the legacy ones so the public
 * website and the existing Admin screens stay in step.
 */
function toLocationPayload(input: LocationInput): Record<string, unknown> {
  const payload = nullifyEmpty(input);

  payload.key_enclaves = input.key_enclaves ?? [];
  payload.is_active = input.publication_status === "published";
  // Ordering is applied transactionally after insert/update — strip here so
  // a raw write cannot leave duplicate sort/primary values behind.
  delete payload.sort_order;
  delete payload.display_order;
  delete payload.primary_order;
  delete payload.is_primary_home;

  return payload;
}

export async function createLocation(
  input: LocationInput,
  image?: { path: string; url: string } | null
): Promise<Location> {
  const supabase = getSupabase();
  const payload = {
    ...toLocationPayload(input),
    // Temporary placeholders; resequenced immediately after insert.
    sort_order: 0,
    display_order: 0,
    is_primary_home: false,
    primary_order: null,
    is_future: input.is_future,
    future_order: input.is_future ? (input.future_order ?? null) : null,
    image_path: image?.path ?? null,
    image_url: image?.url ?? null,
    cover_image: image?.url ?? null,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("*")
    .single();

  throwOnError(error, "Creating location");
  const created = data as unknown as Location;

  await resequenceSortOrder(created.id, input.sort_order || null);
  // Homepage Top 4 is managed only via saveHomepageTop4 — never from the edit dialog.

  const refreshed = await getLocation(created.id);
  const result = refreshed ?? created;
  await syncLookupActiveFromEditorial(
    result,
    Boolean(result.is_active)
  );
  return result;
}

export async function updateLocation(
  id: string,
  input: LocationInput,
  image?: { path: string; url: string } | null
): Promise<Location> {
  const supabase = getSupabase();
  const payload = toLocationPayload(input);
  payload.is_future = input.is_future;
  payload.future_order = input.is_future ? (input.future_order ?? null) : null;

  if (image !== undefined) {
    payload.image_path = image?.path ?? null;
    payload.image_url = image?.url ?? null;
    payload.cover_image = image?.url ?? null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating location");

  await resequenceSortOrder(id, input.sort_order ?? null);
  // Homepage Top 4 (`is_primary_home` / `primary_order`) is owned by
  // saveHomepageTop4 — leave those columns untouched here.

  const refreshed = await getLocation(id);
  const result = refreshed ?? (data as unknown as Location);
  await syncLookupActiveFromEditorial(
    result,
    Boolean(result.is_active)
  );
  return result;
}

export async function deleteLocation(location: Location): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", location.id);

  throwOnError(error, "Deleting location");
  await deleteFile(location.image_path);

  // Keep general + homepage orders contiguous/unique after deletion.
  await resequenceSortOrder(null, null);
  const remainingPrimary = (await listLocations())
    .filter((l) => l.is_primary_home)
    .sort(
      (a, b) =>
        (a.primary_order ?? Number.MAX_SAFE_INTEGER) -
        (b.primary_order ?? Number.MAX_SAFE_INTEGER)
    );
  await Promise.all(
    remainingPrimary.map(async (loc, index) => {
      const { error: primaryError } = await getSupabase()
        .from(TABLE)
        .update({ primary_order: index + 1 })
        .eq("id", loc.id);
      throwOnError(primaryError, "Reordering homepage locations");
    })
  );
}

/**
 * Mirror editorial Live/Hidden onto the linked catalogue row so the two Admin
 * Active controls cannot drift apart.
 */
async function syncLookupActiveFromEditorial(
  location: Location,
  isActive: boolean
): Promise<void> {
  const supabase = getSupabase();
  let query = supabase
    .from("lookup_locations")
    .update({ is_active: isActive });

  if (location.lookup_location_id) {
    query = query.eq("id", location.lookup_location_id);
  } else if (location.slug) {
    query = query.eq("slug", location.slug);
  } else {
    return;
  }

  const { error } = await query;
  throwOnError(error, "Syncing catalogue location visibility");
}

export async function setLocationActive(
  id: string,
  isActive: boolean
): Promise<Location> {
  const supabase = getSupabase();
  // Keep is_active + publication_status in lockstep — the public site gates on
  // both, and Admin treats Live/Hidden / Active as the same visibility control.
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      is_active: isActive,
      publication_status: isActive ? "published" : "draft",
    })
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating location");
  if (!data) {
    throw new Error(
      "Updating location failed: no row was updated. Check admin permissions."
    );
  }

  const saved = data as unknown as Location;
  await syncLookupActiveFromEditorial(saved, isActive);
  return saved;
}

export async function countPropertiesForLocation(
  locationId: string
): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("location_id", locationId)
    .is("deleted_at", null);

  throwOnError(error, "Counting properties");
  return count ?? 0;
}

export async function reorderLocations(ids: string[]): Promise<void> {
  // Drag-and-drop order becomes the canonical public sort_order.
  await applyContiguousSortOrder(ids);
}

/**
 * Reads the four Homepage Top 4 slots from current location rows.
 * Index 0 → primary_order 1, … Index 3 → primary_order 4.
 */
export function getHomepageTop4Slots(
  locations: Location[]
): Array<string | null> {
  const slots: Array<string | null> = [null, null, null, null];
  for (const location of locations) {
    if (!location.is_primary_home) continue;
    const order = location.primary_order;
    if (typeof order === "number" && order >= 1 && order <= MAX_HOME_PRIMARY) {
      slots[order - 1] = location.id;
    }
  }
  return slots;
}

/**
 * Atomically replaces the Homepage Top 4 selection.
 * Uses existing `is_primary_home` + `primary_order` only — never touches sort_order.
 */
export async function saveHomepageTop4(
  orderedIds: string[]
): Promise<Location[]> {
  if (orderedIds.length !== MAX_HOME_PRIMARY) {
    throw new Error(
      `Homepage Top 4 requires exactly ${MAX_HOME_PRIMARY} locations.`
    );
  }
  if (orderedIds.some((id) => !id)) {
    throw new Error("Every Homepage Top 4 slot must have a location selected.");
  }
  if (new Set(orderedIds).size !== MAX_HOME_PRIMARY) {
    throw new Error(
      "Each Homepage Top 4 slot must use a different location."
    );
  }

  const all = await listLocations();
  const byId = new Map(all.map((location) => [location.id, location]));

  for (const id of orderedIds) {
    const location = byId.get(id);
    if (!location) {
      throw new Error(
        "One of the selected locations no longer exists. Refresh and try again."
      );
    }
    if (!location.is_active || location.publication_status !== "published") {
      throw new Error(
        `“${location.name}” must be active and published before it can be saved in Homepage Top 4.`
      );
    }
  }

  const supabase = getSupabase();
  const previouslyPrimary = all.filter((location) => location.is_primary_home);

  // Validate-only complete. Now clear, then assign. On failure, restore previous.
  await Promise.all(
    previouslyPrimary.map(async (location) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ is_primary_home: false, primary_order: null })
        .eq("id", location.id);
      throwOnError(error, "Clearing Homepage Top 4");
    })
  );

  try {
    await Promise.all(
      orderedIds.map(async (id, index) => {
        const { error } = await supabase
          .from(TABLE)
          .update({ is_primary_home: true, primary_order: -(index + 1) })
          .eq("id", id);
        throwOnError(error, "Saving Homepage Top 4");
      })
    );

    await Promise.all(
      orderedIds.map(async (id, index) => {
        const { data, error } = await supabase
          .from(TABLE)
          .update({ is_primary_home: true, primary_order: index + 1 })
          .eq("id", id)
          .select("id")
          .single();
        throwOnError(error, "Saving Homepage Top 4");
        if (!data) {
          throw new Error(
            "Saving Homepage Top 4 failed: a slot was not updated."
          );
        }
      })
    );
  } catch (error) {
    await Promise.all(
      previouslyPrimary.map(async (location, index) => {
        await supabase
          .from(TABLE)
          .update({
            is_primary_home: true,
            primary_order: location.primary_order ?? index + 1,
          })
          .eq("id", location.id);
      })
    );
    throw error;
  }

  return listLocations();
}

/**
 * One-time / maintenance repair: normalize sort_order to 1..n and homepage
 * primary_order to unique 1..k (max 4).
 */
export async function repairLocationOrdering(): Promise<void> {
  await resequenceSortOrder(null, null);

  const all = await listLocations();
  const primary = all
    .filter((l) => l.is_primary_home)
    .sort(
      (a, b) =>
        (a.primary_order ?? Number.MAX_SAFE_INTEGER) -
        (b.primary_order ?? Number.MAX_SAFE_INTEGER)
    );

  // Keep at most four; clear extras beyond the limit.
  const kept = primary.slice(0, MAX_HOME_PRIMARY);
  const dropped = primary.slice(MAX_HOME_PRIMARY);

  await Promise.all(
    dropped.map(async (loc) => {
      const { error } = await getSupabase()
        .from(TABLE)
        .update({ is_primary_home: false, primary_order: null })
        .eq("id", loc.id);
      throwOnError(error, "Repairing homepage locations");
    })
  );

  await Promise.all(
    kept.map(async (loc, index) => {
      const { error } = await getSupabase()
        .from(TABLE)
        .update({
          is_primary_home: true,
          primary_order: index + 1,
        })
        .eq("id", loc.id);
      throwOnError(error, "Repairing homepage location order");
    })
  );
}
