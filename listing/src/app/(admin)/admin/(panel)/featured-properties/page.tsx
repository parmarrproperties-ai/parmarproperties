import type { Metadata } from "next";

import { FeaturedView } from "@/components/properties/featured-view";

export const metadata: Metadata = {
  title: "Featured",
};

export default function FeaturedPage() {
  return <FeaturedView />;
}
