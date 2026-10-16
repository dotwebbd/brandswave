import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { env } from "@/lib/env";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Store only a salted hash of the IP (privacy-friendly spam tracking). */
export function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}:${env.AUTH_SECRET}`).digest("hex").slice(0, 32);
}

/** For custom route handlers that mutate state. */
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return; // non-browser or same-origin GET
  const allowed = new URL(env.NEXT_PUBLIC_SITE_URL).origin;
  const host = req.headers.get("host");
  if (origin !== allowed && (!host || new URL(origin).host !== host)) {
    throw new Response("Forbidden", { status: 403 });
  }
}
