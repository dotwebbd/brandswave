// Client-safe public configuration. NEXT_PUBLIC_* must be referenced statically
// so Next.js can inline them at build time.
export const siteConfig = {
  name: "BrandsWave",
  tagline: "Models, films and campaigns that move people.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS ?? "",
  mapsEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? "",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/models", label: "Models" },
  { href: "/videos", label: "Videos" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
