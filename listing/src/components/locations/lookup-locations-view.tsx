"use client";

import * as React from "react";
import { MapPin, Pencil, Plus, Search, Trash } from "lucide-react";
import { toast } from "sonner";

import type { LookupItem } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  deleteLookupItem,
  listLookupLocations,
  setLookupItemActive,
} from "@/lib/api/lookups";
import { getSupabase, throwOnError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { LookupLocationDialog } from "@/components/locations/lookup-location-dialog";

async function countPropertiesForLookupLocation(
  lookupLocationId: string
): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("lookup_location_id", lookupLocationId)
    .is("deleted_at", null);

  throwOnError(error, "Counting linked properties");
  return count ?? 0;
}

interface LookupLocationsViewProps {
  /** Bumps when editorial Live/Hidden changes so catalogue Active refreshes. */
  syncToken?: number;
  /** Fired after catalogue Active changes (editorial rows were synced too). */
  onVisibilitySynced?: () => void;
}

/**
 * Property filter catalogue (`lookup_locations`).
 * Embedded under Website Content → Locations alongside editorial `locations` pages.
 * Add Property continues to read the same catalogue via listLookupLocations().
 */
export function LookupLocationsView({
  syncToken = 0,
  onVisibilitySynced,
}: LookupLocationsViewProps) {
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<LookupItem | null>(null);
  const [linkedCount, setLinkedCount] = React.useState<number | null>(null);
  const confirm = useConfirm<LookupItem>();
  // Stable fetcher identity — an inline arrow would re-run the effect on every
  // render and race optimistic Active toggles (snapping the switch back).
  const fetchCatalogue = React.useCallback(
    () => listLookupLocations(false),
    []
  );
  const {
    data: locations,
    setData: setLocations,
    loading,
    error,
    reload,
  } = useResource<LookupItem[]>(fetchCatalogue, []);

  React.useEffect(() => {
    if (syncToken > 0) reload();
  }, [syncToken, reload]);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return locations;
    return locations.filter(
      (location) =>
        location.name.toLowerCase().includes(term) ||
        location.slug.toLowerCase().includes(term)
    );
  }, [locations, search]);

  async function askDelete(location: LookupItem) {
    confirm.ask(location);
    setLinkedCount(null);
    try {
      setLinkedCount(await countPropertiesForLookupLocation(location.id));
    } catch {
      setLinkedCount(null);
    }
  }

  async function handleToggle(location: LookupItem, isActive: boolean) {
    const previous = locations;
    setLocations((current) =>
      current.map((item) =>
        item.id === location.id ? { ...item, is_active: isActive } : item
      )
    );

    try {
      const saved = await setLookupItemActive(
        "lookup_locations",
        location.id,
        isActive
      );
      setLocations((current) =>
        current.map((item) => (item.id === saved.id ? saved : item))
      );
      onVisibilitySynced?.();
    } catch (caught) {
      setLocations(previous);
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  return (
    <section className="space-y-4" aria-labelledby="property-location-catalogue">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2
            id="property-location-catalogue"
            className="text-base font-semibold tracking-tight"
          >
            Property Location Catalogue
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Locations used in property filters and related listings
            (<code className="mx-1 text-xs">lookup_locations</code>).
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus />
          Add location
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search locations…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading ? <TableSkeleton rows={6} /> : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          icon={<MapPin />}
          title="No catalogue locations yet"
          description="Add the micro-markets buyers filter by on the Buy page."
          action={
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus />
              Add location
            </Button>
          }
        />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      {location.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {location.slug}
                    </TableCell>
                    <TableCell>{location.display_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={location.is_active}
                        onCheckedChange={(checked) =>
                          void handleToggle(location, checked)
                        }
                        aria-label={`Toggle ${location.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
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
                          size="icon"
                          aria-label={`Delete ${location.name}`}
                          onClick={() => askDelete(location)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      <LookupLocationDialog
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
          linkedCount && linkedCount > 0
            ? `“${confirm.target?.name}” is linked to ${linkedCount} ${
                linkedCount === 1 ? "property" : "properties"
              }. Delete only if you are sure filters will not break.`
            : `Remove “${confirm.target?.name}” from the filter catalogue?`
        }
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteLookupItem("lookup_locations", confirm.target.id);
            toast.success("Location deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </section>
  );
}
