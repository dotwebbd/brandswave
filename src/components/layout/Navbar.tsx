"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navLinks } from "@/config/site";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-foam/10 bg-abyss/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.href} className="relative">
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "relative block px-4 py-2 text-sm transition-colors",
                  isActive(l.href) ? "text-foam" : "text-foam/60 hover:text-foam",
                )}
              >
                {l.label}
                {isActive(l.href) && (
                  <motion.span layoutId="nav-active" className="absolute inset-x-4 -bottom-0.5 h-px bg-glass" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a href={buildWhatsAppLink(whatsappMessages.general())} target="_blank" rel="noopener noreferrer" className="btn-primary py-2">
            Book on WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-foam md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-abyss md:hidden"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="container-page flex flex-col gap-1 py-8">
              {navLinks.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={cn(
                      "block border-b border-foam/10 py-4 font-display text-3xl",
                      isActive(l.href) ? "text-glass" : "text-foam",
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-8">
                <a href={buildWhatsAppLink(whatsappMessages.general())} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  Book on WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
