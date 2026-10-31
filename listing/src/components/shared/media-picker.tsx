"use client";

import * as React from "react";
import { FileText, Trash, Upload } from "lucide-react";

import { cn, formatFileSize, isValidBrochureFile, isValidImageFile } from "@/lib/utils";
import {
  ALLOWED_BROCHURE_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_BROCHURE_SIZE_MB,
  MAX_IMAGE_SIZE_MB,
} from "@/lib/constants";
import { uploadFile, type UploadedFile } from "@/lib/api/storage";
import { Button } from "@/components/ui/button";

/**
 * Tracks what should happen to a file field when the form is submitted.
 * `unchanged` keeps whatever is stored, `remove` clears it, `replace` uploads.
 */
export type FileSelection =
  | { kind: "unchanged" }
  | { kind: "remove" }
  | { kind: "replace"; file: File };

export const unchangedSelection: FileSelection = { kind: "unchanged" };

/**
 * Turns a selection into the argument shape the API services expect:
 * `undefined` leaves the columns alone, `null` clears them.
 */
export async function uploadSelection(
  selection: FileSelection,
  folder: string
): Promise<UploadedFile | null | undefined> {
  if (selection.kind === "unchanged") return undefined;
  if (selection.kind === "remove") return null;
  return uploadFile(selection.file, folder);
}

export function hasFile(
  selection: FileSelection,
  existingUrl?: string | null
): boolean {
  if (selection.kind === "replace") return true;
  if (selection.kind === "remove") return false;
  return Boolean(existingUrl);
}

interface MediaPickerProps {
  variant?: "image" | "document";
  existingUrl?: string | null;
  existingName?: string | null;
  selection: FileSelection;
  onSelectionChange: (selection: FileSelection) => void;
  disabled?: boolean;
  className?: string;
  emptyLabel?: string;
}

/**
 * Single-file picker with preview. Nothing is uploaded until the parent form
 * calls `uploadSelection`, so cancelling a dialog never leaves orphan files.
 */
export function MediaPicker({
  variant = "image",
  existingUrl,
  existingName,
  selection,
  onSelectionChange,
  disabled,
  className,
  emptyLabel,
}: MediaPickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);

  const isImage = variant === "image";
  const maxMb = isImage ? MAX_IMAGE_SIZE_MB : MAX_BROCHURE_SIZE_MB;
  const accept = (isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_BROCHURE_TYPES).join(
    ","
  );

  const previewUrl = React.useMemo(
    () =>
      selection.kind === "replace"
        ? URL.createObjectURL(selection.file)
        : null,
    [selection]
  );

  // Object URLs have to be revoked or the tab slowly leaks memory.
  React.useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    const validationError = isImage
      ? isValidImageFile(file, maxMb)
      : isValidBrochureFile(file, maxMb);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onSelectionChange({ kind: "replace", file });
  }

  function clear() {
    setError(null);
    onSelectionChange({ kind: "remove" });
    if (inputRef.current) inputRef.current.value = "";
  }

  const shownUrl =
    previewUrl ?? (selection.kind === "remove" ? null : existingUrl ?? null);
  const fileName =
    selection.kind === "replace"
      ? selection.file.name
      : selection.kind === "remove"
        ? null
        : existingName ?? null;

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
      />

      {shownUrl && isImage ? (
        <div className="group relative w-full overflow-hidden rounded-lg border border-border bg-muted">
          {/* Storage URLs are remote and unknown at build time, so next/image
              optimisation is intentionally skipped here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shownUrl}
            alt={fileName ?? "Selected image"}
            className="aspect-video w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 px-3 py-2">
            <span className="truncate text-xs text-white">
              {fileName ?? "Current image"}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                aria-label="Remove file"
                disabled={disabled}
                onClick={clear}
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      ) : shownUrl || fileName ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {fileName ?? "Current file"}
              </p>
              {selection.kind === "replace" ? (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selection.file.size)}
                </p>
              ) : shownUrl ? (
                <a
                  href={shownUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Open current file
                </a>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove file"
              disabled={disabled}
              onClick={clear}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (!disabled) handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center transition-colors",
            "hover:border-ring hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          <Upload className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {emptyLabel ??
              (isImage ? "Upload an image" : "Upload a PDF or image")}
          </span>
          <span className="text-xs text-muted-foreground">
            {isImage ? "JPEG, PNG or WebP" : "PDF, JPEG or PNG"} · up to {maxMb}
            MB
          </span>
        </button>
      )}

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
