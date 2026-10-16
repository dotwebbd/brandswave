import "server-only";
import type { Gender, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, cached } from "@/lib/cache";

// Explicit select: ModelPrivate (phone/email) must NEVER appear in public queries.
const cardSelect = {
  id: true,
  slug: true,
  name: true,
  gender: true,
  heightCm: true,
  coverImageId: true,
} satisfies Prisma.ModelSelect;

const profileSelect = {
  ...cardSelect,
  chestBust: true,
  waist: true,
  hips: true,
  eyeColor: true,
  hairColor: true,
  bio: true,
  photos: { orderBy: { sortOrder: "asc" }, select: { id: true, imageId: true } },
  videos: { orderBy: { sortOrder: "asc" }, select: { id: true, title: true, description: true, youtubeUrl: true } },
} satisfies Prisma.ModelSelect;

export type ModelCard = Prisma.ModelGetPayload<{ select: typeof cardSelect }>;
export type ModelProfile = Prisma.ModelGetPayload<{ select: typeof profileSelect }>;
export type Model = Prisma.ModelGetPayload<{ select: typeof cardSelect }>;

export const getFeaturedModels = cached(
  async (limit: number = 12) =>
    prisma.model.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: cardSelect,
    }),
  ["featured-models"],
  [CACHE_TAGS.models],
);

export const getModelsPage = cached(
  async (gender: Gender, page: number, pageSize: number = 12) => {
    const where = { isPublished: true, gender };
    const [items, total] = await Promise.all([
      prisma.model.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: cardSelect,
      }),
      prisma.model.count({ where }),
    ]);
    return { items, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  },
  ["models-page"],
  [CACHE_TAGS.models],
);

export function getModelBySlug(slug: string) {
  return cached(
    async () =>
      prisma.model.findFirst({ where: { slug, isPublished: true }, select: profileSelect }),
    ["model", slug],
    [CACHE_TAGS.models, CACHE_TAGS.model(slug)],
  )();
}

export const getAllModelSlugs = cached(
  async () => prisma.model.findMany({ where: { isPublished: true }, select: { slug: true } }),
  ["model-slugs"],
  [CACHE_TAGS.models],
);
