import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";

export const CACHE_TAGS = {
  models: "models",
  model: (slug: string) => `model:${slug}`,
  services: "services",
  videos: "videos",
  reviews: "reviews",
  team: "team",
  about: "about",
} as const;

/** Wrap a data fetcher in the Next data cache with tags (on-demand ISR). */
export function cached<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  keyParts: string[],
  tags: string[],
) {
  return unstable_cache(fn, keyParts, { tags });
}

/** Call from admin Server Actions after any mutation. */
export function revalidateTags(...tags: string[]) {
  for (const tag of new Set(tags)) revalidateTag(tag);
}
