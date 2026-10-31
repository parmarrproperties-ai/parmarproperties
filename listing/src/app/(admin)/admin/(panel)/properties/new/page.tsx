import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyForm } from "@/components/properties/property-form";

export const metadata: Metadata = {
  title: "New property",
};

export default function NewPropertyPage() {
  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/properties">
          <ChevronLeft />
          Back to properties
        </Link>
      </Button>

      <PageHeader
        title="New property"
        description="Enter property details, configurations, amenities, RERA QR and gallery images, then create. You will land on Media & Documents for brochure and floor plans."
      />

      <PropertyForm />
    </div>
  );
}
