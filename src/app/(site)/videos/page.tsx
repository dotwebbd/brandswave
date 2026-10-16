import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideosPage } from "@/lib/data/videos";
import type { Video } from "@/lib/data/videos";
import { VideosPageGrid } from "@/components/videos/VideosPageGrid";
import { FilterChips } from "@/components/videos/FilterChips";
import { Pagination } from "@/components/videos/Pagination";
import { siteConfig } from "@/config/site";

const PAGE_SIZE = 12;

const ALL_CATEGORIES = [
  { value: "TVC" as const, label: "TVC" },
  { value: "COMMERCIAL" as const, label: "Commercial" },
  { value: "FASHION_SHOOT" as const, label: "Fashion Shoot" },
  { value: "SOCIAL_MEDIA" as const, label: "Social Media" },
  { value: "OTHER" as const, label: "Other" },
];

const ALL_ORIENTATIONS = [
  { value: "LANDSCAPE_16_9" as const, label: "Landscape 16:9" },
  { value: "VERTICAL_9_16" as const, label: "Reels / Shorts 9:16" },
];

export const metadata: Metadata = {
  title: "Videos",
  description: "BrandsWave video portfolio: commercials, TVCs, fashion shoots and social media films from Dhaka.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/videos`,
    images: [
      {
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "BrandsWave Video Portfolio",
      },
    ],
  },
};

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; orientation?: string; page?: string }>;
}) {
  const { category, orientation, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const filters: { category?: string; orientation?: string } = {};
  if (category && category !== "all") filters.category = category;
  if (orientation && orientation !== "all") filters.orientation = orientation;

  const { items, total, totalPages } = await getVideosPage(
    filters as { category?: import("@/lib/data/videos").VideoCategory; orientation?: import("@/lib/data/videos").VideoOrientation },
    currentPage,
    PAGE_SIZE,
  );

  if (currentPage > totalPages && totalPages > 0) notFound();

  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">Video Portfolio</h1>
        <p className="mt-3 text-foam/70 max-w-2xl">
          Explore our work across commercials, TVCs, fashion shoots and social films.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-8">
        <div className="flex-1">
          <p className="text-sm text-foam/60">
            {total} video{total !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex-shrink-0">
          <FilterChips categories={ALL_CATEGORIES} orientations={ALL_ORIENTATIONS} />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-foam/10 bg-tide/30 p-16 text-center">
          <p className="text-foam/60">No videos match your filters. Try adjusting your selection.</p>
        </div>
      ) : (
        <VideosPageGrid items={items as unknown as Video[]} />
      )}

      <Pagination page={currentPage} totalPages={totalPages} total={total} />
    </div>
  );
}
