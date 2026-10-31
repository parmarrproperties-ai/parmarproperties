"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Trash } from "lucide-react";
import { toast } from "sonner";

import type { PropertyWithRelations } from "@/types";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  listProperties,
  propertyDisplayTitle,
  purgeProperty,
  restoreProperty,
} from "@/lib/api/properties";
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
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";

export function TrashView() {
  const confirm = useConfirm<PropertyWithRelations>();

  const fetchDeleted = React.useCallback(async () => {
    const result = await listProperties(
      { sort: "updated", pageSize: 100 },
      { deleted: true }
    );
    return result.data;
  }, []);

  const {
    data: properties,
    loading,
    error,
    reload,
  } = useResource<PropertyWithRelations[]>(fetchDeleted, []);

  async function handleRestore(property: PropertyWithRelations) {
    try {
      await restoreProperty(property.id);
      toast.success(`${propertyDisplayTitle(property)} restored`, {
        description: "It stays hidden until you set it live again.",
      });
      reload();
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trash"
        description="Deleted properties are kept here so nothing is lost by accident. Restoring brings a listing back as hidden."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/properties">Back to properties</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : loading ? (
            <TableSkeleton rows={4} />
          ) : properties.length === 0 ? (
            <EmptyState
              icon={<Trash />}
              title="Trash is empty"
              description="Properties you delete will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Deleted</TableHead>
                  <TableHead className="w-56 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      {propertyDisplayTitle(property)}
                      {property.sub_location ||
                      property.locality ||
                      property.city ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {property.sub_location ||
                            [property.locality, property.city]
                              .filter(Boolean)
                              .join(", ")}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      /{property.slug}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(property.deleted_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleRestore(property)}
                        >
                          <RotateCcw />
                          Restore
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => confirm.ask(property)}
                        >
                          <Trash />
                          Delete forever
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

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Permanently delete this property?"
        description={
          confirm.target
            ? `${propertyDisplayTitle(confirm.target)}, along with its images, configurations, plans and inventory, will be erased. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete forever"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await purgeProperty(confirm.target.id);
            toast.success("Property permanently deleted");
            reload();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </div>
  );
}
