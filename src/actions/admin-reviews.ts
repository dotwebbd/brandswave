"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateTags } from "@/lib/cache";
import { adminUpdateReviewSchema } from "@/lib/validators/review";
import type { ReviewStatus } from "@prisma/client";
import type { ActionResult } from "@/actions/admin-models";

export async function updateReviewStatusAction(id: string, status: ReviewStatus): Promise<ActionResult> {
  await requireAdmin();

  try {
    await prisma.review.update({
      where: { id },
      data: { status },
    });

    revalidateTags(CACHE_TAGS.reviews);
    return {
      success: true,
      message:
        status === "APPROVED"
          ? "Review approved and now visible on the public site."
          : status === "REJECTED"
          ? "Review rejected."
          : "Review moved to pending queue.",
    };
  } catch (err: unknown) {
    console.error("[updateReviewStatusAction]", err);
    return { success: false, error: "Failed to update review status." };
  }
}

export async function updateReviewAction(id: string, rawInput: unknown): Promise<ActionResult> {
  await requireAdmin();

  try {
    const parsed = adminUpdateReviewSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid review data." };
    }

    const { clientName, designation, company, rating, text, status } = parsed.data;

    await prisma.review.update({
      where: { id },
      data: {
        clientName,
        designation: designation || null,
        company: company || null,
        rating,
        text,
        status: status as ReviewStatus,
      },
    });

    revalidateTags(CACHE_TAGS.reviews);
    return { success: true, message: "Review updated successfully." };
  } catch (err: unknown) {
    console.error("[updateReviewAction]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update review." };
  }
}

export async function deleteReviewAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await prisma.review.delete({ where: { id } });
    revalidateTags(CACHE_TAGS.reviews);
    return { success: true, message: "Review permanently deleted." };
  } catch (err: unknown) {
    console.error("[deleteReviewAction]", err);
    return { success: false, error: "Failed to delete review." };
  }
}
