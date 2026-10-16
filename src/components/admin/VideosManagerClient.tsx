"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Video as VideoIcon,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  AlertTriangle,
  Play,
} from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastContext";
import {
  createVideoAction,
  updateVideoAction,
  deleteVideoAction,
  toggleVideoFeaturedAction,
} from "@/actions/admin-videos";
import { extractYouTubeId, youtubeThumbnail, youtubeEmbedUrl } from "@/lib/youtube";
import type { VideoCategory, VideoOrientation } from "@prisma/client";

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  category: VideoCategory;
  orientation: VideoOrientation;
  isFeatured: boolean;
  createdAt: string;
}

interface VideosManagerClientProps {
  videos: VideoItem[];
  total: number;
  page: number;
  pageSize: number;
  featuredCount: number;
  currentCategory?: string;
  currentOrientation?: string;
  currentFeatured?: string;
}

export function VideosManagerClient({
  videos,
  total,
  page,
  pageSize,
  featuredCount,
  currentCategory = "ALL",
  currentOrientation = "ALL",
  currentFeatured = "ALL",
}: VideosManagerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState<VideoCategory>("COMMERCIAL");
  const [orientation, setOrientation] = useState<VideoOrientation>("LANDSCAPE_16_9");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedId = extractYouTubeId(youtubeUrl);
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
    router.push(`/admin/videos?${sp.toString()}`);
  };

  const openAdd = () => {
    setEditingVideo(null);
    setTitle("");
    setYoutubeUrl("");
    setCategory("COMMERCIAL");
    setOrientation("LANDSCAPE_16_9");
    setIsFeatured(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (v: VideoItem) => {
    setEditingVideo(v);
    setTitle(v.title);
    setYoutubeUrl(v.youtubeId);
    setCategory(v.category);
    setOrientation(v.orientation);
    setIsFeatured(v.isFeatured);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    const ytId = extractYouTubeId(youtubeUrl);
    if (!ytId) {
      setFormError("Please enter a valid YouTube video URL or 11-character video ID.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        youtubeUrl: youtubeUrl.trim(),
        category,
        orientation,
        isFeatured,
      };

      const res = editingVideo
        ? await updateVideoAction(editingVideo.id, payload)
        : await createVideoAction(payload);

      if (res.success) {
        toast.success(res.message || "Video saved successfully.");
        if (res.warning) toast.info(res.warning);
        setModalOpen(false);
        router.refresh();
      } else {
        setFormError(res.error);
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to save video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (v: VideoItem) => {
    const newFeatured = !v.isFeatured;
    const res = await toggleVideoFeaturedAction(v.id, newFeatured);
    if (res.success) {
      toast.success(res.message || "Updated featured status");
      if (res.warning) toast.info(res.warning);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await deleteVideoAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message || "Video deleted.");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete video.");
    } finally {
      setIsDeleting(false);
    }
  };

  const showFeaturedWarning = isFeatured && (!editingVideo?.isFeatured || false) && featuredCount >= 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam flex items-center gap-2.5">
            <VideoIcon className="h-7 w-7 text-glass" />
            Video Portfolio ({total})
          </h1>
          <p className="text-xs sm:text-sm text-foam/60 mt-1">
            Manage TVCs, commercials, fashion shoot films, and social media reels.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Video
        </button>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={currentCategory}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="input py-2.5 text-xs sm:text-sm"
        >
          <option value="ALL" className="bg-abyss text-foam">
            All Categories
          </option>
          <option value="TVC" className="bg-abyss text-foam">
            TVC
          </option>
          <option value="COMMERCIAL" className="bg-abyss text-foam">
            Commercial
          </option>
          <option value="FASHION_SHOOT" className="bg-abyss text-foam">
            Fashion Shoot
          </option>
          <option value="SOCIAL_MEDIA" className="bg-abyss text-foam">
            Social Media Reel
          </option>
          <option value="OTHER" className="bg-abyss text-foam">
            Other
          </option>
        </select>

        <select
          value={currentOrientation}
          onChange={(e) => updateFilters({ orientation: e.target.value })}
          className="input py-2.5 text-xs sm:text-sm"
        >
          <option value="ALL" className="bg-abyss text-foam">
            All Orientations
          </option>
          <option value="LANDSCAPE_16_9" className="bg-abyss text-foam">
            Landscape (16:9)
          </option>
          <option value="VERTICAL_9_16" className="bg-abyss text-foam">
            Vertical / Shorts (9:16)
          </option>
        </select>

        <select
          value={currentFeatured}
          onChange={(e) => updateFilters({ featured: e.target.value })}
          className="input py-2.5 text-xs sm:text-sm"
        >
          <option value="ALL" className="bg-abyss text-foam">
            All Videos
          </option>
          <option value="FEATURED" className="bg-abyss text-foam">
            Featured on Landing ({featuredCount})
          </option>
        </select>
      </div>

      {/* Videos Grid / Table */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 overflow-hidden">
        {videos.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <VideoIcon className="h-10 w-10 text-foam/30 mx-auto" />
            <p className="text-base font-semibold text-foam">No portfolio videos found</p>
            <p className="text-xs text-foam/60">
              Add your first YouTube TVC or brand commercial.
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="btn-primary inline-flex items-center gap-1.5 text-xs py-2 px-4 mt-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Video
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foam">
              <thead className="border-b border-foam/10 bg-abyss/40 text-[11px] font-semibold uppercase tracking-wider text-foam/60">
                <tr>
                  <th className="py-3.5 px-4">Video</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foam/10">
                {videos.map((v) => (
                  <tr key={v.id} className="hover:bg-swell/20 transition-colors">
                    {/* Thumbnail + Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-abyss border border-foam/10">
                          <Image
                            src={youtubeThumbnail(v.youtubeId)}
                            alt={v.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-abyss/30">
                            <Play className="h-4 w-4 text-foam fill-foam/60" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foam truncate block">{v.title}</span>
                          <span className="text-xs text-foam/50 font-mono block">
                            ID: {v.youtubeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-xs font-medium text-foam/80">
                      <span className="rounded-md bg-swell/60 px-2 py-1 text-[11px]">
                        {v.category.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Format */}
                    <td className="py-3 px-4 text-xs text-foam/70">
                      {v.orientation === "LANDSCAPE_16_9" ? "16:9 Landscape" : "9:16 Vertical"}
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(v)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          v.isFeatured
                            ? "bg-glass/20 text-glass border border-glass/30 hover:bg-glass/30"
                            : "bg-foam/5 text-foam/40 border border-foam/10 hover:text-foam"
                        }`}
                        title="Toggle featured on landing page"
                      >
                        <Sparkles className="h-3 w-3" />
                        {v.isFeatured ? "Featured" : "Off"}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-xs text-foam/60">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                          title="Watch on YouTube"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => openEdit(v)}
                          className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                          title="Edit video"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(v)}
                          className="rounded-lg p-1.5 text-red-400/80 hover:bg-red-500/20 hover:text-red-300"
                          title="Delete video"
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
              Showing {videos.length} of {total} videos
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

      {/* Add / Edit Video Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setModalOpen(false)}
          />

          <form
            onSubmit={handleSave}
            className="relative w-full max-w-lg rounded-2xl border border-foam/15 bg-tide p-6 shadow-2xl z-10 space-y-5"
          >
            <h3 className="text-lg font-semibold text-foam">
              {editingVideo ? "Edit Portfolio Video" : "Add Portfolio Video"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grameenphone 5G Commercial"
                  className="input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                  YouTube URL or ID *
                </label>
                <input
                  type="text"
                  required
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or shorts URL"
                  className="input"
                />
                {parsedId ? (
                  <p className="text-xs text-glass flex items-center gap-1 mt-1">
                    <Check className="h-3.5 w-3.5" />
                    Valid YouTube ID extracted: {parsedId}
                  </p>
                ) : youtubeUrl ? (
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Checking YouTube URL/ID…
                  </p>
                ) : null}
              </div>

              {/* Live Preview Embed */}
              {parsedId && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foam/60">
                    Live Embed Preview
                  </label>
                  <div className={`overflow-hidden rounded-xl border border-foam/15 bg-abyss ${orientation === "VERTICAL_9_16" ? "aspect-[9/16] max-w-[200px] mx-auto" : "aspect-video w-full"}`}>
                    <iframe
                      src={youtubeEmbedUrl(parsedId)}
                      title="YouTube Live Preview"
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VideoCategory)}
                    className="input"
                  >
                    <option value="COMMERCIAL" className="bg-abyss text-foam">
                      Commercial
                    </option>
                    <option value="TVC" className="bg-abyss text-foam">
                      TVC
                    </option>
                    <option value="FASHION_SHOOT" className="bg-abyss text-foam">
                      Fashion Shoot
                    </option>
                    <option value="SOCIAL_MEDIA" className="bg-abyss text-foam">
                      Social Media Reel
                    </option>
                    <option value="OTHER" className="bg-abyss text-foam">
                      Other
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as VideoOrientation)}
                    className="input"
                  >
                    <option value="LANDSCAPE_16_9" className="bg-abyss text-foam">
                      Landscape 16:9
                    </option>
                    <option value="VERTICAL_9_16" className="bg-abyss text-foam">
                      Reels/Shorts 9:16
                    </option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
                  />
                  <span className="text-sm font-medium text-foam flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-glass" />
                    Feature this video on the landing page showcase
                  </span>
                </label>
              </div>

              {/* Warning for featured soft limit */}
              {showFeaturedWarning && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Notice:</strong> {featuredCount} videos are already featured. The recommended
                    soft limit is 10-12 videos to keep the landing page video reel responsive and fast.
                  </div>
                </div>
              )}

              {formError && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                {isSubmitting ? "Saving Video…" : editingVideo ? "Update Video" : "Add Video"}
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
        title="Delete Portfolio Video?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This video will be removed from all public listings and landing page showcases.`}
        confirmLabel="Delete Video"
        isLoading={isDeleting}
      />
    </div>
  );
}
