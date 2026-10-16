import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ReviewsManagerClient } from "@/components/admin/ReviewsManagerClient";
import type { ReviewStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const validTabs: ReviewStatus[] = ["PENDING", "APPROVED", "REJECTED"];
  const activeTab: ReviewStatus = validTabs.includes(params.tab as ReviewStatus)
    ? (params.tab as ReviewStatus)
    : "PENDING";

  const [reviews, pendingCount, approvedCount, rejectedCount] = await Promise.all([
    prisma.review.findMany({
      where: { status: activeTab },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { status: "APPROVED" } }),
    prisma.review.count({ where: { status: "REJECTED" } }),
  ]);

  const serialized = reviews.map((r) => ({
    id: r.id,
    clientName: r.clientName,
    designation: r.designation,
    company: r.company,
    rating: r.rating,
    text: r.text,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <ReviewsManagerClient
      reviews={serialized}
      counts={{
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      }}
      activeTab={activeTab}
    />
  );
}
