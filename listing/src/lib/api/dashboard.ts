import type {
  AvailabilityStatus,
  DashboardStats,
  InventoryStatus,
  Property,
  PropertyStatus,
  PropertyType,
} from "@/types";

import { getSupabase, throwOnError } from "./client";

export interface ContentCounts {
  heroSlides: number;
  locations: number;
  amenities: number;
  configurations: number;
  floorPlans: number;
}

export interface DashboardBreakdown {
  byStatus: { status: PropertyStatus; label: string; count: number }[];
  byType: { type: PropertyType; count: number }[];
  byAvailability: { availability: AvailabilityStatus; count: number }[];
  inventory: Record<InventoryStatus, number>;
}

async function countRows(
  table: string,
  apply?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any
): Promise<number> {
  const supabase = getSupabase();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (apply) query = apply(query);

  const { count, error } = await query;
  throwOnError(error, `Counting ${table.replace(/_/g, " ")}`);
  return count ?? 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabase();

  const [
    totalProperties,
    activeProperties,
    featuredProperties,
    availableUnits,
    recentlyUpdated,
    recentlyAdded,
  ] = await Promise.all([
    countRows("properties", (q) => q.is("deleted_at", null)),
    countRows("properties", (q) =>
      q.is("deleted_at", null).eq("is_active", true)
    ),
    countRows("properties", (q) =>
      q.is("deleted_at", null).eq("is_featured", true)
    ),
    countRows("inventory_units", (q) => q.eq("status", "available")),
    supabase
      .from("properties")
      .select("*")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("properties")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  throwOnError(recentlyUpdated.error, "Loading recent activity");
  throwOnError(recentlyAdded.error, "Loading recent activity");

  return {
    totalProperties,
    activeProperties,
    featuredProperties,
    availableUnits,
    recentlyUpdated: (recentlyUpdated.data ?? []) as unknown as Property[],
    recentlyAdded: (recentlyAdded.data ?? []) as unknown as Property[],
  };
}

export async function getContentCounts(): Promise<ContentCounts> {
  const [heroSlides, locations, amenities, configurations, floorPlans] =
    await Promise.all([
      countRows("hero_slides"),
      countRows("locations"),
      countRows("amenities"),
      countRows("configurations"),
      countRows("floor_plans"),
    ]);

  return {
    heroSlides,
    locations,
    amenities,
    configurations,
    floorPlans,
  };
}

/**
 * Distribution data for the dashboard charts. Grouping happens client-side
 * because the counts are small and it avoids extra database views.
 */
export async function getDashboardBreakdown(): Promise<DashboardBreakdown> {
  const supabase = getSupabase();

  const [properties, inventory] = await Promise.all([
    supabase
      .from("properties")
      .select("status, property_type, availability")
      .is("deleted_at", null),
    supabase.from("inventory_units").select("status"),
  ]);

  throwOnError(properties.error, "Loading property breakdown");
  throwOnError(inventory.error, "Loading inventory breakdown");

  const rows = (properties.data ?? []) as unknown as {
    status: PropertyStatus;
    property_type: PropertyType;
    availability: AvailabilityStatus;
  }[];

  const statusCounts = new Map<PropertyStatus, number>();
  const typeCounts = new Map<PropertyType, number>();
  const availabilityCounts = new Map<AvailabilityStatus, number>();

  for (const row of rows) {
    statusCounts.set(row.status, (statusCounts.get(row.status) ?? 0) + 1);
    typeCounts.set(
      row.property_type,
      (typeCounts.get(row.property_type) ?? 0) + 1
    );
    availabilityCounts.set(
      row.availability,
      (availabilityCounts.get(row.availability) ?? 0) + 1
    );
  }

  const inventoryRows = (inventory.data ?? []) as unknown as {
    status: InventoryStatus;
  }[];

  const inventoryCounts: Record<InventoryStatus, number> = {
    available: 0,
    booked: 0,
    hold: 0,
    sold: 0,
  };
  for (const row of inventoryRows) {
    inventoryCounts[row.status] += 1;
  }

  return {
    byStatus: [...statusCounts.entries()].map(([status, count]) => ({
      status,
      label: status,
      count,
    })),
    byType: [...typeCounts.entries()].map(([type, count]) => ({ type, count })),
    byAvailability: [...availabilityCounts.entries()].map(
      ([availability, count]) => ({ availability, count })
    ),
    inventory: inventoryCounts,
  };
}

export async function countDeletedProperties(): Promise<number> {
  return countRows("properties", (q) => q.not("deleted_at", "is", null));
}
