import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModelsPage } from "@/lib/data/models";
import type { ModelCard } from "@/lib/data/models";
import { ModelCard as ModelCardComponent } from "@/components/models/ModelCard";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion/primitives";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Models",
  description: "BrandsWave model directory: male and female fashion models for commercials, TVCs and social campaigns in Dhaka.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/models`,
    images: [{ url: `${siteConfig.url}/opengraph-image.png`, width: 1200, height: 630, alt: "BrandsWave Model Directory" }],
  },
};

export default async function ModelsPage({
  searchParams,
}: { searchParams: Promise<{ gender?: string; page?: string }> }) {
  const { gender, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const selectedGender = gender === "MALE" || gender === "FEMALE" ? gender : "FEMALE";

  const { items, total, totalPages } = await getModelsPage(
    selectedGender as "MALE" | "FEMALE",
    currentPage,
    PAGE_SIZE,
  );

  if (currentPage > totalPages && totalPages > 0) notFound();

  const otherGender = selectedGender === "MALE" ? "FEMALE" : "MALE";

  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">
          {selectedGender === "MALE" ? "Male Models" : "Female Models"}
        </h1>
        <p className="mt-3 text-foam/70 max-w-2xl">
          Discover the talent we represent. Cast for commercials, TVCs, fashion shoots and social campaigns.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-10" role="tablist" aria-label="Filter by gender">
        <Link href={`/models?gender=MALE${currentPage > 1 ? "&page=1" : ""}`} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedGender === "MALE" ? "bg-glass text-abyss" : "border-foam/15 text-foam/60 hover:border-glass hover:text-glass"}`} role="tab" aria-selected={selectedGender === "MALE"}>Male Models</Link>
        <Link href={`/models?gender=FEMALE${currentPage > 1 ? "&page=1" : ""}`} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedGender === "FEMALE" ? "bg-glass text-abyss" : "border-foam/15 text-foam/60 hover:border-glass hover:text-glass"}`} role="tab" aria-selected={selectedGender === "FEMALE"}>Female Models</Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-foam/60">{total} model{total !== 1 ? "s" : ""}</p>
        <Link href={`/models?gender=${otherGender}`} className="text-sm text-foam/60 hover:text-glass transition-colors underline underline-offset-4">Browse {otherGender === "MALE" ? "Male" : "Female"} models</Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-foam/10 bg-tide/30 p-16 text-center"><p className="text-foam/60">No {selectedGender.toLowerCase()} models found.</p></div>
      ) : (
        <ScrollReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((model) => (
            <div key={model.id}><ModelCardComponent model={model as unknown as ModelCard} /></div>
          ))}
        </ScrollReveal>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4" aria-label="Pagination">
          <div className="text-sm text-foam/60">
            Page <span className="text-foam font-medium">{currentPage}</span> of{" "}
            <span className="text-foam font-medium">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link href={`/models?gender=${selectedGender}&page=${currentPage - 1}`} className="px-4 py-2 rounded-xl border border-foam/15 bg-tide/30 text-foam/70 hover:border-glass hover:text-glass transition-colors" aria-label="Previous page">Prev</Link>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const isActive = p === currentPage;
                const show = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                if (!show) return null;
                return (
                  <Link key={p} href={`/models?gender=${selectedGender}&page=${p}`} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${isActive ? "bg-glass text-abyss" : "bg-tide/30 text-foam/60 hover:bg-tide/50 hover:text-glass"}`} aria-label={`Page ${p}`} aria-current={isActive ? "page" : undefined}>{p}</Link>
                );
              })}
            </div>
            {currentPage < totalPages && (
              <Link href={`/models?gender=${selectedGender}&page=${currentPage + 1}`} className="px-4 py-2 rounded-xl border border-foam/15 bg-tide/30 text-foam/70 hover:border-glass hover:text-glass transition-colors" aria-label="Next page">Next</Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
