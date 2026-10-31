import { Suspense } from "react";
import type { Metadata } from "next";

import { PropertiesView } from "@/components/properties/properties-view";
import { LoadingBlock } from "@/components/shared/states";

export const metadata: Metadata = {
  title: "Properties",
};

export default function PropertiesPage() {
  return (
    // Filters live in the query string, so the list renders on the client.
    <Suspense fallback={<LoadingBlock label="Loading properties…" />}>
      <PropertiesView />
    </Suspense>
  );
}
