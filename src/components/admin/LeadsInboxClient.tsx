"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Inbox,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Search,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastContext";
import { updateLeadStatusAction, deleteLeadAction } from "@/actions/admin-leads";
import type { LeadStatus } from "@prisma/client";

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  projectBrief: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
}

interface LeadsInboxClientProps {
  leads: LeadItem[];
  total: number;
  page: number;
  pageSize: number;
  counts: {
    all: number;
    new: number;
    contacted: number;
    closed: number;
  };
  currentStatus: string;
  currentSearch: string;
}

export function LeadsInboxClient({
  leads,
  total,
  page,
  pageSize,
  counts,
  currentStatus = "ALL",
  currentSearch = "",
}: LeadsInboxClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [detailModalLead, setDetailModalLead] = useState<LeadItem | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<LeadItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const updateFilters = (params: Record<string, string | null>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "" || value === "ALL") {
        sp.delete(key);
      } else {
        sp.set(key, value);
      }
    });
    if (!params.page) sp.set("page", "1");
    router.push(`/admin/leads?${sp.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput.trim() || null });
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await updateLeadStatusAction(id, newStatus);
      if (res.success) {
        toast.success(res.message || "Lead status updated.");
        if (detailModalLead?.id === id) {
          setDetailModalLead({ ...detailModalLead, status: newStatus });
        }
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await deleteLeadAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message || "Lead deleted.");
        if (detailModalLead?.id === deleteTarget.id) {
          setDetailModalLead(null);
        }
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete lead.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam flex items-center gap-2.5">
            <Inbox className="h-7 w-7 text-glass" />
            Lead Inbox & Inquiries ({total})
          </h1>
          <p className="text-xs sm:text-sm text-foam/60 mt-1">
            Review incoming project inquiries, reach out via WhatsApp or phone, and manage follow-ups.
          </p>
        </div>

        {/* Server CSV Export Button */}
        <a
          href="/api/admin/leads/export"
          download
          className="btn-ghost py-2.5 px-4 text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="h-4 w-4 text-glass" />
          Export CSV (All Leads)
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foam/40" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search leads by name, phone, email, or brief keywords…"
            className="input pl-10 pr-20 py-2.5 text-xs sm:text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-swell/80 px-3 py-1.5 text-xs font-semibold text-foam hover:bg-glass hover:text-abyss transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={currentStatus}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="input py-2.5 text-xs sm:text-sm"
        >
          <option value="ALL" className="bg-abyss text-foam">
            All Statuses ({counts.all})
          </option>
          <option value="NEW" className="bg-abyss text-foam">
            New Inquiries ({counts.new})
          </option>
          <option value="CONTACTED" className="bg-abyss text-foam">
            Contacted ({counts.contacted})
          </option>
          <option value="CLOSED" className="bg-abyss text-foam">
            Closed ({counts.closed})
          </option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Inbox className="h-10 w-10 text-foam/30 mx-auto" />
            <p className="text-base font-semibold text-foam">No inquiries found</p>
            <p className="text-xs text-foam/50">
              {currentSearch
                ? `No leads matched "${currentSearch}".`
                : "Your inbox is clear! Any submissions from the contact form appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foam">
              <thead className="border-b border-foam/10 bg-abyss/40 text-[11px] font-semibold uppercase tracking-wider text-foam/60">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Contact & Quick Reply</th>
                  <th className="py-3.5 px-4">Project Brief</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foam/10">
                {leads.map((lead) => {
                  const waNumber = lead.phone.replace(/[^\d]/g, "");
                  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

                  return (
                    <tr key={lead.id} className="hover:bg-swell/20 transition-colors">
                      {/* Client Name + Source */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foam">{lead.name}</div>
                        <span className="text-[11px] text-foam/40 font-mono">
                          via {lead.source}
                        </span>
                      </td>

                      {/* Phone + WhatsApp + Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              className="font-medium text-foam/90 hover:text-glass flex items-center gap-1"
                              title="Call phone"
                            >
                              <Phone className="h-3 w-3 text-foam/40" />
                              {lead.phone}
                            </a>

                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                                title="Reply directly on WhatsApp"
                              >
                                <MessageCircle className="h-2.5 w-2.5" />
                                WhatsApp
                              </a>
                            )}
                          </div>

                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-foam/60 hover:text-foam flex items-center gap-1 truncate max-w-[200px]"
                              title="Send email"
                            >
                              <Mail className="h-3 w-3 text-foam/40 shrink-0" />
                              {lead.email}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Project Brief */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-xs text-foam/80 font-sans">
                          {lead.projectBrief}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-foam/60 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold border bg-abyss focus:outline-none cursor-pointer ${
                            lead.status === "NEW"
                              ? "border-emerald-400/40 text-emerald-300"
                              : lead.status === "CONTACTED"
                              ? "border-sky-400/40 text-sky-300"
                              : "border-foam/20 text-foam/60"
                          }`}
                        >
                          <option value="NEW" className="bg-abyss text-foam">
                            NEW
                          </option>
                          <option value="CONTACTED" className="bg-abyss text-foam">
                            CONTACTED
                          </option>
                          <option value="CLOSED" className="bg-abyss text-foam">
                            CLOSED
                          </option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailModalLead(lead)}
                            className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                            title="View full brief"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(lead)}
                            className="rounded-lg p-1.5 text-red-400/80 hover:bg-red-500/20 hover:text-red-300"
                            title="Delete lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-foam/10 px-4 py-3 bg-abyss/30 text-xs text-foam/60">
            <span>
              Showing {leads.length} of {total} inquiries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: String(page - 1) })}
                className="rounded-lg border border-foam/15 p-1.5 disabled:opacity-30 hover:bg-swell"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-semibold text-foam">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => updateFilters({ page: String(page + 1) })}
                className="rounded-lg border border-foam/15 p-1.5 disabled:opacity-30 hover:bg-swell"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Detail Modal */}
      {detailModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => setDetailModalLead(null)}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-foam/15 bg-tide p-6 shadow-2xl z-10 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foam">{detailModalLead.name}</h3>
                <span className="text-xs text-foam/50 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Received {new Date(detailModalLead.createdAt).toLocaleString()}
                </span>
              </div>

              <select
                value={detailModalLead.status}
                onChange={(e) =>
                  handleStatusChange(detailModalLead.id, e.target.value as LeadStatus)
                }
                className="rounded-xl px-3 py-1.5 text-xs font-semibold border border-foam/20 bg-abyss text-foam"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {/* Contact options */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href={`tel:${detailModalLead.phone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-foam/20 bg-swell/40 px-3.5 py-2 text-xs font-medium text-foam hover:bg-swell"
              >
                <Phone className="h-3.5 w-3.5 text-glass" />
                Call: {detailModalLead.phone}
              </a>

              {detailModalLead.phone && (
                <a
                  href={`https://wa.me/${detailModalLead.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Reply on WhatsApp
                </a>
              )}

              {detailModalLead.email && (
                <a
                  href={`mailto:${detailModalLead.email}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-foam/20 bg-swell/40 px-3.5 py-2 text-xs font-medium text-foam hover:bg-swell"
                >
                  <Mail className="h-3.5 w-3.5 text-glass" />
                  Email: {detailModalLead.email}
                </a>
              )}
            </div>

            {/* Project Brief */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foam/60">
                Project Scope / Brief:
              </span>
              <div className="rounded-xl border border-foam/10 bg-abyss/60 p-4 text-sm text-foam/90 font-sans leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {detailModalLead.projectBrief}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-foam/10">
              <button
                type="button"
                onClick={() => setDeleteTarget(detailModalLead)}
                className="text-xs font-medium text-red-400 hover:underline"
              >
                Delete this inquiry
              </button>

              <button
                type="button"
                onClick={() => setDetailModalLead(null)}
                className="rounded-xl border border-foam/20 px-4 py-2 text-xs font-medium text-foam hover:bg-swell/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Inquiry?"
        description={`Are you sure you want to delete the inquiry from "${deleteTarget?.name}"? This record will be permanently removed.`}
        confirmLabel="Delete Lead"
        isLoading={isDeleting}
      />
    </div>
  );
}
