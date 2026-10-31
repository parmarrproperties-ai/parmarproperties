"use client";

import Image from "next/image";
import {
  ExternalLink,
  FileText,
  MapPin,
  QrCode,
} from "lucide-react";

import type {
  Configuration,
  FloorPlan,
  InventoryUnit,
  Property,
  PropertyAmenity,
  PropertyConfiguration,
  PropertyImage,
} from "@/types";
import {
  formatCurrency,
  formatDateTime,
} from "@/lib/utils";
import {
  formatCrore,
  getAvailabilityLabel,
  getFloorPlanTypeLabel,
  getInventoryStatusLabel,
  getPropertyStatusLabel,
  getPropertyTypeLabel,
  getPublicationStatusLabel,
} from "@/lib/constants";
import { propertyDisplayTitle } from "@/lib/api/properties";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PropertyPreviewProps {
  property: Property;
  images?: PropertyImage[];
  configurations?: Configuration[];
  layouts?: PropertyConfiguration[];
  floorPlans?: FloorPlan[];
  amenities?: PropertyAmenity[];
  inventory?: InventoryUnit[];
  currency?: string;
}

export function PropertyPreview({
  property,
  images = [],
  configurations = [],
  layouts = [],
  floorPlans = [],
  amenities = [],
  inventory = [],
  currency = "INR",
}: PropertyPreviewProps) {
  const title = propertyDisplayTitle(property);
  const primary =
    images.find((image) => image.is_primary) ?? images[0] ?? null;
  const gallery = images
    .slice()
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6 rounded-xl border bg-card p-4 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Admin preview · not the public website
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {property.tagline ? (
          <p className="text-muted-foreground">{property.tagline}</p>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">
            {getPublicationStatusLabel(property.publication_status)}
          </Badge>
          <Badge>{getPropertyStatusLabel(property.status)}</Badge>
          <Badge variant="secondary">
            {getPropertyTypeLabel(property.property_type)}
          </Badge>
          <Badge variant="outline">
            {getAvailabilityLabel(property.availability)}
          </Badge>
          {property.is_featured ? <Badge variant="warning">Featured</Badge> : null}
          {property.is_new_launch ? <Badge>New launch</Badge> : null}
          {property.is_recommended ? (
            <Badge variant="outline">Recommended</Badge>
          ) : null}
          {!property.is_active ? (
            <Badge variant="muted">Inactive</Badge>
          ) : null}
        </div>
      </div>

      {primary?.url ? (
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-muted">
          <Image
            src={primary.url}
            alt={primary.alt_text || title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex aspect-[21/9] items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
          No primary image
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Price"
          value={
            property.price != null
              ? formatCrore(property.price)
              : property.price_display ||
                formatCurrency(property.price_amount, currency)
          }
        />
        <Info
          label="Carpet area"
          value={
            property.carpet_area_sqft != null
              ? `${property.carpet_area_sqft.toLocaleString("en-IN")} sq ft`
              : property.carpet_area || "—"
          }
        />
        <Info
          label="Possession"
          value={property.possession_date || property.possession || "—"}
        />
        <Info label="Floor" value={property.floor || "—"} />
      </div>

      {property.highlights.length > 0 ? (
        <section className="space-y-2">
          <h3 className="font-semibold">Key highlights</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {property.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <Separator />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-semibold">Location</h3>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span>
              {property.sub_location ||
                [property.address, property.locality, property.city]
                  .filter(Boolean)
                  .join(", ") ||
                property.location_name ||
                "—"}
            </span>
          </p>
          {property.location_details ? (
            <p className="text-sm">{property.location_details}</p>
          ) : null}
          {property.google_maps_url ? (
            <a
              href={property.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Open in Google Maps <ExternalLink className="size-3.5" />
            </a>
          ) : null}
          {property.latitude != null && property.longitude != null ? (
            <p className="text-xs text-muted-foreground">
              {property.latitude}, {property.longitude}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Developer & RERA</h3>
          <p className="text-sm font-medium">
            {property.developer_name || "—"}
          </p>
          {property.developer_description ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {property.developer_description}
            </p>
          ) : null}
          <p className="text-sm">
            RERA:{" "}
            <span className="font-medium">
              {property.rera_id || property.rera_number || "—"}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            {property.rera_qr_url ? (
              <a
                href={property.rera_qr_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <QrCode className="size-3.5" /> View QR
              </a>
            ) : null}
            {property.brochure_url ? (
              <a
                href={property.brochure_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <FileText className="size-3.5" /> Brochure
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {(property.project_overview || property.project_details || property.description) && (
        <>
          <Separator />
          <section className="space-y-4">
            {property.project_overview ? (
              <Block title="Project overview" body={property.project_overview} />
            ) : null}
            {property.project_details ? (
              <Block title="Project details" body={property.project_details} />
            ) : null}
            {property.description && !property.project_overview ? (
              <Block title="Description" body={property.description} />
            ) : null}
          </section>
        </>
      )}

      {gallery.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h3 className="font-semibold">Gallery ({gallery.length})</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {gallery.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.alt_text || title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {image.is_primary ? (
                    <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                      Primary
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {layouts.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h3 className="font-semibold">Layout tabs</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {layouts
                .slice()
                .sort((a, b) => a.display_order - b.display_order)
                .map((layout) => (
                  <Card key={layout.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {layout.tab_label} · {layout.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                      <p>{layout.area_range || "—"}</p>
                      <p>{layout.price_indicator || "—"}</p>
                      <p>{layout.tower_zone || "—"}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        </>
      ) : null}

      {configurations.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h3 className="font-semibold">Configurations</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {configurations
                .slice()
                .sort((a, b) => a.display_order - b.display_order)
                .map((config) => (
                  <Card key={config.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{config.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                      <p>{config.bhk || "—"} · {config.carpet_area || "—"}</p>
                      <p>
                        {config.price_display ||
                          formatCurrency(config.price, currency)}
                      </p>
                      <p>{getAvailabilityLabel(config.availability)}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        </>
      ) : null}

      {floorPlans.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h3 className="font-semibold">Plans</h3>
            <ul className="space-y-2 text-sm">
              {floorPlans
                .slice()
                .sort((a, b) => a.display_order - b.display_order)
                .map((plan) => (
                  <li key={plan.id} className="flex items-center justify-between gap-2">
                    <span>
                      {plan.name}{" "}
                      <span className="text-muted-foreground">
                        ({getFloorPlanTypeLabel(plan.plan_type)})
                      </span>
                    </span>
                    {plan.image_url || plan.file_url ? (
                      <a
                        href={(plan.image_url || plan.file_url) ?? undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        Open
                      </a>
                    ) : null}
                  </li>
                ))}
            </ul>
          </section>
        </>
      ) : null}

      {amenities.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h3 className="font-semibold">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {amenities
                .slice()
                .sort((a, b) => a.display_order - b.display_order)
                .map((item) => (
                  <Badge key={item.id} variant="secondary">
                    {item.lookup_amenity?.name ?? item.amenity?.name ?? "Amenity"}
                  </Badge>
                ))}
            </div>
          </section>
        </>
      ) : null}

      {inventory.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h3 className="font-semibold">Inventory ({inventory.length} units)</h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Unit</th>
                    <th className="px-3 py-2 font-medium">Floor</th>
                    <th className="px-3 py-2 font-medium">Facing</th>
                    <th className="px-3 py-2 font-medium">Price</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((unit) => (
                    <tr key={unit.id} className="border-t">
                      <td className="px-3 py-2">{unit.unit_number}</td>
                      <td className="px-3 py-2">{unit.floor || "—"}</td>
                      <td className="px-3 py-2">{unit.facing || "—"}</td>
                      <td className="px-3 py-2">
                        {formatCurrency(unit.price, currency)}
                      </td>
                      <td className="px-3 py-2">
                        {getInventoryStatusLabel(unit.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Last updated {formatDateTime(property.updated_at)}
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
