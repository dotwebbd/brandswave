"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { X, ExternalLink } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
  title: string;
  orientation?: string;
}

export function VideoModal({ isOpen, onClose, youtubeId, title, orientation }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVertical = orientation === "VERTICAL_9_16";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    const iframe = iframeRef.current;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "";
      if (iframe) iframe.src = "about:blank";
    };
  }, [isOpen, handleKeyDown, handleOutsideClick]);

  const embedUrl = youtubeEmbedUrl(youtubeId, true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-abyss/90 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative z-[201] w-full rounded-2xl border border-glass/20 bg-abyss/95 shadow-2xl shadow-glass/10 overflow-hidden flex flex-col",
              isVertical ? "max-w-sm max-h-[92vh]" : "max-w-4xl max-h-[90vh]"
            )}
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
          >
            {/* Header / close bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-foam/10 bg-abyss/80">
              <span className="text-xs font-mono uppercase tracking-wider text-glass font-medium">
                {isVertical ? "9:16 Vertical Reel" : "4K Cinematic Player"}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-foam/70 hover:text-foam hover:bg-foam/10 transition-colors"
                aria-label="Close video player"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Frame */}
            <div className={cn("relative w-full bg-black", isVertical ? "aspect-[9/16] max-h-[75vh]" : "aspect-video")}>
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Footer title info */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-abyss">
              <h3 id="video-modal-title" className="font-semibold text-foam text-base sm:text-lg line-clamp-1">
                {title}
              </h3>
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-foam/60 hover:text-glass transition-colors flex-shrink-0"
              >
                <span>YouTube</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}