"use client";

import { MotionConfig } from "framer-motion";

/** Respects the visitor's reduced-motion setting for every animation below it. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
