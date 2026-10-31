import type {
  AvailabilityStatus,
  InventoryStatus,
  LookupItem,
  PropertyStatus,
  PropertyType,
  PublicationStatus,
} from "@/types";
import {
  getAvailabilityLabel,
  getInventoryStatusLabel,
  getPropertyStatusLabel,
  getPropertyTypeLabel,
  getPublicationStatusLabel,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const propertyStatusVariants: Record<PropertyStatus, BadgeVariant> = {
  active: "success",
  inactive: "muted",
  sold_out: "destructive",
  upcoming: "default",
  ready_to_move: "success",
  under_construction: "warning",
};

const availabilityVariants: Record<AvailabilityStatus, BadgeVariant> = {
  available: "success",
  limited: "warning",
  sold_out: "destructive",
  coming_soon: "default",
};

const publicationVariants: Record<PublicationStatus, BadgeVariant> = {
  draft: "warning",
  published: "success",
  archived: "muted",
};

const inventoryVariants: Record<InventoryStatus, BadgeVariant> = {
  available: "success",
  booked: "default",
  hold: "warning",
  sold: "destructive",
};

/**
 * Lead statuses live in `lookup_lead_statuses`, so the pipeline can be renamed
 * or extended in the database. Only the colour is mapped here, by slug, and an
 * unknown slug falls back to a neutral badge.
 */
const leadStatusVariants: Record<string, BadgeVariant> = {
  new: "default",
  assigned: "secondary",
  contacted: "secondary",
  viewing_scheduled: "warning",
  negotiation: "warning",
  closed_won: "success",
  disqualified: "destructive",
};

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <Badge variant={propertyStatusVariants[status] ?? "muted"}>
      {getPropertyStatusLabel(status)}
    </Badge>
  );
}

export function AvailabilityBadge({
  availability,
}: {
  availability: AvailabilityStatus;
}) {
  return (
    <Badge variant={availabilityVariants[availability] ?? "muted"}>
      {getAvailabilityLabel(availability)}
    </Badge>
  );
}

export function PublicationStatusBadge({
  status,
}: {
  status: PublicationStatus;
}) {
  return (
    <Badge variant={publicationVariants[status] ?? "muted"}>
      {getPublicationStatusLabel(status)}
    </Badge>
  );
}

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <Badge variant={inventoryVariants[status] ?? "muted"}>
      {getInventoryStatusLabel(status)}
    </Badge>
  );
}

export function PropertyTypeBadge({ type }: { type: PropertyType }) {
  return <Badge variant="outline">{getPropertyTypeLabel(type)}</Badge>;
}

export function LeadStatusBadge({
  status,
}: {
  status?: LookupItem | null;
}) {
  if (!status) return <Badge variant="muted">Unassigned stage</Badge>;

  return (
    <Badge variant={leadStatusVariants[status.slug] ?? "muted"}>
      {status.name}
    </Badge>
  );
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "muted"}>
      {isActive ? "Active" : "Hidden"}
    </Badge>
  );
}
