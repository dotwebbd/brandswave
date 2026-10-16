import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function WaveMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt={siteConfig.name}
      width={32}
      height={32}
      className={cn("rounded-lg object-contain", className)}
    />
  );
}

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} home`} className={cn("inline-flex items-center gap-2.5 group", className)}>
      <Image
        src="/logo.png"
        alt={siteConfig.name}
        width={36}
        height={36}
        className={cn("h-8 w-8 rounded-lg object-cover shadow-sm transition-transform duration-200 group-hover:scale-105", imgClassName)}
        priority
      />
      <span className="font-display text-xl font-semibold tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}

