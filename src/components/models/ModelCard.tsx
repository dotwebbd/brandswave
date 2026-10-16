"use client";

import Link from "next/link";
import Image from "next/image";
import { ScaleOnHover } from "@/components/motion/primitives";

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
  const genderLabel = model.gender === "MALE" ? "Male model" : "Female model";
  const heightText = model.heightCm ? `${model.heightCm} cm` : "Height n/a";

  return (
    <Link
      href={`/models/${model.slug}`}
      className="group block"
      aria-label={`View profile of ${model.name}`}
    >
      <ScaleOnHover scale={1.02} className="relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30">
        <div className="relative h-64 w-full overflow-hidden">
          {model.coverImageId ? (
            <Image
              src={`/api/images/${model.coverImageId}?wm=1`}
              alt={model.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-swell/60 animate-shimmer" />
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-abyss/80 backdrop-blur text-xs font-medium text-foam">
            <span className="h-1.5 w-1.5 rounded-full bg-glass" aria-hidden />
            {genderLabel}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foam group-hover:text-glass transition-colors">{model.name}</h3>
          <p className="text-xs text-foam/50">{heightText}</p>
        </div>
      </ScaleOnHover>
    </Link>
  );
}