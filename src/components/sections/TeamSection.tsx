"use client";

import Image from "next/image";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/motion/primitives";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Mail, Phone, Instagram, Facebook, Linkedin, Users } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoId: string | null;
  phone: string | null;
  email: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
}

interface TeamSectionProps {
  members: TeamMember[];
  heading?: string;
  subheading?: string;
}

export function TeamSection({
  members,
  heading = "Meet the Team",
  subheading = "The creative directors, producers, and talent scouts shaping our campaigns.",
}: TeamSectionProps) {
  // Show all published members or those with content
  const published = members.length > 0 ? members : [];

  return (
    <section className="py-20 lg:py-28 border-y border-foam/5 relative overflow-hidden" aria-labelledby="team-heading">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SlideUp>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass/10 border border-glass/25 text-xs font-semibold text-glass uppercase tracking-wider mb-4">
              <Users className="h-3.5 w-3.5" />
              <span>Leadership &amp; Talent Scouts</span>
            </div>
            <h2 id="team-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foam tracking-tight">
              {heading}
            </h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="mt-4 text-foam/70 text-base sm:text-lg leading-relaxed">{subheading}</p>
          </SlideUp>
        </div>

        {published.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-foam/10 bg-tide/20 max-w-md mx-auto">
            <p className="text-foam/60">No team members to display.</p>
          </div>
        ) : (
          <StaggerContainer
            stagger={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
          >
            {published.map((member) => (
              <StaggerItem key={member.id} className="h-full">
                <TeamCard member={member} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  const whatsappMsg = `Hi BrandsWave, I'd like to get in touch with ${member.name}.`;
  const waLink = buildWhatsAppLink(whatsappMsg);

  // Compute initials for placeholder avatar
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BW";

  return (
    <article className="group h-full flex flex-col justify-between rounded-2xl border border-foam/10 bg-abyss/60 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:border-glass/40 hover:shadow-2xl hover:shadow-glass/10 hover:-translate-y-1">
      {/* Top Section: Avatar, Name & Role */}
      <div>
        {/* Uniform Photo / Avatar Container */}
        <div className="relative mx-auto mb-5 h-28 w-28 rounded-full overflow-hidden border-2 border-foam/15 group-hover:border-glass/60 transition-colors shadow-lg bg-tide/40 flex items-center justify-center">
          {member.photoId ? (
            <Image
              src={`/api/images/${member.photoId}?wm=1`}
              alt={member.name}
              fill
              sizes="112px"
              className="object-cover transition-transform duration-500 group-hover:scale-108"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-tide to-swell flex items-center justify-center text-foam font-display font-bold text-xl tracking-wider">
              {initials}
            </div>
          )}
        </div>

        {/* Name with fixed min-height for uniformity */}
        <h3 className="font-display font-semibold text-foam text-lg group-hover:text-glass transition-colors line-clamp-1">
          {member.name}
        </h3>
        <p className="text-xs font-medium text-glass tracking-wide mt-1 uppercase line-clamp-1">
          {member.role}
        </p>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-foam/10 mx-auto my-4 group-hover:w-16 group-hover:bg-glass/30 transition-all" />

        {/* Contact Links with uniform layout */}
        <div className="space-y-2 text-xs">
          {member.phone ? (
            <a
              href={`tel:${member.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 text-foam/60 hover:text-glass transition-colors line-clamp-1"
            >
              <Phone className="h-3.5 w-3.5 text-glass flex-shrink-0" aria-hidden />
              <span>{member.phone}</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 text-foam/30 line-clamp-1">
              <Phone className="h-3.5 w-3.5 opacity-40 flex-shrink-0" aria-hidden />
              <span>Agency Direct Line</span>
            </div>
          )}

          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center justify-center gap-2 text-foam/60 hover:text-glass transition-colors line-clamp-1"
            >
              <Mail className="h-3.5 w-3.5 text-sand flex-shrink-0" aria-hidden />
              <span>{member.email}</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 text-foam/30 line-clamp-1">
              <Mail className="h-3.5 w-3.5 opacity-40 flex-shrink-0" aria-hidden />
              <span>Verified Roster</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: WhatsApp Action & Social Icons */}
      <div className="mt-6 pt-4 border-t border-foam/5 space-y-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-glass/10 hover:bg-glass hover:text-abyss text-glass text-xs font-semibold transition-all border border-glass/25"
        >
          <Phone className="h-3 w-3" />
          <span>Direct Message</span>
        </a>

        {/* Social Icons with identical row height */}
        <div className="flex items-center justify-center gap-2 h-8">
          {member.instagram ? (
            <a
              href={`https://instagram.com/${member.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-foam/50 hover:text-glass hover:bg-foam/5 transition-colors"
              aria-label={`Instagram: ${member.instagram}`}
            >
              <Instagram className="h-4 w-4" aria-hidden />
            </a>
          ) : null}

          {member.facebook ? (
            <a
              href={member.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-foam/50 hover:text-glass hover:bg-foam/5 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" aria-hidden />
            </a>
          ) : null}

          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-foam/50 hover:text-glass hover:bg-foam/5 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}