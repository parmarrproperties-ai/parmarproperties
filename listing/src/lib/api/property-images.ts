import type { PropertyImage } from "@/types";

import { getSupabase, throwOnError } from "./client";
import { deleteFile, deleteFiles, storageFolders, uploadFile } from "./storage";

const TABLE = "property_images";

/**
 * Keeps the master `properties.cover_image` column pointing at the primary
 * gallery image, which is what the website uses for cards and hero thumbnails.
 */
async function syncCoverImage(propertyId: string): Promise<void> {
  const supabase = getSupabase();
  const { data, error: listError } = await supabase
    .from(TABLE)
    .select("url, is_primary, display_order")
    .eq("property_id", propertyId)
    .order("is_primary", { ascending: false })
    .order("display_order", { ascending: true });

  throwOnError(listError, "Loading images for cover sync");
  const images = (data ?? []) as Array<{
    url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  const primary = images.find((image) => image.is_primary) ?? images[0] ?? null;

  const { error } = await supabase
    .from("properties")
    .update({ cover_image: primary?.url ?? null })
    .eq("id", propertyId);

  throwOnError(error, "Updating the cover image");
}

export async function listPropertyImages(
  propertyId: string
): Promise<PropertyImage[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("property_id", propertyId)
    .order("is_primary", { ascending: false })
    .order("display_order", { ascending: true });

  throwOnError(error, "Loading images");
  return (data ?? []) as unknown as PropertyImage[];
}

/**
 * Uploads a file and records it against the property. The first image for a
 * property automatically becomes the primary one.
 */
export async function addPropertyImage(
  propertyId: string,
  file: File,
  altText?: string
): Promise<PropertyImage> {
  const [row] = await addPropertyImagesBatch(propertyId, [
    { file, altText, isPrimary: undefined },
  ]);
  return row;
}

export interface PropertyImageBatchItem {
  file: File;
  altText?: string;
  /** When set, overrides “first image is primary” for brand-new batches. */
  isPrimary?: boolean;
}

/**
 * Parallel uploads + one batched insert for Add Property gallery images.
 * Syncs `properties.cover_image` once at the end.
 * On insert failure, deletes only the paths uploaded in this call.
 */
export async function addPropertyImagesBatch(
  propertyId: string,
  items: PropertyImageBatchItem[]
): Promise<PropertyImage[]> {
  if (items.length === 0) return [];

  const supabase = getSupabase();
  const existing = await listPropertyImages(propertyId);
  const folder = storageFolders.propertyImages(propertyId);

  const uploaded = await Promise.all(
    items.map((item) => uploadFile(item.file, folder))
  );

  const primaryIndex =
    items.findIndex((item) => item.isPrimary === true) >= 0
      ? items.findIndex((item) => item.isPrimary === true)
      : existing.length === 0
        ? 0
        : -1;

  const rows = uploaded.map((file, index) => ({
    property_id: propertyId,
    path: file.path,
    url: file.url,
    alt_text: items[index]?.altText?.trim()
      ? items[index].altText!.trim()
      : null,
    is_primary:
      primaryIndex >= 0
        ? index === primaryIndex
        : existing.length === 0 && index === 0,
    display_order: existing.length + index,
  }));

  const { data, error } = await supabase
    .from(TABLE)
    .insert(rows)
    .select(
      "id, property_id, path, url, alt_text, is_primary, display_order, created_at, updated_at"
    );

  if (error) {
    await deleteFiles(uploaded.map((file) => file.path));
    throwOnError(error, "Saving images");
  }

  await syncCoverImage(propertyId);
  return (data ?? []) as unknown as PropertyImage[];
}

export async function updatePropertyImageAlt(
  id: string,
  altText: string
): Promise<void> {
  const trimmed = altText.trim();
  if (!trimmed) {
    throw new Error("Alt text is required for gallery images.");
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from(TABLE)
    .update({ alt_text: trimmed })
    .eq("id", id);

  throwOnError(error, "Updating image");
}

export async function deletePropertyImage(
  image: PropertyImage
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", image.id);
  throwOnError(error, "Deleting image");

  await deleteFile(image.path);

  // Promote another image when the primary one was removed.
  if (image.is_primary) {
    const remaining = await listPropertyImages(image.property_id);
    if (remaining.length > 0) {
      await setPrimaryImage(image.property_id, remaining[0].id);
    } else {
      await syncCoverImage(image.property_id);
    }
  }
}

export async function setPrimaryImage(
  propertyId: string,
  imageId: string
): Promise<void> {
  const supabase = getSupabase();

  const { error: clearError } = await supabase
    .from(TABLE)
    .update({ is_primary: false })
    .eq("property_id", propertyId);

  throwOnError(clearError, "Updating primary image");

  const { error } = await supabase
    .from(TABLE)
    .update({ is_primary: true })
    .eq("id", imageId);

  throwOnError(error, "Updating primary image");
  await syncCoverImage(propertyId);
}

export async function reorderPropertyImages(ids: string[]): Promise<void> {
  const supabase = getSupabase();

  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await supabase
        .from(TABLE)
        .update({ display_order: index })
        .eq("id", id);
      throwOnError(error, "Reordering images");
    })
  );
}
