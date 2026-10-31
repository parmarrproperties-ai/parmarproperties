"use client";

import * as React from "react";
import { Image as ImageIcon, LayoutPanelTop, Trash, Upload } from "lucide-react";
import { toast } from "sonner";

import type { FloorPlanType } from "@/types";
import { MAX_IMAGE_SIZE_MB, getVariantLabel } from "@/lib/constants";
import { cn, getErrorMessage, isValidImageFile } from "@/lib/utils";
import {
  listReusableFloorPlanAssets,
  type ReusableFloorPlanAsset,
} from "@/lib/api/floor-plans";
import {
  listReusableConfigurationLayoutAssets,
  type ReusableConfigurationLayoutAsset,
} from "@/lib/api/property-configurations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState, Spinner } from "@/components/shared/states";
import type { ConfigurationDraftRow } from "@/components/properties/configuration-rows-editor";

export type LayoutSourceMode = "existing" | "upload";

export type LayoutPick =
  | { kind: "none" }
  | {
      kind: "existing";
      assetId: string;
      path: string;
      url: string;
      name: string;
    }
  | { kind: "upload"; file: File; previewUrl: string };

export interface FloorPlansDraft {
  master: { mode: LayoutSourceMode; pick: LayoutPick };
  floor: { mode: LayoutSourceMode; pick: LayoutPick };
  /** Keyed by ConfigurationDraftRow.key */
  individual: Record<string, { mode: LayoutSourceMode; pick: LayoutPick }>;
}

export function emptyFloorPlansDraft(): FloorPlansDraft {
  return {
    master: { mode: "upload", pick: { kind: "none" } },
    floor: { mode: "upload", pick: { kind: "none" } },
    individual: {},
  };
}

export function getLayoutPreviewUrl(pick: LayoutPick): string | null {
  if (pick.kind === "upload") return pick.previewUrl;
  if (pick.kind === "existing") return pick.url;
  return null;
}

export function hasLayoutPick(pick: LayoutPick): boolean {
  return pick.kind !== "none";
}

interface AddPropertyFloorPlansProps {
  configRows: ConfigurationDraftRow[];
  value: FloorPlansDraft;
  onChange: (value: FloorPlansDraft) => void;
  disabled?: boolean;
}

function ModeToggle({
  mode,
  onChange,
  disabled,
  id,
}: {
  mode: LayoutSourceMode;
  onChange: (mode: LayoutSourceMode) => void;
  disabled?: boolean;
  id: string;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-border p-0.5"
      role="group"
      aria-label={id}
    >
      <Button
        type="button"
        size="sm"
        variant={mode === "existing" ? "default" : "ghost"}
        disabled={disabled}
        onClick={() => onChange("existing")}
      >
        Select Existing
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === "upload" ? "default" : "ghost"}
        disabled={disabled}
        onClick={() => onChange("upload")}
      >
        Upload New
      </Button>
    </div>
  );
}

function LayoutPreview({
  url,
  label,
  onClear,
  disabled,
}: {
  url: string | null;
  label: string;
  onClear: () => void;
  disabled?: boolean;
}) {
  if (!url) {
    return (
      <div className="flex h-[240px] max-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
        No image selected
      </div>
    );
  }

  return (
    <div className="group relative h-[240px] max-h-[280px] overflow-hidden rounded-lg border border-border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={label}
        className="h-full w-full object-contain"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 px-3 py-2">
        <span className="truncate text-xs text-white">{label}</span>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={disabled}
          onClick={onClear}
        >
          <Trash />
          Clear
        </Button>
      </div>
    </div>
  );
}

function ExistingAssetGrid({
  assets,
  selectedId,
  loading,
  error,
  onSelect,
  disabled,
  emptyLabel,
}: {
  assets: Array<{ id: string; name: string; url: string; path: string }>;
  selectedId?: string;
  loading: boolean;
  error: string | null;
  onSelect: (asset: {
    id: string;
    name: string;
    url: string;
    path: string;
  }) => void;
  disabled?: boolean;
  emptyLabel: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <Spinner />
        Loading existing assets…
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (assets.length === 0) {
    return (
      <EmptyState
        icon={<ImageIcon />}
        title="No reusable images yet"
        description={emptyLabel}
      />
    );
  }

  return (
    <div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
      {assets.map((asset) => {
        const selected = selectedId === asset.id;
        return (
          <button
            key={asset.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(asset)}
            className={cn(
              "overflow-hidden rounded-lg border text-left transition-colors",
              selected
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/40"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.url}
              alt={asset.name}
              className="aspect-video w-full object-cover"
            />
            <p className="truncate px-2 py-1.5 text-xs">{asset.name}</p>
          </button>
        );
      })}
    </div>
  );
}

function UploadPane({
  pick,
  onFile,
  onClear,
  disabled,
  label,
}: {
  pick: LayoutPick;
  onFile: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
  label: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const problem = isValidImageFile(file, MAX_IMAGE_SIZE_MB);
    if (problem) {
      toast.error(problem);
      return;
    }
    onFile(file);
  }

  const preview = getLayoutPreviewUrl(pick);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
      />
      <LayoutPreview
        url={preview}
        label={
          pick.kind === "upload"
            ? pick.file.name
            : pick.kind === "existing"
              ? pick.name
              : label
        }
        onClear={onClear}
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <Upload />
        {pick.kind === "upload" ? "Replace image" : "Upload image"}
      </Button>
    </div>
  );
}

function PlanSlot({
  title,
  description,
  mode,
  pick,
  onModeChange,
  onPickChange,
  disabled,
  planType,
}: {
  title: string;
  description: string;
  mode: LayoutSourceMode;
  pick: LayoutPick;
  onModeChange: (mode: LayoutSourceMode) => void;
  onPickChange: (pick: LayoutPick) => void;
  disabled?: boolean;
  planType: FloorPlanType;
}) {
  const [assets, setAssets] = React.useState<ReusableFloorPlanAsset[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (mode !== "existing") return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    listReusableFloorPlanAssets(planType)
      .then((rows) => {
        if (!cancelled) setAssets(rows);
      })
      .catch((caught) => {
        if (!cancelled) setError(getErrorMessage(caught));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, planType]);

  function setMode(next: LayoutSourceMode) {
    onModeChange(next);
    // Switching mode clears the other source's pending pick.
    onPickChange({ kind: "none" });
  }

  return (
    <section className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ModeToggle
          id={`${title}-mode`}
          mode={mode}
          onChange={setMode}
          disabled={disabled}
        />
      </div>

      {mode === "existing" ? (
        <div className="space-y-3">
          <ExistingAssetGrid
            assets={assets.map((row) => ({
              id: row.id,
              name: row.name,
              url: row.image_url,
              path: row.image_path,
            }))}
            selectedId={pick.kind === "existing" ? pick.assetId : undefined}
            loading={loading}
            error={error}
            disabled={disabled}
            emptyLabel="Upload a master or floor plan on any property first, then reuse it here."
            onSelect={(asset) =>
              onPickChange({
                kind: "existing",
                assetId: asset.id,
                path: asset.path,
                url: asset.url,
                name: asset.name,
              })
            }
          />
          {pick.kind === "existing" ? (
            <LayoutPreview
              url={pick.url}
              label={pick.name}
              onClear={() => onPickChange({ kind: "none" })}
              disabled={disabled}
            />
          ) : null}
        </div>
      ) : (
        <UploadPane
          pick={pick}
          disabled={disabled}
          label={title}
          onClear={() => onPickChange({ kind: "none" })}
          onFile={(file) => {
            if (pick.kind === "upload") URL.revokeObjectURL(pick.previewUrl);
            onPickChange({
              kind: "upload",
              file,
              previewUrl: URL.createObjectURL(file),
            });
          }}
        />
      )}
    </section>
  );
}

/**
 * Add Property — Floor Plans & Layouts.
 * Master / Floor → floor_plans (master_plan / floor_plan).
 * Individual → property_configurations.image_path per configuration row.
 */
export function AddPropertyFloorPlans({
  configRows,
  value,
  onChange,
  disabled,
}: AddPropertyFloorPlansProps) {
  const [activeConfigKey, setActiveConfigKey] = React.useState<string>(
    configRows[0]?.key ?? ""
  );
  const [individualAssets, setIndividualAssets] = React.useState<
    ReusableConfigurationLayoutAsset[]
  >([]);
  const [individualLoading, setIndividualLoading] = React.useState(false);
  const [individualError, setIndividualError] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (configRows.length === 0) {
      setActiveConfigKey("");
      return;
    }
    if (!configRows.some((row) => row.key === activeConfigKey)) {
      setActiveConfigKey(configRows[0].key);
    }
  }, [configRows, activeConfigKey]);

  const activeIndividual = activeConfigKey
    ? value.individual[activeConfigKey] ?? {
        mode: "upload" as LayoutSourceMode,
        pick: { kind: "none" as const },
      }
    : null;

  React.useEffect(() => {
    if (!activeIndividual || activeIndividual.mode !== "existing") return;
    let cancelled = false;
    setIndividualLoading(true);
    setIndividualError(null);
    listReusableConfigurationLayoutAssets()
      .then((rows) => {
        if (!cancelled) setIndividualAssets(rows);
      })
      .catch((caught) => {
        if (!cancelled) setIndividualError(getErrorMessage(caught));
      })
      .finally(() => {
        if (!cancelled) setIndividualLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeIndividual?.mode]);

  function updateIndividual(
    key: string,
    next: { mode: LayoutSourceMode; pick: LayoutPick }
  ) {
    onChange({
      ...value,
      individual: {
        ...value.individual,
        [key]: next,
      },
    });
  }

  function configLabel(row: ConfigurationDraftRow): string {
    if (row.variant_code === "custom") {
      return row.custom_type.trim() || row.title.trim() || "Other";
    }
    return getVariantLabel(row.variant_code);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor Plans &amp; Layouts</CardTitle>
        <CardDescription>
          Master Plan, Floor Plan, and per-configuration Individual Layouts.
          These use the floor_plans / property_configurations media paths — not
          the property image gallery.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PlanSlot
          title="Master Layout"
          description="Site / master plan shown under Master Plan on the public detail page."
          mode={value.master.mode}
          pick={value.master.pick}
          planType="master_plan"
          disabled={disabled}
          onModeChange={(mode) =>
            onChange({
              ...value,
              master: { mode, pick: { kind: "none" } },
            })
          }
          onPickChange={(pick) =>
            onChange({
              ...value,
              master: { ...value.master, pick },
            })
          }
        />

        <PlanSlot
          title="Floor Plan"
          description="Typical floor plate under Floor Plan on the public detail page."
          mode={value.floor.mode}
          pick={value.floor.pick}
          planType="floor_plan"
          disabled={disabled}
          onModeChange={(mode) =>
            onChange({
              ...value,
              floor: { mode, pick: { kind: "none" } },
            })
          }
          onPickChange={(pick) =>
            onChange({
              ...value,
              floor: { ...value.floor, pick },
            })
          }
        />

        <section className="space-y-3 rounded-lg border border-border p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Individual Layout</h3>
            <p className="text-xs text-muted-foreground">
              One layout image per configuration typology. Options come from the
              Configuration section above.
            </p>
          </div>

          {configRows.length === 0 ? (
            <EmptyState
              icon={<LayoutPanelTop />}
              title="Add configurations first"
              description="Create at least one configuration row to attach individual layouts."
            />
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {configRows.map((row) => {
                  const hasImage = hasLayoutPick(
                    value.individual[row.key]?.pick ?? { kind: "none" }
                  );
                  const active = row.key === activeConfigKey;
                  return (
                    <Button
                      key={row.key}
                      type="button"
                      size="sm"
                      variant={active ? "default" : "outline"}
                      disabled={disabled}
                      onClick={() => setActiveConfigKey(row.key)}
                    >
                      {configLabel(row)}
                      {hasImage ? (
                        <Badge variant="secondary" className="ml-1">
                          Set
                        </Badge>
                      ) : null}
                    </Button>
                  );
                })}
              </div>

              {activeConfigKey && activeIndividual ? (
                <div className="space-y-3 border-t border-border pt-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium">
                      Layout for{" "}
                      {configLabel(
                        configRows.find((r) => r.key === activeConfigKey)!
                      )}
                    </p>
                    <ModeToggle
                      id="individual-mode"
                      mode={activeIndividual.mode}
                      disabled={disabled}
                      onChange={(mode) =>
                        updateIndividual(activeConfigKey, {
                          mode,
                          pick: { kind: "none" },
                        })
                      }
                    />
                  </div>

                  {activeIndividual.mode === "existing" ? (
                    <div className="space-y-3">
                      <ExistingAssetGrid
                        assets={individualAssets.map((row) => ({
                          id: row.id,
                          name: row.title || row.tab_label,
                          url: row.image_url,
                          path: row.image_path,
                        }))}
                        selectedId={
                          activeIndividual.pick.kind === "existing"
                            ? activeIndividual.pick.assetId
                            : undefined
                        }
                        loading={individualLoading}
                        error={individualError}
                        disabled={disabled}
                        emptyLabel="Upload an individual layout on a configuration first, then reuse it here."
                        onSelect={(asset) =>
                          updateIndividual(activeConfigKey, {
                            mode: "existing",
                            pick: {
                              kind: "existing",
                              assetId: asset.id,
                              path: asset.path,
                              url: asset.url,
                              name: asset.name,
                            },
                          })
                        }
                      />
                      {activeIndividual.pick.kind === "existing" ? (
                        <LayoutPreview
                          url={activeIndividual.pick.url}
                          label={activeIndividual.pick.name}
                          disabled={disabled}
                          onClear={() =>
                            updateIndividual(activeConfigKey, {
                              ...activeIndividual,
                              pick: { kind: "none" },
                            })
                          }
                        />
                      ) : null}
                    </div>
                  ) : (
                    <UploadPane
                      pick={activeIndividual.pick}
                      disabled={disabled}
                      label="Individual layout"
                      onClear={() =>
                        updateIndividual(activeConfigKey, {
                          ...activeIndividual,
                          pick: { kind: "none" },
                        })
                      }
                      onFile={(file) => {
                        if (activeIndividual.pick.kind === "upload") {
                          URL.revokeObjectURL(
                            activeIndividual.pick.previewUrl
                          );
                        }
                        updateIndividual(activeConfigKey, {
                          mode: "upload",
                          pick: {
                            kind: "upload",
                            file,
                            previewUrl: URL.createObjectURL(file),
                          },
                        });
                      }}
                    />
                  )}
                </div>
              ) : null}
            </>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
