/**
 * Shrinks large photos in the browser before they are uploaded, so the public
 * site never serves multi-megabyte originals. Small files, PDFs, SVGs and GIFs
 * pass through untouched, and any failure falls back to the original file.
 */

const COMPRESSIBLE = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MIN_BYTES = 400 * 1024;
const QUALITY = 0.82;

export interface CompressOptions {
  /** Longest edge in pixels. Plans keep more detail than photos. */
  maxEdge?: number;
}

export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const maxEdge = options.maxEdge ?? 1600;
  if (typeof window === "undefined" || !COMPRESSIBLE.has(file.type)) return file;

  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < MIN_BYTES) return file;

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}
