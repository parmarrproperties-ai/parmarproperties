import type { Metadata } from "next";

import { NewInsightForm } from "@/components/insights/new-insight-form";

export const metadata: Metadata = {
  title: "New insight article",
};

export default function NewInsightPage() {
  return <NewInsightForm />;
}
