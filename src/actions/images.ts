"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { ImageError, processAndStoreImage } from "@/lib/images/process";
import { rateLimit } from "@/lib/security/rate-limit";

export type UploadResult = { ok: true; id: string; url: string } | { ok: false; error: string };

/** Reusable admin upload action. Usage: const fd = new FormData(); fd.append("file", file); */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const session = await requireAdmin();

  const limited = await rateLimit(`upload:${session.email}`, { limit: 60, windowMs: 10 * 60 * 1000 });
  if (!limited.ok) return { ok: false, error: `Too many uploads. Try again in ${limited.retryAfterSec}s.` };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file received." };

  try {
    const { id, url } = await processAndStoreImage(file);
    return { ok: true, id, url };
  } catch (e) {
    if (e instanceof ImageError) return { ok: false, error: e.message };
    console.error("[uploadImageAction]", e);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
