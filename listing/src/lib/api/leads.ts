import type {
  Lead,
  LeadFilters,
  LeadWithRelations,
  LookupItem,
  PaginatedResult,
  Profile,
  Property,
} from "@/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

import { getSupabase, sanitizeSearch, throwOnError } from "./client";

const TABLE = "leads";
const SOURCE_TABLE = "lookup_lead_sources";
const STATUS_TABLE = "lookup_lead_statuses";

export async function listLeadSources(): Promise<LookupItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(SOURCE_TABLE)
    .select("*")
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading lead sources");
  return (data ?? []) as unknown as LookupItem[];
}

export async function listLeadStatuses(): Promise<LookupItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(STATUS_TABLE)
    .select("*")
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading lead statuses");
  return (data ?? []) as unknown as LookupItem[];
}

/**
 * Attaches the source, status, property and advisor each lead points at.
 * The catalogues are small enough to fetch whole, so a page of leads costs
 * four queries however many rows it holds.
 */
async function attachRelations(
  leads: Lead[]
): Promise<LeadWithRelations[]> {
  if (leads.length === 0) return [];

  const supabase = getSupabase();
  const propertyIds = [
    ...new Set(leads.map((lead) => lead.property_id).filter(Boolean)),
  ] as string[];
  const commercialIds = [
    ...new Set(leads.map((lead) => lead.commercial_id).filter(Boolean)),
  ] as string[];
  const articleIds = [
    ...new Set(leads.map((lead) => lead.article_id).filter(Boolean)),
  ] as string[];
  const advisorIds = [
    ...new Set(leads.map((lead) => lead.assigned_to).filter(Boolean)),
  ] as string[];

  const [sources, statuses, properties, commercials, articles, advisors] =
    await Promise.all([
      listLeadSources(),
      listLeadStatuses(),
      propertyIds.length > 0
        ? supabase
            .from("properties")
            .select("id, name, slug, title")
            .in("id", propertyIds)
        : Promise.resolve({ data: [], error: null }),
      commercialIds.length > 0
        ? supabase
            .from("commercial_properties")
            .select("id, title, slug")
            .in("id", commercialIds)
        : Promise.resolve({ data: [], error: null }),
      articleIds.length > 0
        ? supabase
            .from("insights_articles")
            .select("id, title, slug")
            .in("id", articleIds)
        : Promise.resolve({ data: [], error: null }),
      advisorIds.length > 0
        ? supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", advisorIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  const sourceById = new Map(sources.map((row) => [row.id, row]));
  const statusById = new Map(statuses.map((row) => [row.id, row]));
  const propertyById = new Map(
    ((properties.data ?? []) as unknown as Pick<
      Property,
      "id" | "name" | "slug" | "title"
    >[]).map((row) => [row.id, row])
  );
  const commercialById = new Map(
    ((commercials.data ?? []) as unknown as {
      id: string;
      title: string;
      slug: string;
    }[]).map((row) => [row.id, row])
  );
  const articleById = new Map(
    ((articles.data ?? []) as unknown as {
      id: string;
      title: string;
      slug: string;
    }[]).map((row) => [row.id, row])
  );
  const advisorById = new Map(
    ((advisors.data ?? []) as unknown as Pick<
      Profile,
      "id" | "full_name" | "email"
    >[]).map((row) => [row.id, row])
  );

  return leads.map((lead) => ({
    ...lead,
    source: sourceById.get(lead.source_id) ?? null,
    status: lead.status_id ? statusById.get(lead.status_id) ?? null : null,
    property: lead.property_id
      ? propertyById.get(lead.property_id) ?? null
      : null,
    commercial: lead.commercial_id
      ? commercialById.get(lead.commercial_id) ?? null
      : null,
    article: lead.article_id
      ? articleById.get(lead.article_id) ?? null
      : null,
    assignee: lead.assigned_to ? advisorById.get(lead.assigned_to) ?? null : null,
  }));
}

export async function listLeads(
  filters: LeadFilters = {}
): Promise<PaginatedResult<LeadWithRelations>> {
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
        `full_name.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `company_name.ilike.%${search}%`,
      ].join(",")
    );
  }

  if (filters.source_id) query = query.eq("source_id", filters.source_id);
  if (filters.status_id) query = query.eq("status_id", filters.status_id);
  if (filters.assigned === "unassigned") {
    query = query.is("assigned_to", null);
  } else if (filters.assigned) {
    query = query.eq("assigned_to", filters.assigned);
  }

  query = query.order("created_at", {
    ascending: filters.sort === "oldest",
  });

  const { data, error, count } = await query.range(from, to);
  throwOnError(error, "Loading leads");

  const leads = (data ?? []) as unknown as Lead[];
  const total = count ?? 0;

  return {
    data: await attachRelations(leads),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getLead(id: string): Promise<LeadWithRelations | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwOnError(error, "Loading lead");
  if (!data) return null;

  const [lead] = await attachRelations([data as unknown as Lead]);
  return lead ?? null;
}

export async function setLeadStatus(
  id: string,
  statusId: string
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from(TABLE)
    .update({ status_id: statusId })
    .eq("id", id);

  throwOnError(error, "Updating lead status");
}

export async function assignLead(
  id: string,
  advisorId: string | null
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from(TABLE)
    .update({ assigned_to: advisorId })
    .eq("id", id);

  throwOnError(error, "Assigning lead");
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  throwOnError(error, "Deleting lead");
}
