import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ModelsTable } from "@/components/admin/ModelsTable";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminModelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    gender?: string;
    featured?: string;
    published?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = 12;

  const q = params.q?.trim() || "";
  const gender = params.gender === "MALE" || params.gender === "FEMALE" ? params.gender : undefined;
  const isFeatured = params.featured === "FEATURED" ? true : undefined;
  const isPublished =
    params.published === "PUBLISHED" ? true : params.published === "DRAFT" ? false : undefined;

  const where: Prisma.ModelWhereInput = {
    ...(gender ? { gender } : {}),
    ...(isFeatured !== undefined ? { isFeatured } : {}),
    ...(isPublished !== undefined ? { isPublished } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { eyeColor: { contains: q, mode: "insensitive" } },
            { hairColor: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [models, total, featuredCount] = await Promise.all([
    prisma.model.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: { photos: true, videos: true },
        },
      },
    }),
    prisma.model.count({ where }),
    prisma.model.count({ where: { isFeatured: true } }),
  ]);

  const serialized = models.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    gender: m.gender,
    heightCm: m.heightCm,
    coverImageId: m.coverImageId,
    isFeatured: m.isFeatured,
    isPublished: m.isPublished,
    photosCount: m._count.photos,
    videosCount: m._count.videos,
    updatedAt: m.updatedAt.toISOString(),
  }));

  return (
    <ModelsTable
      models={serialized}
      total={total}
      page={page}
      pageSize={pageSize}
      featuredCount={featuredCount}
      currentSearch={q}
      currentGender={params.gender || "ALL"}
      currentFeatured={params.featured || "ALL"}
      currentPublished={params.published || "ALL"}
    />
  );
}
