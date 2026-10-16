"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Deterrent notice: right-click blocking and drag disabling make casual image saving harder,
// but they are not true protection. Determined users can still extract images via dev tools,
// network inspection, or screenshots. This is a light deterrent only.

interface ModelGalleryProps {
  images: { id: string; imageId: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function ModelGallery({ images, isOpen, onClose }: ModelGalleryProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
    },
    [isOpen, images.length, onClose],
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown, handleOutsideClick]);

  if (!isOpen) return null;

  const activeImage = images[current];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-abyss/95 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-8"
        ref={containerRef}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-abyss/80 text-foam hover:text-glass transition-colors"
          aria-label="Close gallery"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-abyss/80 hover:bg-glass text-foam transition-colors hidden md:block"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
        <button
          onClick={() => setCurrent((c) => (c + 1) % images.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-abyss/80 hover:bg-glass text-foam transition-colors hidden md:block"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
        >
          {activeImage && (
            <Image
              src={`/api/images/${activeImage.imageId}?wm=1`}
              alt={`Gallery photo ${current + 1} of ${images.length}`}
              className="max-h-[85vh] rounded-xl shadow-2xl"
              loading="lazy"
              decoding="async"
              // Right-click and drag deterrent (not true protection)
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            />
          )}
        </motion.div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === current ? "bg-glass" : "bg-foam/30 hover:bg-glass",
              )}
              aria-label={`Image ${i + 1}`}
              aria-pressed={i === current}
            />
          ))}
        </div>

        <div className="absolute bottom-4 right-4 z-10 px-4 py-2 rounded-full bg-abyss/80 backdrop-blur text-sm text-foam">
          {current + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}