"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type {
  CommercialFilters,
  CommercialPropertyWithRelations,
  PaginatedResult,
  PublicationStatus,
} from "@/types";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { DEFAULT_PAGE_SIZE, formatCrore } from "@/lib/constants";
import {
  deleteCommercialProperty,
  listCommercialProperties,
} from "@/lib/api/commercial-properties";
import { resolvePublicUrl } from "@/lib/api/storage";
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
import { CommercialDialog } from "@/components/commercials/commercial-dialog";

const ALL = "all";

function parseFilters(params: URLSearchParams): CommercialFilters {
  const page = Number(params.get("page") ?? "1");

  return {
    search: params.get("search") ?? "",
    status: (params.get("status") ?? "") as CommercialFilters["status"],
    sort: (params.get("sort") ?? "newest") as CommercialFilters["sort"],
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function serializeFilters(filters: CommercialFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

function countActiveFilters(filters: CommercialFilters): number {
  return [filters.search, filters.status].filter(Boolean).length;
}

export function CommercialsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = React.useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const confirm = useConfirm<CommercialPropertyWithRelations>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] =
    React.useState<CommercialPropertyWithRelations | null>(null);

  const fetchCommercials = React.useCallback(
    () => listCommercialProperties(filters),
    [filters]
  );

  const {
    data: page,
    loading,
    error,
    reload,
  } = useResource<PaginatedResult<CommercialPropertyWithRelations>>(
    fetchCommercials,
    {
      data: [],
      total: 0,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      totalPages: 1,
    }
  );

  const { data: commercials, total, totalPages, pageSize } = page;

  const applyFilters = React.useCallback(
    (next: CommercialFilters) => {
      const query = serializeFilters(next);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  function update(patch: Partial<CommercialFilters>) {
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
        title="Commercial listings"
        description="Office and retail inventory for the commercial catalogue."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus />
            New listing
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
                  placeholder="Search by title, slug, sub-location or RERA"
                  className="pl-9"
                  aria-label="Search commercial listings"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={filters.status || ALL}
                  onValueChange={(value) =>
                    update({
                      status:
                        value === ALL ? "" : (value as PublicationStatus),
                    })
                  }
                >
                  <SelectTrigger className="w-40" aria-label="Filter by status">
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
                    update({ sort: value as CommercialFilters["sort"] })
                  }
                >
                  <SelectTrigger className="w-40" aria-label="Sort listings">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title">Title A–Z</SelectItem>
                    <SelectItem value="price">Price high–low</SelectItem>
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
          ) : commercials.length === 0 ? (
            <EmptyState
              icon={<Building2 />}
              title={
                activeFilterCount > 0
                  ? "No listings match these filters"
                  : "No commercial listings yet"
              }
              description={
                activeFilterCount > 0
                  ? "Try clearing a filter or searching for something broader."
                  : "Add your first office or retail listing."
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
                  <Button
                    onClick={() => {
                      setEditing(null);
                      setDialogOpen(true);
                    }}
                  >
                    <Plus />
                    New listing
                  </Button>
                )
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing</TableHead>
                    <TableHead>Hub</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commercials.map((item) => {
                    const cover = resolvePublicUrl(item.cover_image);

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {cover ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={cover}
                                alt={item.title}
                                className="size-10 shrink-0 rounded-md border border-border object-cover"
                              />
                            ) : (
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
                                <ImageIcon className="size-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-medium">{item.title}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {item.sub_location || `/${item.slug}`}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.hub?.name ?? "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          {formatCrore(item.price)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.commercial_type?.name ?? "—"}
                        </TableCell>
                        <TableCell>
                          <PublicationStatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDateTime(item.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              aria-label={`Edit ${item.title}`}
                              onClick={() => {
                                setEditing(item);
                                setDialogOpen(true);
                              }}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Delete ${item.title}`}
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => confirm.ask(item)}
                            >
                              <Trash />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      <CommercialDialog
        commercial={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={reload}
      />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this commercial listing?"
        description={
          confirm.target
            ? `${confirm.target.title} will be removed permanently.`
            : undefined
        }
        confirmLabel="Delete listing"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteCommercialProperty(confirm.target.id);
            toast.success("Listing deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
