"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastContext";
import {
  deleteModelAction,
  toggleModelFeaturedAction,
  toggleModelPublishedAction,
} from "@/actions/admin-models";

interface ModelListItem {
  id: string;
  name: string;
  slug: string;
  gender: "MALE" | "FEMALE";
  heightCm: number | null;
  coverImageId: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  photosCount: number;
  videosCount: number;
  updatedAt: string;
}

interface ModelsTableProps {
  models: ModelListItem[];
  total: number;
  page: number;
  pageSize: number;
  featuredCount: number;
  currentSearch?: string;
  currentGender?: string;
  currentFeatured?: string;
  currentPublished?: string;
}

export function ModelsTable({
  models,
  total,
  page,
  pageSize,
  featuredCount,
  currentSearch = "",
  currentGender = "ALL",
  currentFeatured = "ALL",
  currentPublished = "ALL",
}: ModelsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [deleteTarget, setDeleteTarget] = useState<ModelListItem | null>(null);
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
    // Reset to page 1 on filter changes unless page itself is changed
    if (!params.page) sp.set("page", "1");
    router.push(`/admin/models?${sp.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput.trim() || null });
  };

  const handleToggleFeatured = async (m: ModelListItem) => {
    const newFeatured = !m.isFeatured;
    const res = await toggleModelFeaturedAction(m.id, newFeatured);
    if (res.success) {
      toast.success(res.message || "Updated featured status");
      if (res.warning) toast.info(res.warning);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleTogglePublished = async (m: ModelListItem) => {
    const newPublished = !m.isPublished;
    const res = await toggleModelPublishedAction(m.id, newPublished);
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
      const res = await deleteModelAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message || "Model deleted.");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete model.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam flex items-center gap-2.5">
            <Users className="h-7 w-7 text-glass" />
            Model Roster ({total})
          </h1>
          <p className="text-xs sm:text-sm text-foam/60 mt-1">
            Manage talents, measurement specs, photo portfolios, and featured landing page status.
          </p>
        </div>

        <Link
          href="/admin/models/new"
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Talent
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foam/40" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by talent name or slug…"
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
          value={currentGender}
          onChange={(e) => updateFilters({ gender: e.target.value })}
          className="input py-2.5 text-xs sm:text-sm"
        >
          <option value="ALL" className="bg-abyss text-foam">
            All Genders
          </option>
          <option value="FEMALE" className="bg-abyss text-foam">
            Female Models
          </option>
          <option value="MALE" className="bg-abyss text-foam">
            Male Models
          </option>
        </select>

        <select
          value={currentFeatured}
          onChange={(e) => updateFilters({ featured: e.target.value })}
          className="input py-2.5 text-xs sm:text-sm"
        >
          <option value="ALL" className="bg-abyss text-foam">
            All Models
          </option>
          <option value="FEATURED" className="bg-abyss text-foam">
            Featured on Landing ({featuredCount})
          </option>
        </select>

        <select
          value={currentPublished}
          onChange={(e) => updateFilters({ published: e.target.value })}
          className="input py-2.5 text-xs sm:text-sm"
        >
          <option value="ALL" className="bg-abyss text-foam">
            All Statuses
          </option>
          <option value="PUBLISHED" className="bg-abyss text-foam">
            Published
          </option>
          <option value="DRAFT" className="bg-abyss text-foam">
            Drafts
          </option>
        </select>
      </div>

      {/* Models Table */}
      <div className="overflow-hidden rounded-2xl border border-foam/15 bg-tide/40">
        {models.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="h-10 w-10 text-foam/30 mx-auto" />
            <p className="text-base font-semibold text-foam">No models found</p>
            <p className="text-xs text-foam/60">
              Try adjusting your search criteria or create a new model.
            </p>
            <Link
              href="/admin/models/new"
              className="btn-primary inline-flex items-center gap-1.5 text-xs py-2 px-4 mt-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Model
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foam">
              <thead className="border-b border-foam/10 bg-abyss/40 text-[11px] font-semibold uppercase tracking-wider text-foam/60">
                <tr>
                  <th className="py-3.5 px-4">Talent</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4">Specs</th>
                  <th className="py-3.5 px-4">Media</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foam/10">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-swell/20 transition-colors">
                    {/* Talent Photo + Name + Slug */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-swell/60 border border-foam/10">
                          {m.coverImageId ? (
                            <Image
                              src={`/api/images/${m.coverImageId}`}
                              alt={m.name}
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
                          <Link
                            href={`/admin/models/${m.id}`}
                            className="font-semibold text-foam hover:text-glass transition-colors truncate block"
                          >
                            {m.name}
                          </Link>
                          <span className="text-xs text-foam/50 font-mono block">/{m.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-4 text-xs font-medium text-foam/80">
                      {m.gender === "FEMALE" ? "Female" : "Male"}
                    </td>

                    {/* Measurements */}
                    <td className="py-3 px-4 text-xs text-foam/70">
                      {m.heightCm ? `${m.heightCm} cm` : "—"}
                    </td>

                    {/* Media counts */}
                    <td className="py-3 px-4 text-xs text-foam/70">
                      <span>{m.photosCount} photos</span>
                      {m.videosCount > 0 && <span> • {m.videosCount} vids</span>}
                    </td>

                    {/* Featured toggle switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(m)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          m.isFeatured
                            ? "bg-glass/20 text-glass border border-glass/30 hover:bg-glass/30"
                            : "bg-foam/5 text-foam/40 border border-foam/10 hover:text-foam"
                        }`}
                        title="Toggle featured on landing page"
                      >
                        <Sparkles className="h-3 w-3" />
                        {m.isFeatured ? "Featured" : "Off"}
                      </button>
                    </td>

                    {/* Published toggle switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(m)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          m.isPublished
                            ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-400/30"
                            : "bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30"
                        }`}
                        title="Toggle published visibility"
                      >
                        {m.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/models/${m.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                          title="View public profile"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <Link
                          href={`/admin/models/${m.id}`}
                          className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                          title="Edit model"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          className="rounded-lg p-1.5 text-red-400/80 hover:bg-red-500/20 hover:text-red-300"
                          title="Delete model"
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

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-foam/10 px-4 py-3 bg-abyss/30 text-xs text-foam/60">
            <span>
              Showing {models.length} of {total} talents
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Model Profile?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will permanently remove their private records, gallery photos, and associated portfolio media.`}
        confirmLabel="Delete Model"
        isLoading={isDeleting}
      />
    </div>
  );
}
