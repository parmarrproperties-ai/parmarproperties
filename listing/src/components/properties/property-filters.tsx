"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import type { PropertyFilters } from "@/types";
import {
  AVAILABILITY_STATUSES,
  BHK_OPTIONS,
  PROPERTY_COLLECTIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  PUBLICATION_STATUSES,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "all";

const SORT_OPTIONS: { value: NonNullable<PropertyFilters["sort"]>; label: string }[] =
  [
    { value: "updated", label: "Recently updated" },
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name", label: "Name A–Z" },
    { value: "price", label: "Highest price" },
  ];

/**
 * Reads filters out of the URL so a filtered list can be bookmarked or shared.
 */
export function parseFilters(params: URLSearchParams): PropertyFilters {
  const page = Number(params.get("page") ?? "1");

  return {
    search: params.get("search") ?? "",
    status: (params.get("status") ?? "") as PropertyFilters["status"],
    publication_status: (params.get("publication") ??
      "") as PropertyFilters["publication_status"],
    collection: (params.get("collection") ?? "") as PropertyFilters["collection"],
    property_type: (params.get("type") ?? "") as PropertyFilters["property_type"],
    availability: (params.get("availability") ??
      "") as PropertyFilters["availability"],
    bhk: params.get("bhk") ?? "",
    featured: (params.get("featured") ?? "") as PropertyFilters["featured"],
    sort: (params.get("sort") ?? "updated") as PropertyFilters["sort"],
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function serializeFilters(filters: PropertyFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.publication_status)
    params.set("publication", filters.publication_status);
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.property_type) params.set("type", filters.property_type);
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.bhk) params.set("bhk", filters.bhk);
  if (filters.featured) params.set("featured", filters.featured);
  if (filters.sort && filters.sort !== "updated") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

export function countActiveFilters(filters: PropertyFilters): number {
  return [
    filters.search,
    filters.status,
    filters.publication_status,
    filters.collection,
    filters.property_type,
    filters.availability,
    filters.bhk,
    filters.featured,
  ].filter(Boolean).length;
}

interface PropertyFiltersBarProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

export function PropertyFiltersBar({
  filters,
  onChange,
}: PropertyFiltersBarProps) {
  const [searchDraft, setSearchDraft] = React.useState(filters.search ?? "");

  // Keep the box in step when filters are cleared or restored from the URL.
  const [appliedSearch, setAppliedSearch] = React.useState(filters.search ?? "");
  if (appliedSearch !== (filters.search ?? "")) {
    setAppliedSearch(filters.search ?? "");
    setSearchDraft(filters.search ?? "");
  }

  // Debounce so typing does not fire a query per keystroke.
  React.useEffect(() => {
    if (searchDraft === (filters.search ?? "")) return;

    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchDraft, page: 1 });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchDraft, filters, onChange]);

  function update(patch: Partial<PropertyFilters>) {
    onChange({ ...filters, ...patch, page: 1 });
  }

  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-3 border-b border-border p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by title, slug, sub-location or RERA number"
            className="pl-9"
            aria-label="Search properties"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={filters.sort ?? "updated"}
            onValueChange={(value) =>
              update({ sort: value as PropertyFilters["sort"] })
            }
          >
            <SelectTrigger className="w-44" aria-label="Sort properties">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ sort: filters.sort, page: 1 })}
            >
              <X />
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          value={filters.publication_status || ALL}
          onValueChange={(value) =>
            update({
              publication_status: (value === ALL
                ? ""
                : value) as PropertyFilters["publication_status"],
            })
          }
        >
          <SelectTrigger aria-label="Filter by publication status">
            <SelectValue placeholder="Any publication status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any publication status</SelectItem>
            {PUBLICATION_STATUSES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.collection || ALL}
          onValueChange={(value) =>
            update({
              collection: (value === ALL
                ? ""
                : value) as PropertyFilters["collection"],
            })
          }
        >
          <SelectTrigger aria-label="Filter by collection">
            <SelectValue placeholder="All collections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All collections</SelectItem>
            {PROPERTY_COLLECTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || ALL}
          onValueChange={(value) =>
            update({
              status: (value === ALL ? "" : value) as PropertyFilters["status"],
            })
          }
        >
          <SelectTrigger aria-label="Filter by status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {PROPERTY_STATUSES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.property_type || ALL}
          onValueChange={(value) =>
            update({
              property_type: (value === ALL
                ? ""
                : value) as PropertyFilters["property_type"],
            })
          }
        >
          <SelectTrigger aria-label="Filter by type">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {PROPERTY_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.availability || ALL}
          onValueChange={(value) =>
            update({
              availability: (value === ALL
                ? ""
                : value) as PropertyFilters["availability"],
            })
          }
        >
          <SelectTrigger aria-label="Filter by availability">
            <SelectValue placeholder="Any availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any availability</SelectItem>
            {AVAILABILITY_STATUSES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filters.bhk || ALL}
            onValueChange={(value) =>
              update({ bhk: value === ALL ? "" : value })
            }
          >
            <SelectTrigger aria-label="Filter by configuration">
              <SelectValue placeholder="Any BHK" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any BHK</SelectItem>
              {BHK_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.featured || ALL}
            onValueChange={(value) =>
              update({
                featured: (value === ALL
                  ? ""
                  : value) as PropertyFilters["featured"],
              })
            }
          >
            <SelectTrigger aria-label="Filter by featured">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Featured & not</SelectItem>
              <SelectItem value="true">Featured only</SelectItem>
              <SelectItem value="false">Not featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
