"use client";

import Link from "next/link";
import Image from "next/image";
import { ScaleOnHover } from "@/components/motion/primitives";
import { ArrowUpRight } from "lucide-react";

interface ModelCardProps {
  model: {
    id: string;
    slug: string;
    name: string;
    gender: "MALE" | "FEMALE";
    heightCm: number | null;
    coverImageId: string | null;
  };
}

export function ModelCard({ model }: ModelCardProps) {
  const genderLabel = model.gender === "MALE" ? "Men's Board" : "Women's Board";
  const heightText = model.heightCm ? `${model.heightCm} cm` : null;

  return (
    <Link
      href={`/models/${model.slug}`}
      className="group block w-full"
      aria-label={`View composite card of ${model.name}`}
    >
      <ScaleOnHover
        scale={1.02}
        className="relative rounded-2xl overflow-hidden border border-foam/10 bg-abyss/60 backdrop-blur-sm transition-all duration-300 hover:border-glass/40 hover:shadow-2xl hover:shadow-glass/10"
      >
        {/* Aspect 3/4 luxury fashion ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-tide/30">
          {model.coverImageId ? (
            <Image
              src={`/api/images/${model.coverImageId}?wm=1`}
              alt={model.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-swell/40 animate-pulse flex items-center justify-center text-foam/30 text-sm">
              Editorial Portrait
            </div>
          )}

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/20 to-black/20 group-hover:via-abyss/10 transition-all duration-300 pointer-events-none" />

          {/* Top Board Tag */}
          <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-abyss/85 backdrop-blur-md border border-foam/10 text-[11px] font-medium text-foam">
            <span className="h-1.5 w-1.5 rounded-full bg-glass" aria-hidden />
            <span>{genderLabel}</span>
          </div>

          {/* Quick action icon top right */}
          <div className="absolute top-3.5 right-3.5 z-10 h-8 w-8 rounded-full bg-abyss/70 backdrop-blur-md border border-foam/10 flex items-center justify-center text-foam/70 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="h-4 w-4 text-glass" />
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="font-display font-semibold text-foam text-lg sm:text-xl group-hover:text-glass transition-colors line-clamp-1">
              {model.name}
            </h3>
            <div className="mt-1 flex items-center justify-between text-xs text-foam/60">
              <span>{heightText ? `Height: ${heightText}` : "Editorial Talent"}</span>
              <span className="text-glass font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View Book &rarr;
              </span>
            </div>
          </div>
        </div>
      </ScaleOnHover>
    </Link>
  );
}