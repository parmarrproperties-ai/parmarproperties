"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Layers, Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import type { ConfigurationWithBreakdown } from "@/types";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  deleteConfiguration,
  listConfigurationsWithBreakdowns,
  reorderConfigurations,
  savePriceBreakdowns,
} from "@/lib/api/configurations";
import { Button } from "@/components/ui/button";
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
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { OrderControls, moveItem } from "@/components/shared/order-controls";
import { ConfigurationDialog } from "@/components/properties/configuration-dialog";
import { PriceBreakdownEditor } from "@/components/properties/price-breakdown-editor";

export function ConfigurationsManager({
  propertyId,
  currency,
  onChanged,
}: {
  propertyId: string;
  currency: string;
  onChanged?: () => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] =
    React.useState<ConfigurationWithBreakdown | null>(null);
  const confirm = useConfirm<ConfigurationWithBreakdown>();

  const fetchConfigurations = React.useCallback(
    () => listConfigurationsWithBreakdowns(propertyId),
    [propertyId]
  );

  const {
    data: configurations,
    setData: setConfigurations,
    loading,
    error,
    reload,
  } = useResource<ConfigurationWithBreakdown[]>(fetchConfigurations, []);

  async function handleMove(from: number, to: number) {
    const next = moveItem(configurations, from, to);
    if (next === configurations) return;

    setConfigurations(next);
    setBusy(true);
    try {
      await reorderConfigurations(next.map((item) => item.id));
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
          <CardTitle>Unit pricing</CardTitle>
          <CardDescription>
            Optional unit-type pricing and cost sheets (base price, floor rise,
            taxes). This is separate from the public Configuration Matrix &amp;
            Details tab — use Configurations for the typology matrix buyers see.
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
          Add unit type
        </Button>
      </CardHeader>

      <CardContent>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <LoadingBlock label="Loading configurations…" />
        ) : configurations.length === 0 ? (
          <EmptyState
            icon={<Layers />}
            title="No unit types yet"
            description="Optional: add internal unit pricing with carpet area and cost sheets. For the public Configuration Matrix, use the Configurations tab instead."
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
                Add unit type
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {configurations.map((configuration, index) => {
              const isOpen = expanded === configuration.id;
              const lineCount = configuration.price_breakdowns?.length ?? 0;

              return (
                <div
                  key={configuration.id}
                  className="rounded-lg border border-border"
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <OrderControls
                      index={index}
                      total={configurations.length}
                      disabled={busy}
                      onMove={handleMove}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">
                          {configuration.name}
                        </p>
                        <AvailabilityBadge
                          availability={configuration.availability}
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[
                          configuration.bhk,
                          configuration.variant,
                          configuration.carpet_area,
                          configuration.possession,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "No details added"}
                      </p>
                    </div>

                    <div className="text-sm sm:text-right">
                      <p className="font-medium">
                        {configuration.price_display ||
                          formatCurrency(configuration.price, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lineCount > 0
                          ? `${lineCount} cost ${lineCount === 1 ? "line" : "lines"}`
                          : "No cost sheet"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpanded(isOpen ? null : configuration.id)
                        }
                      >
                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                        Cost sheet
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Edit ${configuration.name}`}
                        onClick={() => {
                          setEditing(configuration);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${configuration.name}`}
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => confirm.ask(configuration)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>

                  {isOpen ? (
                    <div className="px-4 pb-4">
                      <PriceBreakdownEditor
                        breakdowns={configuration.price_breakdowns ?? []}
                        currency={currency}
                        onSave={(rows) =>
                          savePriceBreakdowns(configuration.id, rows)
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

      <ConfigurationDialog
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
            ? `${confirm.target.name}, its cost sheet, and any floor plans or units linked to it will be unlinked.`
            : undefined
        }
        confirmLabel="Delete configuration"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteConfiguration(confirm.target.id);
            toast.success("Configuration deleted");
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
