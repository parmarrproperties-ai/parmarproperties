"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building, Inbox, Trash } from "lucide-react";
import { toast } from "sonner";

import type { LeadWithRelations, LookupItem, Profile } from "@/types";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { listAdminProfiles } from "@/lib/api/auth";
import {
  assignLead,
  deleteLead,
  getLead,
  listLeadStatuses,
  setLeadStatus,
} from "@/lib/api/leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/shared/field";
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { LeadStatusBadge } from "@/components/shared/status-badge";

const UNASSIGNED = "unassigned";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function LeadDetail({ leadId }: { leadId: string }) {
  const router = useRouter();
  const confirm = useConfirm<LeadWithRelations>();

  const fetchLead = React.useCallback(() => getLead(leadId), [leadId]);
  const {
    data: lead,
    setData: setLead,
    loading,
    error,
    reload,
  } = useResource<LeadWithRelations | null>(fetchLead, null);

  const { data: statuses } = useResource<LookupItem[]>(listLeadStatuses, []);
  const { data: advisors } = useResource<Profile[]>(listAdminProfiles, []);

  async function handleStatusChange(statusId: string) {
    if (!lead) return;
    const status = statuses.find((item) => item.id === statusId) ?? null;
    setLead({ ...lead, status_id: statusId, status });

    try {
      await setLeadStatus(lead.id, statusId);
      toast.success("Stage updated");
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  async function handleAssign(value: string) {
    if (!lead) return;
    const advisorId = value === UNASSIGNED ? null : value;
    const assignee = advisors.find((item) => item.id === advisorId) ?? null;
    setLead({ ...lead, assigned_to: advisorId, assignee });

    try {
      await assignLead(lead.id, advisorId);
      toast.success(advisorId ? "Lead assigned" : "Assignment cleared");
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      reload();
    }
  }

  if (loading) return <LoadingBlock label="Loading lead…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  if (!lead) {
    return (
      <EmptyState
        icon={<Inbox />}
        title="That lead no longer exists"
        description="It may have been deleted by another admin."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/leads">
              <ArrowLeft />
              Back to leads
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link href="/admin/leads">
          <ArrowLeft />
          All leads
        </Link>
      </Button>

      <PageHeader
        title={lead.full_name}
        description={`${lead.source?.name ?? "Website enquiry"} · received ${formatDateTime(
          lead.created_at
        )}`}
        actions={
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => confirm.ask(lead)}
          >
            <Trash />
            Delete
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Phone">
                <a href={`tel:${lead.phone}`} className="hover:underline">
                  {lead.phone}
                </a>
              </DetailRow>
              <DetailRow label="Email">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </DetailRow>
              <DetailRow label="Company">
                {lead.company_name ?? (
                  <span className="text-muted-foreground">—</span>
                )}
              </DetailRow>
              <DetailRow label="Phone verified">
                <Badge variant={lead.is_otp_verified ? "success" : "muted"}>
                  {lead.is_otp_verified ? "OTP verified" : "Not verified"}
                </Badge>
              </DetailRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Property">
                  {lead.property ? (
                    <Link
                      href={`/admin/properties/${lead.property.id}`}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <Building className="size-3.5" />
                      {lead.property.title || lead.property.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">
                      No specific listing
                    </span>
                  )}
                </DetailRow>
                <DetailRow label="Commercial">
                  {lead.commercial ? (
                    <Link
                      href={`/admin/commercials`}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <Building className="size-3.5" />
                      {lead.commercial.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </DetailRow>
                <DetailRow label="Article">
                  {lead.article ? (
                    <Link
                      href={`/admin/insights/${lead.article.id}`}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      {lead.article.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </DetailRow>
                <DetailRow label="Asset class">
                  {lead.asset_class ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </DetailRow>
                <DetailRow label="Budget indicated">
                  {lead.budget_range ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </DetailRow>
                <DetailRow label="Unlocked">
                  {lead.gate_type ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </DetailRow>
              </div>

              <DetailRow label="Message">
                {lead.message ? (
                  <p className="whitespace-pre-wrap">{lead.message}</p>
                ) : (
                  <span className="text-muted-foreground">
                    The client did not leave a note.
                  </span>
                )}
              </DetailRow>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <LeadStatusBadge status={lead.status} />
            </div>

            <Field
              label="Stage"
              hint="Saved as soon as you choose it."
            >
              <Select
                value={lead.status_id ?? undefined}
                onValueChange={(value) => void handleStatusChange(value)}
              >
                <SelectTrigger aria-label="Pipeline stage">
                  <SelectValue placeholder="Set a stage" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Assigned advisor">
              <Select
                value={lead.assigned_to ?? UNASSIGNED}
                onValueChange={(value) => void handleAssign(value)}
              >
                <SelectTrigger aria-label="Assigned advisor">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {advisors.map((advisor) => (
                    <SelectItem key={advisor.id} value={advisor.id}>
                      {advisor.full_name || advisor.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="space-y-2 border-t border-border pt-4">
              <DetailRow label="Source">
                {lead.source?.name ?? "—"}
              </DetailRow>
              <DetailRow label="Received">
                {formatDateTime(lead.created_at)}
              </DetailRow>
              <DetailRow label="Last updated">
                {formatDateTime(lead.updated_at)}
              </DetailRow>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this lead?"
        description={`The enquiry from ${lead.full_name} will be removed permanently. There is no trash for leads.`}
        confirmLabel="Delete lead"
        destructive
        onConfirm={async () => {
          try {
            await deleteLead(lead.id);
            toast.success("Lead deleted");
            router.push("/admin/leads");
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
