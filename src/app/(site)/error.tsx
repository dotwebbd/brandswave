"use client";

import Link from "next/link";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center gap-6 py-20">
      <h1 className="text-4xl font-semibold sm:text-5xl">This page hit a snag.</h1>
      <p className="max-w-md text-foam/70">Something went wrong while loading this page. Try again, or head back to the homepage.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-ghost">Go home</Link>
      </div>
    </div>
  );
}
