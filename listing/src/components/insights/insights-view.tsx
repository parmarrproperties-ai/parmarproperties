"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Newspaper,
  Pencil,
  Plus,
  Search,
  Trash,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type {
  InsightsArticleWithRelations,
  InsightsFilters,
  LookupItem,
  PaginatedResult,
  PublicationStatus,
} from "@/types";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import {
  deleteInsightsArticle,
  listInsightsArticles,
  listInsightsFormLookups,
} from "@/lib/api/insights-articles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/shared/states";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { PublicationStatusBadge } from "@/components/shared/status-badge";

const ALL = "all";

function parseFilters(params: URLSearchParams): InsightsFilters {
  const page = Number(params.get("page") ?? "1");

  return {
    search: params.get("search") ?? "",
    status: (params.get("status") ?? "") as InsightsFilters["status"],
    category_id: params.get("category") ?? "",
    sort: (params.get("sort") ?? "newest") as InsightsFilters["sort"],
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function serializeFilters(filters: InsightsFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.category_id) params.set("category", filters.category_id);
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

function countActiveFilters(filters: InsightsFilters): number {
  return [filters.search, filters.status, filters.category_id].filter(Boolean)
    .length;
}

export function InsightsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = React.useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const confirm = useConfirm<InsightsArticleWithRelations>();

  const { data: categories } = useResource<LookupItem[]>(
    async () => (await listInsightsFormLookups()).categories,
    []
  );

  const fetchArticles = React.useCallback(
    () => listInsightsArticles(filters),
    [filters]
  );

  const {
    data: page,
    loading,
    error,
    reload,
  } = useResource<PaginatedResult<InsightsArticleWithRelations>>(
    fetchArticles,
    {
      data: [],
      total: 0,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      totalPages: 1,
    }
  );

  const { data: articles, total, totalPages, pageSize } = page;

  const applyFilters = React.useCallback(
    (next: InsightsFilters) => {
      const query = serializeFilters(next);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  function update(patch: Partial<InsightsFilters>) {
    applyFilters({ ...filters, ...patch, page: 1 });
  }

  const [searchDraft, setSearchDraft] = React.useState(filters.search ?? "");
  const [appliedSearch, setAppliedSearch] = React.useState(filters.search ?? "");
  if (appliedSearch !== (filters.search ?? "")) {
    setAppliedSearch(filters.search ?? "");
    setSearchDraft(filters.search ?? "");
  }

  React.useEffect(() => {
    if (searchDraft === (filters.search ?? "")) return;

    const timer = setTimeout(() => {
      applyFilters({ ...filters, search: searchDraft, page: 1 });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchDraft, filters, applyFilters]);

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market insights"
        description="Long-form research articles for the market intelligence section."
        actions={
          <Button asChild>
            <Link href="/admin/insights/new">
              <Plus />
              New article
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="space-y-3 border-b border-border p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Search by title, slug, tag or category"
                  className="pl-9"
                  aria-label="Search articles"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={filters.category_id || ALL}
                  onValueChange={(value) =>
                    update({ category_id: value === ALL ? "" : value })
                  }
                >
                  <SelectTrigger className="w-44" aria-label="Filter by category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status || ALL}
                  onValueChange={(value) =>
                    update({
                      status:
                        value === ALL ? "" : (value as PublicationStatus),
                    })
                  }
                >
                  <SelectTrigger className="w-36" aria-label="Filter by status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sort ?? "newest"}
                  onValueChange={(value) =>
                    update({ sort: value as InsightsFilters["sort"] })
                  }
                >
                  <SelectTrigger className="w-40" aria-label="Sort articles">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title">Title A–Z</SelectItem>
                    <SelectItem value="updated">Recently updated</SelectItem>
                  </SelectContent>
                </Select>

                {activeFilterCount > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyFilters({ sort: filters.sort, page: 1 })}
                  >
                    <X />
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : loading ? (
            <TableSkeleton rows={6} />
          ) : articles.length === 0 ? (
            <EmptyState
              icon={<Newspaper />}
              title={
                activeFilterCount > 0
                  ? "No articles match these filters"
                  : "No insight articles yet"
              }
              description={
                activeFilterCount > 0
                  ? "Try clearing a filter or searching for something broader."
                  : "Publish research and commentary for buyers."
              }
              action={
                activeFilterCount > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => applyFilters({ sort: filters.sort, page: 1 })}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/admin/insights/new">
                      <Plus />
                      New article
                    </Link>
                  </Button>
                )
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/insights/${article.id}`}
                            className="font-medium hover:underline"
                          >
                            {article.title}
                          </Link>
                          <p className="truncate text-xs text-muted-foreground">
                            /{article.slug}
                            {article.tag ? ` · ${article.tag}` : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {article.category?.name ?? article.category_header}
                      </TableCell>
                      <TableCell>
                        <PublicationStatusBadge status={article.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(article.updated_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label={`Edit ${article.title}`}
                            asChild
                          >
                            <Link href={`/admin/insights/${article.id}`}>
                              <Pencil />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            aria-label={`Delete ${article.title}`}
                            onClick={() => confirm.ask(article)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                page={filters.page ?? 1}
                totalPages={totalPages}
                total={total}
                pageSize={pageSize}
                onPageChange={(page) => applyFilters({ ...filters, page })}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this article?"
        description={
          confirm.target
            ? `${confirm.target.title} and its sections will be removed permanently.`
            : undefined
        }
        confirmLabel="Delete article"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteInsightsArticle(confirm.target.id);
            toast.success("Article deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
