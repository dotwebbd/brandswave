import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ModelForm } from "@/components/admin/ModelForm";

export const dynamic = "force-dynamic";

export default async function EditModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [model, featuredCount] = await Promise.all([
    prisma.model.findUnique({
      where: { id },
      include: {
        private: true,
        photos: { orderBy: { sortOrder: "asc" } },
        videos: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.model.count({ where: { isFeatured: true } }),
  ]);

  if (!model) {
    notFound();
  }

  const initialData = {
    id: model.id,
    name: model.name,
    slug: model.slug,
    gender: model.gender,
    heightCm: model.heightCm,
    chestBust: model.chestBust,
    waist: model.waist,
    hips: model.hips,
    eyeColor: model.eyeColor,
    hairColor: model.hairColor,
    bio: model.bio,
    coverImageId: model.coverImageId,
    isFeatured: model.isFeatured,
    isPublished: model.isPublished,
    private: model.private
      ? {
          phone: model.private.phone,
          email: model.private.email,
        }
      : null,
    photos: model.photos.map((p) => ({
      imageId: p.imageId,
      sortOrder: p.sortOrder,
    })),
    videos: model.videos.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      youtubeUrl: v.youtubeUrl,
      sortOrder: v.sortOrder,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam">
          Edit Model: {model.name}
        </h1>
        <p className="text-xs sm:text-sm text-foam/60 mt-1">
          Update profile details, physical specs, private contacts, and media portfolios.
        </p>
      </div>

      <ModelForm initialData={initialData} featuredCount={featuredCount} />
    </div>
  );
}
