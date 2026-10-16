import Link from "next/link";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl border border-foam/15 bg-tide/50 p-4 text-foam/40 mb-4">
        <LayoutDashboard className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foam mb-2">Admin Page Not Found</h2>
      <p className="max-w-md text-sm text-foam/60 mb-6">
        The administration module or record you requested does not exist.
      </p>
      <Link href="/admin" className="btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
