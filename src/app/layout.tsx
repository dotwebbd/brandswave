import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RouteProgress } from "@/components/ui/RouteProgress";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} | Models & Video Production, Dhaka`, template: `%s | ${siteConfig.name}` },
  description: "BrandsWave is a Dhaka-based agency for fashion models, commercials, TVCs and social media films.",
  openGraph: { type: "website", siteName: siteConfig.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0A1424", width: "device-width", initialScale: 1 };

// Runs before first paint so returning visitors never see the intro overlay.
const introGuard = `try{if(sessionStorage.getItem("bw_intro_seen"))document.documentElement.classList.add("bw-seen")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGuard }} />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/opengraph-image.png`,
              sameAs: siteConfig.facebook ? [siteConfig.facebook] : [],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: siteConfig.phone,
                contactType: "customer service",
                availableLanguage: ["en"],
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: siteConfig.address,
                addressCountry: "BD",
              },
            }),
          }}
        />
      </head>
      <body>
        <MotionProvider>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
