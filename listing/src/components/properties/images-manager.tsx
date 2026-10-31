"use client";

import { withBasePath } from "@/lib/base-path";
import * as React from "react";
import Link from "next/link";
import {
  GripVertical,
  Image as ImageIcon,
  Star,
  Trash,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import type { PropertyImage } from "@/types";
import { MAX_IMAGE_SIZE_MB } from "@/lib/constants";
import { cn, getErrorMessage, isValidImageFile } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import {
  addPropertyImage,
  deletePropertyImage,
  listPropertyImages,
  reorderPropertyImages,
  setPrimaryImage,
  updatePropertyImageAlt,
} from "@/lib/api/property-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Spinner,
} from "@/components/shared/states";
import { ConfirmDialog, useConfirm } from "@/components/shared/confirm-dialog";
import { OrderControls, moveItem } from "@/components/shared/order-controls";

/**
 * Cover image + gallery (`property_images`). Primary image syncs to
 * `properties.cover_image`. RERA QR / brochure / floor plans are managed
 * separately and must not be uploaded here.
 */
export function ImagesManager({
  propertyId,
  propertyTitle,
  onChanged,
}: {
  propertyId: string;
  propertyTitle?: string;
  onChanged?: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const confirm = useConfirm<PropertyImage>();

  const fetchImages = React.useCallback(
    () => listPropertyImages(propertyId),
    [propertyId]
  );

  const {
    data: images,
    setData: setImages,
    loading,
    error,
    reload,
    refresh,
  } = useResource<PropertyImage[]>(fetchImages, []);

  // Drag-and-swap state: which card is being dragged / hovered.
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const cover = images.find((image) => image.is_primary) ?? images[0] ?? null;

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const selected = Array.from(files);
    const rejected: string[] = [];
    const accepted: File[] = [];

    for (const file of selected) {
      const problem = isValidImageFile(file, MAX_IMAGE_SIZE_MB);
      if (problem) rejected.push(`${file.name}: ${problem}`);
      else accepted.push(file);
    }

    if (rejected.length > 0) {
      toast.error("Some files were skipped", {
        description: rejected.join("\n"),
      });
    }
    if (accepted.length === 0) return;

    setUploading(true);
    let uploaded = 0;
    try {
      const defaultAlt = propertyTitle?.trim() || undefined;
      for (const file of accepted) {
        await addPropertyImage(propertyId, file, defaultAlt);
        uploaded += 1;
      }
      toast.success(
        `${uploaded} ${uploaded === 1 ? "image" : "images"} uploaded`,
        {
          description:
            images.length === 0
              ? "The first image is set as the cover."
              : undefined,
        }
      );
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
      refresh();
      onChanged?.();
    }
  }

  // Optimistic reorder: the list updates instantly and is saved in the
  // background. Order does not change the property itself, so the parent
  // editor is not refreshed (that is what used to blank the whole page).
  async function persistOrder(next: PropertyImage[]) {
    setImages(next);
    setBusy(true);
    try {
      await reorderPropertyImages(next.map((image) => image.id));
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleMove(from: number, to: number) {
    const next = moveItem(images, from, to);
    if (next === images) return;
    await persistOrder(next);
  }

  async function handleSwap(from: number, to: number) {
    if (from === to || busy) return;
    if (!images[from] || !images[to]) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    await persistOrder(next);
  }

  function endDrag() {
    setDragIndex(null);
    setOverIndex(null);
  }

  async function handleSetCover(image: PropertyImage) {
    setBusy(true);
    try {
      await setPrimaryImage(propertyId, image.id);
      toast.success("Cover image updated");
      refresh();
      onChanged?.();
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function handleAltSave(image: PropertyImage, altText: string) {
    const trimmed = altText.trim();
    if (!trimmed) {
      toast.error("Alt text is required for gallery images.");
      return;
    }
    if ((image.alt_text ?? "") === trimmed) return;

    try {
      await updatePropertyImageAlt(image.id, trimmed);
      setImages((current) =>
        current.map((item) =>
          item.id === image.id ? { ...item, alt_text: trimmed } : item
        )
      );
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Property images</CardTitle>
          <CardDescription>
            Cover image and gallery for the public Property Detail page. The
            cover (primary) is used on listing cards and the hero thumbnail.
            Do not upload RERA QR codes, brochures or floor plans here — those
            have dedicated sections below.
          </CardDescription>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => void handleUpload(event.target.files)}
          />
          <Button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Spinner /> : <Upload />}
            Upload images
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <LoadingBlock label="Loading images…" />
        ) : images.length === 0 ? (
          <EmptyState
            icon={<ImageIcon />}
            title="No cover or gallery images yet"
            description={`Upload JPEG, PNG or WebP up to ${MAX_IMAGE_SIZE_MB}MB. The first upload becomes the cover image; add more for the gallery.`}
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                <Upload />
                Upload cover / gallery
              </Button>
            }
          />
        ) : (
          <>
            {cover ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">Cover image</h3>
                  <Badge variant="warning">
                    <Star className="fill-current" />
                    Cover
                  </Badge>
                </div>
                <div className="overflow-hidden rounded-lg border border-border sm:max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBasePath(cover.url)}
                    alt={cover.alt_text ?? "Cover"}
                    className="aspect-video w-full bg-muted object-cover"
                  />
                  <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                    Synced to the property cover field. Set another gallery
                    image as cover to replace it.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Gallery</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    data-image-card
                    className={cn(
                      "overflow-hidden rounded-lg border border-border transition-[opacity,box-shadow]",
                      dragIndex === index && "opacity-40",
                      overIndex === index &&
                        dragIndex !== index &&
                        "ring-2 ring-primary"
                    )}
                    onDragOver={(event) => {
                      if (dragIndex === null) return;
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      if (overIndex !== index) setOverIndex(index);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const from = dragIndex;
                      endDrag();
                      if (from !== null) void handleSwap(from, index);
                    }}
                  >
                    <div
                      className={cn(
                        "relative",
                        !busy && "cursor-grab active:cursor-grabbing"
                      )}
                      draggable={!busy}
                      title="Drag onto another image to swap"
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", image.id);
                        const card = event.currentTarget.closest(
                          "[data-image-card]"
                        );
                        if (card) event.dataTransfer.setDragImage(card, 24, 24);
                        setDragIndex(index);
                      }}
                      onDragEnd={endDrag}
                    >
                      <GripVertical className="pointer-events-none absolute top-2 right-2 z-10 size-5 rounded bg-background/80 p-0.5 text-muted-foreground shadow-sm" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={withBasePath(image.url)}
                        alt={image.alt_text ?? ""}
                        draggable={false}
                        className="aspect-video w-full bg-muted object-cover"
                      />
                      {image.is_primary ? (
                        <Badge
                          variant="warning"
                          className="absolute top-2 left-2 shadow-sm"
                        >
                          <Star className="fill-current" />
                          Cover
                        </Badge>
                      ) : null}
                    </div>

                    <div className="space-y-2 p-3">
                      <Input
                        defaultValue={image.alt_text ?? ""}
                        placeholder="Describe the image (required)"
                        aria-label="Image alt text"
                        required
                        onBlur={(event) =>
                          void handleAltSave(image, event.target.value)
                        }
                      />

                      <div className="flex items-center justify-between gap-2">
                        <OrderControls
                          index={index}
                          total={images.length}
                          disabled={busy}
                          onMove={handleMove}
                        />
                        <div className="flex items-center gap-1">
                          {!image.is_primary ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={busy}
                              onClick={() => void handleSetCover(image)}
                            >
                              <Star />
                              Set cover
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Delete image"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => confirm.ask(image)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.setOpen}
        title="Delete this image?"
        description="The file is removed from storage and cannot be recovered. If it was the cover, another gallery image becomes cover."
        confirmLabel="Delete image"
        destructive
        onConfirm={async () => {
          if (!confirm.target) return;
          try {
            await deletePropertyImage(confirm.target);
            toast.success("Image deleted");
            refresh();
            onChanged?.();
          } catch (caught) {
            toast.error(getErrorMessage(caught));
          }
        }}
      />
    </Card>
  );
}
