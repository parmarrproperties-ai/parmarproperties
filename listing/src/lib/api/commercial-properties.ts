import type {
  CommercialFilters,
  CommercialProperty,
  CommercialPropertyWithRelations,
  LookupItem,
  PaginatedResult,
} from "@/types";
import type { CommercialPropertyInput } from "@/lib/validations";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

import {
  getSupabase,
  nullifyEmpty,
  sanitizeSearch,
  throwOnError,
} from "./client";
import {
  listLookupCommercialGrades,
  listLookupCommercialHubs,
  listLookupCommercialTypes,
} from "./lookups";

const TABLE = "commercial_properties";

function toPayload(input: CommercialPropertyInput): Record<string, unknown> {
  const payload = nullifyEmpty({
    ...input,
    grade_id: input.grade_id || null,
    cover_image: input.cover_image || "",
    rera_id: input.rera_id || "",
    highlights: input.highlights ?? [],
  });

  // Keep empty string for cover_image / rera_id (NOT NULL columns with defaults)
  payload.cover_image = input.cover_image || "";
  payload.rera_id = input.rera_id || "";
  payload.highlights = input.highlights ?? [];
  payload.tagline = input.tagline;
  payload.sub_location = input.sub_location;
  payload.floor = input.floor;
  payload.possession = input.possession;
  payload.description = input.description;

  return payload;
}

export async function listCommercialProperties(
  filters: CommercialFilters = {}
): Promise<PaginatedResult<CommercialPropertyWithRelations>> {
  const supabase = getSupabase();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from(TABLE).select("*", { count: "exact" });

  const search = filters.search ? sanitizeSearch(filters.search) : "";
  if (search) {
    query = query.or(
      [
        `title.ilike.%${search}%`,
        `slug.ilike.%${search}%`,
        `sub_location.ilike.%${search}%`,
        `rera_id.ilike.%${search}%`,
      ].join(",")
    );
  }

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.hub_id) query = query.eq("hub_id", filters.hub_id);

  switch (filters.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "title":
      query = query.order("title", { ascending: true });
      break;
    case "price":
      query = query.order("price", { ascending: false });
      break;
    case "updated":
      query = query.order("updated_at", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error, count } = await query.range(from, to);
  throwOnError(error, "Loading commercial properties");

  const rows = (data ?? []) as unknown as CommercialProperty[];
  const withRelations = await attachRelations(rows);
  const total = count ?? 0;

  return {
    data: withRelations,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

async function attachRelations(
  rows: CommercialProperty[]
): Promise<CommercialPropertyWithRelations[]> {
  if (rows.length === 0) return [];

  const [hubs, types, grades] = await Promise.all([
    listLookupCommercialHubs(false),
    listLookupCommercialTypes(false),
    listLookupCommercialGrades(false),
  ]);

  const hubById = new Map(hubs.map((h) => [h.id, h]));
  const typeById = new Map(types.map((t) => [t.id, t]));
  const gradeById = new Map(grades.map((g) => [g.id, g]));

  return rows.map((row) => ({
    ...row,
    hub: hubById.get(row.hub_id) ?? null,
    commercial_type: typeById.get(row.commercial_type_id) ?? null,
    grade: row.grade_id ? gradeById.get(row.grade_id) ?? null : null,
  }));
}

export async function getCommercialProperty(
  id: string
): Promise<CommercialPropertyWithRelations | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwOnError(error, "Loading commercial property");
  if (!data) return null;

  const [withRelations] = await attachRelations([
    data as unknown as CommercialProperty,
  ]);
  return withRelations;
}

export async function isCommercialSlugAvailable(
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

export async function createCommercialProperty(
  input: CommercialPropertyInput
): Promise<CommercialProperty> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(toPayload(input))
    .select("*")
    .single();

  throwOnError(error, "Creating commercial property");
  return data as unknown as CommercialProperty;
}

export async function updateCommercialProperty(
  id: string,
  input: CommercialPropertyInput
): Promise<CommercialProperty> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(toPayload(input))
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Updating commercial property");
  return data as unknown as CommercialProperty;
}

export async function deleteCommercialProperty(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting commercial property");
}

export async function listCommercialFormLookups(): Promise<{
  hubs: LookupItem[];
  types: LookupItem[];
  grades: LookupItem[];
}> {
  const [hubs, types, grades] = await Promise.all([
    listLookupCommercialHubs(),
    listLookupCommercialTypes(),
    listLookupCommercialGrades(),
  ]);
  return { hubs, types, grades };
}
