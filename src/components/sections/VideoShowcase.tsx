"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SlideUp } from "@/components/motion/primitives";
import { VideoCard } from "@/components/videos/VideoCard";
import type { Video } from "@/lib/data/videos";

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
  subheading = "A selection of our latest commercials, TVCs and social films.",
  ctaLabel = "View All Videos",
  ctaHref = "/videos",
  showViewAll = true,
}: VideoShowcaseProps) {
  return (
    <section className="py-24 border-y border-foam/5" aria-labelledby="video-showcase-heading">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SlideUp>
              <h2 id="video-showcase-heading" className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">
                {heading}
              </h2>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p className="mt-4 text-foam/70 max-w-md leading-relaxed">{subheading}</p>
            </SlideUp>
            {showViewAll && (
              <SlideUp delay={0.2}>
                <Link href={ctaHref} className="mt-6 inline-flex items-center gap-2 btn-ghost">
                  {ctaLabel}
                  <span className="h-4 w-4 text-foam/40">&rarr;</span>
                </Link>
              </SlideUp>
            )}
          </div>

          <div className="relative">
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <Link href={`/videos/${video.id}`} className="block">
                    <VideoCard video={video} />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}