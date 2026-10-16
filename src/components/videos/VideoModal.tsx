"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/youtube";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
  title: string;
}

export function VideoModal({ isOpen, onClose, youtubeId, title }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      // Unload iframe on close to stop video and free resources
      if (iframe) iframe.src = "about:blank";
    };
  }, [isOpen, handleKeyDown, handleOutsideClick]);

  const embedUrl = youtubeEmbedUrl(youtubeId, true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-abyss/90 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-8"
            ref={containerRef}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-xl border border-foam/15 bg-abyss shadow-2xl overflow-hidden"
            >
              <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-abyss/80 text-foam hover:text-glass transition-colors" aria-label="Close player">
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-video bg-black">
                <iframe
                  ref={iframeRef}
                  src={embedUrl}
                  title={title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-foam">{title}</h3>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}