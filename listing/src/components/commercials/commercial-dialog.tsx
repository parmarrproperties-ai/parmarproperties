"use client";

import * as React from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { CommercialPropertyWithRelations, LookupItem } from "@/types";
import { commercialPropertySchema } from "@/lib/validations";
import { getErrorMessage, slugify } from "@/lib/utils";
import { PUBLICATION_STATUSES } from "@/lib/constants";
import {
  createCommercialProperty,
  isCommercialSlugAvailable,
  listCommercialFormLookups,
  updateCommercialProperty,
} from "@/lib/api/commercial-properties";
import { resolvePublicUrl, storageFolders } from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { TagInput } from "@/components/shared/tag-input";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";

type CommercialValues = z.input<typeof commercialPropertySchema>;
type CommercialOutput = z.output<typeof commercialPropertySchema>;

const NO_GRADE = "none";

interface CommercialDialogProps {
  commercial: CommercialPropertyWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function toFormValues(
  commercial: CommercialPropertyWithRelations | null
): DefaultValues<CommercialValues> {
  return {
    title: commercial?.title ?? "",
    slug: commercial?.slug ?? "",
    tagline: commercial?.tagline ?? "",
    hub_id: commercial?.hub_id ?? "",
    sub_location: commercial?.sub_location ?? "",
    price: commercial?.price ?? undefined,
    carpet_area: commercial?.carpet_area ?? undefined,
    commercial_type_id: commercial?.commercial_type_id ?? "",
    floor: commercial?.floor ?? "",
    possession: commercial?.possession ?? "",
    grade_id: commercial?.grade_id ?? "",
    cover_image: commercial?.cover_image ?? "",
    rera_id: commercial?.rera_id ?? "",
    description: commercial?.description ?? "",
    highlights: commercial?.highlights ?? [],
    status: commercial?.status ?? "published",
    sort_order: commercial?.sort_order ?? 0,
    meta_title: commercial?.meta_title ?? "",
    meta_description: commercial?.meta_description ?? "",
  };
}

export function CommercialDialog({
  commercial,
  open,
  onOpenChange,
  onSaved,
}: CommercialDialogProps) {
  const [selection, setSelection] =
    React.useState<FileSelection>(unchangedSelection);
  const [lookups, setLookups] = React.useState<{
    hubs: LookupItem[];
    types: LookupItem[];
    grades: LookupItem[];
  }>({ hubs: [], types: [], grades: [] });
  const [slugLocked, setSlugLocked] = React.useState(false);

  const form = useForm<CommercialValues, unknown, CommercialOutput>({
    resolver: zodResolver(commercialPropertySchema),
    defaultValues: toFormValues(null),
  });

  React.useEffect(() => {
    if (!open) return;

    listCommercialFormLookups()
      .then(setLookups)
      .catch((error) => toast.error(getErrorMessage(error)));
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    setSelection(unchangedSelection);
    setSlugLocked(Boolean(commercial));
    form.reset(toFormValues(commercial));
  }, [open, commercial, form]);

  const titleValue = form.watch("title");
  const highlights = form.watch("highlights") ?? [];

  React.useEffect(() => {
    if (slugLocked) return;
    form.setValue("slug", slugify(titleValue ?? ""), { shouldValidate: false });
  }, [titleValue, slugLocked, form]);

  async function onSubmit(values: CommercialOutput) {
    try {
      const slugFree = await isCommercialSlugAvailable(
        values.slug,
        commercial?.id
      );
      if (!slugFree) {
        form.setError("slug", {
          message: "Another commercial listing already uses this slug.",
        });
        toast.error("That slug is already taken.");
        return;
      }

      const folder = storageFolders.commercialCover(commercial?.id ?? "new");
      const uploaded = await uploadSelection(selection, folder);

      let cover_image = values.cover_image ?? "";
      if (uploaded !== undefined) {
        cover_image = uploaded?.url ?? "";
      }

      const payload: CommercialOutput = {
        ...values,
        grade_id: values.grade_id || null,
        cover_image,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
      };

      if (commercial) {
        await updateCommercialProperty(commercial.id, payload);
        toast.success("Commercial listing updated");
      } else {
        await createCommercialProperty(payload);
        toast.success("Commercial listing created");
      }

      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const { errors, isSubmitting } = form.formState;
  const coverUrl = resolvePublicUrl(commercial?.cover_image);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {commercial ? "Edit commercial listing" : "New commercial listing"}
          </DialogTitle>
          <DialogDescription>
            Office and retail inventory shown on the commercial catalogue.
          </DialogDescription>
        </DialogHeader>

        <form
          id="commercial-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FieldGrid>
            <Field
              label="Title"
              htmlFor="commercial-title"
              required
              error={errors.title?.message}
            >
              <Input
                id="commercial-title"
                placeholder="Lower Parel Grade-A tower"
                aria-invalid={Boolean(errors.title)}
                {...form.register("title")}
              />
            </Field>

            <Field
              label="URL slug"
              htmlFor="commercial-slug"
              required
              hint={
                slugLocked
                  ? "Used in /commercials/…"
                  : "Generated from the title — edit to take over."
              }
              error={errors.slug?.message}
            >
              <Input
                id="commercial-slug"
                placeholder="lower-parel-grade-a"
                aria-invalid={Boolean(errors.slug)}
                {...form.register("slug", {
                  onChange: () => setSlugLocked(true),
                })}
              />
            </Field>
          </FieldGrid>

          <Field
            label="Tagline"
            htmlFor="commercial-tagline"
            required
            error={errors.tagline?.message}
          >
            <Input
              id="commercial-tagline"
              placeholder="Sea-facing commercial floors"
              {...form.register("tagline")}
            />
          </Field>

          <FieldGrid>
            <Field label="Hub" required error={errors.hub_id?.message}>
              <Select
                value={form.watch("hub_id") || undefined}
                onValueChange={(value) => form.setValue("hub_id", value)}
              >
                <SelectTrigger aria-label="Commercial hub">
                  <SelectValue placeholder="Select hub" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.hubs.map((hub) => (
                    <SelectItem key={hub.id} value={hub.id}>
                      {hub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Sub-location"
              htmlFor="sub_location"
              required
              error={errors.sub_location?.message}
            >
              <Input
                id="sub_location"
                placeholder="Lower Parel"
                {...form.register("sub_location")}
              />
            </Field>
          </FieldGrid>

          <FieldGrid>
            <Field
              label="Price (₹)"
              htmlFor="commercial-price"
              required
              hint="Stored as rupees; the site may show crores."
              error={errors.price?.message}
            >
              <Input
                id="commercial-price"
                type="number"
                min={0}
                step="1"
                {...form.register("price")}
              />
            </Field>

            <Field
              label="Carpet area (sq ft)"
              htmlFor="carpet_area"
              required
              error={errors.carpet_area?.message}
            >
              <Input
                id="carpet_area"
                type="number"
                min={1}
                step="1"
                {...form.register("carpet_area")}
              />
            </Field>
          </FieldGrid>

          <FieldGrid>
            <Field
              label="Commercial type"
              required
              error={errors.commercial_type_id?.message}
            >
              <Select
                value={form.watch("commercial_type_id") || undefined}
                onValueChange={(value) =>
                  form.setValue("commercial_type_id", value)
                }
              >
                <SelectTrigger aria-label="Commercial type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.types.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Grade" error={errors.grade_id?.message}>
              <Select
                value={form.watch("grade_id") || NO_GRADE}
                onValueChange={(value) =>
                  form.setValue(
                    "grade_id",
                    value === NO_GRADE ? "" : value
                  )
                }
              >
                <SelectTrigger aria-label="Building grade">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_GRADE}>Not specified</SelectItem>
                  {lookups.grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>

          <FieldGrid>
            <Field
              label="Floor"
              htmlFor="floor"
              required
              error={errors.floor?.message}
            >
              <Input
                id="floor"
                placeholder="12th – 18th floor"
                {...form.register("floor")}
              />
            </Field>

            <Field
              label="Possession"
              htmlFor="possession"
              required
              error={errors.possession?.message}
            >
              <Input
                id="possession"
                placeholder="Ready to move"
                {...form.register("possession")}
              />
            </Field>
          </FieldGrid>

          <Field
            label="RERA ID"
            htmlFor="rera_id"
            error={errors.rera_id?.message}
          >
            <Input id="rera_id" placeholder="Optional" {...form.register("rera_id")} />
          </Field>

          <Field
            label="Description"
            htmlFor="commercial-description"
            required
            error={errors.description?.message}
          >
            <Textarea
              id="commercial-description"
              rows={4}
              {...form.register("description")}
            />
          </Field>

          <Field
            label="Highlights"
            hint="Up to eight bullet points."
            error={
              errors.highlights?.message ?? errors.highlights?.root?.message
            }
          >
            <TagInput
              value={highlights}
              placeholder="Dual lobby access"
              max={8}
              disabled={isSubmitting}
              onChange={(next) =>
                form.setValue("highlights", next, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </Field>

          <Field label="Cover image">
            <MediaPicker
              existingUrl={coverUrl}
              selection={selection}
              onSelectionChange={setSelection}
              disabled={isSubmitting}
            />
          </Field>

          <FieldGrid>
            <Field label="Status" error={errors.status?.message}>
              <Select
                value={form.watch("status") ?? "published"}
                onValueChange={(value) =>
                  form.setValue(
                    "status",
                    value as CommercialValues["status"]
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
              label="Sort order"
              htmlFor="sort_order"
              error={errors.sort_order?.message}
            >
              <Input
                id="sort_order"
                type="number"
                min={0}
                step="1"
                {...form.register("sort_order")}
              />
            </Field>
          </FieldGrid>

          <FieldGrid>
            <Field
              label="Meta title"
              htmlFor="commercial-meta-title"
              error={errors.meta_title?.message}
            >
              <Input
                id="commercial-meta-title"
                {...form.register("meta_title")}
              />
            </Field>
            <Field
              label="Meta description"
              htmlFor="commercial-meta-description"
              error={errors.meta_description?.message}
            >
              <Input
                id="commercial-meta-description"
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
          <Button type="submit" form="commercial-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {commercial ? "Save changes" : "Create listing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
