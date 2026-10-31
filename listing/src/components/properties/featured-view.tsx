"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

import type { Property } from "@/types";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { formatCrore } from "@/lib/constants";
import {
  listFeaturedProperties,
  propertyDisplayTitle,
  reorderFeaturedProperties,
  setPropertyFeatured,
} from "@/lib/api/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
} from "@/components/shared/states";
import { PropertyStatusBadge } from "@/components/shared/status-badge";
import { OrderControls, moveItem } from "@/components/shared/order-controls";

export function FeaturedView() {
  const [busy, setBusy] = React.useState(false);
  const {
    data: properties,
    setData: setProperties,
    loading,
    error,
    reload,
  } = useResource<Property[]>(listFeaturedProperties, []);

  async function handleMove(from: number, to: number) {
    const next = moveItem(properties, from, to);
    if (next === properties) return;

    setProperties(next);
    setBusy(true);
    try {
      await reorderFeaturedProperties(next.map((property) => property.id));
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(property: Property) {
    try {
      await setPropertyFeatured(property.id, false);
      toast.success(`${propertyDisplayTitle(property)} removed from featured`);
      reload();
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Featured properties"
        description="These appear in the highlighted section of the home page, in the order shown here."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/properties">Browse all properties</Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <LoadingBlock label="Loading featured properties…" />
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={<Star />}
              title="Nothing is featured yet"
              description="Open a property and mark it as featured, or use the actions menu in the property list."
              action={
                <Button asChild>
                  <Link href="/admin/properties">Go to properties</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {properties.map((property, index) => (
            <Card key={property.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <OrderControls
                    index={index}
                    total={properties.length}
                    disabled={busy}
                    onMove={handleMove}
                  />
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-warning/15 text-xs font-semibold text-warning-foreground">
                    {index + 1}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="truncate text-sm font-semibold hover:underline"
                  >
                    {propertyDisplayTitle(property)}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {property.sub_location ||
                      [property.locality, property.city]
                        .filter(Boolean)
                        .join(", ") ||
                      `/${property.slug}`}
                  </p>
                </div>

                <div className="text-sm sm:text-right">
                  <p>
                    {property.price != null
                      ? formatCrore(property.price)
                      : property.price_display ||
                        formatCurrency(property.price_amount)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <PropertyStatusBadge status={property.status} />
                  <Button
                    asChild
                    variant="outline"
                    size="icon-sm"
                    aria-label={`Edit ${propertyDisplayTitle(property)}`}
                  >
                    <Link href={`/admin/properties/${property.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${propertyDisplayTitle(property)} from featured`}
                    onClick={() => void handleRemove(property)}
                  >
                    <StarOff />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
