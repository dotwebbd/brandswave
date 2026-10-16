"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validators/auth";
import { getClientIp } from "@/lib/security/request";
import { rateLimit, resetRateLimit } from "@/lib/security/rate-limit";

export type LoginState = { error?: string } | undefined;

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
// Used to keep response time similar when the email is wrong.
const DUMMY_HASH = bcrypt.hashSync("not-the-real-password", 12);

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
};

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const key = `login:${await getClientIp()}`;
  const limit = await rateLimit(key, { limit: MAX_ATTEMPTS, windowMs: WINDOW_MS });
  if (!limit.ok) {
    return { error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSec / 60)} minute(s).` };
  }

  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) return { error: "Invalid email or password." };

  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };

  const { email, password } = parsed.data;
  const emailOk = safeEqual(email, env.ADMIN_EMAIL.trim().toLowerCase());
  const passwordOk = await bcrypt.compare(password, emailOk ? env.ADMIN_PASSWORD_HASH : DUMMY_HASH);

  if (!emailOk || !passwordOk) return { error: "Invalid email or password." };

  await resetRateLimit(key);
  await createSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
