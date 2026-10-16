"use client";

/**
 * Client-side compression before upload (saves bandwidth; the server re-compresses
 * with sharp regardless, so this is an optimisation, not a trust boundary).
 *
 * This is the single adapter point for `image-video-compressor`: if you want to use
 * that library, call it inside `compressImageClient` and keep the same signature.
 * The canvas implementation below is a dependency-free fallback.
 */
export async function compressImageClient(
  file: File,
  { maxWidth = 1600, quality = 0.8 }: { maxWidth?: number; quality?: number } = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  if (!blob || blob.size >= file.size) return file; // keep original if no gain
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
}
