import { STORAGE_BUCKET } from "@/lib/constants";
import { compressImage } from "@/lib/image-compress";

import { getSupabase } from "./client";

export interface UploadedFile {
  path: string;
  url: string;
}

/**
 * Folder layout inside the `media` bucket. Mirrors the notes in the migration.
 */
export const storageFolders = {
  hero: "hero",
  locations: "locations",
  propertyImages: (propertyId: string) => `properties/${propertyId}/images`,
  propertyFloorPlans: (propertyId: string) =>
    `properties/${propertyId}/floor-plans`,
  propertyLayouts: (propertyId: string) => `properties/${propertyId}/layouts`,
  propertyBrochure: (propertyId: string) =>
    `properties/${propertyId}/brochure`,
  propertyRera: (propertyId: string) => `properties/${propertyId}/rera`,
  commercialCover: (commercialId: string) =>
    `commercials/${commercialId}/cover`,
  insightsCover: (articleId: string) => `insights/${articleId}/cover`,
} as const;

function buildObjectName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const extension = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : "bin";
  const base = (dot > 0 ? fileName.slice(0, dot) : fileName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const unique =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${Date.now()}-${unique}-${base || "file"}.${extension}`;
}

export function getPublicUrl(path: string): string {
  const supabase = getSupabase();
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Master-spec columns store a single value that may be a storage path or an
 * absolute URL, depending on where the row came from.
 */
export function resolvePublicUrl(
  pathOrUrl: string | null | undefined
): string | null {
  if (!pathOrUrl) return null;
  return /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : getPublicUrl(pathOrUrl);
}

export async function uploadFile(
  original: File,
  folder: string
): Promise<UploadedFile> {
  const supabase = getSupabase();
  // Floor plans and layouts keep more pixels so dimensions stay legible.
  const isPlan = /\/(floor-plans|layouts)$/.test(folder);
  const file = await compressImage(original, { maxEdge: isPlan ? 2400 : 1600 });
  const path = `${folder}/${buildObjectName(file.name)}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      // Object names are unique per upload, so the file at a URL never changes.
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    if (error.message.toLowerCase().includes("bucket not found")) {
      throw new Error(
        `Storage bucket "${STORAGE_BUCKET}" was not found. Create it in Supabase Storage first.`
      );
    }
    throw new Error(`Upload failed: ${error.message}`);
  }

  return { path, url: getPublicUrl(path) };
}

/**
 * Deletes an object. Never throws — a missing file should not block the
 * database change the caller is really trying to make.
 */
export async function deleteFile(path: string | null | undefined): Promise<void> {
  if (!path) return;

  const supabase = getSupabase();
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

export async function deleteFiles(paths: (string | null | undefined)[]): Promise<void> {
  const valid = paths.filter((p): p is string => Boolean(p));
  if (valid.length === 0) return;

  const supabase = getSupabase();
  await supabase.storage.from(STORAGE_BUCKET).remove(valid);
}
