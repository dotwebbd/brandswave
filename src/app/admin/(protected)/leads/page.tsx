import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { LeadsInboxClient } from "@/components/admin/LeadsInboxClient";
import type { Prisma, LeadStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = 15;

  const q = params.q?.trim() || "";
  const status =
    params.status && params.status !== "ALL" ? (params.status as LeadStatus) : undefined;

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { projectBrief: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [leads, total, allCount, newCount, contactedCount, closedCount] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONTACTED" } }),
    prisma.lead.count({ where: { status: "CLOSED" } }),
  ]);

  const serialized = leads.map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email,
    projectBrief: l.projectBrief,
    source: l.source,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <LeadsInboxClient
      leads={serialized}
      total={total}
      page={page}
      pageSize={pageSize}
      counts={{
        all: allCount,
        new: newCount,
        contacted: contactedCount,
        closed: closedCount,
      }}
      currentStatus={params.status || "ALL"}
      currentSearch={q}
    />
  );
}
