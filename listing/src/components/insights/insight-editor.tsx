"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  Pencil,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type {
  ArticleSection,
  InsightsArticleWithRelations,
  LookupItem,
} from "@/types";
import { insightsArticleSchema } from "@/lib/validations";
import { getErrorMessage, slugify } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { PUBLICATION_STATUSES } from "@/lib/constants";
import {
  deleteArticleSection,
  getInsightsArticle,
  isInsightsSlugAvailable,
  listInsightsFormLookups,
  reorderArticleSections,
  updateInsightsArticle,
} from "@/lib/api/insights-articles";
import {
  deleteFile,
  resolvePublicUrl,
  storageFolders,
} from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field, FieldGrid } from "@/components/shared/field";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { OrderControls, moveItem } from "@/components/shared/order-controls";
import { ErrorState, LoadingBlock, Spinner } from "@/components/shared/states";
import { TagInput } from "@/components/shared/tag-input";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";
import { InsightSectionDialog } from "@/components/insights/insight-section-dialog";

type ArticleValues = z.input<typeof insightsArticleSchema>;
type ArticleOutput = z.output<typeof insightsArticleSchema>;

interface InsightEditorProps {
  articleId: string;
}

function toFormValues(
  article: InsightsArticleWithRelations
): ArticleValues {
  return {
    title: article.title,
    slug: article.slug,
    category_header: article.category_header,
    category_id: article.category_id,
    subtitle: article.subtitle,
    description: article.description,
    tag: article.tag,
    date_tag: article.date_tag,
    image_path: article.image_path,
    author_name: article.author_name,
    author_role: article.author_role,
    author_desk: article.author_desk,
    key_takeaways: article.key_takeaways ?? [],
    status: article.status,
    sort_order: article.sort_order,
    meta_title: article.meta_title ?? "",
    meta_description: article.meta_description ?? "",
  };
}

export function InsightEditor({ articleId }: InsightEditorProps) {
  const [categories, setCategories] = React.useState<LookupItem[]>([]);
  const [slugLocked, setSlugLocked] = React.useState(true);
  const [selection, setSelection] =
    React.useState<FileSelection>(unchangedSelection);
  const [reordering, setReordering] = React.useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = React.useState(false);
  const [editingSection, setEditingSection] =
    React.useState<ArticleSection | null>(null);
  const sectionConfirm = useConfirm<ArticleSection>();

  const fetchArticle = React.useCallback(
    () => getInsightsArticle(articleId),
    [articleId]
  );

  const {
    data: article,
    setData: setArticle,
    loading,
    error,
    reload,
  } = useResource(fetchArticle, null);

  const form = useForm<ArticleValues, unknown, ArticleOutput>({
    resolver: zodResolver(insightsArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      category_header: "",
      category_id: "",
      subtitle: "",
      description: "",
      tag: "",
      date_tag: "",
      image_path: "",
      author_name: "Advisory Research Desk",
      author_role: "",
      author_desk: "Parmar Properties Research",
      key_takeaways: [],
      status: "draft",
      sort_order: 0,
      meta_title: "",
      meta_description: "",
    },
  });

  React.useEffect(() => {
    listInsightsFormLookups()
      .then(({ categories: loaded }) => setCategories(loaded))
      .catch((caught) => toast.error(getErrorMessage(caught)));
  }, []);

  React.useEffect(() => {
    if (!article) return;
    setSelection(unchangedSelection);
    form.reset(toFormValues(article));
  }, [article, form]);

  const titleValue = form.watch("title");
  const keyTakeaways = form.watch("key_takeaways") ?? [];
  const sections = article?.sections ?? [];

  React.useEffect(() => {
    if (slugLocked) return;
    form.setValue("slug", slugify(titleValue ?? ""), { shouldValidate: false });
  }, [titleValue, slugLocked, form]);

  async function onSubmit(values: ArticleOutput) {
    if (!article) return;

    try {
      const slugFree = await isInsightsSlugAvailable(values.slug, article.id);
      if (!slugFree) {
        form.setError("slug", {
          message: "Another article already uses this slug.",
        });
        toast.error("That slug is already taken.");
        return;
      }

      const uploaded = await uploadSelection(
        selection,
        storageFolders.insightsCover(article.id)
      );

      let image_path = values.image_path ?? "";
      if (uploaded !== undefined) {
        image_path = uploaded?.url ?? "";
        if (uploaded && article.image_path && !/^https?:\/\//i.test(article.image_path)) {
          await deleteFile(article.image_path);
        }
      }

      const payload: ArticleOutput = {
        ...values,
        image_path,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
      };

      const updated = await updateInsightsArticle(article.id, payload);
      setArticle((current) =>
        current ? { ...current, ...updated } : current
      );
      toast.success("Article saved");
      setSelection(unchangedSelection);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  async function handleMoveSections(from: number, to: number) {
    if (!article?.sections) return;
    const next = moveItem(article.sections, from, to);
    if (next === article.sections) return;

    setArticle({ ...article, sections: next });
    setReordering(true);
    try {
      await reorderArticleSections(next.map((section) => section.id));
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    } finally {
      setReordering(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorState message={error} onRetry={reload} />
        <Button asChild variant="outline">
          <Link href="/admin/insights">Back to insights</Link>
        </Button>
      </div>
    );
  }

  if (loading || !article) {
    return <LoadingBlock label="Loading article…" />;
  }

  const { errors, isSubmitting } = form.formState;
  const coverUrl = resolvePublicUrl(article.image_path);
  const nextSectionOrder =
    sections.length > 0
      ? Math.max(...sections.map((s) => s.section_order)) + 1
      : 0;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/insights">
          <ChevronLeft />
          Back to insights
        </Link>
      </Button>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <Card>
          <CardHeader>
            <CardTitle>Article details</CardTitle>
            <CardDescription>
              Headline fields for the market intelligence article page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGrid>
              <Field
                label="Title"
                htmlFor="insight-title"
                required
                error={errors.title?.message}
              >
                <Input id="insight-title" {...form.register("title")} />
              </Field>
              <Field
                label="URL slug"
                htmlFor="insight-slug"
                required
                error={errors.slug?.message}
              >
                <Input
                  id="insight-slug"
                  {...form.register("slug", {
                    onChange: () => setSlugLocked(true),
                  })}
                />
              </Field>
            </FieldGrid>

            {!slugLocked ? (
              <p className="text-xs text-muted-foreground">
                Slug follows the title until you edit it.
              </p>
            ) : (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setSlugLocked(false)}
              >
                Regenerate slug from title
              </Button>
            )}

            <FieldGrid>
              <Field label="Category" required error={errors.category_id?.message}>
                <Select
                  value={form.watch("category_id") || undefined}
                  onValueChange={(value) => {
                    const match = categories.find((c) => c.id === value);
                    form.setValue("category_id", value);
                    if (match) {
                      form.setValue("category_header", match.name, {
                        shouldDirty: true,
                      });
                    }
                  }}
                >
                  <SelectTrigger aria-label="Article category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Category header"
                htmlFor="category_header"
                required
                error={errors.category_header?.message}
              >
                <Input
                  id="category_header"
                  {...form.register("category_header")}
                />
              </Field>
            </FieldGrid>

            <Field label="Subtitle" htmlFor="subtitle" error={errors.subtitle?.message}>
              <Input id="subtitle" {...form.register("subtitle")} />
            </Field>

            <Field
              label="Description"
              htmlFor="description"
              required
              error={errors.description?.message}
            >
              <Textarea id="description" rows={3} {...form.register("description")} />
            </Field>

            <FieldGrid>
              <Field label="Tag" htmlFor="tag" error={errors.tag?.message}>
                <Input id="tag" {...form.register("tag")} />
              </Field>
              <Field
                label="Date tag"
                htmlFor="date_tag"
                error={errors.date_tag?.message}
              >
                <Input id="date_tag" placeholder="Q3 2026" {...form.register("date_tag")} />
              </Field>
            </FieldGrid>

            <Field label="Hero image">
              <MediaPicker
                existingUrl={coverUrl}
                selection={selection}
                onSelectionChange={setSelection}
                disabled={isSubmitting}
              />
            </Field>

            <FieldGrid>
              <Field
                label="Author name"
                htmlFor="author_name"
                error={errors.author_name?.message}
              >
                <Input id="author_name" {...form.register("author_name")} />
              </Field>
              <Field
                label="Author role"
                htmlFor="author_role"
                error={errors.author_role?.message}
              >
                <Input id="author_role" {...form.register("author_role")} />
              </Field>
            </FieldGrid>

            <Field
              label="Author desk"
              htmlFor="author_desk"
              error={errors.author_desk?.message}
            >
              <Input id="author_desk" {...form.register("author_desk")} />
            </Field>

            <Field
              label="Key takeaways"
              error={
                errors.key_takeaways?.message ??
                errors.key_takeaways?.root?.message
              }
            >
              <TagInput
                value={keyTakeaways}
                max={8}
                disabled={isSubmitting}
                onChange={(next) =>
                  form.setValue("key_takeaways", next, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </Field>

            <FieldGrid>
              <Field label="Status" error={errors.status?.message}>
                <Select
                  value={form.watch("status") ?? "published"}
                  onValueChange={(value) =>
                    form.setValue("status", value as ArticleValues["status"])
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
                htmlFor="meta_title"
                error={errors.meta_title?.message}
              >
                <Input id="meta_title" {...form.register("meta_title")} />
              </Field>
              <Field
                label="Meta description"
                htmlFor="meta_description"
                error={errors.meta_description?.message}
              >
                <Input
                  id="meta_description"
                  {...form.register("meta_description")}
                />
              </Field>
            </FieldGrid>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : <Save />}
                Save article
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Sections</CardTitle>
            <CardDescription>
              Ordered body content blocks for this article.
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={() => {
              setEditingSection(null);
              setSectionDialogOpen(true);
            }}
          >
            <Plus />
            Add section
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {sections.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No sections yet. Add the first block to build the article body.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Order</TableHead>
                  <TableHead>Heading</TableHead>
                  <TableHead>Paragraphs</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section, index) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <OrderControls
                        index={index}
                        total={sections.length}
                        disabled={reordering}
                        onMove={handleMoveSections}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{section.heading}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {section.paragraphs.length} paragraph
                      {section.paragraphs.length === 1 ? "" : "s"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Edit ${section.heading}`}
                          onClick={() => {
                            setEditingSection(section);
                            setSectionDialogOpen(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          aria-label={`Delete ${section.heading}`}
                          onClick={() => sectionConfirm.ask(section)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <InsightSectionDialog
        articleId={article.id}
        section={editingSection}
        nextOrder={nextSectionOrder}
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        onSaved={reload}
      />

      <ConfirmDialog
        open={sectionConfirm.open}
        onOpenChange={sectionConfirm.setOpen}
        title="Delete this section?"
        description={
          sectionConfirm.target
            ? `"${sectionConfirm.target.heading}" will be removed permanently.`
            : undefined
        }
        confirmLabel="Delete section"
        destructive
        onConfirm={async () => {
          if (!sectionConfirm.target) return;
          try {
            await deleteArticleSection(sectionConfirm.target.id);
            toast.success("Section deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
