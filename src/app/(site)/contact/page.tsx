import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { GoogleMaps } from "@/components/contact/GoogleMaps";
import { siteConfig } from "@/config/site";
import { ScrollReveal, SlideUp } from "@/components/motion/primitives";
import { Mail, Phone, MapPin, FacebookIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact BrandsWave: model casting, commercial production and video services in Nikunja 2, Dhaka, Bangladesh.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/contact`,
    images: [{ url: `${siteConfig.url}/opengraph-image.png`, width: 1200, height: 630, alt: "BrandsWave Contact" }],
  },
};

export default function ContactPage() {
  return (
    <div className="container-page py-12">
      <div className="mb-12">
        <ScrollReveal><h1 className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">Get in Touch</h1></ScrollReveal>
        <ScrollReveal delay={0.1}><p className="mt-3 text-foam/70 max-w-2xl leading-relaxed">Have a project in mind? Reach out to our team and we&rsquo;ll respond within one business day.</p></ScrollReveal>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <ScrollReveal className="space-y-8" delay={0.2}>
            <div className="rounded-xl border border-foam/10 bg-tide/30 p-6">
              <h2 className="text-lg font-semibold text-foam mb-4">Office</h2>
              <ul className="space-y-4 text-sm text-foam/70">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-glass" aria-hidden /><span className="leading-relaxed">{siteConfig.address}</span></li>
                <li className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-glass" aria-hidden /><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-glass transition-colors">{siteConfig.phone}</a></li>
                <li className="flex items-center gap-3"><a href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi BrandsWave, I'd like to discuss a project.")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-glass transition-colors"><Phone className="h-4 w-4 shrink-0 text-glass" aria-hidden /><span>WhatsApp</span></a></li>
                {siteConfig.email && (<li className="flex items-center gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-glass" aria-hidden /><a href={`mailto:${siteConfig.email}`} className="hover:text-glass transition-colors">{siteConfig.email}</a></li>)}
                {siteConfig.facebook && (<li className="flex items-center gap-3"><FacebookIcon className="mt-0.5 h-4 w-4 shrink-0 text-glass" aria-hidden /><a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-glass transition-colors">Facebook</a></li>)}
              </ul>
            </div>
            <SlideUp delay={0.3}><div className="rounded-xl border border-foam/10 bg-tide/30 p-6"><h2 className="text-lg font-semibold text-foam mb-4">Send a Message</h2><p className="text-sm text-foam/60 mb-4">Fill out the form below and we&rsquo;ll get back to you shortly.</p><Link href="/contact" className="inline-flex items-center gap-2 btn-ghost">Contact Form <span className="h-4 w-4 text-foam/40">&rarr;</span></Link></div></SlideUp>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-2">
          <ScrollReveal className="mb-8" delay={0.2}>
            {siteConfig.mapsEmbedUrl ? (<GoogleMaps embedUrl={siteConfig.mapsEmbedUrl} />) : (<div className="rounded-xl border border-foam/10 bg-tide/30 h-64 flex items-center justify-center"><p className="text-foam/50">Map not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL.</p></div>)}
          </ScrollReveal>
          <ScrollReveal delay={0.3}><div className="rounded-xl border border-foam/10 bg-tide/30 p-6 md:p-8"><h2 className="text-lg font-semibold text-foam mb-6">Inquiry Form</h2><ContactForm /></div></ScrollReveal>
        </div>
      </div>
    </div>
  );
}
