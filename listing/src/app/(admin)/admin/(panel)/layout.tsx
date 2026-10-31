import { Suspense, type ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { LoadingBlock } from "@/components/shared/states";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingBlock label="Loading workspace…" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
