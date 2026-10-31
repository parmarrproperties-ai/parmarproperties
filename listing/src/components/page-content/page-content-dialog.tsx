"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { PageContent } from "@/types";
import { pageContentSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { updatePageContent } from "@/lib/api/page-content";
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
import { Field, FieldGrid } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";

type PageContentValues = z.input<typeof pageContentSchema>;
type PageContentOutput = z.output<typeof pageContentSchema>;

interface PageContentDialogProps {
  row: PageContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function toFormValues(row: PageContent | null): PageContentValues {
  return {
    title: row?.title ?? "",
    subtitle: row?.subtitle ?? "",
    breadcrumb: row?.breadcrumb ?? "",
    badge: row?.badge ?? "",
    meta_title: row?.meta_title ?? "",
    meta_description: row?.meta_description ?? "",
    sections_data: row?.sections_data ?? {},
  };
}

function sectionsToJson(value: Record<string, unknown> | undefined): string {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

export function PageContentDialog({
  row,
  open,
  onOpenChange,
  onSaved,
}: PageContentDialogProps) {
  const [sectionsJson, setSectionsJson] = React.useState("{}");
  const [sectionsError, setSectionsError] = React.useState<string | null>(null);

  const form = useForm<PageContentValues, unknown, PageContentOutput>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: toFormValues(null),
  });

  React.useEffect(() => {
    if (!open || !row) return;
    const values = toFormValues(row);
    form.reset(values);
    setSectionsJson(sectionsToJson(values.sections_data as Record<string, unknown>));
    setSectionsError(null);
  }, [open, row, form]);

  function parseSectionsJson(): Record<string, unknown> {
    const trimmed = sectionsJson.trim();
    if (!trimmed) return {};

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw new Error("Sections data must be valid JSON.");
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("Sections data must be a JSON object.");
    }

    return parsed as Record<string, unknown>;
  }

  async function onSubmit(values: PageContentOutput) {
    if (!row) return;

    try {
      let sections_data: Record<string, unknown>;
      try {
        sections_data = parseSectionsJson();
      } catch (error) {
        const message = getErrorMessage(error);
        setSectionsError(message);
        toast.error(message);
        return;
      }

      const parsed = pageContentSchema.safeParse({
        ...values,
        sections_data,
      });

      if (!parsed.success) {
        toast.error("Fix validation errors before saving.");
        return;
      }

      await updatePageContent(row.id, parsed.data);
      toast.success("Page content saved");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit page content</DialogTitle>
          <DialogDescription>
            {row ? (
              <>
                Route key <span className="font-mono text-foreground">{row.id}</span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <form
          id="page-content-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field
            label="Title"
            htmlFor="page-title"
            required
            error={errors.title?.message}
          >
            <Input id="page-title" {...form.register("title")} />
          </Field>

          <Field
            label="Subtitle"
            htmlFor="page-subtitle"
            error={errors.subtitle?.message}
          >
            <Textarea id="page-subtitle" rows={2} {...form.register("subtitle")} />
          </Field>

          <FieldGrid>
            <Field
              label="Breadcrumb"
              htmlFor="breadcrumb"
              error={errors.breadcrumb?.message}
            >
              <Input id="breadcrumb" {...form.register("breadcrumb")} />
            </Field>
            <Field label="Badge" htmlFor="badge" error={errors.badge?.message}>
              <Input id="badge" {...form.register("badge")} />
            </Field>
          </FieldGrid>

          <FieldGrid>
            <Field
              label="Meta title"
              htmlFor="page-meta-title"
              required
              error={errors.meta_title?.message}
            >
              <Input id="page-meta-title" {...form.register("meta_title")} />
            </Field>
            <Field
              label="Meta description"
              htmlFor="page-meta-description"
              required
              error={errors.meta_description?.message}
            >
              <Input
                id="page-meta-description"
                {...form.register("meta_description")}
              />
            </Field>
          </FieldGrid>

          <Field
            label="Sections data (JSON)"
            htmlFor="sections_data"
            hint="Must be a JSON object — page-specific blocks for the public site."
            error={sectionsError ?? undefined}
          >
            <Textarea
              id="sections_data"
              rows={10}
              value={sectionsJson}
              onChange={(event) => {
                setSectionsJson(event.target.value);
                setSectionsError(null);
              }}
              className="font-mono text-xs"
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
          <Button type="submit" form="page-content-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
