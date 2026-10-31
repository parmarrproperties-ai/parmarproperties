import type { Metadata } from "next";
import { Suspense } from "react";

import { PropertyEditor } from "@/components/properties/property-editor";
import { LoadingBlock } from "@/components/shared/states";

export const metadata: Metadata = {
  title: "Edit property",
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingBlock label="Loading property…" />}>
      <PropertyEditor propertyId={id} />
    </Suspense>
  );
}
