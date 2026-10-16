"use client";

import { useEffect, useRef, useState } from "react";

interface GoogleMapsProps {
  embedUrl: string;
}

export function GoogleMaps({ embedUrl }: GoogleMapsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!embedUrl || isLoaded) return;
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [embedUrl, isLoaded]);

  if (!embedUrl) return null;

  return (
    <div className="rounded-xl border border-foam/10 bg-tide/30 overflow-hidden aspect-[16/9] relative">
      {isLoaded && iframeRef.current ? (
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="BrandsWave office location - Nikunja 2, Dhaka, Bangladesh"
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <button
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white text-abyss hover:bg-glass transition-colors"
            aria-label="Open in Google Maps"
            onClick={() => window.open(embedUrl, "_blank")}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
            Open in Maps
          </button>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="h-8 w-32 rounded-full bg-swell/60 animate-shimmer" />
        </div>
      )}
    </div>
  );
}