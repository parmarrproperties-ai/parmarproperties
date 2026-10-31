"use client";

import * as React from "react";
import { FileText, Pencil } from "lucide-react";

import type { PageContent } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { listPageContent } from "@/lib/api/page-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/shared/states";
import { PageContentDialog } from "@/components/page-content/page-content-dialog";

export function PageContentView() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PageContent | null>(null);

  const { data: rows, loading, error, reload } = useResource<PageContent[]>(
    listPageContent,
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Page content"
        description="Headlines and structured sections for static public routes."
      />

      <Card>
        <CardContent className="p-0">
          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : loading ? (
            <TableSkeleton rows={5} />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={<FileText />}
              title="No page content rows"
              description="Seed page_content in the database for each public route."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route key</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Breadcrumb</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-16 text-right">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.id}</TableCell>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.breadcrumb || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(row.updated_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Edit ${row.id}`}
                          onClick={() => {
                            setEditing(row);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PageContentDialog
        row={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={reload}
      />
    </div>
  );
}
