import type {
  AvailabilityStatus,
  FloorPlanType,
  InventoryStatus,
  PropertyCollection,
  PropertyConfigPlanType,
  PropertyConfigVariant,
  PropertyStatus,
  PropertyType,
  PublicationStatus,
} from "@/types";

export const PUBLICATION_STATUSES: {
  value: PublicationStatus;
  label: string;
}[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const PROPERTY_COLLECTIONS: {
  value: PropertyCollection;
  label: string;
}[] = [
  { value: "buy", label: "Buy" },
  { value: "new-launches", label: "New launches" },
  { value: "luxury", label: "Luxury collection" },
];

export const PLAN_TYPES: {
  value: PropertyConfigPlanType;
  label: string;
}[] = [
  { value: "master", label: "Master plan" },
  { value: "floor", label: "Floor plan" },
  { value: "individual", label: "Individual layout" },
];

export const VARIANT_CODES: {
  value: PropertyConfigVariant;
  label: string;
}[] = [
  { value: "1bhk", label: "1 BHK" },
  { value: "2bhk", label: "2 BHK" },
  { value: "3bhk", label: "3 BHK" },
  { value: "4bhk", label: "4 BHK" },
  { value: "5bhk", label: "5 BHK" },
  { value: "custom", label: "Other" },
];

export const PROPERTY_STATUSES: {
  value: PropertyStatus;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "sold_out", label: "Sold Out" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ready_to_move", label: "Ready to Move" },
  { value: "under_construction", label: "Under Construction" },
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "penthouse", label: "Penthouse" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "duplex", label: "Duplex" },
  { value: "other", label: "Other" },
];

export const AVAILABILITY_STATUSES: {
  value: AvailabilityStatus;
  label: string;
}[] = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "sold_out", label: "Sold Out" },
  { value: "coming_soon", label: "Coming Soon" },
];

export const FLOOR_PLAN_TYPES: { value: FloorPlanType; label: string }[] = [
  { value: "floor_plan", label: "Floor Plan" },
  { value: "master_plan", label: "Master Plan" },
  { value: "configuration_plan", label: "Configuration Plan" },
];

export const INVENTORY_STATUSES: {
  value: InventoryStatus;
  label: string;
}[] = [
  { value: "available", label: "Available" },
  { value: "booked", label: "Booked" },
  { value: "hold", label: "Hold" },
  { value: "sold", label: "Sold" },
];

export const BHK_OPTIONS = [
  "1 BHK",
  "1.5 BHK",
  "2 BHK",
  "2.5 BHK",
  "3 BHK",
  "3.5 BHK",
  "4 BHK",
  "4.5 BHK",
  "5 BHK",
  "5+ BHK",
];

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_BROCHURE_SIZE_MB = 20;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ALLOWED_BROCHURE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export const STORAGE_BUCKET = "media";

export function getPropertyStatusLabel(status: PropertyStatus): string {
  return PROPERTY_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getPropertyTypeLabel(type: PropertyType): string {
  return PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getAvailabilityLabel(status: AvailabilityStatus): string {
  return AVAILABILITY_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getInventoryStatusLabel(status: InventoryStatus): string {
  return INVENTORY_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getFloorPlanTypeLabel(type: FloorPlanType): string {
  return FLOOR_PLAN_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getPublicationStatusLabel(status: PublicationStatus): string {
  return PUBLICATION_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getPlanTypeLabel(type: PropertyConfigPlanType): string {
  return PLAN_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getVariantLabel(variant: PropertyConfigVariant): string {
  return VARIANT_CODES.find((v) => v.value === variant)?.label ?? variant;
}

/** Price in ₹ Crores as the website shows it. */
export function formatCrore(price: number | null | undefined): string {
  if (price == null) return "—";
  return `₹${Number(price).toFixed(2)} Cr`;
}
