import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { AboutManagerClient } from "@/components/admin/AboutManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  await requireAdmin();

  const about = await prisma.aboutContent.findUnique({
    where: { id: 1 },
  });

  return (
    <AboutManagerClient
      initialVision={about?.vision || ""}
      initialMission={about?.mission || ""}
    />
  );
}
