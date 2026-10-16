"use client";

import Link from "next/link";
import Image from "next/image";
import { StaggerContainer, StaggerItem } from "@/components/motion/primitives";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { formatBDT } from "@/lib/utils";
import { MessageCircle, Briefcase, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/data/services";

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const hasPrice = !service.hidePrice && service.priceMin != null && service.priceMax != null;
  const priceRange = hasPrice
    ? `${formatBDT(service.priceMin!)} – ${formatBDT(service.priceMax!)}`
    : "Bespoke Quote";

  const whatsappMsg = whatsappMessages.service(service.title);
  const waLink = buildWhatsAppLink(whatsappMsg);

  return (
    <article className="group h-full flex flex-col justify-between rounded-2xl overflow-hidden border border-foam/10 bg-abyss/60 backdrop-blur-sm transition-all duration-300 hover:border-glass/40 hover:shadow-2xl hover:shadow-glass/10 hover:-translate-y-1">
      <div>
        <div className="relative h-52 w-full overflow-hidden bg-tide/30">
          {service.imageId ? (
            <Image
              src={`/api/images/${service.imageId}?wm=1`}
              alt={`${service.title} service thumbnail`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-tide to-swell flex items-center justify-center text-foam/30">
              <Briefcase className="h-10 w-10 text-glass/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/30 to-black/30 pointer-events-none" />

          {/* Pricing tag */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-abyss/90 backdrop-blur-md border border-foam/15 px-3 py-1 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-glass" />
            <span className={hasPrice ? "text-glass" : "text-sand"}>{priceRange}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="font-display font-semibold text-foam text-lg sm:text-xl group-hover:text-glass transition-colors line-clamp-1">
            {service.title}
          </h3>
          <p className="mt-2.5 text-xs sm:text-sm text-foam/70 leading-relaxed line-clamp-3">
            {service.description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 pt-0">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-glass/10 hover:bg-glass hover:text-abyss text-glass text-xs font-semibold transition-all border border-glass/25 shadow-sm"
          aria-label={`WhatsApp inquiry about ${service.title}`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Inquire on WhatsApp</span>
        </a>
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
  subheading = "From editorial casting to 4K cinematic commercials, we produce unforgettable campaigns.",
  ctaLabel = "View All Services",
  ctaHref = "/services",
}: ServiceHighlightsProps) {
  const featured = services.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" aria-labelledby="service-highlights-heading">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass/10 border border-glass/25 text-xs font-semibold text-glass uppercase tracking-wider mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Full-Cycle Agency Solutions</span>
            </div>
            <h2 id="service-highlights-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foam tracking-tight">
              {heading}
            </h2>
            <p className="mt-4 text-foam/70 text-base sm:text-lg leading-relaxed">{subheading}</p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foam/15 bg-tide/40 text-foam hover:text-glass hover:border-glass/40 hover:bg-tide/70 transition-all text-sm font-medium"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-glass" />
            </Link>
          </div>
        </div>

        <StaggerContainer stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {featured.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}