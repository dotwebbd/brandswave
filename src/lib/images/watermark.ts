import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

let customMark: Buffer | null | undefined;

async function loadCustomMark() {
  if (customMark !== undefined) return customMark;
  try {
    // Drop your real logo at public/watermark.png (transparent PNG) to override the default mark.
    customMark = await readFile(path.join(process.cwd(), "public", "watermark.png"));
  } catch {
    customMark = null;
  }
  return customMark;
}

// Vector wave mark (no text, so it renders even without system fonts on serverless).
const waveSvg = (size: number) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
      <g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.55">
        <path d="M6 22c8-10 14 10 22 0s14 10 22 0 8-6 8-6"/>
        <path d="M6 36c8-10 14 10 22 0s14 10 22 0 8-6 8-6"/>
        <path d="M6 50c8-10 14 10 22 0s14 10 22 0 8-6 8-6"/>
      </g>
    </svg>`,
  );

/** Returns a watermarked WebP copy of the image (the original stays untouched in the DB). */
export async function applyWatermark(input: Buffer): Promise<Buffer> {
  try {
    const meta = await sharp(input).metadata();
    const width = meta.width ?? 800;
    const size = Math.max(48, Math.round(width * 0.14));
    const margin = Math.round(size * 0.2);

    const custom = await loadCustomMark();
    const base = custom
      ? await sharp(custom).resize({ width: size, height: size, fit: "inside" }).png().toBuffer()
      : await sharp(waveSvg(size)).png().toBuffer();

    // Transparent padding on the right/bottom acts as the margin from the corner.
    const mark = await sharp(base)
      .extend({ right: margin, bottom: margin, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    return await sharp(input).composite([{ input: mark, gravity: "southeast" }]).webp({ quality: 82 }).toBuffer();
  } catch {
    return input; // never break image delivery if watermarking fails
  }
}
