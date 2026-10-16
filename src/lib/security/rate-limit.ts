import "server-only";

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterSec: number };

/**
 * In-memory fixed-window limiter. Async signature so it can be swapped for
 * Upstash/Redis (required for multi-instance serverless deployments).
 */
export async function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const now = Date.now();
  if (store.size > 5000) for (const [k, v] of store) if (v.resetAt < now) store.delete(k);

  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
  }
  entry.count += 1;
  const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), retryAfterSec };
}

export async function resetRateLimit(key: string) {
  store.delete(key);
}
