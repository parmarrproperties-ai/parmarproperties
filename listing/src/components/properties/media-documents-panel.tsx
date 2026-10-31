"use client";

import type { Property } from "@/types";

import { ImagesManager } from "@/components/properties/images-manager";
import { PropertyFiles } from "@/components/properties/property-files";
import { FloorPlansManager } from "@/components/properties/floor-plans-manager";

/**
 * Unified Media & Documents surface for a saved property:
 * cover + gallery, MahaRERA QR + brochure, and floor/master plans.
 */
export function MediaDocumentsPanel({
  property,
  onChanged,
}: {
  property: Property;
  onChanged?: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight">
          Media &amp; documents
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Manage every visual and compliance asset the public Property Detail
          page uses: cover and gallery imagery, MahaRERA QR, downloadable
          brochure, and floor / master plans. Upload only after the property
          has been created so files can be stored under this listing.
        </p>
      </div>

      <section aria-labelledby="media-property-images" className="space-y-3">
        <h3 id="media-property-images" className="sr-only">
          Property images
        </h3>
        <ImagesManager
          propertyId={property.id}
          propertyTitle={property.title ?? property.name}
          onChanged={onChanged}
        />
      </section>

      <section aria-labelledby="media-compliance" className="space-y-3">
        <h3 id="media-compliance" className="sr-only">
          Compliance and documents
        </h3>
        <PropertyFiles property={property} onSaved={onChanged} />
      </section>

      <section aria-labelledby="media-floor-plans" className="space-y-3">
        <h3 id="media-floor-plans" className="sr-only">
          Floor plans
        </h3>
        <FloorPlansManager propertyId={property.id} onChanged={onChanged} />
      </section>
    </div>
  );
}
