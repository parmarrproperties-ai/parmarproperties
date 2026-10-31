"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { ArticleSection } from "@/types";
import { articleSectionSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import {
  createArticleSection,
  updateArticleSection,
} from "@/lib/api/insights-articles";
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
import { Field } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";
import { TagInput } from "@/components/shared/tag-input";

type SectionValues = z.input<typeof articleSectionSchema>;
type SectionOutput = z.output<typeof articleSectionSchema>;

interface InsightSectionDialogProps {
  articleId: string;
  section: ArticleSection | null;
  nextOrder: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function toFormValues(
  section: ArticleSection | null,
  nextOrder: number
): SectionValues {
  return {
    heading: section?.heading ?? "",
    paragraphs: section?.paragraphs ?? [],
    highlight_quote: section?.highlight_quote ?? "",
    table_data: (section?.table_data as SectionValues["table_data"]) ?? null,
    section_order: section?.section_order ?? nextOrder,
  };
}

function tableDataToJson(
  value: SectionValues["table_data"]
): string {
  if (value == null) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

export function InsightSectionDialog({
  articleId,
  section,
  nextOrder,
  open,
  onOpenChange,
  onSaved,
}: InsightSectionDialogProps) {
  const [tableJson, setTableJson] = React.useState("");
  const [tableError, setTableError] = React.useState<string | null>(null);

  const form = useForm<SectionValues, unknown, SectionOutput>({
    resolver: zodResolver(articleSectionSchema),
    defaultValues: toFormValues(null, nextOrder),
  });

  React.useEffect(() => {
    if (!open) return;
    const values = toFormValues(section, nextOrder);
    form.reset(values);
    setTableJson(tableDataToJson(values.table_data));
    setTableError(null);
  }, [open, section, nextOrder, form]);

  const paragraphs = form.watch("paragraphs") ?? [];

  function parseTableJson(): SectionOutput["table_data"] {
    const trimmed = tableJson.trim();
    if (!trimmed) return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw new Error("Table data must be valid JSON.");
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Table data must be a JSON object.");
    }

    const result = articleSectionSchema.shape.table_data.safeParse(parsed);
    if (!result.success) {
      throw new Error("Table data does not match the expected shape.");
    }

    return result.data ?? null;
  }

  async function onSubmit(values: SectionOutput) {
    try {
      let table_data: SectionOutput["table_data"];
      try {
        table_data = parseTableJson();
      } catch (error) {
        const message = getErrorMessage(error);
        setTableError(message);
        toast.error(message);
        return;
      }

      const payload: SectionOutput = {
        ...values,
        table_data,
        highlight_quote: values.highlight_quote || null,
      };

      if (section) {
        await updateArticleSection(section.id, payload);
        toast.success("Section updated");
      } else {
        await createArticleSection(articleId, payload);
        toast.success("Section added");
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
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{section ? "Edit section" : "New section"}</DialogTitle>
          <DialogDescription>
            Body blocks inside the article. Reorder sections from the editor.
          </DialogDescription>
        </DialogHeader>

        <form
          id="insight-section-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field
            label="Heading"
            htmlFor="section-heading"
            required
            error={errors.heading?.message}
          >
            <Input
              id="section-heading"
              {...form.register("heading")}
              aria-invalid={Boolean(errors.heading)}
            />
          </Field>

          <Field
            label="Paragraphs"
            hint="Each tag is one paragraph."
            error={
              errors.paragraphs?.message ?? errors.paragraphs?.root?.message
            }
          >
            <TagInput
              value={paragraphs}
              placeholder="Add a paragraph"
              disabled={isSubmitting}
              onChange={(next) =>
                form.setValue("paragraphs", next, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </Field>

          <Field
            label="Highlight quote"
            htmlFor="highlight_quote"
            error={errors.highlight_quote?.message}
          >
            <Textarea
              id="highlight_quote"
              rows={2}
              placeholder="Optional pull quote"
              {...form.register("highlight_quote")}
            />
          </Field>

          <Field
            label="Table data (JSON)"
            htmlFor="table_data"
            hint='Optional object with "headers" and "rows" arrays.'
            error={tableError ?? undefined}
          >
            <Textarea
              id="table_data"
              rows={6}
              value={tableJson}
              onChange={(event) => {
                setTableJson(event.target.value);
                setTableError(null);
              }}
              placeholder='{"headers":["Column A"],"rows":[["Value"]]}'
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
          <Button
            type="submit"
            form="insight-section-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : null}
            {section ? "Save section" : "Add section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
