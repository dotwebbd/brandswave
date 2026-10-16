import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon } from "@/components/ui/icons";
import { navLinks, siteConfig } from "@/config/site";

export function Footer() {
  const { email, phone, address, facebook, name, tagline } = siteConfig;
  return (
    <footer className="mt-24 border-t border-foam/10 bg-tide/40">
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.3fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-foam/60">{tagline}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-foam/70">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-glass">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="space-y-3 text-sm text-foam/70">
          {address && (
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-glass" aria-hidden />
              <span>{address}</span>
            </li>
          )}
          {email && (
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-glass" aria-hidden />
              <a href={`mailto:${email}`} className="hover:text-glass">{email}</a>
            </li>
          )}
          {phone && (
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-glass" aria-hidden />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-glass">{phone}</a>
            </li>
          )}
          {facebook && (
            <li className="flex gap-3">
              <FacebookIcon className="mt-0.5 h-4 w-4 shrink-0 text-glass" />
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-glass">
                Facebook
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="border-t border-foam/10 py-5 text-center text-xs text-foam/50">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </div>
    </footer>
  );
}
