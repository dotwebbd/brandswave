import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

/** Use at the top of EVERY admin Server Action, route handler and protected page. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Variant for route handlers that should return 401 instead of redirecting.  */
export async function requireAdminApi() {
  const session = await getSession();
  if (!session) throw new Response("Unauthorized", { status: 401 });
  return session;
}
