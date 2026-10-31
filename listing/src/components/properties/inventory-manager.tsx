"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, Layers, Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type { Configuration, InventoryStatus, InventoryUnit } from "@/types";
import { inventoryUnitSchema } from "@/lib/validations";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { INVENTORY_STATUSES } from "@/lib/constants";
import {
  bulkCreateInventoryUnits,
  createInventoryUnit,
  deleteInventoryUnit,
  listInventoryUnits,
  setInventoryUnitStatus,
  summarizeInventory,
  updateInventoryUnit,
} from "@/lib/api/inventory";
import { listConfigurations } from "@/lib/api/configurations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field, FieldGrid } from "@/components/shared/field";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Spinner,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";

type UnitValues = z.input<typeof inventoryUnitSchema>;
type UnitOutput = z.output<typeof inventoryUnitSchema>;

const NO_CONFIGURATION = "none";

export function InventoryManager({
  propertyId,
  currency,
}: {
  propertyId: string;
  currency: string;
}) {
  const [statusFilter, setStatusFilter] = React.useState<InventoryStatus | "">(
    ""
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<InventoryUnit | null>(null);
  const confirm = useConfirm<InventoryUnit>();

  const fetchInventory = React.useCallback(async () => {
    const [units, configurations] = await Promise.all([
      listInventoryUnits(propertyId),
      listConfigurations(propertyId),
    ]);
    return { units, configurations };
  }, [propertyId]);

  const { data, setData, loading, error, reload } = useResource<{
    units: InventoryUnit[];
    configurations: Configuration[];
  }>(fetchInventory, { units: [], configurations: [] });

  const { units, configurations } = data;

  const setUnits = React.useCallback(
    (update: React.SetStateAction<InventoryUnit[]>) => {
      setData((current) => ({
        ...current,
        units: typeof update === "function" ? update(current.units) : update,
      }));
    },
    [setData]
  );

  const summary = React.useMemo(() => summarizeInventory(units), [units]);
  const visible = statusFilter
    ? units.filter((unit) => unit.status === statusFilter)
    : units;

  const configurationNames = React.useMemo(
    () => new Map(configurations.map((item) => [item.id, item.name])),
    [configurations]
  );

  async function handleStatusChange(
    unit: InventoryUnit,
    status: InventoryStatus
  ) {
    setUnits((current) =>
      current.map((item) =>
        item.id === unit.id ? { ...item, status } : item
      )
    );

    try {
      await setInventoryUnitStatus(unit.id, status);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            Unit-level availability. This is internal only and is never published
            to the website.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setBulkOpen(true)}
          >
            <Layers />
            Bulk add
          </Button>
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus />
            Add unit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <LoadingBlock label="Loading inventory…" />
        ) : units.length === 0 ? (
          <EmptyState
            icon={<Boxes />}
            title="No units recorded"
            description="Add units individually, or use bulk add to create a numbered range at once."
            action={
              <Button type="button" variant="outline" onClick={() => setBulkOpen(true)}>
                <Layers />
                Bulk add
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <SummaryTile label="Total" value={summary.total} />
              {INVENTORY_STATUSES.map((status) => (
                <SummaryTile
                  key={status.value}
                  label={status.label}
                  value={summary[status.value]}
                  active={statusFilter === status.value}
                  onClick={() =>
                    setStatusFilter(
                      statusFilter === status.value ? "" : status.value
                    )
                  }
                />
              ))}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Facing</TableHead>
                  <TableHead>Configuration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      {unit.unit_number}
                      {unit.notes ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {unit.notes}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {unit.floor || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {unit.facing || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {unit.configuration_id
                        ? configurationNames.get(unit.configuration_id) ?? "—"
                        : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatCurrency(unit.price, currency)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={unit.status}
                        onValueChange={(value) =>
                          void handleStatusChange(unit, value as InventoryStatus)
                        }
                      >
                        <SelectTrigger
                          className="h-8"
                          aria-label={`Status for unit ${unit.unit_number}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INVENTORY_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Edit unit ${unit.unit_number}`}
                          onClick={() => {
                            setEditing(unit);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete unit ${unit.unit_number}`}
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => confirm.ask(unit)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {visible.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No units with that status.
              </p>
            ) : null}
          </>
        )}
      </CardContent>

      <UnitDialog
        propertyId={propertyId}
        unit={editing}
        configurations={configurations}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={reload}
      />

      <BulkUnitsDialog
        propertyId={propertyId}
        configurations={configurations}
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        onSaved={reload}
      />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this unit?"
        description={
          confirm.target
            ? `Unit ${confirm.target.unit_number} will be removed from inventory.`
            : undefined
        }
        confirmLabel="Delete unit"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteInventoryUnit(confirm.target.id);
            toast.success("Unit deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </Card>
  );
}

function SummaryTile({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </>
  );

  if (!onClick) {
    return (
      <div className="rounded-lg border border-border px-3 py-2">{content}</div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-3 py-2 text-left transition-colors ${
        active
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/60"
      }`}
    >
      {content}
    </button>
  );
}

function UnitDialog({
  propertyId,
  unit,
  configurations,
  open,
  onOpenChange,
  onSaved,
}: {
  propertyId: string;
  unit: InventoryUnit | null;
  configurations: Configuration[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const form = useForm<UnitValues, unknown, UnitOutput>({
    resolver: zodResolver(inventoryUnitSchema),
    defaultValues: {
      unit_number: "",
      floor: "",
      facing: "",
      configuration_id: "",
      price: null,
      status: "available",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;

    form.reset({
      unit_number: unit?.unit_number ?? "",
      floor: unit?.floor ?? "",
      facing: unit?.facing ?? "",
      configuration_id: unit?.configuration_id ?? "",
      price: unit?.price ?? null,
      status: unit?.status ?? "available",
      notes: unit?.notes ?? "",
    });
  }, [open, unit, form]);

  async function onSubmit(values: UnitOutput) {
    try {
      if (unit) {
        await updateInventoryUnit(unit.id, values);
        toast.success("Unit updated");
      } else {
        await createInventoryUnit(propertyId, values);
        toast.success("Unit added");
      }

      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{unit ? "Edit unit" : "Add unit"}</DialogTitle>
          <DialogDescription>
            Track a single flat or plot and its sales status.
          </DialogDescription>
        </DialogHeader>

        <form
          id="unit-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldGrid>
            <Field
              label="Unit number"
              htmlFor="unit_number"
              required
              error={errors.unit_number?.message}
            >
              <Input
                id="unit_number"
                placeholder="A-1203"
                aria-invalid={Boolean(errors.unit_number)}
                {...form.register("unit_number")}
              />
            </Field>
            <Field label="Floor" htmlFor="floor" error={errors.floor?.message}>
              <Input id="floor" placeholder="12" {...form.register("floor")} />
            </Field>
            <Field label="Facing" htmlFor="facing" error={errors.facing?.message}>
              <Input
                id="facing"
                placeholder="East"
                {...form.register("facing")}
              />
            </Field>
            <Field label="Price" htmlFor="unit-price" error={errors.price?.message}>
              <Input
                id="unit-price"
                type="number"
                min={0}
                placeholder="9800000"
                {...form.register("price")}
              />
            </Field>
            <Field label="Configuration" error={errors.configuration_id?.message}>
              <Select
                value={form.watch("configuration_id") || NO_CONFIGURATION}
                onValueChange={(value) =>
                  form.setValue(
                    "configuration_id",
                    value === NO_CONFIGURATION ? "" : value
                  )
                }
              >
                <SelectTrigger aria-label="Configuration">
                  <SelectValue placeholder="Not linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CONFIGURATION}>Not linked</SelectItem>
                  {configurations.map((configuration) => (
                    <SelectItem key={configuration.id} value={configuration.id}>
                      {configuration.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status" error={errors.status?.message}>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as UnitValues["status"])
                }
              >
                <SelectTrigger aria-label="Status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVENTORY_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>

          <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Held for a client until Friday, corner unit, etc."
              {...form.register("notes")}
            />
          </Field>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="unit-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {unit ? "Save changes" : "Add unit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BulkUnitsDialog({
  propertyId,
  configurations,
  open,
  onOpenChange,
  onSaved,
}: {
  propertyId: string;
  configurations: Configuration[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [prefix, setPrefix] = React.useState("A-");
  const [from, setFrom] = React.useState("101");
  const [to, setTo] = React.useState("110");
  const [floor, setFloor] = React.useState("");
  const [configurationId, setConfigurationId] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reopening starts from a clean slate rather than the last failure.
  const [wasOpen, setWasOpen] = React.useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setError(null);
  }

  const start = Number(from);
  const end = Number(to);
  const valid =
    Number.isInteger(start) && Number.isInteger(end) && end >= start;
  const count = valid ? end - start + 1 : 0;

  async function handleCreate() {
    if (!valid) {
      setError("Enter a valid numeric range.");
      return;
    }
    if (count > 200) {
      setError("Create at most 200 units at a time.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const units = Array.from({ length: count }, (_, index) => ({
        unit_number: `${prefix}${start + index}`,
        floor: floor || null,
        facing: null,
        configuration_id: configurationId || null,
        price: null,
        status: "available" as const,
        notes: null,
      }));

      const created = await bulkCreateInventoryUnits(propertyId, units);
      toast.success(`${created} units added`);
      onSaved();
      onOpenChange(false);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk add units</DialogTitle>
          <DialogDescription>
            Creates a numbered range, for example A-101 through A-110. You can
            edit each unit afterwards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <FieldGrid columns={3}>
            <Field label="Prefix" htmlFor="bulk-prefix">
              <Input
                id="bulk-prefix"
                value={prefix}
                onChange={(event) => setPrefix(event.target.value)}
                placeholder="A-"
              />
            </Field>
            <Field label="From" htmlFor="bulk-from">
              <Input
                id="bulk-from"
                value={from}
                inputMode="numeric"
                onChange={(event) => setFrom(event.target.value)}
              />
            </Field>
            <Field label="To" htmlFor="bulk-to">
              <Input
                id="bulk-to"
                value={to}
                inputMode="numeric"
                onChange={(event) => setTo(event.target.value)}
              />
            </Field>
          </FieldGrid>

          <FieldGrid>
            <Field label="Floor" htmlFor="bulk-floor" hint="Applied to every unit.">
              <Input
                id="bulk-floor"
                value={floor}
                onChange={(event) => setFloor(event.target.value)}
                placeholder="1"
              />
            </Field>
            <Field label="Configuration">
              <Select
                value={configurationId || NO_CONFIGURATION}
                onValueChange={(value) =>
                  setConfigurationId(value === NO_CONFIGURATION ? "" : value)
                }
              >
                <SelectTrigger aria-label="Configuration">
                  <SelectValue placeholder="Not linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CONFIGURATION}>Not linked</SelectItem>
                  {configurations.map((configuration) => (
                    <SelectItem key={configuration.id} value={configuration.id}>
                      {configuration.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>

          <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {valid ? (
              <>
                This creates <span className="font-medium text-foreground">{count}</span>{" "}
                units, from{" "}
                <span className="font-medium text-foreground">
                  {prefix}
                  {start}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {prefix}
                  {end}
                </span>
                .
              </>
            ) : (
              "Enter a valid numeric range to preview."
            )}
          </p>

          {error ? (
            <p className="text-xs font-medium text-destructive">{error}</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={saving || !valid}
          >
            {saving ? <Spinner /> : null}
            Create {count > 0 ? count : ""} units
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
