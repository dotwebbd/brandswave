"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoModal } from "@/components/videos/VideoModal";
import type { Video } from "@/lib/data/videos";
import { Film, Sparkles, ArrowRight } from "lucide-react";

interface VideoShowcaseProps {
  videos: Video[];
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  showViewAll?: boolean;
}

export function VideoShowcase({
  videos,
  heading = "Featured Work",
  subheading = "A curated selection of our commercial productions, television commercials, and viral fashion campaigns.",
  ctaLabel = "Explore Full Portfolio",
  ctaHref = "/videos",
  showViewAll = true,
}: VideoShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const categories = [
    { key: "ALL", label: "All Projects" },
    { key: "TVC", label: "Television TVCs" },
    { key: "COMMERCIAL", label: "Commercials" },
    { key: "FASHION_SHOOT", label: "Fashion Films" },
    { key: "SOCIAL_MEDIA", label: "Reels & Shorts" },
  ];

  const filteredVideos =
    activeTab === "ALL" ? videos : videos.filter((v) => v.category === activeTab);

  // Fallback if filter has 0 results, show all
  const displayVideos = filteredVideos.length > 0 ? filteredVideos : videos;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden" aria-labelledby="video-showcase-heading">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-swell/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass/10 border border-glass/25 text-xs font-semibold text-glass uppercase tracking-wider mb-4">
              <Film className="h-3.5 w-3.5" />
              <span>Cinematic Production House</span>
            </div>
            <h2
              id="video-showcase-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foam tracking-tight leading-tight"
            >
              {heading}
            </h2>
            <p className="mt-4 text-foam/70 text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          </div>

          {showViewAll && (
            <div className="flex-shrink-0">
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foam/15 bg-tide/40 text-foam hover:text-glass hover:border-glass/40 hover:bg-tide/70 transition-all text-sm font-medium"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-glass" />
              </Link>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.key === "ALL"
                ? videos.length
                : videos.filter((v) => v.category === cat.key).length;
            if (cat.key !== "ALL" && count === 0) return null;

            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === cat.key
                    ? "bg-glass text-abyss font-semibold shadow-lg shadow-glass/20"
                    : "bg-abyss/60 border border-foam/10 text-foam/70 hover:text-foam hover:border-foam/25"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === cat.key ? "bg-abyss/20 text-abyss" : "bg-foam/10 text-foam/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Video Grid Format */}
        {displayVideos.length === 0 ? (
          <div className="rounded-2xl border border-foam/10 bg-tide/20 p-16 text-center">
            <Sparkles className="h-8 w-8 text-glass mx-auto mb-3 opacity-60" />
            <p className="text-foam/60">No videos available in this category yet.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {displayVideos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <VideoCard
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Video Modal Portal */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          youtubeId={selectedVideo.youtubeId}
          title={selectedVideo.title}
          orientation={selectedVideo.orientation}
        />
      )}
    </section>
  );
}