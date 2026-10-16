"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateTags } from "@/lib/cache";
import { videoSchema } from "@/lib/validators/videos";
import { extractYouTubeId } from "@/lib/youtube";
import type { ActionResult } from "@/actions/admin-models";

export async function createVideoAction(rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  try {
    const parsed = videoSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid video data." };
    }

    const { title, youtubeUrl, category, orientation, isFeatured, thumbnailImageId } = parsed.data;

    const ytId = extractYouTubeId(youtubeUrl);
    if (!ytId) {
      return { success: false, error: "Invalid YouTube URL or ID. Please provide a valid watch, embed, shorts, or youtu.be link." };
    }

    let warning: string | undefined;
    if (isFeatured) {
      const featuredCount = await prisma.video.count({ where: { isFeatured: true } });
      if (featuredCount >= 10) {
        warning = `Note: ${featuredCount} videos are already featured on the landing page (recommend 10-12 max).`;
      }
    }

    const video = await prisma.video.create({
      data: {
        title,
        youtubeId: ytId,
        category,
        orientation,
        isFeatured,
        thumbnailImageId: thumbnailImageId || null,
      },
    });

    revalidateTags(CACHE_TAGS.videos);
    return { success: true, data: { id: video.id }, warning, message: "Video added to portfolio." };
  } catch (err: unknown) {
    console.error("[createVideoAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create video." };
  }
}

export async function updateVideoAction(id: string, rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  try {
    const parsed = videoSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid video data." };
    }

    const { title, youtubeUrl, category, orientation, isFeatured, thumbnailImageId } = parsed.data;

    const ytId = extractYouTubeId(youtubeUrl);
    if (!ytId) {
      return { success: false, error: "Invalid YouTube URL or ID." };
    }

    let warning: string | undefined;
    if (isFeatured) {
      const current = await prisma.video.findUnique({ where: { id }, select: { isFeatured: true } });
      if (!current?.isFeatured) {
        const featuredCount = await prisma.video.count({ where: { isFeatured: true } });
        if (featuredCount >= 10) {
          warning = `Note: ${featuredCount} videos are already featured on the landing page.`;
        }
      }
    }

    await prisma.video.update({
      where: { id },
      data: {
        title,
        youtubeId: ytId,
        category,
        orientation,
        isFeatured,
        thumbnailImageId: thumbnailImageId || null,
      },
    });

    revalidateTags(CACHE_TAGS.videos);
    return { success: true, data: { id }, warning, message: "Video updated successfully." };
  } catch (err: unknown) {
    console.error("[updateVideoAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update video." };
  }
}

export async function toggleVideoFeaturedAction(id: string, isFeatured: boolean): Promise<ActionResult> {
  await requireAdmin();

  try {
    let warning: string | undefined;
    if (isFeatured) {
      const count = await prisma.video.count({ where: { isFeatured: true } });
      if (count >= 10) {
        warning = `Soft limit: ${count} videos are currently featured.`;
      }
    }

    await prisma.video.update({
      where: { id },
      data: { isFeatured },
    });

    revalidateTags(CACHE_TAGS.videos);
    return { success: true, warning, message: isFeatured ? "Video featured on landing page." : "Removed from featured videos." };
  } catch (err: unknown) {
    console.error("[toggleVideoFeaturedAction]", err);
    return { success: false, error: "Failed to toggle featured status." };
  }
}

export async function deleteVideoAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await prisma.video.delete({ where: { id } });
    revalidateTags(CACHE_TAGS.videos);
    return { success: true, message: "Video deleted successfully." };
  } catch (err: unknown) {
    console.error("[deleteVideoAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete video." };
  }
}
