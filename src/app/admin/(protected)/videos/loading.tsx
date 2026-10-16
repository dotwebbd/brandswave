import { Skeleton } from "@/components/ui/Skeleton";

export default function VideosLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading videos">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>

      <div className="rounded-2xl border border-foam/15 bg-tide/30 p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-foam/5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-24 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
