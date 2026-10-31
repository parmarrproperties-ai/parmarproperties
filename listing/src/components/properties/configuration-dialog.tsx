"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { Configuration } from "@/types";
import { configurationSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { AVAILABILITY_STATUSES, BHK_OPTIONS } from "@/lib/constants";
import {
  createConfiguration,
  getNextConfigurationOrder,
  updateConfiguration,
} from "@/lib/api/configurations";
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

type ConfigurationValues = z.input<typeof configurationSchema>;
type ConfigurationOutput = z.output<typeof configurationSchema>;

const CUSTOM_BHK = "custom";

interface ConfigurationDialogProps {
  propertyId: string;
  configuration: Configuration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function ConfigurationDialog({
  propertyId,
  configuration,
  open,
  onOpenChange,
  onSaved,
}: ConfigurationDialogProps) {
  const form = useForm<ConfigurationValues, unknown, ConfigurationOutput>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      name: "",
      bhk: "",
      variant: "",
      carpet_area: "",
      possession: "",
      price: null,
      price_display: "",
      availability: "available",
      status: "active",
      display_order: 0,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    form.reset({
      name: configuration?.name ?? "",
      bhk: configuration?.bhk ?? "",
      variant: configuration?.variant ?? "",
      carpet_area: configuration?.carpet_area ?? "",
      possession: configuration?.possession ?? "",
      price: configuration?.price ?? null,
      price_display: configuration?.price_display ?? "",
      availability: configuration?.availability ?? "available",
      status: configuration?.status ?? "active",
      display_order: configuration?.display_order ?? 0,
    });
  }, [open, configuration, form]);

  async function onSubmit(values: ConfigurationOutput) {
    try {
      if (configuration) {
        await updateConfiguration(configuration.id, values);
        toast.success("Configuration updated");
      } else {
        await createConfiguration(propertyId, {
          ...values,
          display_order: await getNextConfigurationOrder(propertyId),
        });
        toast.success("Configuration added");
      }

      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const { errors, isSubmitting } = form.formState;
  const bhkValue = form.watch("bhk") ?? "";
  const bhkIsPreset = BHK_OPTIONS.includes(bhkValue);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {configuration ? "Edit configuration" : "New configuration"}
          </DialogTitle>
          <DialogDescription>
            Each unit type buyers can choose, with its own pricing and
            availability.
          </DialogDescription>
        </DialogHeader>

        <form
          id="configuration-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldGrid>
            <Field
              label="Name"
              htmlFor="config-name"
              required
              hint="For example “2 BHK Premium”."
              error={errors.name?.message}
            >
              <Input
                id="config-name"
                placeholder="2 BHK Premium"
                aria-invalid={Boolean(errors.name)}
                {...form.register("name")}
              />
            </Field>

            <Field label="BHK" error={errors.bhk?.message}>
              <Select
                value={bhkIsPreset ? bhkValue : bhkValue ? CUSTOM_BHK : ""}
                onValueChange={(value) =>
                  form.setValue("bhk", value === CUSTOM_BHK ? "" : value)
                }
              >
                <SelectTrigger aria-label="BHK">
                  <SelectValue placeholder="Select a configuration" />
                </SelectTrigger>
                <SelectContent>
                  {BHK_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_BHK}>Something else…</SelectItem>
                </SelectContent>
              </Select>
              {!bhkIsPreset ? (
                <Input
                  placeholder="Type the configuration"
                  className="mt-2"
                  {...form.register("bhk")}
                />
              ) : null}
            </Field>

            <Field
              label="Variant"
              htmlFor="variant"
              hint="Wing, tower or layout variant."
              error={errors.variant?.message}
            >
              <Input
                id="variant"
                placeholder="A Wing · East facing"
                {...form.register("variant")}
              />
            </Field>

            <Field
              label="Carpet area"
              htmlFor="config-carpet"
              error={errors.carpet_area?.message}
            >
              <Input
                id="config-carpet"
                placeholder="720 sq ft"
                {...form.register("carpet_area")}
              />
            </Field>

            <Field
              label="Price"
              htmlFor="config-price"
              hint="Numeric value, used for sorting."
              error={errors.price?.message}
            >
              <Input
                id="config-price"
                type="number"
                min={0}
                placeholder="9500000"
                {...form.register("price")}
              />
            </Field>

            <Field
              label="Display price"
              htmlFor="config-price-display"
              error={errors.price_display?.message}
            >
              <Input
                id="config-price-display"
                placeholder="₹95 L"
                {...form.register("price_display")}
              />
            </Field>

            <Field
              label="Possession"
              htmlFor="config-possession"
              error={errors.possession?.message}
            >
              <Input
                id="config-possession"
                placeholder="Dec 2027"
                {...form.register("possession")}
              />
            </Field>

            <Field label="Availability" error={errors.availability?.message}>
              <Select
                value={form.watch("availability")}
                onValueChange={(value) =>
                  form.setValue(
                    "availability",
                    value as ConfigurationValues["availability"]
                  )
                }
              >
                <SelectTrigger aria-label="Availability">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_STATUSES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>
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
            form="configuration-form"
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
