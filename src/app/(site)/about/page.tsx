import type { Metadata } from "next";
import Link from "next/link";
import { getAbout, getTeam } from "@/lib/data/content";
import { siteConfig } from "@/config/site";
import { ScrollReveal, SlideUp, StaggerContainer, StaggerItem } from "@/components/motion/primitives";
import type { TeamMember } from "@/lib/data/content";
import { TeamCard } from "@/components/sections/TeamSection";

export const metadata: Metadata = {
  title: "About",
  description: "About BrandsWave: our brand story, vision and mission. A Dhaka-based agency for fashion models, commercials, TVCs and social media films.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/about`,
    images: [{ url: `${siteConfig.url}/opengraph-image.png`, width: 1200, height: 630, alt: "BrandsWave About" }],
  },
};

export default async function AboutPage() {
  const [about, team] = await Promise.all([getAbout(), getTeam()]);

  return (
    <div className="container-page py-12">
      <ScrollReveal className="mb-16">
        <h1 className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">About BrandsWave</h1>
        <p className="mt-4 text-foam/70 max-w-2xl leading-relaxed">
          We are a Dhaka-based agency representing fashion models and producing commercials, TVCs and social
          films. Our work is defined by precision, creativity and a deep understanding of what makes a brand
          unforgettable.
        </p>
      </ScrollReveal>

      {about && (
        <ScrollReveal className="mb-16 border-y border-foam/5 py-12" delay={0.1}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foam mb-4">Our Vision</h2>
              <p className="text-foam/80 leading-relaxed">{about.vision}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foam mb-4">Our Mission</h2>
              <p className="text-foam/80 leading-relaxed">{about.mission}</p>
            </div>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal className="mb-16" delay={0.2}>
        <h2 className="text-2xl font-semibold text-foam mb-8">Meet the Team</h2>
        <StaggerContainer stagger={0.08} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {team.map((member) => (
            <StaggerItem key={member.id}>
              <TeamCard member={member as unknown as TeamMember} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollReveal>

      <SlideUp className="rounded-2xl border border-glass/20 bg-glass/5 p-8 md:p-12 text-center">
        <h2 className="text-2xl font-semibold text-foam mb-4">Ready to collaborate?</h2>
        <p className="text-foam/70 max-w-lg mx-auto mb-6">Get in touch with our team to discuss your next campaign.</p>
        <Link href="/contact" className="btn-primary">Contact Us</Link>
      </SlideUp>
    </div>
  );
}
