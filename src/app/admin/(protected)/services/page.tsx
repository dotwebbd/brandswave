import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ServicesManagerClient } from "@/components/admin/ServicesManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <ServicesManagerClient services={services} />;
}
