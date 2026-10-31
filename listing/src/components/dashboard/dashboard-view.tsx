"use client";

import * as React from "react";
import Link from "next/link";
import {
  Boxes,
  Building,
  Images,
  MapPin,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";

import type { DashboardStats, Property } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { propertyDisplayTitle } from "@/lib/api/properties";
import {
  getContentCounts,
  getDashboardBreakdown,
  getDashboardStats,
  type ContentCounts,
  type DashboardBreakdown,
} from "@/lib/api/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
} from "@/components/shared/states";
import { PropertyStatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export function DashboardView() {
  const fetchDashboard = React.useCallback(async () => {
    const [stats, counts, breakdown] = await Promise.all([
      getDashboardStats(),
      getContentCounts(),
      getDashboardBreakdown(),
    ]);
    return { stats, counts, breakdown };
  }, []);

  const { data, loading, error, reload } = useResource<{
    stats: DashboardStats | null;
    counts: ContentCounts | null;
    breakdown: DashboardBreakdown | null;
  }>(fetchDashboard, { stats: null, counts: null, breakdown: null });

  const { stats, counts, breakdown } = data;

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A snapshot of your portfolio and the content powering the public website."
        actions={
          <Button asChild>
            <Link href="/admin/properties/new">
              <Plus />
              New property
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total properties"
          value={stats?.totalProperties ?? 0}
          hint="Excluding deleted listings"
          href="/admin/properties"
          icon={Building}
          loading={loading}
        />
        <StatCard
          label="Live on site"
          value={stats?.activeProperties ?? 0}
          hint="Visible to visitors"
          href="/admin/properties?status=active"
          icon={Boxes}
          tone="success"
          loading={loading}
        />
        <StatCard
          label="Featured"
          value={stats?.featuredProperties ?? 0}
          hint="Highlighted on the home page"
          href="/admin/featured-properties"
          icon={Star}
          tone="warning"
          loading={loading}
        />
        <StatCard
          label="Available units"
          value={stats?.availableUnits ?? 0}
          hint="Across all inventory"
          icon={TrendingUp}
          tone="default"
          loading={loading}
        />
      </div>

      {loading ? (
        <LoadingBlock label="Loading dashboard…" />
      ) : (
        <>
          {breakdown ? <DashboardCharts breakdown={breakdown} /> : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <RecentList
              title="Recently updated"
              description="Jump back into what you last worked on."
              properties={stats?.recentlyUpdated ?? []}
              timestamp={(property) => formatDateTime(property.updated_at)}
            />
            <RecentList
              title="Recently added"
              description="The newest listings in your portfolio."
              properties={stats?.recentlyAdded ?? []}
              timestamp={(property) => formatDateTime(property.created_at)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Website content</CardTitle>
              <CardDescription>
                Sections of the public site you can edit from here.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ContentLink
                href="/admin/hero"
                icon={Images}
                label="Hero slides"
                count={counts?.heroSlides ?? 0}
              />
              <ContentLink
                href="/admin/locations"
                icon={MapPin}
                label="Locations"
                count={counts?.locations ?? 0}
              />
              <ContentLink
                href="/admin/amenities"
                icon={Boxes}
                label="Amenities"
                count={counts?.amenities ?? 0}
              />
              <ContentLink
                href="/admin/properties"
                icon={Building}
                label="Configurations"
                count={counts?.configurations ?? 0}
              />
              <ContentLink
                href="/admin/properties"
                icon={Images}
                label="Floor plans"
                count={counts?.floorPlans ?? 0}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function RecentList({
  title,
  description,
  properties,
  timestamp,
}: {
  title: string;
  description: string;
  properties: Property[];
  timestamp: (property: Property) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        {properties.length === 0 ? (
          <EmptyState
            icon={<Building />}
            title="Nothing here yet"
            description="Properties you create will show up in this list."
          />
        ) : (
          <ul className="divide-y divide-border">
            {properties.map((property) => (
              <li key={property.id}>
                <Link
                  href={`/admin/properties/${property.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {propertyDisplayTitle(property)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {timestamp(property)}
                    </p>
                  </div>
                  <PropertyStatusBadge status={property.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ContentLink({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-ring/60 hover:bg-muted/50"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "entry" : "entries"}
        </p>
      </div>
    </Link>
  );
}
