"use client";

import * as React from "react";
import { ImageDown } from "lucide-react";
import { toast } from "sonner";

import { STORAGE_BUCKET } from "@/lib/constants";
import { getSupabase } from "@/lib/api/client";
import { compressImage } from "@/lib/image-compress";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/shared/states";

const LARGE_BYTES = 500 * 1024;

interface StoredImage {
  path: string;
  url: string;
  isPlan: boolean;
}

async function listStoredImages(): Promise<StoredImage[]> {
  const supabase = getSupabase();
  const [images, plans] = await Promise.all([
    supabase.from("property_images").select("path, url"),
    supabase.from("floor_plans").select("image_path, image_url"),
  ]);
  if (images.error) throw images.error;
  if (plans.error) throw plans.error;

  const rows: StoredImage[] = [];
  for (const row of images.data ?? []) {
    if (row.path && row.url) rows.push({ path: row.path as string, url: row.url as string, isPlan: false });
  }
  for (const row of plans.data ?? []) {
    if (row.image_path && row.image_url) {
      rows.push({ path: row.image_path as string, url: row.image_url as string, isPlan: true });
    }
  }
  return rows;
}

/**
 * Recompresses property photos and floor plans that were uploaded before the
 * admin started shrinking images on upload. Files are replaced in place, so no
 * database row or public URL changes.
 */
export function ImageOptimizerCard() {
  const [running, setRunning] = React.useState(false);
  const [progress, setProgress] = React.useState("");

  async function run() {
    setRunning(true);
    let checked = 0;
    let optimized = 0;
    let savedBytes = 0;
    try {
      const supabase = getSupabase();
      const images = await listStoredImages();

      for (const image of images) {
        checked += 1;
        setProgress(`Checked ${checked} of ${images.length} · optimized ${optimized}`);

        const response = await fetch(image.url, { cache: "no-store" });
        if (!response.ok) continue;
        const blob = await response.blob();
        if (blob.size < LARGE_BYTES || blob.type === "application/pdf") continue;

        const original = new File([blob], image.path.split("/").pop() ?? "image", { type: blob.type });
        const smaller = await compressImage(original, { maxEdge: image.isPlan ? 2400 : 1600 });
        if (smaller === original) continue;

        const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(image.path, smaller, {
          upsert: true,
          contentType: smaller.type,
          cacheControl: "31536000",
        });
        if (error) throw error;

        optimized += 1;
        savedBytes += blob.size - smaller.size;
      }

      toast.success("Images optimized", {
        description: `${optimized} of ${checked} images recompressed, ${(savedBytes / 1024 / 1024).toFixed(1)} MB saved.`,
      });
    } catch (error) {
      toast.error("Image optimization stopped", { description: getErrorMessage(error) });
    } finally {
      setProgress(`Checked ${checked} · optimized ${optimized} · saved ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
      setRunning(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimize stored images</CardTitle>
        <CardDescription>
          Shrinks property photos and floor plans over 500 KB (photos to 1600 px, plans to 2400 px, WebP).
          New uploads are already optimized; run this once for older files. Keep this tab open until it finishes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4">
        <Button onClick={run} disabled={running}>
          {running ? <Spinner /> : <ImageDown />}
          {running ? "Optimizing…" : "Optimize images"}
        </Button>
        {progress ? <span className="text-sm text-muted-foreground">{progress}</span> : null}
      </CardContent>
    </Card>
  );
}
