"use client";

import { SlideUp, StaggerContainer, StaggerItem } from "@/components/motion/primitives";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Mail, Phone, Instagram, Facebook, Linkedin, Globe } from "lucide-react";

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

export function TeamSection({ members, heading = "Meet the Team", subheading = "The people behind the camera and the cast." }: TeamSectionProps) {
  const published = members.filter((m) => m.photoId || m.phone || m.email || m.facebook || m.linkedin || m.instagram);

  return (
    <section className="py-24" aria-labelledby="team-heading">
      <div className="container-page">
        <div className="text-center mb-16">
          <SlideUp>
            <h2 id="team-heading" className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">
              {heading}
            </h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="mt-4 text-foam/70 max-w-lg mx-auto leading-relaxed">{subheading}</p>
          </SlideUp>
        </div>

        {published.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foam/60">No team members to display.</p>
          </div>
        ) : (
          <StaggerContainer stagger={0.08} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {published.map((member) => (
              <StaggerItem key={member.id}>
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

  return (
    <article className="group rounded-xl border border-foam/10 bg-tide/30 p-6 text-center transition-colors hover:border-glass/50">
      {/* Photo - strictly conditional */}
      {member.photoId && (
        <div className="relative mx-auto mb-4">
          <img
            src={`/api/images/${member.photoId}?wm=1`}
            alt={member.name}
            className="h-24 w-24 rounded-full object-cover border-2 border-glass/30"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <h3 className="font-semibold text-foam">{member.name}</h3>
      <p className="text-sm text-glass">{member.role}</p>

      <div className="mt-5 space-y-2">
        {/* Phone - strictly conditional */}
        {member.phone && (
          <a
            href={`tel:${member.phone.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 text-xs text-foam/60 hover:text-glass transition-colors"
          >
            <Phone className="h-3 w-3" aria-hidden />
            {member.phone}
          </a>
        )}

        {/* Email - strictly conditional */}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="flex items-center justify-center gap-2 text-xs text-foam/60 hover:text-glass transition-colors"
          >
            <Mail className="h-3 w-3" aria-hidden />
            {member.email}
          </a>
        )}

        {/* WhatsApp - always available as primary contact */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs text-foam/60 hover:text-glass transition-colors"
        >
          <Phone className="h-3 w-3" aria-hidden />
          WhatsApp
        </a>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {/* Social links - strictly conditional */}
        {member.instagram && (
          <a
            href={`https://instagram.com/${member.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-foam/50 hover:text-glass transition-colors"
            aria-label={`Instagram: ${member.instagram}`}
          >
            <Instagram className="h-4 w-4" aria-hidden />
          </a>
        )}
        {member.facebook && (
          <a
            href={member.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-foam/50 hover:text-glass transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" aria-hidden />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-foam/50 hover:text-glass transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" aria-hidden />
          </a>
        )}
        {/* Fallback: globe icon if no socials at all */}
        {!member.instagram && !member.facebook && !member.linkedin && (
          <span className="p-2 rounded-full bg-foam/10 text-foam/40">
            <Globe className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
    </article>
  );
}