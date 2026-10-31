"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { PropertyConfiguration } from "@/types";
import { propertyConfigurationSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { PLAN_TYPES, VARIANT_CODES } from "@/lib/constants";
import {
  createPropertyConfiguration,
  getNextPropertyConfigurationOrder,
  updatePropertyConfiguration,
} from "@/lib/api/property-configurations";
import {
  deleteFile,
  resolvePublicUrl,
  storageFolders,
} from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Spinner } from "@/components/shared/states";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";

type ConfigValues = z.input<typeof propertyConfigurationSchema>;
type ConfigOutput = z.output<typeof propertyConfigurationSchema>;

interface PropertyConfigurationDialogProps {
  propertyId: string;
  configuration: PropertyConfiguration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function PropertyConfigurationDialog({
  propertyId,
  configuration,
  open,
  onOpenChange,
  onSaved,
}: PropertyConfigurationDialogProps) {
  const [selection, setSelection] =
    React.useState<FileSelection>(unchangedSelection);

  const form = useForm<ConfigValues, unknown, ConfigOutput>({
    resolver: zodResolver(propertyConfigurationSchema),
    defaultValues: {
      plan_type: "individual",
      variant_code: "1bhk",
      tab_label: "",
      title: "",
      area_range: "",
      carpet_area: "",
      price_indicator: "",
      tower_zone: "",
      image_path: "",
      display_order: 0,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    setSelection(unchangedSelection);
    form.reset({
      plan_type: configuration?.plan_type ?? "individual",
      variant_code: configuration?.variant_code ?? "1bhk",
      tab_label: configuration?.tab_label ?? "",
      title: configuration?.title ?? "",
      area_range: configuration?.area_range ?? "",
      carpet_area: configuration?.carpet_area ?? "",
      price_indicator: configuration?.price_indicator ?? "",
      tower_zone: configuration?.tower_zone ?? "",
      image_path: configuration?.image_path ?? "",
      display_order: configuration?.display_order ?? 0,
    });
  }, [open, configuration, form]);

  async function onSubmit(values: ConfigOutput) {
    if (!propertyId) {
      toast.error("Save the property first before adding configurations.");
      return;
    }

    try {
      const uploaded = await uploadSelection(
        selection,
        storageFolders.propertyLayouts(propertyId)
      );

      const imagePath =
        uploaded === undefined
          ? values.image_path
          : uploaded === null
            ? ""
            : uploaded.path;

      if (configuration) {
        await updatePropertyConfiguration(configuration.id, {
          ...values,
          image_path: imagePath,
        });
        if (uploaded !== undefined && configuration.image_path) {
          await deleteFile(configuration.image_path);
        }
        toast.success("Configuration updated");
      } else {
        await createPropertyConfiguration(propertyId, {
          ...values,
          image_path: imagePath,
          display_order: await getNextPropertyConfigurationOrder(propertyId),
        });
        toast.success("Configuration added", {
          description:
            "It will appear in Configuration Matrix & Details on the public property page.",
        });
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
          <DialogTitle>
            {configuration ? "Edit configuration" : "New configuration"}
          </DialogTitle>
          <DialogDescription>
            One typology row in the public{" "}
            <span className="font-medium text-foreground">
              Configuration Matrix &amp; Details
            </span>{" "}
            section (for example “2 BHK Luxury Residence” or “4 BHK Sky Suite”).
          </DialogDescription>
        </DialogHeader>

        <form
          id="property-configuration-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldGrid>
            <Field
              label="Plan type"
              required
              hint="Master plan, floor plate, or individual unit layout."
              error={errors.plan_type?.message}
            >
              <Select
                value={form.watch("plan_type") ?? "individual"}
                onValueChange={(value) =>
                  form.setValue("plan_type", value as ConfigValues["plan_type"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger aria-label="Plan type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Variant code"
              required
              hint="BHK bucket used for the matrix tabs."
              error={errors.variant_code?.message}
            >
              <Select
                value={form.watch("variant_code") ?? "1bhk"}
                onValueChange={(value) =>
                  form.setValue(
                    "variant_code",
                    value as ConfigValues["variant_code"],
                    { shouldDirty: true, shouldValidate: true }
                  )
                }
              >
                <SelectTrigger aria-label="Variant code">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VARIANT_CODES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Tab label"
              htmlFor="config-tab-label"
              required
              hint="Short label on the matrix tab, e.g. “3 BHK”."
              error={errors.tab_label?.message}
            >
              <Input
                id="config-tab-label"
                placeholder="3 BHK"
                aria-invalid={Boolean(errors.tab_label)}
                {...form.register("tab_label")}
              />
            </Field>

            <Field
              label="Title / typology"
              htmlFor="config-title"
              required
              hint="Shown as the primary name in the matrix, e.g. “3 BHK Grande”."
              error={errors.title?.message}
            >
              <Input
                id="config-title"
                placeholder="3 BHK Grande"
                aria-invalid={Boolean(errors.title)}
                {...form.register("title")}
              />
            </Field>

            <Field
              label="Area range"
              htmlFor="config-area-range"
              hint="e.g. 850–1,020 sq.ft"
              error={errors.area_range?.message}
            >
              <Input
                id="config-area-range"
                placeholder="850–1,020 sq.ft"
                {...form.register("area_range")}
              />
            </Field>

            <Field
              label="Carpet area"
              htmlFor="config-carpet-area"
              hint="e.g. 1,820 Sq.Ft"
              error={errors.carpet_area?.message}
            >
              <Input
                id="config-carpet-area"
                placeholder="1,820 Sq.Ft"
                {...form.register("carpet_area")}
              />
            </Field>

            <Field
              label="Price indicator"
              htmlFor="config-price-indicator"
              hint="e.g. ₹3.85 Cr – ₹4.50 Cr onwards"
              error={errors.price_indicator?.message}
            >
              <Input
                id="config-price-indicator"
                placeholder="₹3.85 Cr – ₹4.50 Cr onwards"
                {...form.register("price_indicator")}
              />
            </Field>

            <Field
              label="Tower / zone"
              htmlFor="config-tower-zone"
              hint="e.g. High-Rise Sky Suites (Levels 22–48)"
              error={errors.tower_zone?.message}
            >
              <Input
                id="config-tower-zone"
                placeholder="High-Rise Sky Suites (Levels 22–48)"
                {...form.register("tower_zone")}
              />
            </Field>

            <Field
              label="Display order"
              htmlFor="config-display-order"
              hint="Lower numbers appear first. Reordering in the list also updates this."
              error={errors.display_order?.message}
            >
              <Input
                id="config-display-order"
                type="number"
                min={0}
                step={1}
                {...form.register("display_order")}
              />
            </Field>
          </FieldGrid>

          <Field
            label="Configuration / floor-plan image"
            hint="Plan drawing shown with this typology on the public detail page."
            error={errors.image_path?.message}
          >
            <MediaPicker
              existingUrl={resolvePublicUrl(configuration?.image_path)}
              selection={selection}
              onSelectionChange={setSelection}
              disabled={isSubmitting}
              emptyLabel="Upload configuration image"
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
          <Button
            type="submit"
            form="property-configuration-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : null}
            {configuration ? "Save changes" : "Add configuration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
