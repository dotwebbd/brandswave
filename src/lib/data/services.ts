import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, cached } from "@/lib/cache";

const select = {
  id: true,
  slug: true,
  title: true,
  description: true,
  imageId: true,
  priceMin: true,
  priceMax: true,
  hidePrice: true,
} as const;

export type Service = Prisma.ServiceGetPayload<{ select: typeof select }>;

export const getServices = cached(
  async (limit?: number) =>
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
      select,
    }),
  ["services"],
  [CACHE_TAGS.services],
);

export const getServiceBySlug = (slug: string) =>
  cached(
    async () => prisma.service.findFirst({ where: { slug, isPublished: true }, select }),
    ["service", slug],
    [CACHE_TAGS.services],
  )();
