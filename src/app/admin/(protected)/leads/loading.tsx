import { Skeleton } from "@/components/ui/Skeleton";

export default function LeadsLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading lead inbox">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Skeleton className="h-10 sm:col-span-2 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>

      <div className="rounded-2xl border border-foam/15 bg-tide/30 p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-foam/5">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
