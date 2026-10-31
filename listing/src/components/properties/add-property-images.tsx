"use client";

import * as React from "react";
import { Image as ImageIcon, Star, Trash, Upload } from "lucide-react";

import { MAX_IMAGE_SIZE_MB } from "@/lib/constants";
import { isValidImageFile } from "@/lib/utils";
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
import { Field } from "@/components/shared/field";
import { EmptyState } from "@/components/shared/states";
import { OrderControls, moveItem } from "@/components/shared/order-controls";

export interface PendingPropertyImage {
  key: string;
  file: File;
  previewUrl: string;
  altText: string;
  isPrimary: boolean;
}

interface AddPropertyImagesProps {
  images: PendingPropertyImage[];
  onChange: (images: PendingPropertyImage[]) => void;
  disabled?: boolean;
  defaultAlt?: string;
  error?: string;
}

function makeKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Local-only gallery staging for Add Property. Files upload to
 * property_images after the property row exists.
 */
export function AddPropertyImages({
  images,
  onChange,
  disabled,
  defaultAlt,
  error,
}: AddPropertyImagesProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rejectMessage, setRejectMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      for (const image of images) {
        URL.revokeObjectURL(image.previewUrl);
      }
    };
    // Only revoke on unmount; per-image cleanup happens on remove.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const rejected: string[] = [];
    const accepted: PendingPropertyImage[] = [];

    for (const file of Array.from(files)) {
      const problem = isValidImageFile(file, MAX_IMAGE_SIZE_MB);
      if (problem) {
        rejected.push(`${file.name}: ${problem}`);
        continue;
      }
      accepted.push({
        key: makeKey(),
        file,
        previewUrl: URL.createObjectURL(file),
        altText: defaultAlt?.trim() || "",
        isPrimary: false,
      });
    }

    setRejectMessage(rejected.length > 0 ? rejected.join(" · ") : null);

    if (accepted.length === 0) return;

    const next = [...images, ...accepted];
    if (!next.some((image) => image.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);

    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(key: string) {
    const target = images.find((image) => image.key === key);
    if (target) URL.revokeObjectURL(target.previewUrl);

    let next = images.filter((image) => image.key !== key);
    if (next.length > 0 && !next.some((image) => image.isPrimary)) {
      next = next.map((image, index) => ({
        ...image,
        isPrimary: index === 0,
      }));
    }
    onChange(next);
  }

  function setPrimary(key: string) {
    onChange(
      images.map((image) => ({
        ...image,
        isPrimary: image.key === key,
      }))
    );
  }

  function updateAlt(key: string, altText: string) {
    onChange(
      images.map((image) =>
        image.key === key ? { ...image, altText } : image
      )
    );
  }

  function handleMove(from: number, to: number) {
    const next = moveItem(images, from, to);
    if (next === images) return;
    onChange(next);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Property Images</CardTitle>
          <CardDescription>
            Gallery images shown at the start of the public property detail
            page. The primary image becomes the cover image after save.
          </CardDescription>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            <Upload />
            Add images
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {rejectMessage ? (
          <p className="text-sm text-destructive">{rejectMessage}</p>
        ) : null}

        {images.length === 0 ? (
          <EmptyState
            icon={<ImageIcon />}
            title="No images yet"
            description="Upload one or more images. The first becomes primary / cover unless you choose another."
          />
        ) : (
          <ul className="space-y-3">
            {images.map((image, index) => (
              <li
                key={image.key}
                className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-start"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.previewUrl}
                  alt={image.altText || image.file.name}
                  className="aspect-video w-full rounded-md object-cover sm:w-40"
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {image.isPrimary ? (
                      <Badge>Primary / cover</Badge>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() => setPrimary(image.key)}
                      >
                        <Star />
                        Set as primary
                      </Button>
                    )}
                    <span className="truncate text-xs text-muted-foreground">
                      {image.file.name}
                    </span>
                  </div>

                  <Field label="Alt text">
                    <Input
                      value={image.altText}
                      placeholder="Sea-facing living room"
                      disabled={disabled}
                      onChange={(event) =>
                        updateAlt(image.key, event.target.value)
                      }
                    />
                  </Field>

                  <div className="flex items-center justify-between gap-2">
                    <OrderControls
                      index={index}
                      total={images.length}
                      disabled={disabled}
                      onMove={handleMove}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      onClick={() => removeImage(image.key)}
                    >
                      <Trash />
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
