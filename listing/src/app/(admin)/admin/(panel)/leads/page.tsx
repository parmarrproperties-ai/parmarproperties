import type { Metadata } from "next";

import { LeadsView } from "@/components/leads/leads-view";

export const metadata: Metadata = {
  title: "Leads",
};

export default function LeadsPage() {
  return <LeadsView />;
}
