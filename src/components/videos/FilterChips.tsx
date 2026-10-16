"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { VideoCategory, VideoOrientation } from "@/lib/data/videos";

interface FilterChipProps {
  label: string;
  value: string | null;
  isActive: boolean;
  onSelect: (value: string | null) => void;
}

function FilterChip({ label, value, isActive, onSelect }: FilterChipProps) {
  const setFilter = () => {
    if (value === "all" || value === null) {
      onSelect(null);
    } else {
      onSelect(value);
    }
  };

  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setFilter();
      }}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
        isActive
          ? "bg-glass text-abyss border-glass"
          : "border-foam/15 text-foam/60 hover:border-glass hover:text-glass",
      )}
    >
      {label}
    </Link>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  TVC: "TVC",
  COMMERCIAL: "Commercial",
  FASHION_SHOOT: "Fashion Shoot",
  SOCIAL_MEDIA: "Social Media",
  OTHER: "Other",
};

const ORIENTATION_LABELS: Record<string, string> = {
  LANDSCAPE_16_9: "Landscape 16:9",
  VERTICAL_9_16: "Reels / Shorts 9:16",
};

interface FilterChipsProps {
  categories: { value: VideoCategory; label: string }[];
  orientations: { value: VideoOrientation; label: string }[];
}

export function FilterChips({ categories, orientations }: FilterChipsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category");
  const currentOrientation = searchParams.get("orientation");

  const setCategory = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const setOrientation = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "all") {
      params.delete("orientation");
    } else {
      params.set("orientation", value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8" role="radiogroup" aria-label="Filter videos">
      <div className="flex items-center gap-2 text-sm text-foam/50 font-medium">
        Filter by:
      </div>

      <FilterChip
        label="All"
        value="all"
        isActive={currentCategory === null || currentCategory === "all"}
        onSelect={setCategory}
      />
      {categories.map((cat) => (
        <FilterChip
          key={`category-${cat.value}`}
          label={CATEGORY_LABELS[cat.value] ?? cat.value}
          value={cat.value}
          isActive={currentCategory === cat.value}
          onSelect={setCategory}
        />
      ))}

      <FilterChip
        label="All"
        value="all"
        isActive={currentOrientation === null || currentOrientation === "all"}
        onSelect={setOrientation}
      />
      {orientations.map((ori) => (
        <FilterChip
          key={`orientation-${ori.value}`}
          label={ORIENTATION_LABELS[ori.value] ?? ori.value}
          value={ori.value}
          isActive={currentOrientation === ori.value}
          onSelect={setOrientation}
        />
      ))}
    </div>
  );
}