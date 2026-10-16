"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/** Slim top progress bar for client-side navigations (starts on internal link click, ends when the URL changes). */
export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearInterval(timer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const start = useCallback(() => {
    clear();
    setVisible(true);
    setProgress(12);
    timer.current = setInterval(() => setProgress((p) => (p < 90 ? p + (90 - p) * 0.12 : p)), 180);
  }, []);

  useEffect(() => {
    // URL changed => navigation finished
    clear();
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);
    return clear;
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="route-progress"
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="progressbar"
          aria-hidden
        >
          <motion.div
            className="h-full bg-glass shadow-[0_0_12px_rgba(134,217,198,0.8)]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
