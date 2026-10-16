"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Base = { delay?: number; className?: string; children?: React.ReactNode };

export function FadeIn({ delay = 0, className, children, ...rest }: Base & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ delay = 0, className, children, ...rest }: Base & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Reveals when scrolled into view (once). */
export function ScrollReveal({
  delay = 0,
  y = 32,
  className,
  children,
  ...rest
}: Base & { y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const container = (stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export function StaggerContainer({
  stagger = 0.08,
  className,
  children,
  inView = true,
}: {
  stagger?: number;
  className?: string;
  children: React.ReactNode;
  inView?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={container(stagger)}
      initial="hidden"
      {...(inView ? { whileInView: "show", viewport: { once: true, margin: "-60px" } } : { animate: "show" })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({
  scale = 1.03,
  className,
  children,
}: {
  scale?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div className={className} whileHover={{ scale }} whileTap={{ scale: 0.985 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      {children}
    </motion.div>
  );
}

/** Wrap route content (used by template.tsx so it replays on every navigation). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
      {children}
    </motion.div>
  );
}
