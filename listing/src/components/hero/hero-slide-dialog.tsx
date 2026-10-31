"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { HeroSlide } from "@/types";
import { heroSlideSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import {
  createHeroSlide,
  getNextHeroOrder,
  updateHeroSlide,
} from "@/lib/api/hero-slides";
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
import { Field, FieldGrid, ToggleField } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";

type HeroValues = z.input<typeof heroSlideSchema>;
type HeroOutput = z.output<typeof heroSlideSchema>;

interface HeroSlideDialogProps {
  slide: HeroSlide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function HeroSlideDialog({
  slide,
  open,
  onOpenChange,
  onSaved,
}: HeroSlideDialogProps) {
  const [selection, setSelection] =
    React.useState<FileSelection>(unchangedSelection);

  const form = useForm<HeroValues, unknown, HeroOutput>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      heading: "",
      supporting_text: "",
      cta_label: "",
      cta_url: "",
      is_active: true,
      display_order: 0,
    },
  });

  // Reset whenever the dialog opens so stale values never leak between rows.
  React.useEffect(() => {
    if (!open) return;

    setSelection(unchangedSelection);
    form.reset({
      heading: slide?.heading ?? "",
      supporting_text: slide?.supporting_text ?? "",
      cta_label: slide?.cta_label ?? "",
      cta_url: slide?.cta_url ?? "",
      is_active: slide?.is_active ?? true,
      display_order: slide?.display_order ?? 0,
    });
  }, [open, slide, form]);

  async function onSubmit(values: HeroOutput) {
    try {
      const uploaded = await uploadSelection(selection, storageFolders.hero);

      if (slide) {
        await updateHeroSlide(slide.id, values, uploaded);
        // Replacing or clearing the artwork frees the previous object.
        if (uploaded !== undefined && slide.image_path) {
          await deleteFile(slide.image_path);
        }
        toast.success("Hero slide updated");
      } else {
        await createHeroSlide(
          { ...values, display_order: await getNextHeroOrder() },
          uploaded ?? null
        );
        toast.success("Hero slide created");
      }

      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {slide ? "Edit hero slide" : "New hero slide"}
          </DialogTitle>
          <DialogDescription>
            Slides appear in the home page carousel in the order you arrange
            them.
          </DialogDescription>
        </DialogHeader>

        <form
          id="hero-slide-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field
            label="Heading"
            htmlFor="heading"
            required
            error={form.formState.errors.heading?.message}
          >
            <Input
              id="heading"
              placeholder="Find your next address in Pune"
              aria-invalid={Boolean(form.formState.errors.heading)}
              {...form.register("heading")}
            />
          </Field>

          <Field
            label="Supporting text"
            htmlFor="supporting_text"
            hint="One or two lines of context below the heading."
            error={form.formState.errors.supporting_text?.message}
          >
            <Textarea
              id="supporting_text"
              rows={3}
              placeholder="Handpicked homes from trusted developers."
              {...form.register("supporting_text")}
            />
          </Field>

          <FieldGrid>
            <Field
              label="Button label"
              htmlFor="cta_label"
              error={form.formState.errors.cta_label?.message}
            >
              <Input
                id="cta_label"
                placeholder="Browse properties"
                {...form.register("cta_label")}
              />
            </Field>
            <Field
              label="Button link"
              htmlFor="cta_url"
              hint="Full URL, including https://"
              error={form.formState.errors.cta_url?.message}
            >
              <Input
                id="cta_url"
                placeholder="https://parmarproperties.com/properties"
                {...form.register("cta_url")}
              />
            </Field>
          </FieldGrid>

          <Field label="Background image">
            <MediaPicker
              existingUrl={slide?.image_url}
              selection={selection}
              onSelectionChange={setSelection}
              disabled={isSubmitting}
            />
          </Field>

          <ToggleField
            label="Show on the website"
            description="Turn off to keep this slide as a draft."
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
          <Button type="submit" form="hero-slide-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {slide ? "Save changes" : "Create slide"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
