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
  createMasterAmenity,
  updateMasterAmenity,
} from "@/lib/api/amenities";
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

type AmenityValues = z.input<typeof lookupItemSchema>;
type AmenityOutput = z.output<typeof lookupItemSchema>;

interface AmenityDialogProps {
  amenity: LookupItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function AmenityDialog({
  amenity,
  open,
  onOpenChange,
  onSaved,
}: AmenityDialogProps) {
  const [slugLocked, setSlugLocked] = React.useState(Boolean(amenity));

  const form = useForm<AmenityValues, unknown, AmenityOutput>({
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

    setSlugLocked(Boolean(amenity));
    form.reset({
      name: amenity?.name ?? "",
      slug: amenity?.slug ?? "",
      display_order: amenity?.display_order ?? 0,
      is_active: amenity?.is_active ?? true,
    });
  }, [open, amenity, form]);

  const nameValue = form.watch("name");

  React.useEffect(() => {
    if (slugLocked) return;
    form.setValue("slug", slugify(nameValue ?? ""), { shouldValidate: false });
  }, [nameValue, slugLocked, form]);

  async function onSubmit(values: AmenityOutput) {
    try {
      if (amenity) {
        await updateMasterAmenity(amenity.id, values);
        toast.success("Amenity updated");
      } else {
        await createMasterAmenity(values);
        toast.success("Amenity added");
      }

      onSaved();
      onOpenChange(false);
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes("already taken")) {
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
          <DialogTitle>{amenity ? "Edit amenity" : "New amenity"}</DialogTitle>
          <DialogDescription>
            Amenities live in lookup_amenities and are shared across every
            property amenity picker.
          </DialogDescription>
        </DialogHeader>

        <form
          id="amenity-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field
            label="Name"
            htmlFor="name"
            required
            error={errors.name?.message}
          >
            <Input
              id="name"
              placeholder="Infinity Sky Pool"
              aria-invalid={Boolean(errors.name)}
              {...form.register("name")}
            />
          </Field>

          <FieldGrid>
            <Field
              label="Slug"
              htmlFor="slug"
              required
              error={errors.slug?.message}
            >
              <Input
                id="slug"
                placeholder="infinity-sky-pool"
                aria-invalid={Boolean(errors.slug)}
                {...form.register("slug", {
                  onChange: () => setSlugLocked(true),
                })}
              />
            </Field>
            <Field
              label="Display order"
              htmlFor="display_order"
              error={errors.display_order?.message}
            >
              <Input
                id="display_order"
                type="number"
                min={0}
                step={1}
                {...form.register("display_order")}
              />
            </Field>
          </FieldGrid>

          <ToggleField
            label="Available for selection"
            description="Inactive amenities stay on properties that already use them."
            control={
              <Switch
                checked={form.watch("is_active") ?? true}
                onCheckedChange={(checked) =>
                  form.setValue("is_active", checked)
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
          <Button type="submit" form="amenity-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {amenity ? "Save changes" : "Add amenity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
