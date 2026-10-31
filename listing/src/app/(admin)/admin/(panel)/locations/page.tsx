import type { Metadata } from "next";

import { LocationsView } from "@/components/locations/locations-view";

export const metadata: Metadata = {
  title: "Locations",
};

export default function LocationsPage() {
  return <LocationsView />;
}
