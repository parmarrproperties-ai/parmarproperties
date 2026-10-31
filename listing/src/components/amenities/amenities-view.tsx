"use client";

import * as React from "react";
import { Boxes, Pencil, Plus, Search, Trash } from "lucide-react";
import { toast } from "sonner";

import type { LookupItem } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  countPropertiesForLookupAmenity,
  deleteMasterAmenity,
  listMasterAmenities,
  setMasterAmenityActive,
} from "@/lib/api/amenities";
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
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { AmenityDialog } from "@/components/amenities/amenity-dialog";

export function AmenitiesView() {
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<LookupItem | null>(null);
  const [linkedCount, setLinkedCount] = React.useState<number | null>(null);
  const confirm = useConfirm<LookupItem>();
  // Stable fetcher identity — prevents Active-toggle races from inline arrows.
  const fetchAmenities = React.useCallback(
    () => listMasterAmenities(false),
    []
  );
  const {
    data: amenities,
    setData: setAmenities,
    loading,
    error,
    reload,
  } = useResource<LookupItem[]>(fetchAmenities, []);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return amenities;
    return amenities.filter(
      (amenity) =>
        amenity.name.toLowerCase().includes(term) ||
        amenity.slug.toLowerCase().includes(term)
    );
  }, [amenities, search]);

  async function askDelete(amenity: LookupItem) {
    confirm.ask(amenity);
    setLinkedCount(null);
    try {
      setLinkedCount(await countPropertiesForLookupAmenity(amenity.id));
    } catch {
      setLinkedCount(null);
    }
  }

  async function handleToggle(amenity: LookupItem, isActive: boolean) {
    const previous = amenities;
    setAmenities((current) =>
      current.map((item) =>
        item.id === amenity.id ? { ...item, is_active: isActive } : item
      )
    );

    try {
      const saved = await setMasterAmenityActive(amenity.id, isActive);
      setAmenities((current) =>
        current.map((item) => (item.id === saved.id ? saved : item))
      );
    } catch (caught) {
      setAmenities(previous);
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Amenities"
        description="Master catalogue (lookup_amenities) shared by every property listing."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus />
            Add amenity
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search amenities…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading ? <TableSkeleton rows={6} /> : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          icon={<Boxes />}
          title="No amenities yet"
          description="Add the signature amenities buyers filter by on the Buy page."
          action={
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus />
              Add amenity
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
                {filtered.map((amenity) => (
                  <TableRow key={amenity.id}>
                    <TableCell className="font-medium">{amenity.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {amenity.slug}
                    </TableCell>
                    <TableCell>{amenity.display_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={amenity.is_active}
                        onCheckedChange={(checked) =>
                          void handleToggle(amenity, checked)
                        }
                        aria-label={`Toggle ${amenity.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${amenity.name}`}
                          onClick={() => {
                            setEditing(amenity);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${amenity.name}`}
                          onClick={() => askDelete(amenity)}
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

      <AmenityDialog
        amenity={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={reload}
      />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this amenity?"
        description={
          linkedCount && linkedCount > 0
            ? `${confirm.target?.name} is linked to ${linkedCount} ${linkedCount === 1 ? "property" : "properties"}. Removing it clears those links.`
            : `${confirm.target?.name ?? "This amenity"} will be removed from the catalogue.`
        }
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteMasterAmenity(confirm.target.id);
            toast.success("Amenity deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
