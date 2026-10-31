"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type { LookupItem } from "@/types";
import { insightsArticleSchema } from "@/lib/validations";
import { getErrorMessage, slugify } from "@/lib/utils";
import {
  createInsightsArticle,
  isInsightsSlugAvailable,
  listInsightsFormLookups,
} from "@/lib/api/insights-articles";
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
import { PageHeader } from "@/components/shared/page-header";
import { Field, FieldGrid } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";

type NewArticleValues = z.input<typeof insightsArticleSchema>;
type NewArticleOutput = z.output<typeof insightsArticleSchema>;

export function NewInsightForm() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<LookupItem[]>([]);
  const [slugLocked, setSlugLocked] = React.useState(false);

  const form = useForm<NewArticleValues, unknown, NewArticleOutput>({
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

  const titleValue = form.watch("title");

  React.useEffect(() => {
    if (slugLocked) return;
    form.setValue("slug", slugify(titleValue ?? ""), { shouldValidate: false });
  }, [titleValue, slugLocked, form]);

  async function onSubmit(values: NewArticleOutput) {
    try {
      const slugFree = await isInsightsSlugAvailable(values.slug);
      if (!slugFree) {
        form.setError("slug", {
          message: "Another article already uses this slug.",
        });
        toast.error("That slug is already taken.");
        return;
      }

      const created = await createInsightsArticle({
        ...values,
        status: "draft",
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
      });

      toast.success("Article created");
      router.replace(`/admin/insights/${created.id}`);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/insights">
          <ChevronLeft />
          Back to insights
        </Link>
      </Button>

      <PageHeader
        title="New article"
        description="Enter the basics, then continue in the full editor."
      />

      <Card>
        <CardHeader>
          <CardTitle>Start the article</CardTitle>
          <CardDescription>
            You can add sections, imagery and SEO after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FieldGrid>
              <Field
                label="Title"
                htmlFor="new-insight-title"
                required
                error={errors.title?.message}
              >
                <Input id="new-insight-title" {...form.register("title")} />
              </Field>
              <Field
                label="URL slug"
                htmlFor="new-insight-slug"
                required
                error={errors.slug?.message}
              >
                <Input
                  id="new-insight-slug"
                  {...form.register("slug", {
                    onChange: () => setSlugLocked(true),
                  })}
                />
              </Field>
            </FieldGrid>

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
                htmlFor="new-category-header"
                required
                error={errors.category_header?.message}
              >
                <Input
                  id="new-category-header"
                  {...form.register("category_header")}
                />
              </Field>
            </FieldGrid>

            <Field
              label="Description"
              htmlFor="new-description"
              required
              error={errors.description?.message}
            >
              <Textarea
                id="new-description"
                rows={4}
                placeholder="Short summary for cards and SEO."
                {...form.register("description")}
              />
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : null}
                Create and continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
