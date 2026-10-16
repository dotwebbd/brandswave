import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Video,
  Sparkles,
  Star,
  Inbox,
  ArrowRight,
  PlusCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    modelsCount,
    activeModelsCount,
    videosCount,
    servicesCount,
    pendingReviewsCount,
    newLeadsCount,
    recentLeads,
  ] = await Promise.all([
    prisma.model.count().catch(() => 0),
    prisma.model.count({ where: { isPublished: true } }).catch(() => 0),
    prisma.video.count().catch(() => 0),
    prisma.service.count().catch(() => 0),
    prisma.review.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.lead.count({ where: { status: "NEW" } }).catch(() => 0),
    prisma.lead
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          projectBrief: true,
          status: true,
          createdAt: true,
        },
      })
      .catch(() => []),
  ]);

  const stats = [
    {
      label: "Total Models",
      value: modelsCount,
      subtext: `${activeModelsCount} published`,
      href: "/admin/models",
      icon: Users,
      color: "text-glass",
      bg: "bg-glass/10 border-glass/20",
    },
    {
      label: "Video Portfolio",
      value: videosCount,
      subtext: "TVCs & Commercials",
      href: "/admin/videos",
      icon: Video,
      color: "text-sky-400",
      bg: "bg-sky-400/10 border-sky-400/20",
    },
    {
      label: "Agency Services",
      value: servicesCount,
      subtext: "Published offerings",
      href: "/admin/services",
      icon: Sparkles,
      color: "text-sand",
      bg: "bg-sand/10 border-sand/20",
    },
    {
      label: "Pending Reviews",
      value: pendingReviewsCount,
      subtext: pendingReviewsCount > 0 ? "Requires moderation" : "All caught up",
      href: "/admin/reviews",
      icon: Star,
      color: pendingReviewsCount > 0 ? "text-amber-400" : "text-foam/60",
      bg: pendingReviewsCount > 0 ? "bg-amber-400/10 border-amber-400/30" : "bg-swell/30 border-foam/10",
      alert: pendingReviewsCount > 0,
    },
    {
      label: "New Leads",
      value: newLeadsCount,
      subtext: newLeadsCount > 0 ? "Awaiting response" : "No pending leads",
      href: "/admin/leads",
      icon: Inbox,
      color: newLeadsCount > 0 ? "text-emerald-400" : "text-foam/60",
      bg: newLeadsCount > 0 ? "bg-emerald-400/10 border-emerald-400/30" : "bg-swell/30 border-foam/10",
      alert: newLeadsCount > 0,
    },
  ];

  const quickLinks = [
    { label: "Add New Model", href: "/admin/models/new", icon: PlusCircle, desc: "Create profile with photos and measurements" },
    { label: "Add Portfolio Video", href: "/admin/videos", icon: Video, desc: "Add YouTube TVC or Commercial reel" },
    { label: "Manage Services", href: "/admin/services", icon: Sparkles, desc: "Update agency service catalog and pricing" },
    { label: "Moderate Reviews", href: "/admin/reviews", icon: Star, desc: "Approve or edit client testimonials" },
    { label: "Inbox & Inquiries", href: "/admin/leads", icon: Inbox, desc: "Follow up with clients and export CSV" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foam">Dashboard</h1>
          <p className="text-sm text-foam/60 mt-1">
            Overview of BrandsWave roster, portfolio, inquiries, and site content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/models/new"
            className="btn-primary py-2.5 px-4 text-xs font-semibold shadow-sm inline-flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Model
          </Link>
          <Link
            href="/admin/leads"
            className="btn-ghost py-2.5 px-4 text-xs font-semibold inline-flex items-center gap-2"
          >
            <Inbox className="h-4 w-4" />
            View Leads
          </Link>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${s.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-foam/70">
                  {s.label}
                </span>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>

              <div className="mt-4">
                <div className="text-3xl font-bold tracking-tight text-foam">{s.value}</div>
                <div className="text-xs text-foam/60 mt-1 flex items-center gap-1.5">
                  {s.alert && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                  {s.subtext}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Quick Actions + Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foam flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-glass" />
              Quick Actions
            </h2>
          </div>

          <div className="space-y-2.5">
            {quickLinks.map((ql) => {
              const Icon = ql.icon;
              return (
                <Link
                  key={ql.label}
                  href={ql.href}
                  className="group flex items-center justify-between rounded-2xl border border-foam/10 bg-tide/50 p-4 transition-all hover:bg-swell/40 hover:border-foam/20"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl bg-swell/60 p-2.5 text-glass group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foam group-hover:text-glass transition-colors">
                        {ql.label}
                      </h3>
                      <p className="text-xs text-foam/50">{ql.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foam/40 group-hover:text-glass group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Inquiries (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foam flex items-center gap-2">
              <Clock className="h-4 w-4 text-sand" />
              Recent Website Inquiries
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-glass hover:underline inline-flex items-center gap-1"
            >
              View all leads
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-foam/10 bg-tide/40 overflow-hidden">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-sm text-foam/60">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-foam/10">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-swell/20 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-foam text-sm truncate">{lead.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            lead.status === "NEW"
                              ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                              : lead.status === "CONTACTED"
                              ? "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                              : "bg-foam/10 text-foam/60 border border-foam/15"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-foam/50 flex items-center gap-3">
                        <span>{lead.phone}</span>
                        {lead.email && <span>• {lead.email}</span>}
                        <span>• {new Date(lead.createdAt).toLocaleDateString()}</span>
                      </p>
                      <p className="text-xs text-foam/70 line-clamp-1 mt-1 font-sans">
                        &ldquo;{lead.projectBrief}&rdquo;
                      </p>
                    </div>

                    <Link
                      href="/admin/leads"
                      className="shrink-0 text-xs font-medium text-glass hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                    >
                      Respond
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
