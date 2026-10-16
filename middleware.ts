import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "bw_session";

async function hasValidSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// First line of defence only: every admin Server Action and page re-checks the session.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await hasValidSession(req);
  const isLogin = pathname === "/admin/login";

  let res: NextResponse;
  if (isLogin && authed) res = NextResponse.redirect(new URL("/admin", req.url));
  else if (!isLogin && !authed) res = NextResponse.redirect(new URL("/admin/login", req.url));
  else res = NextResponse.next();

  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
