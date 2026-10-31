"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Boxes,
  Building,
  ChevronLeft,
  Copy,
  Ellipsis,
  Eye,
  Image as ImageIcon,
  LayoutPanelTop,
  Star,
  StarOff,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import type { Property, PropertyWithRelations } from "@/types";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  duplicateProperty,
  getPropertyWithRelations,
  propertyDisplayTitle,
  setPropertyFeatured,
  softDeleteProperty,
} from "@/lib/api/properties";
import { getCurrency } from "@/lib/api/settings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorState, LoadingBlock } from "@/components/shared/states";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  AvailabilityBadge,
  PropertyStatusBadge,
  PropertyTypeBadge,
  PublicationStatusBadge,
} from "@/components/shared/status-badge";
import { PropertyForm } from "@/components/properties/property-form";
import { MediaDocumentsPanel } from "@/components/properties/media-documents-panel";
import { PropertyConfigurationsManager } from "@/components/properties/property-configurations-manager";
import { AmenitiesPicker } from "@/components/properties/amenities-picker";
import { PropertyPreview } from "@/components/properties/property-preview";

const EDITOR_TABS = [
  "details",
  "media",
  "configurations",
  "amenities",
  "preview",
] as const;

type EditorTab = (typeof EDITOR_TABS)[number];

/** Older bookmarks / redirects still supported. */
const TAB_ALIASES: Record<string, EditorTab> = {
  images: "media",
  documents: "media",
  files: "media",
  plans: "media",
  layouts: "configurations",
};

function resolveTab(value: string | null): EditorTab {
  if (!value) return "details";
  if (EDITOR_TABS.includes(value as EditorTab)) return value as EditorTab;
  return TAB_ALIASES[value] ?? "details";
}

export function PropertyEditor({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const activeTab = resolveTab(searchParams.get("tab"));

  const fetchProperty = React.useCallback(async () => {
    const [property, currency] = await Promise.all([
      getPropertyWithRelations(propertyId),
      getCurrency(),
    ]);

    if (!property) {
      throw new Error("That property does not exist, or you cannot access it.");
    }

    return { property, currency };
  }, [propertyId]);

  const { data, setData, loading, error, reload, refresh } = useResource<{
    property: PropertyWithRelations | null;
    currency: string;
  }>(fetchProperty, { property: null, currency: "INR" });

  const { property, currency } = data;

  const setProperty = React.useCallback(
    (saved: Property) => {
      setData((current) => ({
        ...current,
        property: current.property
          ? { ...current.property, ...saved }
          : saved,
      }));
    },
    [setData]
  );

  function setTab(value: string) {
    const next = resolveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "details") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    const query = params.toString();
    router.replace(
      query
        ? `/admin/properties/${propertyId}?${query}`
        : `/admin/properties/${propertyId}`,
      { scroll: false }
    );
  }

  if (loading) return <LoadingBlock label="Loading property…" />;
  if (error || !property) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/properties">
            <ChevronLeft />
            Back to properties
          </Link>
        </Button>
        <ErrorState
          message={error ?? "Property not found."}
          onRetry={reload}
        />
      </div>
    );
  }

  async function handleFeaturedToggle() {
    if (!property) return;
    const next = !property.is_featured;

    try {
      await setPropertyFeatured(property.id, next);
      toast.success(next ? "Added to featured" : "Removed from featured");
      refresh();
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  async function handleDuplicate() {
    if (!property) return;

    try {
      const copy = await duplicateProperty(property.id);
      toast.success("Property duplicated", {
        description:
          "Configurations and amenities were copied. Images need to be uploaded again.",
      });
      router.push(`/admin/properties/${copy.id}?tab=media`);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/admin/properties">
            <ChevronLeft />
            Back to properties
          </Link>
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {propertyDisplayTitle(property)}
              </h1>
              {property.is_featured ? (
                <Star className="size-4 shrink-0 fill-warning text-warning" />
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PublicationStatusBadge status={property.publication_status} />
              <PropertyStatusBadge status={property.status} />
              <AvailabilityBadge availability={property.availability} />
              <PropertyTypeBadge type={property.property_type} />
              {property.is_new_launch ? (
                <Badge variant="default">New launch</Badge>
              ) : null}
              {!property.is_active ? (
                <Badge variant="muted">Hidden from site</Badge>
              ) : null}
              <span className="text-xs text-muted-foreground">
                /{property.slug} · updated {formatDateTime(property.updated_at)}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Property actions">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => void handleFeaturedToggle()}>
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
              <DropdownMenuItem onClick={() => void handleDuplicate()}>
                <Copy />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash />
                Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setTab(value);
          if (value === "preview") refresh();
        }}
      >
        <TabsList>
          <TabsTrigger value="details">
            <Building />
            Details
          </TabsTrigger>
          <TabsTrigger value="media">
            <ImageIcon />
            Media &amp; Documents
          </TabsTrigger>
          <TabsTrigger value="configurations">
            <LayoutPanelTop />
            Configurations
          </TabsTrigger>
          <TabsTrigger value="amenities">
            <Boxes />
            Amenities
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <PropertyForm
            property={property}
            onSaved={(saved) => setProperty(saved)}
          />
        </TabsContent>

        <TabsContent value="media">
          <MediaDocumentsPanel property={property} onChanged={refresh} />
        </TabsContent>

        <TabsContent value="configurations" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Manage the typologies shown under{" "}
            <span className="font-medium text-foreground">
              Configuration Matrix &amp; Details
            </span>{" "}
            on the public property page.
          </p>
          <PropertyConfigurationsManager
            propertyId={property.id}
            currency={currency}
            onChanged={refresh}
          />
        </TabsContent>

        <TabsContent value="amenities">
          <AmenitiesPicker propertyId={property.id} />
        </TabsContent>

        <TabsContent value="preview">
          <PropertyPreview
            property={property}
            images={property.images}
            configurations={property.configurations}
            layouts={property.property_configurations}
            floorPlans={property.floor_plans}
            amenities={property.property_amenities}
            inventory={property.inventory_units}
            currency={currency}
          />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Move this property to trash?"
        description={`${propertyDisplayTitle(property)} will be hidden from the website. You can restore it from Trash.`}
        confirmLabel="Move to trash"
        destructive
        onConfirm={async () => {
          try {
            await softDeleteProperty(property.id);
            toast.success("Moved to trash");
            router.push("/admin/properties");
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
