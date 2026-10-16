"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateTags } from "@/lib/cache";
import { teamMemberSchema } from "@/lib/validators/team";
import type { ActionResult } from "@/actions/admin-models";

export async function createTeamMemberAction(rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  try {
    const parsed = teamMemberSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid team member data." };
    }

    const {
      name,
      role,
      photoId,
      phone,
      email,
      facebook,
      linkedin,
      instagram,
      showPhone,
      showEmail,
      sortOrder,
      isPublished,
    } = parsed.data;

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        photoId: photoId || null,
        phone: phone || null,
        email: email || null,
        facebook: facebook || null,
        linkedin: linkedin || null,
        instagram: instagram || null,
        showPhone,
        showEmail,
        sortOrder,
        isPublished,
      },
    });

    revalidateTags(CACHE_TAGS.team);
    return { success: true, data: { id: member.id }, message: "Team member added successfully." };
  } catch (err: unknown) {
    console.error("[createTeamMemberAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to add team member." };
  }
}

export async function updateTeamMemberAction(id: string, rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  try {
    const parsed = teamMemberSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid team member data." };
    }

    const {
      name,
      role,
      photoId,
      phone,
      email,
      facebook,
      linkedin,
      instagram,
      showPhone,
      showEmail,
      sortOrder,
      isPublished,
    } = parsed.data;

    await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        photoId: photoId || null,
        phone: phone || null,
        email: email || null,
        facebook: facebook || null,
        linkedin: linkedin || null,
        instagram: instagram || null,
        showPhone,
        showEmail,
        sortOrder,
        isPublished,
      },
    });

    revalidateTags(CACHE_TAGS.team);
    return { success: true, data: { id }, message: "Team member updated successfully." };
  } catch (err: unknown) {
    console.error("[updateTeamMemberAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update team member." };
  }
}

export async function deleteTeamMemberAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) return { success: false, error: "Team member not found." };

    await prisma.teamMember.delete({ where: { id } });

    if (member.photoId) {
      await prisma.image.deleteMany({
        where: {
          id: member.photoId,
          modelCovers: { none: {} },
          modelPhotos: { none: {} },
          services: { none: {} },
          videos: { none: {} },
          teamPhotos: { none: {} },
        },
      });
    }

    revalidateTags(CACHE_TAGS.team);
    return { success: true, message: "Team member deleted successfully." };
  } catch (err: unknown) {
    console.error("[deleteTeamMemberAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete team member." };
  }
}
