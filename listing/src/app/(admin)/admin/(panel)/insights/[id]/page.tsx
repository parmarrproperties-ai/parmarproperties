import type { Metadata } from "next";

import { InsightEditor } from "@/components/insights/insight-editor";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Edit insight article",
};

export default async function EditInsightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit article"
        description="Update headline fields and manage body sections."
      />
      <InsightEditor articleId={id} />
    </div>
  );
}
