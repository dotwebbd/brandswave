import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModelBySlug, getAllModelSlugs } from "@/lib/data/models";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";
import { ScrollReveal, FadeIn } from "@/components/motion/primitives";
import Image from "next/image";
import { ProfileVideos } from "@/components/models/ProfileVideos";
import { Phone } from "lucide-react";

import type { ModelProfile } from "@/lib/data/models";

export async function generateStaticParams() {
  const slugs = await getAllModelSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) return { title: "Model Not Found" };
  return {
    title: `${model.name} | BrandsWave Model`,
    description: model.bio ? model.bio.slice(0, 160) : `Professional ${model.gender} model represented by BrandsWave in Dhaka.`,
    alternates: { canonical: `${siteConfig.url}/models/${slug}` },
    openGraph: {
      type: "profile",
      url: `${siteConfig.url}/models/${slug}`,
      title: `${model.name} | BrandsWave`,
      description: model.bio ? model.bio.slice(0, 200) : undefined,
      images: model.coverImageId
        ? [{ url: `${siteConfig.url}/api/images/${model.coverImageId}?wm=1`, width: 1200, height: 1200, alt: model.name }]
        : [{ url: `${siteConfig.url}/opengraph-image.png`, width: 1200, height: 630, alt: model.name }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ModelProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) notFound();

  const waMsg = whatsappMessages.model(model.name, model.slug);
  const waLink = buildWhatsAppLink(waMsg);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: model.name,
            url: `${siteConfig.url}/models/${slug}`,
            image: model.coverImageId ? `${siteConfig.url}/api/images/${model.coverImageId}?wm=1` : undefined,
            jobTitle: model.gender === "MALE" ? "Male Model" : "Female Model",
            height: model.heightCm ? `${model.heightCm} cm` : undefined,
            description: model.bio || undefined,
            worksFor: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          }),
        }}
      />
      <div className="container-page py-12">
      <ScrollReveal className="flex flex-col lg:flex-row gap-12 mb-16">
        <div className="flex-shrink-0">
          {model.coverImageId ? (
            <Image src={`/api/images/${model.coverImageId}?wm=1`} alt={model.name} width={400} height={520} className="rounded-2xl shadow-2xl object-cover" loading="lazy" decoding="async" />
          ) : (
            <div className="w-64 h-80 rounded-2xl bg-swell/60 animate-shimmer" />
          )}
        </div>

        <div className="flex-1">
          <FadeIn className="space-y-4">
            <h1 className="text-4xl font-semibold sm:text-5xl text-foam tracking-tight">{model.name}</h1>
            <p className="text-xl text-glass">{model.gender === "MALE" ? "Male Model" : "Female Model"}</p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {model.heightCm && (
                <div className="p-4 rounded-xl border border-foam/10 bg-tide/30 text-center">
                  <p className="text-xs text-foam/50 uppercase tracking-wider">Height</p>
                  <p className="font-semibold text-foam">{model.heightCm} cm</p>
                </div>
              )}
              {model.chestBust && (
                <div className="p-4 rounded-xl border border-foam/10 bg-tide/30 text-center">
                  <p className="text-xs text-foam/50 uppercase tracking-wider">Chest / Bust</p>
                  <p className="font-semibold text-foam">{model.chestBust} cm</p>
                </div>
              )}
              {model.waist && (
                <div className="p-4 rounded-xl border border-foam/10 bg-tide/30 text-center">
                  <p className="text-xs text-foam/50 uppercase tracking-wider">Waist</p>
                  <p className="font-semibold text-foam">{model.waist} cm</p>
                </div>
              )}
              {model.hips && (
                <div className="p-4 rounded-xl border border-foam/10 bg-tide/30 text-center">
                  <p className="text-xs text-foam/50 uppercase tracking-wider">Hips</p>
                  <p className="font-semibold text-foam">{model.hips} cm</p>
                </div>
              )}
            </div>

            {model.eyeColor && (
              <div className="mt-6 flex items-center gap-3">
                <p className="text-sm text-foam/50 w-20">Eye Color</p>
                <p className="font-semibold text-foam">{model.eyeColor}</p>
              </div>
            )}
            {model.hairColor && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-foam/50 w-20">Hair Color</p>
                <p className="font-semibold text-foam">{model.hairColor}</p>
              </div>
            )}

            {model.bio && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-foam/60 uppercase tracking-wider mb-3">About</h3>
                <p className="text-foam/80 leading-relaxed">{model.bio}</p>
              </div>
            )}
          </FadeIn>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mb-16" delay={0.1}>
        <div className="rounded-2xl border border-glass/20 bg-glass/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-foam/60">Book this model</p>
            <p className="text-lg font-semibold text-foam">{model.name}</p>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary" aria-label={`Book ${model.name} on WhatsApp`}>
            <Phone className="h-4 w-4 mr-2" aria-hidden />
            Book on WhatsApp
          </a>
        </div>
      </ScrollReveal>

      {model.photos.length > 0 && (
        <ScrollReveal className="mb-16" delay={0.2}>
          <div>
            <h2 className="text-2xl font-semibold text-foam mb-6">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {model.photos.map((photo) => (
                <button key={photo.id} className="relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30 group" aria-label={`Gallery photo ${photo.id}`}>
                  <Image src={`/api/images/${photo.imageId}?wm=1`} alt={`${model.name} gallery photo`} fill className="object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none" loading="lazy" decoding="async" draggable={false} style={{ userSelect: "none", WebkitUserSelect: "none" }} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="h-6 w-6 rounded-full bg-white text-abyss flex items-center justify-center text-xs font-bold">View</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      <ProfileVideos videos={model.videos as unknown as ModelProfile["videos"]} />

      <div className="mt-16 text-center text-foam/40 text-sm">
        <p>BrandsWave &bull; {model.name} &bull; Profile: {siteConfig.url}/models/{slug}</p>
      </div>
    </div>
    </>
  );
}