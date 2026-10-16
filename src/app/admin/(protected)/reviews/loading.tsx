import { Skeleton } from "@/components/ui/Skeleton";

export default function ReviewsLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading reviews">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="flex gap-4 border-b border-foam/15 pb-2">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-foam/15 bg-tide/30 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-8 w-32 rounded-xl" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
