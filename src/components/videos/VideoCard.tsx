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
  onClick?: () => void;
}

export function VideoCard({ video, aspectClass = "aspect-video", onClick }: VideoCardProps) {
  const isVertical = video.orientation === "VERTICAL_9_16";
  const thumbUrl = video.thumbnailImageId ? `/api/images/${video.thumbnailImageId}` : youtubeThumbnail(video.youtubeId);

  const categoryNames: Record<string, string> = {
    TVC: "Television Commercial",
    COMMERCIAL: "Brand Commercial",
    FASHION_SHOOT: "Fashion Editorial",
    SOCIAL_MEDIA: "Social & Reels",
    OTHER: "Special Project",
  };

  return (
    <ScaleOnHover
      scale={1.02}
      className={cn(
        "group relative rounded-2xl overflow-hidden border border-foam/10 bg-abyss/60 backdrop-blur-sm transition-all duration-300 hover:border-glass/40 hover:shadow-2xl hover:shadow-glass/10 text-left w-full",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Play ${video.title}`}
    >
      <div className={cn("relative overflow-hidden w-full", aspectClass)}>
        <Image
          src={thumbUrl}
          alt={`${video.title} thumbnail`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
          decoding="async"
          priority={false}
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/30 to-black/30 group-hover:via-abyss/20 transition-all duration-300" />

        {/* Play button with animated pulsing glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-glass text-abyss shadow-xl shadow-glass/30 transition-transform duration-300 group-hover:scale-115">
            <span className="absolute -inset-1 rounded-full bg-glass/40 animate-ping opacity-0 group-hover:opacity-75 transition-opacity" />
            <Play className="h-6 w-6 ml-1 fill-current" aria-hidden />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-abyss/85 backdrop-blur-md border border-foam/10 text-[11px] font-medium text-glass tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-glass animate-pulse" />
            {categoryNames[video.category] || video.category}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-medium text-foam/70">
            {isVertical ? "9:16 Vertical" : "16:9 4K UHD"}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-foam text-base sm:text-lg group-hover:text-glass transition-colors line-clamp-1">
          {video.title}
        </h3>
        <div className="mt-2 flex items-center justify-between text-xs text-foam/50">
          <span>Click to play video</span>
          <span className="group-hover:translate-x-1 transition-transform text-glass font-medium flex items-center gap-1">
            Watch Now &rarr;
          </span>
        </div>
      </div>
    </ScaleOnHover>
  );
}