import { Skeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading about editor">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-foam/15 bg-tide/30 p-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-foam/15 bg-tide/30 p-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl border border-foam/15 bg-abyss/40 p-6 space-y-4">
        <Skeleton className="h-4 w-52" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
