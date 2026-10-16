"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { VideoModal } from "@/components/videos/VideoModal";
import { Phone, Play, Sparkles, ArrowRight, CheckCircle2, Film } from "lucide-react";

export function Hero() {
  const [showReelOpen, setShowReelOpen] = useState(false);

  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 lg:py-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Cinematic ambient background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[650px] h-[650px] rounded-full bg-swell/20 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[750px] h-[750px] rounded-full bg-tide/30 blur-[150px]" />
        <div className="absolute top-[35%] left-[30%] w-[500px] h-[500px] rounded-full bg-glass/10 blur-[130px]" />
      </div>

      <div className="container-page w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left / Editorial Copy Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-glass/30 bg-glass/10 px-4 py-1.5 text-xs font-semibold text-glass uppercase tracking-wider shadow-sm shadow-glass/10"
            >
              <span className="relative flex h-2 w-2 rounded-full bg-glass">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glass opacity-75" />
              </span>
              <span>Premier Talent Management &amp; TVC Production</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-foam"
            >
              Models, films &amp; campaigns{" "}
              <span className="bg-gradient-to-r from-glass via-sand to-glass bg-clip-text text-transparent">
                that move people.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-foam/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Casting, television commercials, fashion editorials, and viral digital films produced in Dhaka for brands that demand excellence. Full-cycle production and elite model management.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <a
                href={buildWhatsAppLink(whatsappMessages.general())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shadow-lg shadow-glass/20 group"
                aria-label="Book BrandsWave on WhatsApp"
              >
                <Phone className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden />
                <span>Book on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowReelOpen(true)}
                className="btn-secondary group flex items-center gap-2"
                aria-label="Watch BrandsWave Showreel"
              >
                <div className="h-6 w-6 rounded-full bg-glass/20 flex items-center justify-center text-glass group-hover:bg-glass group-hover:text-abyss transition-colors">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </div>
                <span>Watch 2026 Reel</span>
              </button>

              <Link
                href="/models"
                className="btn-ghost text-sm flex items-center gap-1.5 hover:text-glass"
              >
                <span>Browse Talent</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Trust & Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-foam/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-foam">150+</div>
                <div className="text-xs text-foam/60 font-medium mt-0.5">TVCs Produced</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-glass">85+</div>
                <div className="text-xs text-foam/60 font-medium mt-0.5">Verified Models</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-sand">4.9 ★</div>
                <div className="text-xs text-foam/60 font-medium mt-0.5">Client Rating</div>
              </div>
            </motion.div>
          </div>

          {/* Right / Visual High-Fashion Showcase Collage */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Haute Couture Model Card */}
              <div className="relative rounded-3xl overflow-hidden border border-foam/15 bg-tide/40 shadow-2xl shadow-abyss/80 aspect-[3/4] w-full max-w-[380px] mx-auto">
                <Image
                  src="/showcase/hero-female.jpg"
                  alt="High fashion runway model Zara Ahmed"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover object-top select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/20 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-abyss/80 backdrop-blur-md border border-glass/30 text-xs font-semibold text-glass">
                  <Sparkles className="h-3 w-3" />
                  <span>Haute Couture Roster</span>
                </div>

                {/* Bottom Model Details */}
                <div className="absolute bottom-5 left-5 right-5 z-10 text-foam">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-xl text-foam">Zara Ahmed</h3>
                      <p className="text-xs text-foam/70 mt-0.5">Runway &amp; Editorial • 178 cm</p>
                    </div>
                    <Link
                      href="/models/zara-ahmed"
                      className="px-3 py-1.5 rounded-full bg-glass text-abyss font-semibold text-xs hover:bg-foam transition-colors shadow-md"
                    >
                      Book Profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating TVC Production Preview Card */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="hidden sm:flex absolute -bottom-6 -left-8 rounded-2xl border border-glass/25 bg-abyss/90 backdrop-blur-xl p-3.5 shadow-2xl shadow-black/60 items-center gap-3 max-w-[260px] z-20"
              >
                <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-tide">
                  <Image
                    src="/showcase/hero-tvc.jpg"
                    alt="TVC Production set preview"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Film className="h-4 w-4 text-glass" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-glass uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-glass animate-pulse" />
                    ARRI 4K TVC
                  </div>
                  <p className="text-xs font-medium text-foam line-clamp-1 mt-0.5">Apex Festive Commercial</p>
                  <p className="text-[10px] text-foam/50">Post-production master</p>
                </div>
              </motion.div>

              {/* Floating Top Right Male Talent Pill */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="hidden sm:flex absolute -top-4 -right-4 rounded-full border border-foam/15 bg-abyss/90 backdrop-blur-xl px-4 py-2 shadow-xl items-center gap-2.5 z-20"
              >
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-sand">
                  <Image
                    src="/showcase/hero-male.jpg"
                    alt="Rahim Chowdhury"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-foam flex items-center gap-1">
                    <span>Rahim C.</span>
                    <CheckCircle2 className="h-3 w-3 text-glass" />
                  </div>
                  <div className="text-[10px] text-sand font-mono">GQ Star • 186 cm</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Showreel Lightbox Modal */}
      {showReelOpen && (
        <VideoModal
          isOpen={showReelOpen}
          onClose={() => setShowReelOpen(false)}
          youtubeId="dQw4w9WgXcQ"
          title="BrandsWave 2026 Commercial & Fashion Showreel"
        />
      )}
    </section>
  );
}