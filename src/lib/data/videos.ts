import "server-only";
import type { Prisma, VideoCategory, VideoOrientation } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, cached } from "@/lib/cache";

const select = {
  id: true,
  title: true,
  youtubeId: true,
  category: true,
  orientation: true,
  thumbnailImageId: true,
} satisfies Prisma.VideoSelect;

export type Video = Prisma.VideoGetPayload<{ select: typeof select }>;

export const getFeaturedVideos = cached(
  async (limit: number = 12) =>
    prisma.video.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select,
    }),
  ["featured-videos"],
  [CACHE_TAGS.videos],
);

export const getVideosPage = cached(
  async (
    filters: { category?: VideoCategory; orientation?: VideoOrientation },
    page: number,
    pageSize: number = 12,
  ) => {
    const where: Prisma.VideoWhereInput = { ...filters };
    const [items, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select,
      }),
      prisma.video.count({ where }),
    ]);
    return { items, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  },
  ["videos-page"],
  [CACHE_TAGS.videos],
);

export { VideoCategory, VideoOrientation };
