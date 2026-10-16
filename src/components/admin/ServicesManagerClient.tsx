"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Eye,
  Tag,
  DollarSign,
} from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/ToastContext";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  toggleServicePublishedAction,
} from "@/actions/admin-services";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  hidePrice: boolean;
  sortOrder: number;
  isPublished: boolean;
}

interface ServicesManagerClientProps {
  services: ServiceItem[];
}

export function ServicesManagerClient({ services }: ServicesManagerClientProps) {
  const router = useRouter();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [hidePrice, setHidePrice] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAdd = () => {
    setEditingService(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setImageId(null);
    setPriceMin("");
    setPriceMax("");
    setHidePrice(false);
    setSortOrder(services.length);
    setIsPublished(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (s: ServiceItem) => {
    setEditingService(s);
    setTitle(s.title);
    setSlug(s.slug);
    setDescription(s.description);
    setImageId(s.imageId);
    setPriceMin(s.priceMin !== null ? String(s.priceMin) : "");
    setPriceMax(s.priceMax !== null ? String(s.priceMax) : "");
    setHidePrice(s.hidePrice);
    setSortOrder(s.sortOrder);
    setIsPublished(s.isPublished);
    setFormError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingService) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const renderPriceBadge = (
    minVal: string | number | null,
    maxVal: string | number | null,
    hidden: boolean
  ) => {
    if (hidden) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-sand/30 bg-sand/15 px-3 py-1 text-xs font-semibold text-sand">
          <Tag className="h-3 w-3" />
          Price on Request
        </span>
      );
    }
    const numMin = minVal ? Number(minVal) : null;
    const numMax = maxVal ? Number(maxVal) : null;

    if (numMin && numMax) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-glass/30 bg-glass/15 px-3 py-1 text-xs font-semibold text-glass">
          ৳{numMin.toLocaleString()} – ৳{numMax.toLocaleString()}
        </span>
      );
    }
    if (numMin) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-glass/30 bg-glass/15 px-3 py-1 text-xs font-semibold text-glass">
          Starting at ৳{numMin.toLocaleString()}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-foam/20 bg-foam/10 px-3 py-1 text-xs font-semibold text-foam/70">
        Custom Quote
      </span>
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!slug.trim()) {
      setFormError("Slug is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        imageId,
        priceMin: priceMin ? Number(priceMin) : null,
        priceMax: priceMax ? Number(priceMax) : null,
        hidePrice,
        sortOrder: Number(sortOrder) || 0,
        isPublished,
      };

      const res = editingService
        ? await updateServiceAction(editingService.id, payload)
        : await createServiceAction(payload);

      if (res.success) {
        toast.success(res.message || "Service saved.");
        setModalOpen(false);
        router.refresh();
      } else {
        setFormError(res.error);
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to save service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublished = async (s: ServiceItem) => {
    const newPublished = !s.isPublished;
    const res = await toggleServicePublishedAction(s.id, newPublished);
    if (res.success) {
      toast.success(res.message || "Updated published status");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await deleteServiceAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message || "Service deleted.");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete service.");
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
            <Sparkles className="h-7 w-7 text-glass" />
            Agency Services ({services.length})
          </h1>
          <p className="text-xs sm:text-sm text-foam/60 mt-1">
            Configure offered commercial services, promotional packages, and live pricing badges.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Sparkles className="h-10 w-10 text-foam/30 mx-auto" />
            <p className="text-base font-semibold text-foam">No services created yet</p>
            <p className="text-xs text-foam/60">
              Add talent casting, TVC production, or photography services.
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="btn-primary inline-flex items-center gap-1.5 text-xs py-2 px-4 mt-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Service
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foam">
              <thead className="border-b border-foam/10 bg-abyss/40 text-[11px] font-semibold uppercase tracking-wider text-foam/60">
                <tr>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Pricing Badge</th>
                  <th className="py-3.5 px-4 text-center">Order</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foam/10">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-swell/20 transition-colors">
                    {/* Image + Title + Slug */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-abyss border border-foam/10">
                          {s.imageId ? (
                            <Image
                              src={`/api/images/${s.imageId}`}
                              alt={s.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-foam/40">
                              No pic
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foam truncate block">{s.title}</span>
                          <span className="text-xs text-foam/50 font-mono block">/{s.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Price Badge */}
                    <td className="py-3 px-4">
                      {renderPriceBadge(s.priceMin, s.priceMax, s.hidePrice)}
                    </td>

                    {/* Sort Order */}
                    <td className="py-3 px-4 text-center text-xs font-mono text-foam/70">
                      {s.sortOrder}
                    </td>

                    {/* Published status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(s)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          s.isPublished
                            ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-400/30"
                            : "bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30"
                        }`}
                        title="Toggle published status"
                      >
                        {s.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/services`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                          title="View on public site"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                          title="Edit service"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          className="rounded-lg p-1.5 text-red-400/80 hover:bg-red-500/20 hover:text-red-300"
                          title="Delete service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setModalOpen(false)}
          />

          <form
            onSubmit={handleSave}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-foam/15 bg-tide p-6 shadow-2xl z-10 space-y-5"
          >
            <h3 className="text-lg font-semibold text-foam">
              {editingService ? "Edit Service" : "Add Service"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. TVC & Commercial Production"
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="tvc-commercial-production"
                    className="input font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                  Service Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline scope of deliverables, studio equipment, directing, and post-production..."
                  className="input resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="pt-1">
                <ImageUploadField
                  label="Service Banner / Showcase Image"
                  value={imageId}
                  onChange={(id) => setImageId(id)}
                  aspectRatio="landscape"
                  helperText="Service cover card image. JPEG/PNG/WebP."
                />
              </div>

              {/* Pricing Section with Live Badge Preview */}
              <div className="rounded-xl border border-foam/15 bg-abyss/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-glass" />
                    Pricing & Estimates
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hidePrice}
                      onChange={(e) => setHidePrice(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
                    />
                    <span className="text-xs font-medium text-foam/70">
                      Hide Price (&quot;Price on Request&quot;)
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-foam/60">Minimum Price (BDT)</label>
                    <input
                      type="number"
                      disabled={hidePrice}
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="e.g. 50000"
                      className="input py-2 text-xs disabled:opacity-40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-foam/60">Maximum Price (BDT, optional)</label>
                    <input
                      type="number"
                      disabled={hidePrice}
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="e.g. 150000"
                      className="input py-2 text-xs disabled:opacity-40"
                    />
                  </div>
                </div>

                {/* Live Badge Preview */}
                <div className="pt-2 border-t border-foam/10 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-foam/50 font-medium">
                    Live Price Badge Preview:
                  </span>
                  <div>{renderPriceBadge(priceMin, priceMax, hidePrice)}</div>
                </div>
              </div>

              {/* Order & Publish */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="input"
                  />
                  <span className="text-[11px] text-foam/40">Lower numbers appear first</span>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-4 w-4 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
                    />
                    <span className="text-sm font-medium text-foam">Published to site</span>
                  </label>
                </div>
              </div>

              {formError && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-foam/10">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-foam/20 px-4 py-2 text-sm text-foam hover:bg-swell/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary py-2 px-5 text-sm"
              >
                {isSubmitting ? "Saving Service…" : editingService ? "Update Service" : "Add Service"}
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
        title="Delete Agency Service?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This service and its pricing information will be removed.`}
        confirmLabel="Delete Service"
        isLoading={isDeleting}
      />
    </div>
  );
}
