import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  const [pendingReviewsCount, newLeadsCount] = await Promise.all([
    prisma.review.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.lead.count({ where: { status: "NEW" } }).catch(() => 0),
  ]);

  return (
    <AdminShell
      userEmail={session.email}
      pendingReviewsCount={pendingReviewsCount}
      newLeadsCount={newLeadsCount}
    >
      {children}
    </AdminShell>
  );
}
