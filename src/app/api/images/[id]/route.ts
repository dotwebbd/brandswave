import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyWatermark } from "@/lib/images/watermark";

export const runtime = "nodejs";

const ID_RE = /^[a-zA-Z0-9_-]{10,40}$/;
const CACHE = "public, max-age=31536000, immutable";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID_RE.test(id)) return new NextResponse("Not found", { status: 404 });

  const watermark = new URL(req.url).searchParams.get("wm") === "1";

  // Cheap metadata lookup first so 304 responses never load image bytes.
  const meta = await prisma.image.findUnique({ where: { id }, select: { mimeType: true, createdAt: true } });
  if (!meta) return new NextResponse("Not found", { status: 404 });

  const etag = `"${id}-${meta.createdAt.getTime()}${watermark ? "-wm" : ""}"`;
  const baseHeaders = { ETag: etag, "Cache-Control": CACHE, "X-Content-Type-Options": "nosniff" };

  if (req.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers: baseHeaders });

  const row = await prisma.image.findUnique({ where: { id }, select: { data: true } });
  if (!row) return new NextResponse("Not found", { status: 404 });

  let body = Buffer.from(row.data) as Buffer;
  if (watermark) body = await applyWatermark(body);

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      ...baseHeaders,
      "Content-Type": watermark ? "image/webp" : meta.mimeType,
      "Content-Length": String(body.length),
      "Content-Disposition": "inline",
    },
  });
}
