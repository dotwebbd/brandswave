import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Helper to escape CSV cell contents
  const escapeCsv = (val: string | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const clean = String(val).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const header = ["ID", "Name", "Phone", "Email", "Project Brief", "Source", "Status", "Date"];
  const rows = leads.map((l) => [
    escapeCsv(l.id),
    escapeCsv(l.name),
    escapeCsv(l.phone),
    escapeCsv(l.email),
    escapeCsv(l.projectBrief),
    escapeCsv(l.source),
    escapeCsv(l.status),
    escapeCsv(l.createdAt.toISOString()),
  ]);

  const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const today = new Date().toISOString().split("T")[0];
  const filename = `brandswave-leads-${today}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
