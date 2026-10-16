"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
}

export function Pagination({ page, totalPages, total }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4" aria-label="Pagination">
      <div className="text-sm text-foam/60">
        Showing page <span className="text-foam font-medium">{page}</span> of{" "}
        <span className="text-foam font-medium">{totalPages}</span> ({total} total)
      </div>

      <div className="flex items-center gap-2">
        {page > 1 && (
          <Link
            href={buildUrl(page - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-foam/15 bg-tide/30 text-foam/70 hover:border-glass hover:text-glass transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden /> Prev
          </Link>
        )}

        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const isActive = p === page;
            // Show first, last, current, and neighbors
            const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
            if (!show) return null;
            return (
              <Link
                key={p}
                href={buildUrl(p)}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                  isActive
                    ? "bg-glass text-abyss"
                    : "bg-tide/30 text-foam/60 hover:bg-tide/50 hover:text-glass",
                )}
                aria-label={`Page ${p}`}
                aria-current={isActive ? "page" : undefined}
              >
                {p}
              </Link>
            );
          })}
        </div>

        {page < totalPages && (
          <Link
            href={buildUrl(page + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-foam/15 bg-tide/30 text-foam/70 hover:border-glass hover:text-glass transition-colors"
            aria-label="Next page"
          >
            Next <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </nav>
  );
}