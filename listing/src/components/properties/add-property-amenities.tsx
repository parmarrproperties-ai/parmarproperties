"use client";

import * as React from "react";
import { Boxes, Plus, Search, Trash, X } from "lucide-react";

import type { LookupItem } from "@/types";
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
import { Field } from "@/components/shared/field";
import { EmptyState } from "@/components/shared/states";

export interface AmenityDraftSelection {
  lookupAmenityIds: string[];
  exclusiveLabels: string[];
}

interface AddPropertyAmenitiesProps {
  catalog: LookupItem[];
  value: AmenityDraftSelection;
  onChange: (value: AmenityDraftSelection) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Add Property amenities picker: select from lookup_amenities and attach
 * property-exclusive labels that never enter the global catalogue.
 */
export function AddPropertyAmenities({
  catalog,
  value,
  onChange,
  disabled,
  error,
}: AddPropertyAmenitiesProps) {
  const [search, setSearch] = React.useState("");
  const [exclusiveDraft, setExclusiveDraft] = React.useState("");

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return catalog;
    return catalog.filter((amenity) =>
      amenity.name.toLowerCase().includes(term)
    );
  }, [catalog, search]);

  function toggle(id: string, checked: boolean) {
    const lookupAmenityIds = checked
      ? [...value.lookupAmenityIds, id]
      : value.lookupAmenityIds.filter((item) => item !== id);
    onChange({ ...value, lookupAmenityIds });
  }

  function addExclusive() {
    const label = exclusiveDraft.trim();
    if (!label) return;
    if (
      value.exclusiveLabels.some(
        (existing) => existing.toLowerCase() === label.toLowerCase()
      )
    ) {
      setExclusiveDraft("");
      return;
    }
    onChange({
      ...value,
      exclusiveLabels: [...value.exclusiveLabels, label.slice(0, 120)],
    });
    setExclusiveDraft("");
  }

  function removeExclusive(label: string) {
    onChange({
      ...value,
      exclusiveLabels: value.exclusiveLabels.filter((item) => item !== label),
    });
  }

  const selectedCount =
    value.lookupAmenityIds.length + value.exclusiveLabels.length;

  const catalogIds = catalog.map((amenity) => amenity.id);
  const allCatalogSelected =
    catalogIds.length > 0 &&
    catalogIds.every((id) => value.lookupAmenityIds.includes(id));

  function toggleSelectAllCatalog() {
    if (allCatalogSelected) {
      onChange({
        ...value,
        lookupAmenityIds: value.lookupAmenityIds.filter(
          (id) => !catalogIds.includes(id)
        ),
      });
      return;
    }

    const merged = Array.from(
      new Set([...value.lookupAmenityIds, ...catalogIds])
    );
    onChange({ ...value, lookupAmenityIds: merged });
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Amenities</CardTitle>
          <CardDescription>
            Select from the shared catalogue, then optionally add exclusive
            amenities that apply only to this property.
          </CardDescription>
        </div>
        <Badge variant="secondary">{selectedCount} selected</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {catalog.length === 0 ? (
          <EmptyState
            icon={<Boxes />}
            title="The catalogue is empty"
            description="No active rows in lookup_amenities yet."
          />
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search amenities"
                  className="pl-9"
                  disabled={disabled}
                  aria-label="Search amenities"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || catalogIds.length === 0}
                onClick={toggleSelectAllCatalog}
              >
                {allCatalogSelected ? "Deselect All" : "Select All"}
              </Button>
            </div>

            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No amenities match “{search}”.
              </p>
            ) : (
              <div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((amenity) => {
                  const checked = value.lookupAmenityIds.includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      htmlFor={`add-amenity-${amenity.id}`}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/60 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5"
                    >
                      <Checkbox
                        id={`add-amenity-${amenity.id}`}
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={(next) =>
                          toggle(amenity.id, next === true)
                        }
                      />
                      <Label
                        htmlFor={`add-amenity-${amenity.id}`}
                        className="cursor-pointer truncate"
                      >
                        {amenity.name}
                      </Label>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3 border-t border-border pt-4">
          <Field
            label="Exclusive amenity"
            hint="Property-specific only — not added to the global catalogue."
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={exclusiveDraft}
                onChange={(event) => setExclusiveDraft(event.target.value)}
                placeholder="Private Yacht Dock"
                disabled={disabled}
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
                disabled={disabled || !exclusiveDraft.trim()}
                onClick={addExclusive}
              >
                <Plus />
                Add exclusive
              </Button>
            </div>
          </Field>

          {value.exclusiveLabels.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {value.exclusiveLabels.map((label) => (
                <li key={label}>
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {label}
                    <button
                      type="button"
                      className="rounded-sm p-0.5 hover:bg-muted"
                      aria-label={`Remove ${label}`}
                      disabled={disabled}
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
              No exclusive amenities yet.
            </p>
          )}
        </div>

        {selectedCount > 0 ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Trash className="size-3.5" />
            Uncheck catalogue items or remove exclusive badges to clear them
            before saving.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
