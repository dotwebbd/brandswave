"use client";

import Link from "next/link";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/motion/primitives";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { formatBDT } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import type { Service } from "@/lib/data/services";

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const hasPrice = !service.hidePrice && service.priceMin != null && service.priceMax != null;
  const priceRange = hasPrice
    ? `${formatBDT(service.priceMin!)} – ${formatBDT(service.priceMax!)}`
    : "Message us for price";

  const whatsappMsg = whatsappMessages.service(service.title);
  const waLink = buildWhatsAppLink(whatsappMsg);

  return (
    <article
      className="group relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30 transition-colors hover:border-glass/50"
    >
      <div className="relative h-48 overflow-hidden">
        {service.imageId ? (
          <img
            src={`/api/images/${service.imageId}?wm=1`}
            alt={`${service.title} service thumbnail`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-swell/60 animate-shimmer" />
        )}
        <div className="absolute inset-0 bg-abyss/40" />
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-abyss/80 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foam">
          {hasPrice ? (
            <span className="text-glass">{priceRange}</span>
          ) : (
            <>
              <span className="text-sand">{priceRange}</span>
            </>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-foam group-hover:text-glass transition-colors">{service.title}</h3>
        <p className="mt-2 text-sm text-foam/60 line-clamp-2">
          {service.description}
        </p>
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center"
            aria-label={`WhatsApp inquiry about ${service.title}`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}

interface ServiceHighlightsProps {
  services: Service[];
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function ServiceHighlights({
  services,
  heading = "Our Services",
  subheading = "From casting to production, we handle every detail of your campaign.",
  ctaLabel = "View All Services",
  ctaHref = "/services",
}: ServiceHighlightsProps) {
  const featured = services.slice(0, 6);

  return (
    <section className="py-24 border-y border-foam/5" aria-labelledby="service-highlights-heading">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-12">
          <div className="flex-1">
            <SlideUp>
              <h2 id="service-highlights-heading" className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">
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

        <StaggerContainer stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}