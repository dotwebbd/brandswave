import type { Metadata } from "next";
import { getFeaturedVideos } from "@/lib/data/videos";
import { getFeaturedModels } from "@/lib/data/models";
import { getServices } from "@/lib/data/services";
import { getApprovedReviews, getTeam } from "@/lib/data/content";
import { Hero } from "@/components/sections/Hero";
import { VideoShowcase } from "@/components/sections/VideoShowcase";
import { ModelShowcase } from "@/components/sections/ModelShowcase";
import { ServiceHighlights } from "@/components/sections/ServiceHighlights";
import { ReviewSlider } from "@/components/sections/ReviewSlider";
import { TeamSection } from "@/components/sections/TeamSection";
import { LeadCTA } from "@/components/sections/LeadCTA";
import { siteConfig } from "@/config/site";
import { ScrollReveal } from "@/components/motion/primitives";
import type { Video } from "@/lib/data/videos";
import type { ModelCard } from "@/lib/data/models";
import type { Service } from "@/lib/data/services";
import type { Review } from "@/lib/data/content";
import type { TeamMember } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Home",
  description: "BrandsWave is a Dhaka-based agency for fashion models, commercials, TVCs and social media films. Premium model management and video production.",
  openGraph: {
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "BrandsWave - Models, films and campaigns that move people",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default async function HomePage() {
  const [videos, models, services, reviews, team] = await Promise.all([
    getFeaturedVideos(12),
    getFeaturedModels(12),
    getServices(6),
    getApprovedReviews(),
    getTeam(),
  ]);

  return (
    <>
      <Hero />

      <ScrollReveal>
        <VideoShowcase
          videos={videos as unknown as Video[]}
          heading="Featured Commercials &amp; Films"
          subheading="A curated selection of our commercial productions, TVCs, and viral fashion campaigns."
          ctaLabel="View All Videos"
          ctaHref="/videos"
          showViewAll
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ModelShowcase
          models={models as unknown as ModelCard[]}
          heading="Featured Talents &amp; Models"
          subheading="Discover elite runway models and commercial actors. Cast for commercials, TVCs, fashion shoots and global campaigns."
          ctaLabel="View All Models"
          ctaHref="/models"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <ServiceHighlights
          services={services as unknown as Service[]}
          heading="Our Agency Services"
          subheading="From casting and location scouting to 4K cinematography and post-production sound mastering."
          ctaLabel="View All Services"
          ctaHref="/services"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <ReviewSlider reviews={reviews as unknown as Review[]} />
      </ScrollReveal>

      <ScrollReveal delay={0.25}>
        <TeamSection members={team as unknown as TeamMember[]} />
      </ScrollReveal>

      <LeadCTA />
    </>
  );
}
