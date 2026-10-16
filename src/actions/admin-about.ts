"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateTags } from "@/lib/cache";
import { aboutSchema } from "@/lib/validators/about";
import type { ActionResult } from "@/actions/admin-models";

export async function updateAboutAction(rawInput: unknown): Promise<ActionResult> {
  await requireAdmin();

  try {
    const parsed = aboutSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid about content." };
    }

    const { vision, mission } = parsed.data;

    await prisma.aboutContent.upsert({
      where: { id: 1 },
      create: { id: 1, vision, mission },
      update: { vision, mission },
    });

    revalidateTags(CACHE_TAGS.about);
    return { success: true, message: "Vision & Mission updated successfully." };
  } catch (err: unknown) {
    console.error("[updateAboutAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update About content." };
  }
}
