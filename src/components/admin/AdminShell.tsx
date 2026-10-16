"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Video,
  Sparkles,
  Star,
  Users2,
  BookOpen,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { ToastProvider } from "@/components/admin/ToastContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface AdminShellProps {
  userEmail: string;
  pendingReviewsCount: number;
  newLeadsCount: number;
  children: React.ReactNode;
}

export function AdminShell({
  userEmail,
  pendingReviewsCount,
  newLeadsCount,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Models", href: "/admin/models", icon: Users },
    { label: "Videos", href: "/admin/videos", icon: Video },
    { label: "Services", href: "/admin/services", icon: Sparkles },
    {
      label: "Reviews",
      href: "/admin/reviews",
      icon: Star,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { label: "Team", href: "/admin/team", icon: Users2 },
    { label: "About", href: "/admin/about", icon: BookOpen },
    {
      label: "Leads",
      href: "/admin/leads",
      icon: Inbox,
      badge: newLeadsCount > 0 ? newLeadsCount : undefined,
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between px-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-md border border-foam/15 transition-transform duration-200 group-hover:scale-105">
              <Image src="/logo.png" alt="BrandsWave Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="block font-display text-lg font-bold tracking-tight text-foam">
                BrandsWave
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-widest text-glass">
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-glass/15 text-glass font-semibold"
                    : "text-foam/70 hover:bg-swell/40 hover:text-foam"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      active ? "text-glass" : "text-foam/50 group-hover:text-foam"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge !== undefined && (
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        item.label === "Leads"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-glass/20 text-glass border border-glass/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <ChevronRight className="h-3.5 w-3.5 text-glass opacity-70" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User & Logout */}
      <div className="border-t border-foam/10 pt-4 space-y-3">
        <div className="px-2">
          <p className="text-[11px] uppercase tracking-wider text-foam/40">Logged in as</p>
          <p className="truncate text-xs font-medium text-foam/80" title={userEmail}>
            {userEmail}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-foam/70 hover:bg-swell/40 hover:text-foam transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-foam/50" />
              View Public Site
            </span>
          </a>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-300/80 hover:bg-red-500/10 hover:text-red-200 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 text-red-400" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-abyss text-foam flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-foam/10 bg-abyss/80 backdrop-blur-md sticky top-0 h-screen z-30">
          {navContent}
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-foam/10 bg-abyss/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-foam/15 p-2 text-foam hover:bg-swell/50"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative h-7 w-7 overflow-hidden rounded-lg">
              <Image src="/logo.png" alt="BrandsWave" fill className="object-cover" />
            </div>
            <span className="font-display font-semibold tracking-tight text-foam">
              BrandsWave Admin
            </span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-foam/15 px-2.5 py-1.5 text-xs text-foam/80 hover:text-foam"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Site</span>
          </a>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-tide border-r border-foam/15 shadow-2xl z-50 flex flex-col"
              >
                {navContent}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0">
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
