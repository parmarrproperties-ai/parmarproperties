"use client";

import * as React from "react";
import { MapPin, Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import type { Location } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  countPropertiesForLocation,
  deleteLocation,
  listLocations,
  reorderLocations,
  setLocationActive,
} from "@/lib/api/locations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PublicationStatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { OrderControls, moveItem } from "@/components/shared/order-controls";
import { LocationDialog } from "@/components/locations/location-dialog";
import { LookupLocationsView } from "@/components/locations/lookup-locations-view";
import { HomepageTop4Section } from "@/components/locations/homepage-top4-section";

/**
 * Canonical admin location management (Website Content → Locations).
 *
 * - Editorial micro-market pages → `locations` table.
 * - Homepage Top 4 → `is_primary_home` / `primary_order` (dedicated section).
 * - Property filter / catalogue entries → `lookup_locations`.
 */
export function LocationsView() {
  const [reordering, setReordering] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Location | null>(null);
  const [linkedCount, setLinkedCount] = React.useState<number | null>(null);
  const [catalogueSyncToken, setCatalogueSyncToken] = React.useState(0);
  const confirm = useConfirm<Location>();
  const {
    data: locations,
    setData: setLocations,
    loading,
    error,
    reload,
  } = useResource<Location[]>(listLocations, []);

  async function askDelete(location: Location) {
    confirm.ask(location);
    setLinkedCount(null);
    try {
      setLinkedCount(await countPropertiesForLocation(location.id));
    } catch {
      setLinkedCount(null);
    }
  }

  async function handleMove(from: number, to: number) {
    const next = moveItem(locations, from, to);
    if (next === locations) return;

    setLocations(next);
    setReordering(true);
    try {
      await reorderLocations(next.map((location) => location.id));
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    } finally {
      setReordering(false);
    }
  }

  async function handleToggle(location: Location, isActive: boolean) {
    const previous = locations;
    setLocations((current) =>
      current.map((item) =>
        item.id === location.id
          ? {
              ...item,
              is_active: isActive,
              publication_status: isActive ? "published" : "draft",
            }
          : item
      )
    );

    try {
      const saved = await setLocationActive(location.id, isActive);
      setLocations((current) =>
        current.map((item) => (item.id === saved.id ? saved : item))
      );
      // Catalogue Active is synced in the API — refresh that table too.
      setCatalogueSyncToken((token) => token + 1);
    } catch (caught) {
      setLocations(previous);
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations"
        description="Editorial micro-market pages and the property filter catalogue. Card arrows change General Order. Homepage Top 4 is configured in its own section at the bottom."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus />
            New location
          </Button>
        }
      />

      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight">
          Editorial location pages
        </h2>
        <p className="text-sm text-muted-foreground">
          Public micro-market dossiers (<code className="text-xs">locations</code>
          ). Properties can optionally link to these pages.
        </p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <LoadingBlock label="Loading locations…" />
      ) : locations.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={<MapPin />}
              title="No locations yet"
              description="Add the areas you operate in, such as Baner or Kharadi."
              action={
                <Button
                  onClick={() => {
                    setEditing(null);
                    setDialogOpen(true);
                  }}
                >
                  <Plus />
                  New location
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {locations.map((location, index) => (
            <Card key={location.id} className="overflow-hidden">
              {location.cover_image || location.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={location.cover_image ?? location.image_url ?? ""}
                  alt={location.name}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground">
                  <MapPin className="size-5" />
                </div>
              )}

              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {location.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {location.city || "City not set"}
                    </p>
                  </div>
                  <OrderControls
                    index={index}
                    total={locations.length}
                    disabled={reordering}
                    onMove={handleMove}
                  />
                </div>

                {location.tagline ? (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {location.tagline}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-1.5">
                  <PublicationStatusBadge status={location.publication_status} />
                  {location.is_primary_home ? (
                    <Badge variant="secondary">
                      Top 4
                      {location.primary_order
                        ? ` · order ${location.primary_order}`
                        : ""}
                    </Badge>
                  ) : null}
                  {location.is_future ? (
                    <Badge variant="outline">Future enclave</Badge>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`location-active-${location.id}`}
                      checked={location.is_active}
                      onCheckedChange={(checked) =>
                        void handleToggle(location, checked)
                      }
                    />
                    <Label
                      htmlFor={`location-active-${location.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      {location.is_active ? "Live" : "Hidden"}
                    </Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Edit ${location.name}`}
                      onClick={() => {
                        setEditing(location);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${location.name}`}
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => void askDelete(location)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LocationDialog
        location={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={reload}
      />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this location?"
        description={
          confirm.target
            ? linkedCount && linkedCount > 0
              ? `${confirm.target.name} is linked to ${linkedCount} ${
                  linkedCount === 1 ? "property" : "properties"
                }. Those properties will keep their typed location text but lose the link.`
              : `${confirm.target.name} and its image will be removed. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete location"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteLocation(confirm.target);
            toast.success("Location deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />

      <div className="border-t border-border pt-8">
        <LookupLocationsView
          syncToken={catalogueSyncToken}
          onVisibilitySynced={reload}
        />
      </div>

      <div className="border-t border-border pt-8">
        <HomepageTop4Section locations={locations} onSaved={reload} />
      </div>
    </div>
  );
}
