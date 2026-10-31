"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Ellipsis, Eye, Inbox, Search, Trash, X } from "lucide-react";
import { toast } from "sonner";

import type {
  LeadFilters,
  LeadWithRelations,
  LookupItem,
  PaginatedResult,
  Profile,
} from "@/types";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { listAdminProfiles } from "@/lib/api/auth";
import {
  deleteLead,
  listLeadSources,
  listLeadStatuses,
  listLeads,
  setLeadStatus,
} from "@/lib/api/leads";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/shared/states";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";

const ALL = "all";
const UNASSIGNED = "unassigned";

function parseFilters(params: URLSearchParams): LeadFilters {
  const page = Number(params.get("page") ?? "1");

  return {
    search: params.get("search") ?? "",
    source_id: params.get("source") ?? "",
    status_id: params.get("status") ?? "",
    assigned: params.get("assigned") ?? "",
    sort: (params.get("sort") ?? "newest") as LeadFilters["sort"],
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function serializeFilters(filters: LeadFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.source_id) params.set("source", filters.source_id);
  if (filters.status_id) params.set("status", filters.status_id);
  if (filters.assigned) params.set("assigned", filters.assigned);
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

function countActiveFilters(filters: LeadFilters): number {
  return [
    filters.search,
    filters.source_id,
    filters.status_id,
    filters.assigned,
  ].filter(Boolean).length;
}

function advisorLabel(profile: Pick<Profile, "full_name" | "email">): string {
  return profile.full_name || profile.email;
}

export function LeadsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = React.useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const confirm = useConfirm<LeadWithRelations>();

  const fetchLeads = React.useCallback(() => listLeads(filters), [filters]);

  const {
    data: page,
    setData: setPage,
    loading,
    error,
    reload,
  } = useResource<PaginatedResult<LeadWithRelations>>(fetchLeads, {
    data: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });

  const { data: sources } = useResource<LookupItem[]>(listLeadSources, []);
  const { data: statuses } = useResource<LookupItem[]>(listLeadStatuses, []);
  const { data: advisors } = useResource<Profile[]>(listAdminProfiles, []);

  const { data: leads, total, totalPages, pageSize } = page;

  const applyFilters = React.useCallback(
    (next: LeadFilters) => {
      const query = serializeFilters(next);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  function update(patch: Partial<LeadFilters>) {
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

  async function handleStatusChange(lead: LeadWithRelations, statusId: string) {
    const status = statuses.find((item) => item.id === statusId) ?? null;

    setPage((current) => ({
      ...current,
      data: current.data.map((item) =>
        item.id === lead.id ? { ...item, status_id: statusId, status } : item
      ),
    }));

    try {
      await setLeadStatus(lead.id, statusId);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Every enquiry from the website, whichever form or modal it came through. Open one to see what the client asked for and who is handling it."
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
                  placeholder="Search by name, phone, email or company"
                  className="pl-9"
                  aria-label="Search leads"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={filters.sort ?? "newest"}
                  onValueChange={(value) =>
                    update({ sort: value as LeadFilters["sort"] })
                  }
                >
                  <SelectTrigger className="w-40" aria-label="Sort leads">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
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

            <div className="grid gap-2 sm:grid-cols-3">
              <Select
                value={filters.status_id || ALL}
                onValueChange={(value) =>
                  update({ status_id: value === ALL ? "" : value })
                }
              >
                <SelectTrigger aria-label="Filter by pipeline stage">
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All stages</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.source_id || ALL}
                onValueChange={(value) =>
                  update({ source_id: value === ALL ? "" : value })
                }
              >
                <SelectTrigger aria-label="Filter by source">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.assigned || ALL}
                onValueChange={(value) =>
                  update({ assigned: value === ALL ? "" : value })
                }
              >
                <SelectTrigger aria-label="Filter by advisor">
                  <SelectValue placeholder="Any advisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Any advisor</SelectItem>
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {advisors.map((advisor) => (
                    <SelectItem key={advisor.id} value={advisor.id}>
                      {advisorLabel(advisor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : loading ? (
            <TableSkeleton rows={6} />
          ) : leads.length === 0 ? (
            <EmptyState
              icon={<Inbox />}
              title={
                activeFilterCount > 0
                  ? "No leads match these filters"
                  : "No leads yet"
              }
              description={
                activeFilterCount > 0
                  ? "Try clearing a filter or searching for something broader."
                  : "Enquiries submitted on the website will appear here as soon as they arrive."
              }
              action={
                activeFilterCount > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => applyFilters({ sort: filters.sort, page: 1 })}
                  >
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Interested in</TableHead>
                    <TableHead className="w-56">Stage</TableHead>
                    <TableHead>Advisor</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-medium hover:underline"
                        >
                          {lead.full_name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {[lead.phone, lead.email].filter(Boolean).join(" · ")}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.source?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {lead.property ? (
                          <Link
                            href={`/admin/properties/${lead.property.id}`}
                            className="hover:underline"
                          >
                            {lead.property.name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">
                            {lead.asset_class || "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status_id ?? undefined}
                          onValueChange={(value) =>
                            void handleStatusChange(lead, value)
                          }
                        >
                          <SelectTrigger
                            className="h-8"
                            aria-label={`Pipeline stage for ${lead.full_name}`}
                          >
                            <SelectValue placeholder="Set a stage" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.assignee ? advisorLabel(lead.assignee) : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(lead.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${lead.full_name}`}
                            >
                              <Ellipsis />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/leads/${lead.id}`}>
                                <Eye />
                                Open
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => confirm.ask(lead)}
                            >
                              <Trash />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                onPageChange={(next) => applyFilters({ ...filters, page: next })}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this lead?"
        description={
          confirm.target
            ? `The enquiry from ${confirm.target.full_name} will be removed permanently. There is no trash for leads.`
            : undefined
        }
        confirmLabel="Delete lead"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deleteLead(confirm.target.id);
            toast.success("Lead deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
