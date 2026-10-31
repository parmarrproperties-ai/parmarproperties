import type { Metadata } from "next";

import { AmenitiesView } from "@/components/amenities/amenities-view";

export const metadata: Metadata = {
  title: "Amenities",
};

export default function AmenitiesPage() {
  return <AmenitiesView />;
}
