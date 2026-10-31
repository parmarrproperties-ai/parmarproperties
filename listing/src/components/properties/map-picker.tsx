"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGrid } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";

// Leaflet touches `window` on import, so the canvas is loaded in the browser only.
const MapCanvas = dynamic(() => import("./map-canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-lg border border-border bg-muted text-sm text-muted-foreground">
      <Spinner />
      <span className="ml-2">Loading map…</span>
    </div>
  ),
});

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (coords: { latitude: number | null; longitude: number | null }) => void;
  latitudeError?: string;
  longitudeError?: string;
}

/**
 * Coordinate picker: click or drag on the map, or type the values directly.
 */
export function MapPicker({
  latitude,
  longitude,
  onChange,
  latitudeError,
  longitudeError,
}: MapPickerProps) {
  function parseCoordinate(value: string): number | null {
    if (value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return (
    <div className="space-y-3">
      <FieldGrid columns={2}>
        <Field label="Latitude" htmlFor="latitude" error={latitudeError}>
          <Input
            id="latitude"
            inputMode="decimal"
            placeholder="18.5204"
            value={latitude ?? ""}
            onChange={(event) =>
              onChange({
                latitude: parseCoordinate(event.target.value),
                longitude,
              })
            }
          />
        </Field>
        <Field label="Longitude" htmlFor="longitude" error={longitudeError}>
          <Input
            id="longitude"
            inputMode="decimal"
            placeholder="73.8567"
            value={longitude ?? ""}
            onChange={(event) =>
              onChange({
                latitude,
                longitude: parseCoordinate(event.target.value),
              })
            }
          />
        </Field>
      </FieldGrid>

      <div className="overflow-hidden rounded-lg border border-border">
        <MapCanvas
          latitude={latitude}
          longitude={longitude}
          onPick={(lat, lng) => onChange({ latitude: lat, longitude: lng })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          Click the map to drop a pin, or drag an existing pin to fine-tune it.
        </p>
        {latitude != null || longitude != null ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange({ latitude: null, longitude: null })}
          >
            Clear pin
          </Button>
        ) : null}
      </div>
    </div>
  );
}
