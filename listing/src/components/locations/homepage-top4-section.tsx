"use client";

import * as React from "react";
import { toast } from "sonner";

import type { Location } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import {
  getHomepageTop4Slots,
  saveHomepageTop4,
} from "@/lib/api/locations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/shared/states";

const EMPTY_SLOT = "__empty__";
const SLOT_COUNT = 4;

function isEligible(location: Location): boolean {
  return (
    location.is_active && location.publication_status === "published"
  );
}

interface HomepageTop4SectionProps {
  locations: Location[];
  onSaved: () => void;
}

/**
 * Dedicated Homepage Top 4 editor.
 * Writes only `is_primary_home` + `primary_order` — never General Order.
 */
export function HomepageTop4Section({
  locations,
  onSaved,
}: HomepageTop4SectionProps) {
  const serverSlots = getHomepageTop4Slots(locations);
  const serverKey = serverSlots.join("|");
  const [slots, setSlots] = React.useState<Array<string | null>>(serverSlots);
  const [baselineKey, setBaselineKey] = React.useState(serverKey);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync from server when locations reload (e.g. after Save), without an effect.
  if (baselineKey !== serverKey) {
    setBaselineKey(serverKey);
    setSlots(serverSlots);
    setError(null);
  }

  const selectedIds = React.useMemo(
    () => new Set(slots.filter((id): id is string => Boolean(id))),
    [slots]
  );

  function optionsForSlot(slotIndex: number): Location[] {
    const currentId = slots[slotIndex];
    return locations
      .filter(
        (location) =>
          isEligible(location) ||
          location.id === currentId ||
          // Keep currently selected Top 4 rows visible even if later inactivated,
          // so the admin can see and replace the missing public slot.
          (location.is_primary_home && selectedIds.has(location.id))
      )
      .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
  }

  function handleSlotChange(slotIndex: number, value: string) {
    const nextId = value === EMPTY_SLOT ? null : value;
    setError(null);

    if (nextId) {
      const duplicateIndex = slots.findIndex(
        (id, index) => index !== slotIndex && id === nextId
      );
      if (duplicateIndex >= 0) {
        const name =
          locations.find((location) => location.id === nextId)?.name ??
          "That location";
        setError(
          `“${name}” is already in slot ${duplicateIndex + 1}. Each slot must be unique.`
        );
        return;
      }
    }

    setSlots((current) => {
      const next = [...current];
      next[slotIndex] = nextId;
      return next;
    });
  }

  async function handleSave() {
    setError(null);

    if (slots.some((id) => !id)) {
      setError("Select a location for every Homepage Top 4 slot before saving.");
      return;
    }

    if (new Set(slots).size !== SLOT_COUNT) {
      setError("Each Homepage Top 4 slot must use a different location.");
      return;
    }

    setSaving(true);
    try {
      await saveHomepageTop4(slots as string[]);
      toast.success("Homepage Top 4 saved");
      onSaved();
    } catch (caught) {
      const message = getErrorMessage(caught);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4" aria-labelledby="homepage-top4-heading">
      <div className="space-y-1">
        <h2
          id="homepage-top4-heading"
          className="text-base font-semibold tracking-tight"
        >
          Homepage Top 4
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Choose the four locations displayed in the homepage Explore Properties
          section. This is separate from General Order.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-3">
            {slots.map((slotId, index) => {
              const options = optionsForSlot(index);
              return (
                <div
                  key={`top4-slot-${index + 1}`}
                  className="grid grid-cols-[2rem_1fr] items-center gap-3"
                >
                  <span className="text-sm font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <Select
                    value={slotId ?? EMPTY_SLOT}
                    onValueChange={(value) => handleSlotChange(index, value)}
                    disabled={saving}
                  >
                    <SelectTrigger aria-label={`Homepage Top 4 slot ${index + 1}`}>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EMPTY_SLOT}>Select a location</SelectItem>
                      {options.map((location) => {
                        const inactive = !isEligible(location);
                        return (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                            {inactive ? " (not public)" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button type="button" onClick={() => void handleSave()} disabled={saving}>
              {saving ? <Spinner /> : null}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
