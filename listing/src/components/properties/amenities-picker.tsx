"use client";

import * as React from "react";
import { Boxes, Plus, Save, Search, X } from "lucide-react";
import { toast } from "sonner";

import type { LookupItem } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  listPropertyAmenities,
  setPropertyAmenitySelection,
} from "@/lib/api/amenities";
import { listLookupAmenities } from "@/lib/api/lookups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Spinner,
} from "@/components/shared/states";
import { Field } from "@/components/shared/field";

export function AmenitiesPicker({ propertyId }: { propertyId: string }) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [exclusiveLabels, setExclusiveLabels] = React.useState<string[]>([]);
  const [exclusiveDraft, setExclusiveDraft] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const fetchAmenities = React.useCallback(async () => {
    const [amenities, links] = await Promise.all([
      listLookupAmenities(),
      listPropertyAmenities(propertyId),
    ]);

    // Amenities already attached stay visible even if later deactivated.
    const attached = links
      .map((link) => link.lookup_amenity)
      .filter((amenity): amenity is LookupItem => Boolean(amenity));
    const catalog = [...amenities];
    for (const amenity of attached) {
      if (!catalog.some((item) => item.id === amenity.id)) catalog.push(amenity);
    }
    catalog.sort((a, b) => a.name.localeCompare(b.name));

    const ids = links
      .map((link) => link.lookup_amenity_id)
      .filter((id): id is string => Boolean(id));
    const exclusives = links
      .map((link) => link.custom_label)
      .filter((label): label is string => Boolean(label?.trim()));

    setSelected(ids);
    setExclusiveLabels(exclusives);
    return { catalog, savedIds: ids, savedExclusive: exclusives };
  }, [propertyId]);

  const { data, setData, loading, error, reload } = useResource<{
    catalog: LookupItem[];
    savedIds: string[];
    savedExclusive: string[];
  }>(fetchAmenities, { catalog: [], savedIds: [], savedExclusive: [] });

  const { catalog, savedIds, savedExclusive } = data;

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return catalog;
    return catalog.filter((amenity) =>
      amenity.name.toLowerCase().includes(term)
    );
  }, [catalog, search]);

  const dirty =
    selected.length !== savedIds.length ||
    selected.some((id) => !savedIds.includes(id)) ||
    exclusiveLabels.length !== savedExclusive.length ||
    exclusiveLabels.some((label) => !savedExclusive.includes(label));

  function toggle(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id)
    );
  }

  function addExclusive() {
    const label = exclusiveDraft.trim();
    if (!label) return;
    if (
      exclusiveLabels.some(
        (existing) => existing.toLowerCase() === label.toLowerCase()
      )
    ) {
      setExclusiveDraft("");
      return;
    }
    setExclusiveLabels((current) => [...current, label.slice(0, 120)]);
    setExclusiveDraft("");
  }

  function removeExclusive(label: string) {
    setExclusiveLabels((current) => current.filter((item) => item !== label));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setPropertyAmenitySelection(propertyId, {
        lookupAmenityIds: selected,
        exclusiveLabels,
      });
      setData((current) => ({
        ...current,
        savedIds: selected,
        savedExclusive: exclusiveLabels,
      }));
      toast.success("Amenities updated");
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Amenities</CardTitle>
          <CardDescription>
            Pick from <code>lookup_amenities</code>, and optionally add
            exclusive amenities that apply only to this property.
          </CardDescription>
        </div>
        <Badge variant="secondary">
          {selected.length + exclusiveLabels.length} selected
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <LoadingBlock label="Loading amenities…" />
        ) : catalog.length === 0 ? (
          <EmptyState
            icon={<Boxes />}
            title="The catalogue is empty"
            description="No active rows in lookup_amenities yet — seed the catalogue in the database first."
          />
        ) : (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search amenities"
                className="pl-9"
                aria-label="Search amenities"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No amenities match “{search}”.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((amenity) => {
                  const checked = selected.includes(amenity.id);

                  return (
                    <label
                      key={amenity.id}
                      htmlFor={`amenity-${amenity.id}`}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/60 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5"
                    >
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggle(amenity.id, value === true)
                        }
                      />
                      <span className="min-w-0 flex-1">
                        <Label
                          htmlFor={`amenity-${amenity.id}`}
                          className="cursor-pointer truncate"
                        >
                          {amenity.name}
                        </Label>
                        {!amenity.is_active ? (
                          <span className="block text-xs text-muted-foreground">
                            Retired from the catalogue
                          </span>
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="space-y-3 border-t border-border pt-4">
              <Field
                label="Exclusive amenity"
                hint="Stored only on this property — never added to lookup_amenities."
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={exclusiveDraft}
                    onChange={(event) => setExclusiveDraft(event.target.value)}
                    placeholder="Private Yacht Dock"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addExclusive();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!exclusiveDraft.trim()}
                    onClick={addExclusive}
                  >
                    <Plus />
                    Add exclusive
                  </Button>
                </div>
              </Field>

              {exclusiveLabels.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {exclusiveLabels.map((label) => (
                    <li key={label}>
                      <Badge variant="secondary" className="gap-1 pr-1">
                        {label}
                        <button
                          type="button"
                          className="rounded-sm p-0.5 hover:bg-muted"
                          aria-label={`Remove ${label}`}
                          onClick={() => removeExclusive(label)}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No exclusive amenities on this property.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              {dirty ? (
                <p className="mr-auto text-xs text-muted-foreground">
                  Unsaved amenity changes.
                </p>
              ) : null}
              <Button
                type="button"
                disabled={saving || !dirty}
                onClick={handleSave}
              >
                {saving ? <Spinner /> : <Save />}
                Save amenities
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
