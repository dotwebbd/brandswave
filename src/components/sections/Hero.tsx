"use client";

import Link from "next/link";
import { StaggerContainer, StaggerItem, SlideUp, ScaleOnHover } from "@/components/motion/primitives";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { ArrowRight, Phone, Play } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center items-center pt-16 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-swell/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-tide/30 blur-[120px]"></div>
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-glass/10 blur-[100px]"></div>
      </div>

      <StaggerContainer stagger={0.12} className="relative z-10 max-w-5xl px-5 text-center space-y-8">
        <StaggerItem>
          <SlideUp className="inline-flex items-center gap-2 rounded-full border border-glass/30 bg-glass/10 px-4 py-1.5 text-xs font-semibold text-glass uppercase tracking-wider">
            <span className="relative flex h-2 w-2 rounded-full bg-glass animate-pulse" />
            Now casting for Spring/Summer campaigns
          </SlideUp>
        </StaggerItem>

        <StaggerItem>
          <h1
            id="hero-heading"
            className="font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl text-foam"
          >
            Models, films &amp; campaigns<span className="text-glass"> that move people.</span>
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="text-lg text-foam/70 max-w-2xl mx-auto leading-relaxed sm:text-xl">
            Casting, commercials, TVCs and social films produced in Dhaka for brands
            that want to be remembered. Premium model management and video production,
            end to end.
          </p>
        </StaggerItem>

        <StaggerItem className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={buildWhatsAppLink(whatsappMessages.general())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            aria-label="Book BrandsWave on WhatsApp"
          >
            <Phone className="h-4 w-4" aria-hidden />
            Book on WhatsApp
          </a>
          <Link
            href="/videos"
            className="btn-ghost"
            aria-label="View BrandsWave video work"
          >
            <Play className="h-4 w-4" aria-hidden />
            View Our Work
          </Link>
        </StaggerItem>

        <StaggerItem className="mt-8">
          <ScaleOnHover className="inline-flex items-center gap-2 text-sm text-foam/50 hover:text-glass transition-colors">
            <ArrowRight className="h-4 w-4" aria-hidden />
            <span>See our latest work &rarr;</span>
          </ScaleOnHover>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}