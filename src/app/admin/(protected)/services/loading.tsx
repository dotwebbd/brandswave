import { Skeleton } from "@/components/ui/Skeleton";

export default function ServicesLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading services">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <div className="rounded-2xl border border-foam/15 bg-tide/30 p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-foam/5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-14 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
