import "server-only";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { IMAGE_LIMITS } from "@/lib/images/constants";

/** Verify real file type from magic bytes (never trust the client MIME). */
function detectMime(buf: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

export class ImageError extends Error {}

/** Validate, normalise (rotate, resize, WebP) and persist an image. Returns its id. */
export async function processAndStoreImage(file: File) {
  if (file.size === 0) throw new ImageError("The file is empty.");
  if (file.size > IMAGE_LIMITS.maxInputBytes) throw new ImageError("Image is too large (max 8 MB before compression).");

  const input = Buffer.from(await file.arrayBuffer());
  if (!detectMime(input)) throw new ImageError("Only JPEG, PNG or WebP images are allowed.");

  let output: Buffer;
  let info: sharp.OutputInfo;
  try {
    const result = await sharp(input, { failOn: "error", limitInputPixels: 60_000_000 })
      .rotate() // honour EXIF orientation, then strip metadata
      .resize({ width: IMAGE_LIMITS.maxWidth, withoutEnlargement: true })
      .webp({ quality: IMAGE_LIMITS.webpQuality })
      .toBuffer({ resolveWithObject: true });
    output = result.data;
    info = result.info;
  } catch {
    throw new ImageError("That image could not be processed. Try a different file.");
  }

  if (output.length > IMAGE_LIMITS.maxOutputBytes) throw new ImageError("Image is still too large after compression.");

  const row = await prisma.image.create({
    data: {
      data: new Uint8Array(output),
      mimeType: "image/webp",
      sizeBytes: output.length,
      width: info.width,
      height: info.height,
    },
    select: { id: true },
  });
  return { id: row.id, url: `/api/images/${row.id}` };
}

export async function deleteImage(id: string) {
  await prisma.image.deleteMany({ where: { id } });
}
