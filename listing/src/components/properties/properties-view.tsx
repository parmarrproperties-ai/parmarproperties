"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Building,
  Copy,
  Ellipsis,
  Image as ImageIcon,
  Pencil,
  Plus,
  Star,
  StarOff,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import type {
  PaginatedResult,
  PropertyFilters,
  PropertyWithRelations,
} from "@/types";
import { formatCurrency, formatDateTime, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  DEFAULT_PAGE_SIZE,
  formatCrore,
  getPropertyTypeLabel,
} from "@/lib/constants";
import {
  duplicateProperty,
  listProperties,
  propertyDisplayTitle,
  setPropertyActive,
  setPropertyFeatured,
  softDeleteProperty,
} from "@/lib/api/properties";
import { listLookupBhk, listLookupPropertyTypes } from "@/lib/api/lookups";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import {
  AvailabilityBadge,
  PropertyStatusBadge,
  PublicationStatusBadge,
} from "@/components/shared/status-badge";
import {
  PropertyFiltersBar,
  countActiveFilters,
  parseFilters,
  serializeFilters,
} from "@/components/properties/property-filters";

export function PropertiesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = React.useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const confirm = useConfirm<PropertyWithRelations>();

  // Type and BHK are lookup ids on master rows, so the names are resolved once
  // for the whole page. Retired entries are included so nothing shows as blank.
  const [lookupNames, setLookupNames] = React.useState<Record<string, string>>(
    {}
  );

  React.useEffect(() => {
    Promise.all([listLookupPropertyTypes(false), listLookupBhk(false)])
      .then(([types, bhk]) =>
        setLookupNames(
          Object.fromEntries(
            [...types, ...bhk].map((item) => [item.id, item.name])
          )
        )
      )
      .catch((caught) => toast.error(getErrorMessage(caught)));
  }, []);

  const fetchProperties = React.useCallback(
    () => listProperties(filters),
    [filters]
  );

  const {
    data: page,
    setData: setPage,
    loading,
    error,
    reload,
  } = useResource<PaginatedResult<PropertyWithRelations>>(fetchProperties, {
    data: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });

  const { data: properties, total, totalPages, pageSize } = page;

  const setProperties = React.useCallback(
    (update: React.SetStateAction<PropertyWithRelations[]>) => {
      setPage((current) => ({
        ...current,
        data: typeof update === "function" ? update(current.data) : update,
      }));
    },
    [setPage]
  );

  const applyFilters = React.useCallback(
    (next: PropertyFilters) => {
      const query = serializeFilters(next);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  async function handleActiveToggle(
    property: PropertyWithRelations,
    isActive: boolean
  ) {
    setProperties((current) =>
      current.map((item) =>
        item.id === property.id ? { ...item, is_active: isActive } : item
      )
    );

    try {
      await setPropertyActive(property.id, isActive);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  async function handleFeaturedToggle(property: PropertyWithRelations) {
    const next = !property.is_featured;
    try {
      await setPropertyFeatured(property.id, next);
      toast.success(next ? "Added to featured" : "Removed from featured");
      reload();
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  async function handleDuplicate(property: PropertyWithRelations) {
    try {
      const copy = await duplicateProperty(property.id);
      toast.success("Property duplicated", {
        description:
          "Configurations and amenities were copied. Images need to be uploaded again.",
      });
      router.push(`/admin/properties/${copy.id}`);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        description="Every listing in your portfolio. Open one to manage images, configurations, floor plans and inventory."
        actions={
          <Button asChild>
            <Link href="/admin/properties/new">
              <Plus />
              New property
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <PropertyFiltersBar filters={filters} onChange={applyFilters} />

          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : loading ? (
            <TableSkeleton rows={6} />
          ) : properties.length === 0 ? (
            <EmptyState
              icon={<Building />}
              title={
                activeFilterCount > 0
                  ? "No properties match these filters"
                  : "No properties yet"
              }
              description={
                activeFilterCount > 0
                  ? "Try clearing a filter or searching for something broader."
                  : "Create your first listing to get started."
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
                    <Link href="/admin/properties/new">
                      <Plus />
                      New property
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
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="w-24">Live</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => {
                    const thumbnail = property.images?.[0];
                    const title = propertyDisplayTitle(property);
                    const bhkLabel =
                      (property.bhk_id ? lookupNames[property.bhk_id] : null) ??
                      property.bhk;

                    return (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {thumbnail ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={thumbnail.url}
                                alt={thumbnail.alt_text ?? title}
                                className="size-10 shrink-0 rounded-md border border-border object-cover"
                              />
                            ) : (
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
                                <ImageIcon className="size-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <Link
                                href={`/admin/properties/${property.id}`}
                                className="flex items-center gap-1.5 font-medium hover:underline"
                              >
                                <span className="truncate">{title}</span>
                                {property.is_featured ? (
                                  <Star className="size-3.5 shrink-0 fill-warning text-warning" />
                                ) : null}
                              </Link>
                              <p className="truncate text-xs text-muted-foreground">
                                {property.sub_location ||
                                  property.locality ||
                                  property.city ||
                                  `/${property.slug}`}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {(property.property_type_id
                            ? lookupNames[property.property_type_id]
                            : null) ??
                            getPropertyTypeLabel(property.property_type)}
                          {bhkLabel ? (
                            <span className="block text-xs">{bhkLabel}</span>
                          ) : null}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          {property.price != null
                            ? formatCrore(property.price)
                            : property.price_display ||
                              formatCurrency(property.price_amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <PublicationStatusBadge
                              status={property.publication_status}
                            />
                            <PropertyStatusBadge status={property.status} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <AvailabilityBadge
                            availability={property.availability}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={property.is_active}
                            aria-label={`Show ${title} on the website`}
                            onCheckedChange={(checked) =>
                              void handleActiveToggle(property, checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDateTime(property.updated_at)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Actions for ${title}`}
                              >
                                <Ellipsis />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/properties/${property.id}`}>
                                  <Pencil />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  void handleFeaturedToggle(property)
                                }
                              >
                                {property.is_featured ? (
                                  <>
                                    <StarOff />
                                    Remove from featured
                                  </>
                                ) : (
                                  <>
                                    <Star />
                                    Mark as featured
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => void handleDuplicate(property)}
                              >
                                <Copy />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => confirm.ask(property)}
                              >
                                <Trash />
                                Move to trash
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Move this property to trash?"
        description={
          confirm.target
            ? `${propertyDisplayTitle(confirm.target)} will be hidden from the website. You can restore it from Trash.`
            : undefined
        }
        confirmLabel="Move to trash"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await softDeleteProperty(confirm.target.id);
            toast.success("Moved to trash");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
