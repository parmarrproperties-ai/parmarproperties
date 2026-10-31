import type { Metadata } from "next";

import { PageContentView } from "@/components/page-content/page-content-view";

export const metadata: Metadata = {
  title: "Page content",
};

export default function PageContentPage() {
  return <PageContentView />;
}
