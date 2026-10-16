"use client";

import { useEffect } from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Injects JSON-LD structured data into the document head.
 * Use for Organization, Person, Service, etc.
 */
export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const existing = document.querySelector(`script[type="application/ld+json"][data-bw-key="${JSON.stringify(data).slice(0, 32)}"]`);
    if (existing) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-bw-key", JSON.stringify(data).slice(0, 32));
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => script.remove();
  }, [data]);

  return null;
}