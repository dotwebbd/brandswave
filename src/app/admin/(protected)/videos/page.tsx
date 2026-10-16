import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { VideosManagerClient } from "@/components/admin/VideosManagerClient";
import type { Prisma, VideoCategory, VideoOrientation } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    orientation?: string;
    featured?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = 12;

  const category = params.category && params.category !== "ALL" ? (params.category as VideoCategory) : undefined;
  const orientation =
    params.orientation && params.orientation !== "ALL"
      ? (params.orientation as VideoOrientation)
      : undefined;
  const isFeatured = params.featured === "FEATURED" ? true : undefined;

  const where: Prisma.VideoWhereInput = {
    ...(category ? { category } : {}),
    ...(orientation ? { orientation } : {}),
    ...(isFeatured !== undefined ? { isFeatured } : {}),
  };

  const [videos, total, featuredCount] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.video.count({ where }),
    prisma.video.count({ where: { isFeatured: true } }),
  ]);

  const serialized = videos.map((v) => ({
    id: v.id,
    title: v.title,
    youtubeId: v.youtubeId,
    category: v.category,
    orientation: v.orientation,
    isFeatured: v.isFeatured,
    createdAt: v.createdAt.toISOString(),
  }));

  return (
    <VideosManagerClient
      videos={serialized}
      total={total}
      page={page}
      pageSize={pageSize}
      featuredCount={featuredCount}
      currentCategory={params.category || "ALL"}
      currentOrientation={params.orientation || "ALL"}
      currentFeatured={params.featured || "ALL"}
    />
  );
}
