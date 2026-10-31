"use client";

import { withBasePath } from "@/lib/base-path";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  GripVertical,
  Image as ImageIcon,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type { Configuration, FloorPlan } from "@/types";
import { floorPlanSchema } from "@/lib/validations";
import { cn, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { FLOOR_PLAN_TYPES, getFloorPlanTypeLabel } from "@/lib/constants";
import {
  createFloorPlan,
  deleteFloorPlan,
  getNextFloorPlanOrder,
  listFloorPlans,
  reorderFloorPlans,
  setFloorPlanActive,
  updateFloorPlan,
} from "@/lib/api/floor-plans";
import { listConfigurations } from "@/lib/api/configurations";
import { deleteFile, storageFolders } from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { Field, FieldGrid } from "@/components/shared/field";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Spinner,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { OrderControls, moveItem } from "@/components/shared/order-controls";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";

type FloorPlanValues = z.input<typeof floorPlanSchema>;
type FloorPlanOutput = z.output<typeof floorPlanSchema>;

const NO_CONFIGURATION = "none";

export function FloorPlansManager({
  propertyId,
  onChanged,
}: {
  propertyId: string;
  onChanged?: () => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FloorPlan | null>(null);
  const confirm = useConfirm<FloorPlan>();

  const fetchPlans = React.useCallback(async () => {
    const [plans, configurations] = await Promise.all([
      listFloorPlans(propertyId),
      listConfigurations(propertyId),
    ]);
    return { plans, configurations };
  }, [propertyId]);

  const { data, setData, loading, error, reload, refresh } = useResource<{
    plans: FloorPlan[];
    configurations: Configuration[];
  }>(fetchPlans, { plans: [], configurations: [] });

  const { plans, configurations } = data;

  const setPlans = React.useCallback(
    (update: React.SetStateAction<FloorPlan[]>) => {
      setData((current) => ({
        ...current,
        plans: typeof update === "function" ? update(current.plans) : update,
      }));
    },
    [setData]
  );

  // Drag-and-swap state: which card is being dragged / hovered.
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  // Optimistic: the list updates instantly and is saved in the background.
  // Order does not change the property, so the parent editor is not refreshed.
  async function persistOrder(next: FloorPlan[]) {
    setPlans(next);
    setBusy(true);
    try {
      await reorderFloorPlans(next.map((plan) => plan.id));
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleMove(from: number, to: number) {
    const next = moveItem(plans, from, to);
    if (next === plans) return;
    await persistOrder(next);
  }

  async function handleSwap(from: number, to: number) {
    if (from === to || busy) return;
    if (!plans[from] || !plans[to]) return;
    const next = [...plans];
    [next[from], next[to]] = [next[to], next[from]];
    await persistOrder(next);
  }

  function endDrag() {
    setDragIndex(null);
    setOverIndex(null);
  }

  async function handleToggle(plan: FloorPlan, isActive: boolean) {
    setPlans((current) =>
      current.map((item) =>
        item.id === plan.id ? { ...item, is_active: isActive } : item
      )
    );

    try {
      await setFloorPlanActive(plan.id, isActive);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      refresh();
    }
  }

  const configurationNames = React.useMemo(
    () => new Map(configurations.map((item) => [item.id, item.name])),
    [configurations]
  );

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Floor plans</CardTitle>
          <CardDescription>
            Master plan, floor plate and individual layout artwork for the
            public property page. Use plan type Master Plan, Floor Plan or
            Configuration Plan. Active plans can be shown; inactive ones stay
            hidden. These are separate from gallery images and from the
            Configuration Matrix typologies.
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
          Add floor plan
        </Button>
      </CardHeader>

      <CardContent>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <LoadingBlock label="Loading plans…" />
        ) : plans.length === 0 ? (
          <EmptyState
            icon={<ImageIcon />}
            title="No floor plans yet"
            description="Upload a Master Plan, Floor Plan or Configuration Plan image (and optional PDF). Gated/blurred display on the public site is controlled by the website lead gate — keep plans Active when they should be available after unlock."
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
                Add floor plan
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                data-plan-card
                className={cn(
                  "overflow-hidden rounded-lg border border-border transition-[opacity,box-shadow]",
                  dragIndex === index && "opacity-40",
                  overIndex === index && dragIndex !== index && "ring-2 ring-primary"
                )}
                onDragOver={(event) => {
                  if (dragIndex === null) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  if (overIndex !== index) setOverIndex(index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const from = dragIndex;
                  endDrag();
                  if (from !== null) void handleSwap(from, index);
                }}
              >
                <div
                  className={cn("relative", !busy && "cursor-grab active:cursor-grabbing")}
                  draggable={!busy}
                  title="Drag onto another plan to swap"
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", plan.id);
                    const card = event.currentTarget.closest("[data-plan-card]");
                    if (card) event.dataTransfer.setDragImage(card, 24, 24);
                    setDragIndex(index);
                  }}
                  onDragEnd={endDrag}
                >
                  <GripVertical className="pointer-events-none absolute top-2 right-2 z-10 size-5 rounded bg-background/80 p-0.5 text-muted-foreground shadow-sm" />
                  {plan.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={withBasePath(plan.image_url)}
                      alt={plan.name}
                      draggable={false}
                      className="aspect-video w-full bg-muted object-contain"
                    />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground">
                      <ImageIcon className="size-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{plan.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {getFloorPlanTypeLabel(plan.plan_type)}
                        {plan.configuration_id
                          ? ` · ${configurationNames.get(plan.configuration_id) ?? "Configuration"}`
                          : ""}
                      </p>
                    </div>
                    {plan.file_url ? (
                      <a
                        href={plan.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge variant="outline">
                          <FileText />
                          File
                        </Badge>
                      </a>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={plan.is_active}
                        aria-label={`Show ${plan.name} on the website`}
                        onCheckedChange={(checked) =>
                          void handleToggle(plan, checked)
                        }
                      />
                      <OrderControls
                        index={index}
                        total={plans.length}
                        disabled={busy}
                        onMove={handleMove}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Edit ${plan.name}`}
                        onClick={() => {
                          setEditing(plan);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${plan.name}`}
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => confirm.ask(plan)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <FloorPlanDialog
        propertyId={propertyId}
        plan={editing}
        configurations={configurations}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={() => {
          refresh();
          onChanged?.();
        }}
      />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this plan?"
        description="The artwork and any attached file are removed from storage."
        confirmLabel="Delete plan"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteFloorPlan(confirm.target);
            toast.success("Plan deleted");
            refresh();
            onChanged?.();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </Card>
  );
}

function FloorPlanDialog({
  propertyId,
  plan,
  configurations,
  open,
  onOpenChange,
  onSaved,
}: {
  propertyId: string;
  plan: FloorPlan | null;
  configurations: Configuration[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [image, setImage] = React.useState<FileSelection>(unchangedSelection);
  const [document, setDocument] =
    React.useState<FileSelection>(unchangedSelection);

  const form = useForm<FloorPlanValues, unknown, FloorPlanOutput>({
    resolver: zodResolver(floorPlanSchema),
    defaultValues: {
      name: "",
      plan_type: "floor_plan",
      configuration_id: "",
      is_active: true,
      display_order: 0,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    setImage(unchangedSelection);
    setDocument(unchangedSelection);
    form.reset({
      name: plan?.name ?? "",
      plan_type: plan?.plan_type ?? "floor_plan",
      configuration_id: plan?.configuration_id ?? "",
      is_active: plan?.is_active ?? true,
      display_order: plan?.display_order ?? 0,
    });
  }, [open, plan, form]);

  async function onSubmit(values: FloorPlanOutput) {
    try {
      const [uploadedImage, uploadedDocument] = await Promise.all([
        uploadSelection(image, storageFolders.propertyFloorPlans(propertyId)),
        uploadSelection(document, storageFolders.propertyFloorPlans(propertyId)),
      ]);

      if (plan) {
        await updateFloorPlan(plan.id, values, {
          image: uploadedImage,
          document: uploadedDocument,
        });
        if (uploadedImage !== undefined && plan.image_path) {
          await deleteFile(plan.image_path);
        }
        if (uploadedDocument !== undefined && plan.file_path) {
          await deleteFile(plan.file_path);
        }
        toast.success("Plan updated");
      } else {
        await createFloorPlan(
          propertyId,
          {
            ...values,
            display_order: await getNextFloorPlanOrder(propertyId),
          },
          { image: uploadedImage ?? null, document: uploadedDocument ?? null }
        );
        toast.success("Plan added");
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit floor plan" : "New floor plan"}</DialogTitle>
          <DialogDescription>
            Choose Master Plan, Floor Plan or Configuration Plan, upload the
            on-page image, and optionally a higher-resolution downloadable file.
          </DialogDescription>
        </DialogHeader>

        <form
          id="floor-plan-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldGrid>
            <Field
              label="Name"
              htmlFor="plan-name"
              required
              error={errors.name?.message}
            >
              <Input
                id="plan-name"
                placeholder="2 BHK — Type A"
                aria-invalid={Boolean(errors.name)}
                {...form.register("name")}
              />
            </Field>

            <Field label="Plan type" error={errors.plan_type?.message}>
              <Select
                value={form.watch("plan_type")}
                onValueChange={(value) =>
                  form.setValue("plan_type", value as FloorPlanValues["plan_type"])
                }
              >
                <SelectTrigger aria-label="Plan type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLOOR_PLAN_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>

          <Field
            label="Linked configuration"
            hint="Optional. Helps the website show the right plan per unit type."
            error={errors.configuration_id?.message}
          >
            <Select
              value={form.watch("configuration_id") || NO_CONFIGURATION}
              onValueChange={(value) =>
                form.setValue(
                  "configuration_id",
                  value === NO_CONFIGURATION ? "" : value
                )
              }
            >
              <SelectTrigger aria-label="Linked configuration">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plan image">
              <MediaPicker
                existingUrl={plan?.image_url}
                selection={image}
                onSelectionChange={setImage}
                disabled={isSubmitting}
              />
            </Field>
            <Field label="Downloadable file" hint="Optional PDF or larger image.">
              <MediaPicker
                variant="document"
                existingUrl={plan?.file_url}
                existingName={plan?.file_path?.split("/").pop() ?? "Plan file"}
                selection={document}
                onSelectionChange={setDocument}
                disabled={isSubmitting}
                emptyLabel="Upload a file"
              />
            </Field>
          </div>
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
          <Button type="submit" form="floor-plan-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {plan ? "Save changes" : "Add plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
