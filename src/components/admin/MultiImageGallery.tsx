"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { compressImageClient } from "@/lib/images/compress-client";
import { uploadImageAction } from "@/actions/images";
import { useToast } from "@/components/admin/ToastContext";

export interface GalleryPhotoItem {
  imageId: string;
  sortOrder: number;
}

interface MultiImageGalleryProps {
  photos: GalleryPhotoItem[];
  onChange: (photos: GalleryPhotoItem[]) => void;
}

export function MultiImageGallery({ photos, onChange }: MultiImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      const newItems: GalleryPhotoItem[] = [...photos];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Processing ${i + 1} of ${files.length}…`);

        try {
          const compressed = await compressImageClient(file, { maxWidth: 1600, quality: 0.85 });
          const fd = new FormData();
          fd.append("file", compressed);

          const res = await uploadImageAction(fd);
          if (res.ok) {
            newItems.push({
              imageId: res.id,
              sortOrder: newItems.length,
            });
          } else {
            toast.error(`Failed to upload ${file.name}: ${res.error}`);
          }
        } catch {
          toast.error(`Error uploading ${file.name}`);
        }
      }

      onChange(newItems);
      toast.success(`Gallery updated with ${files.length} photos.`);
    } catch (err: unknown) {
      console.error("[MultiImageGallery]", err);
      toast.error("Failed to upload photos.");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMove = (index: number, direction: "prev" | "next") => {
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const updated = [...photos];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index sortOrder
    const reordered = updated.map((item, idx) => ({ ...item, sortOrder: idx }));
    onChange(reordered);
  };

  const handleDelete = (index: number) => {
    const updated = photos.filter((_, idx) => idx !== index);
    const reordered = updated.map((item, idx) => ({ ...item, sortOrder: idx }));
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foam/80">
            Portfolio Gallery Photos ({photos.length})
          </label>
          <p className="text-xs text-foam/50 mt-0.5">
            Upload multiple photos. Use arrows to re-order sequence.
          </p>
        </div>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="btn-ghost py-2 px-3 text-xs font-semibold inline-flex items-center gap-1.5"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-glass" />
              <span>{uploadProgress || "Uploading…"}</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5 text-glass" />
              <span>Add Photos</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Grid of gallery photos */}
      {photos.length === 0 ? (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foam/15 bg-tide/20 p-8 text-center transition-all hover:border-glass hover:bg-tide/50"
        >
          <div className="rounded-xl bg-swell/40 p-3 text-foam/60 mb-2">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foam">No gallery photos yet</p>
          <p className="text-xs text-foam/50 mt-1">
            Click here to select and upload multiple high-res shots
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {photos.map((item, index) => (
            <div
              key={`${item.imageId}-${index}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-foam/15 bg-tide/40 shadow-sm"
            >
              <Image
                src={`/api/images/${item.imageId}`}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {/* Sort Order Badge */}
              <div className="absolute top-2 left-2 rounded-md bg-abyss/80 px-2 py-0.5 text-[10px] font-bold text-foam/90 backdrop-blur-sm">
                #{index + 1}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2 rounded-md bg-red-500/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Re-order controls bottom bar */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/90 via-abyss/60 to-transparent p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "prev")}
                  className="rounded bg-swell/80 p-1 text-foam hover:bg-glass hover:text-abyss disabled:opacity-30 disabled:hover:bg-swell/80 disabled:hover:text-foam"
                  title="Move earlier"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] text-foam/60 font-medium">Reorder</span>
                <button
                  type="button"
                  disabled={index === photos.length - 1}
                  onClick={() => handleMove(index, "next")}
                  className="rounded bg-swell/80 p-1 text-foam hover:bg-glass hover:text-abyss disabled:opacity-30 disabled:hover:bg-swell/80 disabled:hover:text-foam"
                  title="Move later"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
