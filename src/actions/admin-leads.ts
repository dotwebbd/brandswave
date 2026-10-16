"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";
import type { ActionResult } from "@/actions/admin-models";

export async function updateLeadStatusAction(id: string, status: LeadStatus): Promise<ActionResult> {
  await requireAdmin();

  try {
    await prisma.lead.update({
      where: { id },
      data: { status },
    });

    return { success: true, message: `Lead status updated to ${status}.` };
  } catch (err: unknown) {
    console.error("[updateLeadStatusAction]", err);
    return { success: false, error: "Failed to update lead status." };
  }
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await prisma.lead.delete({ where: { id } });
    return { success: true, message: "Lead inquiry deleted." };
  } catch (err: unknown) {
    console.error("[deleteLeadAction]", err);
    return { success: false, error: "Failed to delete lead." };
  }
}
