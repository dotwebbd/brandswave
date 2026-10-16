"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Clock,
  MessageSquare,
} from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastContext";
import {
  updateReviewStatusAction,
  updateReviewAction,
  deleteReviewAction,
} from "@/actions/admin-reviews";
import type { ReviewStatus } from "@prisma/client";

interface ReviewItem {
  id: string;
  clientName: string;
  designation: string | null;
  company: string | null;
  rating: number;
  text: string;
  status: ReviewStatus;
  createdAt: string;
}

interface ReviewsManagerClientProps {
  reviews: ReviewItem[];
  counts: {
    pending: number;
    approved: number;
    rejected: number;
  };
  activeTab: ReviewStatus;
}

export function ReviewsManagerClient({
  reviews,
  counts,
  activeTab,
}: ReviewsManagerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  // Edit form states
  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<ReviewStatus>("PENDING");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const switchTab = (tab: ReviewStatus) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", tab);
    router.push(`/admin/reviews?${sp.toString()}`);
  };

  const handleStatusChange = async (id: string, newStatus: ReviewStatus) => {
    try {
      const res = await updateReviewStatusAction(id, newStatus);
      if (res.success) {
        toast.success(res.message || "Review status updated.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const openEdit = (r: ReviewItem) => {
    setEditingReview(r);
    setClientName(r.clientName);
    setDesignation(r.designation || "");
    setCompany(r.company || "");
    setRating(r.rating);
    setText(r.text);
    setStatus(r.status);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    if (!clientName.trim()) {
      toast.error("Client name is required.");
      return;
    }
    if (!text.trim()) {
      toast.error("Review text is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateReviewAction(editingReview.id, {
        clientName: clientName.trim(),
        designation: designation.trim() || null,
        company: company.trim() || null,
        rating: Number(rating),
        text: text.trim(),
        status,
      });

      if (res.success) {
        toast.success(res.message || "Review updated.");
        setEditModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to update review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await deleteReviewAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message || "Review permanently deleted.");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam flex items-center gap-2.5">
          <Star className="h-7 w-7 text-amber-400 fill-amber-400/20" />
          Review & Testimonial Manager
        </h1>
        <p className="text-xs sm:text-sm text-foam/60 mt-1">
          Moderate incoming client testimonials. Only Approved reviews appear publicly on the website.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-foam/15 gap-2">
        <button
          type="button"
          onClick={() => switchTab("PENDING")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "PENDING"
              ? "border-amber-400 text-amber-300"
              : "border-transparent text-foam/60 hover:text-foam"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Pending Queue</span>
          {counts.pending > 0 && (
            <span className="rounded-full bg-amber-400/20 text-amber-300 px-2 py-0.5 text-[11px] font-bold">
              {counts.pending}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => switchTab("APPROVED")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "APPROVED"
              ? "border-glass text-glass"
              : "border-transparent text-foam/60 hover:text-foam"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Approved Public</span>
          <span className="rounded-full bg-glass/20 text-glass px-2 py-0.5 text-[11px] font-bold">
            {counts.approved}
          </span>
        </button>

        <button
          type="button"
          onClick={() => switchTab("REJECTED")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "REJECTED"
              ? "border-red-400 text-red-300"
              : "border-transparent text-foam/60 hover:text-foam"
          }`}
        >
          <XCircle className="h-4 w-4" />
          <span>Rejected</span>
          <span className="rounded-full bg-foam/10 text-foam/60 px-2 py-0.5 text-[11px] font-bold">
            {counts.rejected}
          </span>
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-foam/15 bg-tide/30 p-12 text-center space-y-2">
          <MessageSquare className="h-10 w-10 text-foam/30 mx-auto" />
          <p className="text-base font-semibold text-foam">
            No {activeTab.toLowerCase()} reviews
          </p>
          <p className="text-xs text-foam/50">
            {activeTab === "PENDING"
              ? "All caught up! No user reviews are awaiting moderation."
              : `No reviews currently marked as ${activeTab.toLowerCase()}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-foam/15 bg-tide/40 p-5 space-y-3 hover:border-foam/25 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-foam text-base">{r.clientName}</span>
                  {(r.designation || r.company) && (
                    <span className="text-xs text-foam/60 flex items-center gap-1.5">
                      • {r.designation} {r.company ? `@ ${r.company}` : ""}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating ? "fill-amber-400 text-amber-400" : "text-foam/20"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-foam/40">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm text-foam/85 leading-relaxed bg-abyss/40 rounded-xl p-3.5 border border-foam/10 font-sans">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-foam/10">
                <div className="flex items-center gap-2">
                  {r.status !== "APPROVED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(r.id, "APPROVED")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-glass/20 px-3.5 py-1.5 text-xs font-semibold text-glass hover:bg-glass hover:text-abyss transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve & Publish
                    </button>
                  )}

                  {r.status !== "REJECTED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(r.id, "REJECTED")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  )}

                  {r.status !== "PENDING" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(r.id, "PENDING")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-swell/50 px-3 py-1.5 text-xs font-medium text-foam/80 hover:bg-swell transition-colors"
                    >
                      Move to Pending
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    className="inline-flex items-center gap-1 rounded-xl border border-foam/15 px-3 py-1.5 text-xs font-medium text-foam hover:bg-swell/50 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(r)}
                    className="rounded-xl p-1.5 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {editModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setEditModalOpen(false)}
          />

          <form
            onSubmit={handleSaveEdit}
            className="relative w-full max-w-lg rounded-2xl border border-foam/15 bg-tide p-6 shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-lg font-semibold text-foam">Edit Testimonial</h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                  Client / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Marketing Director"
                    className="input py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Company / Brand
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Footwear"
                    className="input py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="input py-2 text-sm"
                  >
                    <option value={5} className="bg-abyss text-foam">
                      5 Stars ★★★★★
                    </option>
                    <option value={4} className="bg-abyss text-foam">
                      4 Stars ★★★★
                    </option>
                    <option value={3} className="bg-abyss text-foam">
                      3 Stars ★★★
                    </option>
                    <option value={2} className="bg-abyss text-foam">
                      2 Stars ★★
                    </option>
                    <option value={1} className="bg-abyss text-foam">
                      1 Star ★
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                    className="input py-2 text-sm"
                  >
                    <option value="APPROVED" className="bg-abyss text-foam">
                      Approved (Public)
                    </option>
                    <option value="PENDING" className="bg-abyss text-foam">
                      Pending Moderation
                    </option>
                    <option value="REJECTED" className="bg-abyss text-foam">
                      Rejected (Hidden)
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                  Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="input resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-foam/10">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setEditModalOpen(false)}
                className="rounded-xl border border-foam/20 px-4 py-2 text-sm text-foam hover:bg-swell/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary py-2 px-5 text-sm"
              >
                {isSubmitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Review Permanently?"
        description={`Are you sure you want to delete the testimonial from "${deleteTarget?.clientName}"? This action cannot be undone.`}
        confirmLabel="Delete Review"
        isLoading={isDeleting}
      />
    </div>
  );
}
