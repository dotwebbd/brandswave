"use client";

import Link from "next/link";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/motion/primitives";
import { ModelCard } from "@/components/models/ModelCard";
import type { Model } from "@/lib/data/models";

interface ModelShowcaseProps {
  models: Model[];
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function ModelShowcase({
  models,
  heading = "Featured Models",
  subheading = "Discover the talent we represent. Cast for commercials, TVCs, fashion shoots and social campaigns.",
  ctaLabel = "View All Models",
  ctaHref = "/models",
}: ModelShowcaseProps) {
  return (
    <section className="py-24 border-y border-foam/5" aria-labelledby="model-showcase-heading">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-12">
          <div className="flex-1">
            <SlideUp>
              <h2 id="model-showcase-heading" className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">
                {heading}
              </h2>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p className="mt-4 text-foam/70 max-w-md leading-relaxed">{subheading}</p>
            </SlideUp>
          </div>
          <div className="flex-shrink-0">
            <SlideUp delay={0.2}>
              <Link href={ctaHref} className="btn-ghost inline-flex items-center gap-2">
                {ctaLabel}
                <span className="h-4 w-4 text-foam/40">&rarr;</span>
              </Link>
            </SlideUp>
          </div>
        </div>

        <StaggerContainer stagger={0.08} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {models.map((model) => (
            <StaggerItem key={model.id}>
              <ModelCard model={model} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}