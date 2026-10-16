import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { TeamManagerClient } from "@/components/admin/TeamManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  await requireAdmin();

  const members = await prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <TeamManagerClient members={members} />;
}
