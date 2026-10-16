import type { Metadata } from "next";
import { getServices } from "@/lib/data/services";
import { siteConfig } from "@/config/site";
import { ScrollReveal } from "@/components/motion/primitives";
import { formatBDT } from "@/lib/utils";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "BrandsWave services: model casting, commercial production, TVCs, fashion shoots and social media films in Dhaka.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/services`,
    images: [{ url: `${siteConfig.url}/opengraph-image.png`, width: 1200, height: 630, alt: "BrandsWave Services" }],
  },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="container-page py-12">
      <div className="mb-12">
        <ScrollReveal><h1 className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">Our Services</h1></ScrollReveal>
        <ScrollReveal delay={0.1}><p className="mt-3 text-foam/70 max-w-2xl leading-relaxed">From casting to production, we handle every detail of your campaign. All prices are in BDT.</p></ScrollReveal>
      </div>

      {services.length === 0 ? (
        <ScrollReveal><div className="rounded-xl border border-foam/10 bg-tide/30 p-16 text-center"><p className="text-foam/60">No services available at the moment.</p></div></ScrollReveal>
      ) : (
        <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.2}>
          {services.map((service) => (
            <article key={service.id} className="group relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30 transition-colors hover:border-glass/50">
              <div className="relative h-48 overflow-hidden">
                {service.imageId ? (
                  <Image src={`/api/images/${service.imageId}?wm=1`} alt={`${service.title} service thumbnail`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                ) : (
                  <div className="h-full w-full bg-swell/60 animate-shimmer" />
                )}
                <div className="absolute inset-0 bg-abyss/40" />
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-abyss/80 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foam">
                  {service.hidePrice || (!service.priceMin && !service.priceMax) ? (
                    <span className="text-sand">Message us for price</span>
                  ) : (
                    service.priceMin && service.priceMax && <span className="text-glass">{formatBDT(service.priceMin)} &ndash; {formatBDT(service.priceMax)}</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foam group-hover:text-glass transition-colors">{service.title}</h3>
                <p className="mt-2 text-sm text-foam/60 line-clamp-2">{service.description}</p>
                <div className="mt-5">
                  <a href={buildWhatsAppLink(whatsappMessages.service(service.title))} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full btn-primary" aria-label={`WhatsApp inquiry about ${service.title}`}>
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </ScrollReveal>
      )}
    </div>
  );
}
