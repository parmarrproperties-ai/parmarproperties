"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { LookupItem } from "@/types";
import { lookupItemSchema } from "@/lib/validations";
import { getErrorMessage, slugify } from "@/lib/utils";
import {
  createLookupItem,
  updateLookupItem,
} from "@/lib/api/lookups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGrid, ToggleField } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";

type LocationValues = z.input<typeof lookupItemSchema>;
type LocationOutput = z.output<typeof lookupItemSchema>;

interface LookupLocationDialogProps {
  location: LookupItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function LookupLocationDialog({
  location,
  open,
  onOpenChange,
  onSaved,
}: LookupLocationDialogProps) {
  const [slugLocked, setSlugLocked] = React.useState(Boolean(location));

  const form = useForm<LocationValues, unknown, LocationOutput>({
    resolver: zodResolver(lookupItemSchema),
    defaultValues: {
      name: "",
      slug: "",
      display_order: 0,
      is_active: true,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    setSlugLocked(Boolean(location));
    form.reset({
      name: location?.name ?? "",
      slug: location?.slug ?? "",
      display_order: location?.display_order ?? 0,
      is_active: location?.is_active ?? true,
    });
  }, [open, location, form]);

  const nameValue = form.watch("name");

  React.useEffect(() => {
    if (slugLocked) return;
    form.setValue("slug", slugify(nameValue ?? ""), { shouldValidate: false });
  }, [nameValue, slugLocked, form]);

  async function onSubmit(values: LocationOutput) {
    try {
      if (location) {
        await updateLookupItem("lookup_locations", location.id, values);
        toast.success("Location updated");
      } else {
        await createLookupItem("lookup_locations", values);
        toast.success("Location added");
      }

      onSaved();
      onOpenChange(false);
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes("already taken") || message.includes("duplicate")) {
        form.setError("slug", { message: "That slug is already taken." });
      }
      toast.error(message);
    }
  }

  const { isSubmitting, errors } = form.formState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {location ? "Edit location" : "New location"}
          </DialogTitle>
          <DialogDescription>
            Filter catalogue entry in <code>lookup_locations</code>. This is
            separate from editorial micro-market pages under Website content →
            Locations.
          </DialogDescription>
        </DialogHeader>

        <form
          id="lookup-location-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldGrid>
            <Field
              label="Name"
              htmlFor="lookup-location-name"
              required
              error={errors.name?.message}
            >
              <Input
                id="lookup-location-name"
                placeholder="Worli"
                aria-invalid={Boolean(errors.name)}
                {...form.register("name", {
                  onChange: () => {
                    if (!slugLocked) return;
                  },
                })}
              />
            </Field>

            <Field
              label="Slug"
              htmlFor="lookup-location-slug"
              required
              error={errors.slug?.message}
            >
              <Input
                id="lookup-location-slug"
                placeholder="worli"
                aria-invalid={Boolean(errors.slug)}
                {...form.register("slug", {
                  onChange: () => setSlugLocked(true),
                })}
              />
            </Field>

            <Field
              label="Display order"
              htmlFor="lookup-location-order"
              error={errors.display_order?.message}
            >
              <Input
                id="lookup-location-order"
                type="number"
                min={0}
                step="1"
                {...form.register("display_order")}
              />
            </Field>
          </FieldGrid>

          <ToggleField
            label="Active"
            description="Inactive locations are hidden from property filters."
            control={
              <Switch
                checked={form.watch("is_active") ?? true}
                onCheckedChange={(checked) =>
                  form.setValue("is_active", checked, { shouldDirty: true })
                }
              />
            }
          />
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
          <Button type="submit" form="lookup-location-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {location ? "Save changes" : "Add location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
