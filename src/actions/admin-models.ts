"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateTags } from "@/lib/cache";
import { modelSchema, modelPhotoItemSchema, modelVideoItemSchema } from "@/lib/validators/models";
import { extractYouTubeId } from "@/lib/youtube";
import { z } from "zod";

export type ActionResult<T = unknown> =
  | { success: true; data?: T; warning?: string; message?: string }
  | { success: false; error: string };

export async function createModelAction(rawInput: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();

  try {
    const inputObj = rawInput as Record<string, unknown>;
    const parsed = modelSchema.safeParse(inputObj);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid model data." };
    }

    const {
      name,
      slug,
      gender,
      heightCm,
      chestBust,
      waist,
      hips,
      eyeColor,
      hairColor,
      bio,
      coverImageId,
      isFeatured,
      isPublished,
      phone,
      email,
    } = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.model.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A model with this slug already exists. Please choose a different slug." };
    }

    // Check featured count soft limit warning
    let warning: string | undefined;
    if (isFeatured) {
      const featuredCount = await prisma.model.count({ where: { isFeatured: true } });
      if (featuredCount >= 12) {
        warning = `Note: ${featuredCount} models are already featured. Soft limit is 12 for optimal landing page layout.`;
      }
    }

    // Parse gallery photos
    const rawPhotos = Array.isArray(inputObj.photos) ? inputObj.photos : [];
    const parsedPhotos = z.array(modelPhotoItemSchema).safeParse(rawPhotos);
    const photosToCreate = parsedPhotos.success ? parsedPhotos.data : [];

    // Parse work videos
    const rawVideos = Array.isArray(inputObj.videos) ? inputObj.videos : [];
    const parsedVideos = z.array(modelVideoItemSchema).safeParse(rawVideos);
    const videosToCreate = parsedVideos.success
      ? parsedVideos.data.map((v, idx) => {
          const ytId = extractYouTubeId(v.youtubeUrl);
          return {
            title: v.title,
            description: v.description || null,
            youtubeUrl: ytId ? `https://www.youtube-nocookie.com/embed/${ytId}` : v.youtubeUrl,
            sortOrder: v.sortOrder ?? idx,
          };
        })
      : [];

    const newModel = await prisma.$transaction(async (tx) => {
      const model = await tx.model.create({
        data: {
          name,
          slug,
          gender,
          heightCm,
          chestBust,
          waist,
          hips,
          eyeColor,
          hairColor,
          bio,
          coverImageId: coverImageId || null,
          isFeatured,
          isPublished,
          private: phone || email ? { create: { phone, email } } : undefined,
          photos:
            photosToCreate.length > 0
              ? {
                  create: photosToCreate.map((p, idx) => ({
                    imageId: p.imageId,
                    sortOrder: p.sortOrder ?? idx,
                  })),
                }
              : undefined,
          videos:
            videosToCreate.length > 0
              ? {
                  create: videosToCreate,
                }
              : undefined,
        },
      });
      return model;
    });

    revalidateTags(CACHE_TAGS.models, CACHE_TAGS.model(slug));
    return { success: true, data: { id: newModel.id, slug: newModel.slug }, warning, message: "Model created successfully." };
  } catch (err: unknown) {
    console.error("[createModelAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create model." };
  }
}

export async function updateModelAction(id: string, rawInput: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();

  try {
    const inputObj = rawInput as Record<string, unknown>;
    const parsed = modelSchema.safeParse(inputObj);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid model data." };
    }

    const current = await prisma.model.findUnique({
      where: { id },
      include: { photos: true, videos: true, private: true },
    });
    if (!current) {
      return { success: false, error: "Model not found." };
    }

    const {
      name,
      slug,
      gender,
      heightCm,
      chestBust,
      waist,
      hips,
      eyeColor,
      hairColor,
      bio,
      coverImageId,
      isFeatured,
      isPublished,
      phone,
      email,
    } = parsed.data;

    // Check slug collision
    if (slug !== current.slug) {
      const collision = await prisma.model.findUnique({ where: { slug } });
      if (collision) {
        return { success: false, error: "Another model is already using this slug." };
      }
    }

    // Check featured count soft limit warning
    let warning: string | undefined;
    if (isFeatured && !current.isFeatured) {
      const featuredCount = await prisma.model.count({ where: { isFeatured: true } });
      if (featuredCount >= 12) {
        warning = `Note: ${featuredCount} models are already featured. Soft limit is 12 for optimal landing page layout.`;
      }
    }

    // Parse gallery photos
    const rawPhotos = Array.isArray(inputObj.photos) ? inputObj.photos : [];
    const parsedPhotos = z.array(modelPhotoItemSchema).safeParse(rawPhotos);
    const photosToSync = parsedPhotos.success ? parsedPhotos.data : [];

    // Parse work videos
    const rawVideos = Array.isArray(inputObj.videos) ? inputObj.videos : [];
    const parsedVideos = z.array(modelVideoItemSchema).safeParse(rawVideos);
    const videosToSync = parsedVideos.success
      ? parsedVideos.data.map((v, idx) => {
          const ytId = extractYouTubeId(v.youtubeUrl);
          return {
            title: v.title,
            description: v.description || null,
            youtubeUrl: ytId ? `https://www.youtube-nocookie.com/embed/${ytId}` : v.youtubeUrl,
            sortOrder: v.sortOrder ?? idx,
          };
        })
      : [];

    await prisma.$transaction(async (tx) => {
      // Update core model fields
      await tx.model.update({
        where: { id },
        data: {
          name,
          slug,
          gender,
          heightCm,
          chestBust,
          waist,
          hips,
          eyeColor,
          hairColor,
          bio,
          coverImageId: coverImageId || null,
          isFeatured,
          isPublished,
        },
      });

      // Upsert private section
      if (phone || email) {
        await tx.modelPrivate.upsert({
          where: { modelId: id },
          create: { modelId: id, phone, email },
          update: { phone, email },
        });
      } else {
        await tx.modelPrivate.deleteMany({ where: { modelId: id } });
      }

      // Re-create photos list
      await tx.modelPhoto.deleteMany({ where: { modelId: id } });
      if (photosToSync.length > 0) {
        await tx.modelPhoto.createMany({
          data: photosToSync.map((p, idx) => ({
            modelId: id,
            imageId: p.imageId,
            sortOrder: p.sortOrder ?? idx,
          })),
        });
      }

      // Re-create videos list
      await tx.modelVideo.deleteMany({ where: { modelId: id } });
      if (videosToSync.length > 0) {
        await tx.modelVideo.createMany({
          data: videosToSync.map((v) => ({
            modelId: id,
            title: v.title,
            description: v.description,
            youtubeUrl: v.youtubeUrl,
            sortOrder: v.sortOrder,
          })),
        });
      }
    });

    revalidateTags(CACHE_TAGS.models, CACHE_TAGS.model(current.slug), CACHE_TAGS.model(slug));
    return { success: true, data: { id, slug }, warning, message: "Model updated successfully." };
  } catch (err: unknown) {
    console.error("[updateModelAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update model." };
  }
}

export async function toggleModelFeaturedAction(id: string, isFeatured: boolean): Promise<ActionResult<{ isFeatured: boolean }>> {
  await requireAdmin();

  try {
    let warning: string | undefined;
    if (isFeatured) {
      const count = await prisma.model.count({ where: { isFeatured: true } });
      if (count >= 12) {
        warning = `Soft limit reached: ${count} models are currently featured on the landing page.`;
      }
    }

    const updated = await prisma.model.update({
      where: { id },
      data: { isFeatured },
      select: { slug: true, isFeatured: true },
    });

    revalidateTags(CACHE_TAGS.models, CACHE_TAGS.model(updated.slug));
    return { success: true, data: { isFeatured: updated.isFeatured }, warning, message: isFeatured ? "Model marked as featured." : "Removed from featured." };
  } catch (err: unknown) {
    console.error("[toggleModelFeaturedAction]", err);
    return { success: false, error: "Failed to toggle featured status." };
  }
}

export async function toggleModelPublishedAction(id: string, isPublished: boolean): Promise<ActionResult<{ isPublished: boolean }>> {
  await requireAdmin();

  try {
    const updated = await prisma.model.update({
      where: { id },
      data: { isPublished },
      select: { slug: true, isPublished: true },
    });

    revalidateTags(CACHE_TAGS.models, CACHE_TAGS.model(updated.slug));
    return { success: true, data: { isPublished: updated.isPublished }, message: isPublished ? "Model published." : "Model drafted." };
  } catch (err: unknown) {
    console.error("[toggleModelPublishedAction]", err);
    return { success: false, error: "Failed to toggle published status." };
  }
}

export async function deleteModelAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const model = await prisma.model.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!model) {
      return { success: false, error: "Model not found." };
    }

    // Collect image IDs to purge orphaned images from DB
    const imageIdsToDelete: string[] = [];
    if (model.coverImageId) imageIdsToDelete.push(model.coverImageId);
    for (const photo of model.photos) {
      if (photo.imageId) imageIdsToDelete.push(photo.imageId);
    }

    // Cascade delete model (Prisma schema cascades ModelPrivate, ModelPhoto, ModelVideo)
    await prisma.model.delete({ where: { id } });

    // Clean up orphaned Image records if not referenced anywhere else
    if (imageIdsToDelete.length > 0) {
      await prisma.image.deleteMany({
        where: {
          id: { in: imageIdsToDelete },
          modelCovers: { none: {} },
          modelPhotos: { none: {} },
          services: { none: {} },
          videos: { none: {} },
          teamPhotos: { none: {} },
        },
      });
    }

    revalidateTags(CACHE_TAGS.models, CACHE_TAGS.model(model.slug));
    return { success: true, message: "Model and associated gallery deleted successfully." };
  } catch (err: unknown) {
    console.error("[deleteModelAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete model." };
  }
}
