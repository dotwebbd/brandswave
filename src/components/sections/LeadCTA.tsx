"use client";

import Link from "next/link";
import { SlideUp } from "@/components/motion/primitives";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function LeadCTA() {
  return (
    <section className="py-20 border-y border-foam/5">
      <div className="container-page">
        <SlideUp>
          <div className="relative rounded-2xl border border-glass/20 bg-tide/50 p-8 md:p-12 overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-glass/10 rounded-full blur-[100px] -mr-10 -mt-10" />

            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-2xl font-semibold sm:text-3xl text-foam mb-3">
                Ready to start your next project?
              </h2>
              <p className="text-foam/70 max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed">
                Let’s build something remarkable together. Reach out and we’ll respond within one business day.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                <Link href="/contact" className="btn-primary">
                  Get in Touch <ArrowRight className="h-4 w-4 ml-1" aria-hidden />
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi BrandsWave, I'd like to discuss a new project.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  aria-label="Book on WhatsApp"
                >
                  <Phone className="h-4 w-4 mr-2" aria-hidden />
                  Book on WhatsApp
                </a>
                {siteConfig.email && (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-xs text-foam/50 hover:text-glass transition-colors"
                    aria-label="Email BrandsWave"
                  >
                    <Mail className="h-3 w-3 mr-1" aria-hidden />
                    {siteConfig.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}