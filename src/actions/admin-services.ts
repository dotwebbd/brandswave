"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateTags } from "@/lib/cache";
import { serviceSchema } from "@/lib/validators/services";
import type { ActionResult } from "@/actions/admin-models";

export async function createServiceAction(rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  try {
    const parsed = serviceSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid service data." };
    }

    const { title, slug, description, imageId, priceMin, priceMax, hidePrice, sortOrder, isPublished } = parsed.data;

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A service with this slug already exists." };
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        imageId: imageId || null,
        priceMin: priceMin ?? null,
        priceMax: priceMax ?? null,
        hidePrice,
        sortOrder,
        isPublished,
      },
    });

    revalidateTags(CACHE_TAGS.services);
    return { success: true, data: { id: service.id }, message: "Service created successfully." };
  } catch (err: unknown) {
    console.error("[createServiceAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create service." };
  }
}

export async function updateServiceAction(id: string, rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  try {
    const parsed = serviceSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid service data." };
    }

    const current = await prisma.service.findUnique({ where: { id } });
    if (!current) {
      return { success: false, error: "Service not found." };
    }

    const { title, slug, description, imageId, priceMin, priceMax, hidePrice, sortOrder, isPublished } = parsed.data;

    if (slug !== current.slug) {
      const collision = await prisma.service.findUnique({ where: { slug } });
      if (collision) {
        return { success: false, error: "Another service already uses this slug." };
      }
    }

    await prisma.service.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        imageId: imageId || null,
        priceMin: priceMin ?? null,
        priceMax: priceMax ?? null,
        hidePrice,
        sortOrder,
        isPublished,
      },
    });

    revalidateTags(CACHE_TAGS.services);
    return { success: true, data: { id }, message: "Service updated successfully." };
  } catch (err: unknown) {
    console.error("[updateServiceAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update service." };
  }
}

export async function toggleServicePublishedAction(id: string, isPublished: boolean): Promise<ActionResult> {
  await requireAdmin();

  try {
    await prisma.service.update({
      where: { id },
      data: { isPublished },
    });

    revalidateTags(CACHE_TAGS.services);
    return { success: true, message: isPublished ? "Service published." : "Service drafted." };
  } catch (err: unknown) {
    console.error("[toggleServicePublishedAction]", err);
    return { success: false, error: "Failed to toggle service status." };
  }
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return { success: false, error: "Service not found." };

    await prisma.service.delete({ where: { id } });

    if (service.imageId) {
      await prisma.image.deleteMany({
        where: {
          id: service.imageId,
          modelCovers: { none: {} },
          modelPhotos: { none: {} },
          services: { none: {} },
          videos: { none: {} },
          teamPhotos: { none: {} },
        },
      });
    }

    revalidateTags(CACHE_TAGS.services);
    return { success: true, message: "Service deleted successfully." };
  } catch (err: unknown) {
    console.error("[deleteServiceAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete service." };
  }
}
