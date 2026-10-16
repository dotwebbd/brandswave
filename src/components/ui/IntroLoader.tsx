"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";

const SEEN_KEY = "bw_intro_seen";

/** Branded full-screen intro, shown once per browser session. */
export function IntroLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setShow(false);
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, "1");
      document.documentElement.classList.add("bw-seen");
      setShow(false);
    }, 2200);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) document.body.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="intro-overlay fixed inset-0 z-[200] flex flex-col items-center justify-center bg-abyss"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          role="status"
          aria-label="Loading BrandsWave"
        >
          <svg viewBox="0 0 64 64" className="h-20 w-20 text-glass" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
            {["M6 22c8-10 14 10 22 0s14 10 22 0 8-6 8-6", "M6 36c8-10 14 10 22 0s14 10 22 0 8-6 8-6", "M6 50c8-10 14 10 22 0s14 10 22 0 8-6 8-6"].map(
              (d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.1, delay: i * 0.22, ease: "easeInOut" }}
                />
              ),
            )}
          </svg>
          <motion.p
            className="mt-6 font-display text-3xl font-semibold tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            {siteConfig.name}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
