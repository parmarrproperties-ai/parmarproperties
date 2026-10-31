import type { Metadata } from "next";

import { HeroSlidesView } from "@/components/hero/hero-slides-view";

export const metadata: Metadata = {
  title: "Hero slides",
};

export default function HeroSlidesPage() {
  return <HeroSlidesView />;
}
