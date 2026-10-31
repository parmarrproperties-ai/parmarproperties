"use client";

import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import type { Property } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { updatePropertyMedia } from "@/lib/api/properties";
import { deleteFile, storageFolders } from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGrid } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";

/**
 * Brochure and MahaRERA QR — property file columns, never gallery rows.
 * MahaRERA registration number is edited on the Details → Compliance section.
 */
export function PropertyFiles({
  property,
  onSaved,
}: {
  property: Property;
  onSaved?: () => void;
}) {
  const [brochure, setBrochure] =
    React.useState<FileSelection>(unchangedSelection);
  const [reraQr, setReraQr] = React.useState<FileSelection>(unchangedSelection);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setBrochure(unchangedSelection);
    setReraQr(unchangedSelection);
  }, [property.id, property.brochure_url, property.rera_qr_url]);

  const dirty = brochure.kind !== "unchanged" || reraQr.kind !== "unchanged";
  const reraNumber = property.rera_id || property.rera_number || "";

  async function handleSave() {
    setSaving(true);
    try {
      const [uploadedBrochure, uploadedQr] = await Promise.all([
        uploadSelection(brochure, storageFolders.propertyBrochure(property.id)),
        uploadSelection(reraQr, storageFolders.propertyRera(property.id)),
      ]);

      await updatePropertyMedia(property.id, {
        brochure: uploadedBrochure,
        reraQr: uploadedQr,
      });

      if (uploadedBrochure !== undefined && property.brochure_path) {
        await deleteFile(property.brochure_path);
      }
      if (uploadedQr !== undefined && property.rera_qr_path) {
        await deleteFile(property.rera_qr_path);
      }

      setBrochure(unchangedSelection);
      setReraQr(unchangedSelection);
      toast.success("Compliance documents saved");
      onSaved?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance &amp; documents</CardTitle>
        <CardDescription>
          MahaRERA QR and brochure are stored on the property itself — not in
          the image gallery. The public MahaRERA block and Download Brochure
          action use these fields.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldGrid>
          <Field
            label="MahaRERA number"
            hint="Edited under Details → Compliance. Shown here for reference only."
          >
            <Input
              value={reraNumber || "Not set yet"}
              readOnly
              disabled
              aria-label="MahaRERA number (read-only)"
            />
          </Field>
        </FieldGrid>

        <div className="grid gap-6 lg:grid-cols-2">
          <Field
            label="MahaRERA QR code"
            hint="Image only (JPEG/PNG/WebP). Separate from the registration number above. Preview, replace or remove, then save."
          >
            <MediaPicker
              existingUrl={property.rera_qr_url ?? property.rera_qr_image}
              selection={reraQr}
              onSelectionChange={setReraQr}
              disabled={saving}
              emptyLabel="Upload RERA QR image"
            />
          </Field>

          <Field
            label="Brochure"
            hint="PDF preferred (also JPEG/PNG). Powers the public Download Brochure action. Not a gallery image."
          >
            <MediaPicker
              variant="document"
              existingUrl={property.brochure_url}
              existingName={
                property.brochure_path?.split("/").pop() ?? "Brochure"
              }
              selection={brochure}
              onSelectionChange={setBrochure}
              disabled={saving}
              emptyLabel="Upload brochure PDF"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3">
          {dirty ? (
            <p className="text-xs text-muted-foreground">
              Upload or remove files, then save to apply.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              No unsaved document changes.
            </p>
          )}
          <Button type="button" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? <Spinner /> : <Save />}
            Save documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
