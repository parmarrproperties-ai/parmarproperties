import type { Metadata } from "next";

import { CommercialsView } from "@/components/commercials/commercials-view";

export const metadata: Metadata = {
  title: "Commercial listings",
};

export default function CommercialsPage() {
  return <CommercialsView />;
}
