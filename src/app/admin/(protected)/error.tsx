"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foam mb-2">Something went wrong</h2>
      <p className="max-w-md text-sm text-foam/70 mb-6">
        {error.message || "An unexpected error occurred while loading the administration module."}
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
