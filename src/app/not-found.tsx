import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-screen flex-col items-start justify-center gap-6 py-20">
      <Logo />
      <h1 className="text-5xl font-semibold sm:text-6xl">We couldn&apos;t find that page.</h1>
      <p className="max-w-md text-foam/70">The link may be old, or the profile may have been unpublished.</p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/models" className="btn-ghost">Browse models</Link>
      </div>
    </div>
  );
}
