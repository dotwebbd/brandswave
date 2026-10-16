"use client";

import Image from "next/image";
import { ScaleOnHover } from "@/components/motion/primitives";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    youtubeId: string;
    category: string;
    orientation: string;
    thumbnailImageId: string | null;
  };
  aspectClass?: string;
}

export function VideoCard({ video, aspectClass = "aspect-video" }: VideoCardProps) {
  const isVertical = video.orientation === "VERTICAL_9_16";
  const thumbUrl = video.thumbnailImageId ? `/api/images/${video.thumbnailImageId}` : youtubeThumbnail(video.youtubeId);

  return (
    <ScaleOnHover scale={1.02} className="group relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30">
      <div className={cn("relative overflow-hidden", aspectClass)}>
        <Image
          src={thumbUrl}
          alt={`${video.title} thumbnail`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-glass text-abyss shadow-lg">
            <Play className="h-5 w-5 ml-0.5" aria-hidden />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-foam">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-abyss/80 backdrop-blur text-xs font-medium text-sand">
            {isVertical ? "Reels / Shorts" : "Landscape 16:9"}
          </span>
        </div>
      </div>
      <h3 className="mt-3 font-semibold text-foam group-hover:text-glass transition-colors line-clamp-1">{video.title}</h3>
    </ScaleOnHover>
  );
}