"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { Location, LookupItem } from "@/types";
import { locationSchema } from "@/lib/validations";
import { getErrorMessage, slugify } from "@/lib/utils";
import { PUBLICATION_STATUSES } from "@/lib/constants";
import {
  createLocation,
  getNextLocationOrder,
  isLocationSlugAvailable,
  updateLocation,
} from "@/lib/api/locations";
import { listLookupLocations } from "@/lib/api/lookups";
import { deleteFile, storageFolders } from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Field, FieldGrid, ToggleField } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";
import { TagInput } from "@/components/shared/tag-input";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";

type LocationValues = z.input<typeof locationSchema>;
type LocationOutput = z.output<typeof locationSchema>;

const NO_MICRO_MARKET = "none";

interface LocationDialogProps {
  location: Location | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function toFormValues(location: Location | null): LocationValues {
  return {
    name: location?.name ?? "",
    slug: location?.slug ?? "",
    tagline: location?.tagline ?? "",
    description: location?.description ?? "",
    city: location?.city ?? "",
    price_range: location?.price_range ?? "",
    average_rate: location?.average_rate ?? "",
    lifestyle: location?.lifestyle ?? "",
    key_enclaves: location?.key_enclaves ?? [],
    is_primary_home: location?.is_primary_home ?? false,
    primary_order: location?.primary_order ?? null,
    is_future: location?.is_future ?? false,
    future_order: location?.future_order ?? null,
    publication_status: location?.publication_status ?? "published",
    sort_order: location?.sort_order ?? location?.display_order ?? 0,
    meta_title: location?.meta_title ?? "",
    meta_description: location?.meta_description ?? "",
    lookup_location_id: location?.lookup_location_id ?? "",
    is_active: location?.is_active ?? true,
    display_order: location?.display_order ?? 0,
  };
}

export function LocationDialog({
  location,
  open,
  onOpenChange,
  onSaved,
}: LocationDialogProps) {
  const [selection, setSelection] =
    React.useState<FileSelection>(unchangedSelection);
  const [microMarkets, setMicroMarkets] = React.useState<LookupItem[]>([]);
  const [slugLocked, setSlugLocked] = React.useState(false);

  const form = useForm<LocationValues, unknown, LocationOutput>({
    resolver: zodResolver(locationSchema),
    defaultValues: toFormValues(null),
  });

  React.useEffect(() => {
    if (!open) return;

    listLookupLocations()
      .then(setMicroMarkets)
      .catch((error) => toast.error(getErrorMessage(error)));
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    setSelection(unchangedSelection);
    setSlugLocked(Boolean(location));
    form.reset(toFormValues(location));
  }, [open, location, form]);

  const nameValue = form.watch("name");

  React.useEffect(() => {
    if (slugLocked) return;
    form.setValue("slug", slugify(nameValue ?? ""), { shouldValidate: false });
  }, [nameValue, slugLocked, form]);

  async function onSubmit(values: LocationOutput) {
    try {
      const slugFree = await isLocationSlugAvailable(values.slug, location?.id);
      if (!slugFree) {
        form.setError("slug", {
          message: "Another location already uses this slug.",
        });
        toast.error("That slug is already taken.");
        return;
      }

      const uploaded = await uploadSelection(
        selection,
        storageFolders.locations
      );

      if (location) {
        await updateLocation(location.id, values, uploaded);
        if (uploaded !== undefined && location.image_path) {
          await deleteFile(location.image_path);
        }
        toast.success("Location updated");
      } else {
        // Append when sort_order is unset/0; otherwise insert at the requested
        // position and shift peers (enforced in the locations API).
        const sortOrder =
          values.sort_order && values.sort_order > 0
            ? values.sort_order
            : await getNextLocationOrder();
        await createLocation({ ...values, sort_order: sortOrder }, uploaded ?? null);
        toast.success("Location created");
      }

      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const { errors, isSubmitting } = form.formState;
  const isFuture = form.watch("is_future") ?? false;
  const keyEnclaves = form.watch("key_enclaves") ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {location ? "Edit location" : "New location"}
          </DialogTitle>
          <DialogDescription>
            Editorial micro-market page. General Order controls directory and
            filter lists. Homepage Top 4 is configured in the dedicated section
            on the Locations page.
          </DialogDescription>
        </DialogHeader>

        <form
          id="location-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldGrid>
            <Field
              label="Name"
              htmlFor="name"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                placeholder="Worli"
                aria-invalid={Boolean(errors.name)}
                {...form.register("name")}
              />
            </Field>

            <Field
              label="URL slug"
              htmlFor="location-slug"
              required
              hint={
                slugLocked
                  ? "Used in /locations/…"
                  : "Generated from the name — edit to take over."
              }
              error={errors.slug?.message}
            >
              <Input
                id="location-slug"
                placeholder="worli"
                aria-invalid={Boolean(errors.slug)}
                {...form.register("slug", {
                  onChange: () => setSlugLocked(true),
                })}
              />
            </Field>

            <Field label="City" htmlFor="city" error={errors.city?.message}>
              <Input id="city" placeholder="Mumbai" {...form.register("city")} />
            </Field>

            <Field
              label="Catalogue micro-market"
              hint="Links this page to the location filter options."
              error={errors.lookup_location_id?.message}
            >
              <Select
                value={form.watch("lookup_location_id") || NO_MICRO_MARKET}
                onValueChange={(value) =>
                  form.setValue(
                    "lookup_location_id",
                    value === NO_MICRO_MARKET ? "" : value
                  )
                }
              >
                <SelectTrigger aria-label="Catalogue micro-market">
                  <SelectValue placeholder="Not linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_MICRO_MARKET}>Not linked</SelectItem>
                  {microMarkets.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>

          <Field
            label="Tagline"
            htmlFor="tagline"
            hint="A short line shown under the location name."
            error={errors.tagline?.message}
          >
            <Input
              id="tagline"
              placeholder="Mumbai's sea-facing address"
              {...form.register("tagline")}
            />
          </Field>

          <Field
            label="Editorial overview"
            htmlFor="description"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              placeholder="Why buyers choose this area — architecture, connectivity, lifestyle."
              {...form.register("description")}
            />
          </Field>

          <FieldGrid>
            <Field
              label="Price band"
              htmlFor="price_range"
              hint="For example “₹18 Cr – ₹75 Cr+”."
              error={errors.price_range?.message}
            >
              <Input
                id="price_range"
                placeholder="₹18 Cr – ₹75 Cr+"
                {...form.register("price_range")}
              />
            </Field>

            <Field
              label="Average capital rate"
              htmlFor="average_rate"
              hint="For example “₹65,000 – ₹1,20,000 / sq ft”."
              error={errors.average_rate?.message}
            >
              <Input
                id="average_rate"
                placeholder="₹65,000 – ₹1,20,000 / sq ft"
                {...form.register("average_rate")}
              />
            </Field>
          </FieldGrid>

          <Field
            label="Lifestyle tags"
            htmlFor="lifestyle"
            hint="Comma-separated line shown in the dossier highlights."
            error={errors.lifestyle?.message}
          >
            <Input
              id="lifestyle"
              placeholder="Sea Link Promenade, High-Rise"
              {...form.register("lifestyle")}
            />
          </Field>

          <Field
            label="Key enclaves"
            htmlFor="key_enclaves"
            hint="Streets and pockets listed on the dossier page."
            error={
              errors.key_enclaves?.message ?? errors.key_enclaves?.root?.message
            }
          >
            <TagInput
              id="key_enclaves"
              value={keyEnclaves}
              placeholder="Worli Sea Face"
              max={12}
              disabled={isSubmitting}
              onChange={(next) =>
                form.setValue("key_enclaves", next, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </Field>

          <Field label="Cover image">
            <MediaPicker
              existingUrl={location?.cover_image ?? location?.image_url}
              selection={selection}
              onSelectionChange={setSelection}
              disabled={isSubmitting}
            />
          </Field>

          <FieldGrid>
            <Field
              label="Publication status"
              error={errors.publication_status?.message}
            >
              <Select
                value={form.watch("publication_status") ?? "published"}
                onValueChange={(value) =>
                  form.setValue(
                    "publication_status",
                    value as LocationValues["publication_status"]
                  )
                }
              >
                <SelectTrigger aria-label="Publication status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PUBLICATION_STATUSES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="General Order"
              htmlFor="sort_order"
              hint="Directory / filter / corridor order only. Does not control the homepage Top 4 cards."
              error={errors.sort_order?.message}
            >
              <Input
                id="sort_order"
                type="number"
                min={1}
                step="1"
                {...form.register("sort_order")}
              />
            </Field>
          </FieldGrid>

          <div className="space-y-3">
            <ToggleField
              label="Future enclave"
              description="Appears in the upcoming pipeline strip."
              control={
                <Switch
                  checked={isFuture}
                  onCheckedChange={(checked) =>
                    form.setValue("is_future", checked, { shouldDirty: true })
                  }
                />
              }
            />
            {isFuture ? (
              <Field
                label="Future strip order"
                htmlFor="future_order"
                error={errors.future_order?.message}
              >
                <Input
                  id="future_order"
                  type="number"
                  min={1}
                  step="1"
                  {...form.register("future_order")}
                />
              </Field>
            ) : null}
          </div>

          <FieldGrid>
            <Field
              label="Meta title"
              htmlFor="location-meta-title"
              error={errors.meta_title?.message}
            >
              <Input
                id="location-meta-title"
                placeholder="Luxury residences in Worli"
                {...form.register("meta_title")}
              />
            </Field>
            <Field
              label="Meta description"
              htmlFor="location-meta-description"
              error={errors.meta_description?.message}
            >
              <Input
                id="location-meta-description"
                placeholder="A short summary for search results."
                {...form.register("meta_description")}
              />
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
          <Button type="submit" form="location-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {location ? "Save changes" : "Create location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
