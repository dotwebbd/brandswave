"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, ShieldAlert, Sparkles, AlertTriangle } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MultiImageGallery, type GalleryPhotoItem } from "@/components/admin/MultiImageGallery";
import { WorkVideosManager, type ModelWorkVideoItem } from "@/components/admin/WorkVideosManager";
import { useToast } from "@/components/admin/ToastContext";
import { createModelAction, updateModelAction } from "@/actions/admin-models";

interface ModelFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    gender: "MALE" | "FEMALE";
    heightCm?: number | null;
    chestBust?: number | null;
    waist?: number | null;
    hips?: number | null;
    eyeColor?: string | null;
    hairColor?: string | null;
    bio?: string | null;
    coverImageId?: string | null;
    isFeatured: boolean;
    isPublished: boolean;
    private?: {
      phone?: string | null;
      email?: string | null;
    } | null;
    photos?: {
      imageId: string;
      sortOrder: number;
    }[];
    videos?: {
      id?: string;
      title: string;
      description?: string | null;
      youtubeUrl: string;
      sortOrder: number;
    }[];
  };
  featuredCount?: number;
}

export function ModelForm({ initialData, featuredCount = 0 }: ModelFormProps) {
  const router = useRouter();
  const toast = useToast();
  const isEditing = Boolean(initialData?.id);

  // Form states
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [gender, setGender] = useState<"MALE" | "FEMALE">(initialData?.gender || "FEMALE");
  const [heightCm, setHeightCm] = useState<string>(initialData?.heightCm ? String(initialData.heightCm) : "");
  const [chestBust, setChestBust] = useState<string>(initialData?.chestBust ? String(initialData.chestBust) : "");
  const [waist, setWaist] = useState<string>(initialData?.waist ? String(initialData.waist) : "");
  const [hips, setHips] = useState<string>(initialData?.hips ? String(initialData.hips) : "");
  const [eyeColor, setEyeColor] = useState(initialData?.eyeColor || "");
  const [hairColor, setHairColor] = useState(initialData?.hairColor || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [coverImageId, setCoverImageId] = useState<string | null>(initialData?.coverImageId || null);
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.isPublished ?? true);

  // Private section
  const [phone, setPhone] = useState(initialData?.private?.phone || "");
  const [email, setEmail] = useState(initialData?.private?.email || "");

  // Photos & Videos
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>(initialData?.photos || []);
  const [videos, setVideos] = useState<ModelWorkVideoItem[]>(initialData?.videos || []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from name unless manually modified
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited && !isEditing) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Model name is required.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        gender,
        heightCm: heightCm ? Number(heightCm) : null,
        chestBust: chestBust ? Number(chestBust) : null,
        waist: waist ? Number(waist) : null,
        hips: hips ? Number(hips) : null,
        eyeColor: eyeColor.trim() || null,
        hairColor: hairColor.trim() || null,
        bio: bio.trim() || null,
        coverImageId: coverImageId || null,
        isFeatured,
        isPublished,
        phone: phone.trim() || null,
        email: email.trim() || null,
        photos,
        videos,
      };

      const res = isEditing
        ? await updateModelAction(initialData!.id, payload)
        : await createModelAction(payload);

      if (res.success) {
        toast.success(res.message || "Model saved successfully.");
        if (res.warning) {
          toast.info(res.warning);
        }
        router.push("/admin/models");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (err: unknown) {
      console.error("[ModelForm]", err);
      toast.error("Failed to save model.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showFeaturedLimitWarning = isFeatured && (!initialData?.isFeatured || false) && featuredCount >= 12;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/models"
          className="inline-flex items-center gap-2 text-xs font-semibold text-foam/60 hover:text-foam transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Models List
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/models"
            className="rounded-xl border border-foam/20 px-4 py-2 text-xs font-medium text-foam hover:bg-swell/50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary py-2.5 px-6 text-sm font-semibold inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Model…
              </>
            ) : isEditing ? (
              "Update Model"
            ) : (
              "Create Model"
            )}
          </button>
        </div>
      </div>

      {/* Basic Profile Card */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foam border-b border-foam/10 pb-3">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Zara Ahmed"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManuallyEdited(true);
              }}
              placeholder="zara-ahmed"
              className="input font-mono"
            />
            <span className="text-[11px] text-foam/40">
              Will be accessible at: /models/{slug || "slug"}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Gender *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE")}
              className="input"
            >
              <option value="FEMALE" className="bg-abyss text-foam">
                Female
              </option>
              <option value="MALE" className="bg-abyss text-foam">
                Male
              </option>
            </select>
          </div>

          <div className="flex items-center gap-6 pt-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
              />
              <span className="text-sm font-medium text-foam">Published (Visible to public)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
              />
              <span className="text-sm font-medium text-foam flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-glass" />
                Featured on landing page
              </span>
            </label>
          </div>
        </div>

        {/* Soft limit warning for featured */}
        {showFeaturedLimitWarning && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Notice:</strong> {featuredCount} models are currently featured. The recommended
              soft limit is 12 models to ensure optimal landing page layout and performance.
            </div>
          </div>
        )}

        <div className="pt-2">
          <ImageUploadField
            label="Cover Portrait Photo"
            value={coverImageId}
            onChange={(id) => setCoverImageId(id)}
            aspectRatio="portrait"
            helperText="Main portrait card shown on public listings. JPEG/PNG/WebP."
          />
        </div>
      </div>

      {/* Measurements Card */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foam border-b border-foam/10 pb-3">
          Physical Specifications & Bio
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 178"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Chest/Bust (cm)
            </label>
            <input
              type="number"
              value={chestBust}
              onChange={(e) => setChestBust(e.target.value)}
              placeholder="e.g. 86"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Waist (cm)
            </label>
            <input
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="e.g. 62"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Hips (cm)
            </label>
            <input
              type="number"
              value={hips}
              onChange={(e) => setHips(e.target.value)}
              placeholder="e.g. 90"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Eye Color
            </label>
            <input
              type="text"
              value={eyeColor}
              onChange={(e) => setEyeColor(e.target.value)}
              placeholder="e.g. Dark Brown"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Hair Color
            </label>
            <input
              type="text"
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
              placeholder="e.g. Black"
              className="input"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
            Biography & Editorial Experience
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Editorial background, brand campaigns, runway credits..."
            className="input resize-none"
          />
        </div>
      </div>

      {/* Private Admin Section */}
      <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-amber-500/20 p-1.5 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Private Section: Admin Only
            </h3>
            <p className="text-xs text-amber-200/70">
              Contact information is strictly isolated in <code>ModelPrivate</code>. It is never
              included in public APIs, page HTML sources, or search engines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Direct Phone / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1700 000000"
              className="input bg-abyss/80 border-amber-500/20 focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
              Direct Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="model.private@domain.com"
              className="input bg-abyss/80 border-amber-500/20 focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 p-6">
        <MultiImageGallery photos={photos} onChange={setPhotos} />
      </div>

      {/* Work Videos Section */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 p-6">
        <WorkVideosManager videos={videos} onChange={setVideos} />
      </div>

      {/* Bottom Submit Bar */}
      <div className="flex justify-end gap-3 pt-4 border-t border-foam/10">
        <Link
          href="/admin/models"
          className="rounded-xl border border-foam/20 px-5 py-2.5 text-sm font-medium text-foam hover:bg-swell/50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary py-2.5 px-6 text-sm font-semibold inline-flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Model…
            </>
          ) : isEditing ? (
            "Update Model"
          ) : (
            "Create Model"
          )}
        </button>
      </div>
    </form>
  );
}
