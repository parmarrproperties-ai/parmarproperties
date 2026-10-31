"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  IndianRupee,
  LayoutPanelTop,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import type { PropertyConfigurationWithBreakdowns } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { getPlanTypeLabel, getVariantLabel } from "@/lib/constants";
import {
  deletePropertyConfiguration,
  listPropertyConfigurationsWithBreakdowns,
  reorderPropertyConfigurations,
  savePropertyConfigurationPriceBreakdowns,
} from "@/lib/api/property-configurations";
import { deleteFile, resolvePublicUrl } from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
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
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { OrderControls, moveItem } from "@/components/shared/order-controls";
import { PropertyConfigurationDialog } from "@/components/properties/property-configuration-dialog";
import { PriceBreakdownEditor } from "@/components/properties/price-breakdown-editor";

/**
 * Admin editor for `property_configurations` — feeds the public property
 * page section “Configuration Matrix & Details”, including per-typology
 * price breakdown line items.
 */
export function PropertyConfigurationsManager({
  propertyId,
  currency = "INR",
  onChanged,
}: {
  propertyId: string;
  currency?: string;
  onChanged?: () => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] =
    React.useState<PropertyConfigurationWithBreakdowns | null>(null);
  const [breakdownOpenId, setBreakdownOpenId] = React.useState<string | null>(
    null
  );
  const confirm = useConfirm<PropertyConfigurationWithBreakdowns>();

  const fetchConfigurations = React.useCallback(
    () => listPropertyConfigurationsWithBreakdowns(propertyId),
    [propertyId]
  );

  const {
    data: configurations,
    setData: setConfigurations,
    loading,
    error,
    reload,
  } = useResource<PropertyConfigurationWithBreakdowns[]>(
    fetchConfigurations,
    []
  );

  async function handleMove(from: number, to: number) {
    const next = moveItem(configurations, from, to);
    if (next === configurations) return;

    setConfigurations(next);
    setBusy(true);
    try {
      await reorderPropertyConfigurations(next.map((item) => item.id));
      toast.success("Configuration order saved");
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Configuration Matrix &amp; Details</CardTitle>
          <CardDescription>
            These rows appear on the public Property Detail page under{" "}
            <span className="font-medium text-foreground">
              Configuration Matrix &amp; Details
            </span>
            . Use <span className="font-medium text-foreground">Price Breakdown</span>{" "}
            for the line items unlocked by the public PRICE BREAKDOWN action.
          </CardDescription>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus />
          Add configuration
        </Button>
      </CardHeader>

      <CardContent>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <LoadingBlock label="Loading configurations…" />
        ) : configurations.length === 0 ? (
          <EmptyState
            icon={<LayoutPanelTop />}
            title="No configurations yet"
            description="Add the typologies shown in the public Configuration Matrix — plan type, BHK variant, areas, price band, floor-plan image and optional price breakdown."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setDialogOpen(true);
                }}
              >
                <Plus />
                Add configuration
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {configurations.map((config, index) => {
              const previewUrl = resolvePublicUrl(config.image_path);
              const lineCount = config.price_breakdowns?.length ?? 0;
              const breakdownOpen = breakdownOpenId === config.id;

              return (
                <div
                  key={config.id}
                  className="rounded-lg border border-border"
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <OrderControls
                      index={index}
                      total={configurations.length}
                      disabled={busy}
                      onMove={handleMove}
                    />

                    {previewUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={previewUrl}
                        alt={config.title}
                        className="size-14 shrink-0 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
                        <ImageIcon className="size-4" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{config.title}</p>
                        <Badge variant="secondary">{config.tab_label}</Badge>
                        <Badge variant="outline">
                          {getVariantLabel(config.variant_code)}
                        </Badge>
                        <Badge variant="muted">
                          {getPlanTypeLabel(config.plan_type)}
                        </Badge>
                      </div>
                      {config.area_range || config.carpet_area ? (
                        <p className="text-sm text-muted-foreground">
                          {config.area_range || config.carpet_area}
                          {config.area_range && config.carpet_area
                            ? ` · Carpet ${config.carpet_area}`
                            : null}
                        </p>
                      ) : null}
                      {config.price_indicator ? (
                        <p className="text-sm font-medium">
                          {config.price_indicator}
                          <span className="font-normal text-muted-foreground">
                            {" "}
                            onwards
                          </span>
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        {lineCount > 0
                          ? `${lineCount} price breakdown ${lineCount === 1 ? "line" : "lines"}`
                          : "No price breakdown yet"}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setBreakdownOpenId(
                            breakdownOpen ? null : config.id
                          )
                        }
                      >
                        <IndianRupee />
                        Price Breakdown
                        {breakdownOpen ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Edit ${config.title}`}
                        onClick={() => {
                          setEditing(config);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${config.title}`}
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => confirm.ask(config)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>

                  {breakdownOpen ? (
                    <div className="border-t border-border px-4 py-4">
                      <PriceBreakdownEditor
                        breakdowns={config.price_breakdowns ?? []}
                        currency={currency}
                        title="Price breakdown"
                        emptyHint="Add the official line items for this typology (base price, floor rise, taxes, levies). These feed the public PRICE BREAKDOWN unlock for this configuration."
                        saveLabel="Save price breakdown"
                        onSave={(rows) =>
                          savePropertyConfigurationPriceBreakdowns(
                            config.id,
                            rows
                          )
                        }
                        onSaved={() => {
                          reload();
                          onChanged?.();
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <PropertyConfigurationDialog
        propertyId={propertyId}
        configuration={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={() => {
          reload();
          onChanged?.();
        }}
      />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this configuration?"
        description={
          confirm.target
            ? `${confirm.target.title} and its price breakdown lines will be removed from the Configuration Matrix.`
            : undefined
        }
        confirmLabel="Delete configuration"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deletePropertyConfiguration(confirm.target.id);
            await deleteFile(
              confirm.target.image_path.startsWith("http")
                ? null
                : confirm.target.image_path
            );
            toast.success("Configuration deleted");
            if (breakdownOpenId === confirm.target.id) {
              setBreakdownOpenId(null);
            }
            reload();
            onChanged?.();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </Card>
  );
}
