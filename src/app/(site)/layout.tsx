import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { IntroLoader } from "@/components/ui/IntroLoader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IntroLoader />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-glass focus:px-4 focus:py-2 focus:text-abyss">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="min-h-[70vh] pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
