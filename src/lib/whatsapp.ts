import { siteConfig } from "@/config/site";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  general: () => "Hi BrandsWave, I'd like to discuss a project.",
  service: (name: string) => `Hi BrandsWave, I'm interested in your "${name}" service. Could you share details and pricing?`,
  model: (name: string, slug: string) =>
    `Hi BrandsWave, I'd like to book ${name}.\nProfile: ${siteConfig.url}/models/${slug}`,
};
