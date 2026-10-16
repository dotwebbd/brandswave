import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-swell/60", className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foam/10 to-transparent" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container-page space-y-8 py-16" role="status" aria-label="Loading">
      <Skeleton className="h-12 w-2/3 max-w-xl" />
      <Skeleton className="h-5 w-1/2 max-w-md" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4]" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function ModelCardSkeleton() {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30">
      <Skeleton className="h-64 w-full aspect-[3/4]" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2 mt-2" />
      </div>
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30 aspect-[16/9]">
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-4 left-4 right-4 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30">
      <Skeleton className="h-48 w-full aspect-[4/3]" />
      <div className="p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2 mt-3" />
        <Skeleton className="h-3 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-foam/10 bg-tide/30">
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-3 w-1/4 mb-3" />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-4 w-full mt-3" />
      <Skeleton className="h-3 w-3/4 mt-2" />
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-foam/10 bg-tide/30 flex flex-col items-center text-center">
      <Skeleton className="h-24 w-24 rounded-full mb-4" />
      <Skeleton className="h-5 w-1/2 mb-1" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}
