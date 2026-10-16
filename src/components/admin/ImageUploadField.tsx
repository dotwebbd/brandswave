"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { compressImageClient } from "@/lib/images/compress-client";
import { uploadImageAction } from "@/actions/images";
import { useToast } from "@/components/admin/ToastContext";

interface ImageUploadFieldProps {
  label: string;
  value?: string | null; // imageId
  onChange: (imageId: string | null) => void;
  aspectRatio?: "square" | "portrait" | "landscape";
  helperText?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  aspectRatio = "portrait",
  helperText = "JPEG, PNG or WebP. Auto-compressed.",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[16/9]",
  }[aspectRatio];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Client-side compression
      const compressed = await compressImageClient(file, { maxWidth: 1600, quality: 0.85 });

      const fd = new FormData();
      fd.append("file", compressed);

      const res = await uploadImageAction(fd);
      if (res.ok) {
        onChange(res.id);
        toast.success("Image uploaded successfully.");
      } else {
        toast.error(res.error);
      }
    } catch (err: unknown) {
      console.error("[ImageUploadField]", err);
      toast.error("Failed to process image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-foam/80">
        {label}
      </label>

      {value ? (
        <div className={`relative max-w-xs w-full overflow-hidden rounded-2xl border border-foam/20 bg-tide/50 shadow-md ${aspectClasses}`}>
          <Image
            src={`/api/images/${value}`}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 320px"
          />
          <div className="absolute inset-0 bg-abyss/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-swell/90 p-2 text-xs font-medium text-foam hover:bg-glass hover:text-abyss transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-xl bg-red-500/90 p-2 text-xs font-medium text-white hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex max-w-xs w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foam/20 bg-tide/30 p-6 text-center transition-all hover:border-glass hover:bg-tide/60 ${aspectClasses}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-glass">
              <Loader2 className="h-7 w-7 animate-spin" />
              <span className="text-xs font-medium">Compressing & uploading…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-foam/60">
              <div className="rounded-xl bg-swell/50 p-3 text-foam">
                <Upload className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-foam">Click to upload photo</span>
              <span className="text-[11px] text-foam/40">{helperText}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
