"use server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp, hashIp } from "@/lib/security/request";
import { leadSchema } from "@/lib/validators/lead";

export type LeadState = { error?: string; success?: boolean } | undefined;

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function submitLeadAction(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const ip = await getClientIp();
  const ipHash = hashIp(ip);

  // Rate limit by IP
  const key = `lead:${ipHash}`;
  const limit = await rateLimit(key, { limit: MAX_ATTEMPTS, windowMs: WINDOW_MS });
  if (!limit.ok) {
    return { error: `Too many submissions. Try again in ${Math.ceil(limit.retryAfterSec / 60)} minute(s).` };
  }

  // Honeypot check
  const website = formData.get("website");
  if (website && website.toString().length > 0) {
    return { error: "Invalid submission." };
  }

  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    projectBrief: formData.get("projectBrief"),
    website: formData.get("website"),
  };

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const { name, phone, email, projectBrief } = parsed.data;

  try {
    await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        projectBrief,
        source: "contact-form",
        status: "NEW",
        ipHash,
      },
    });

    return { success: true };
  } catch (e) {
    console.error("[submitLeadAction]", e);
    return { error: "Something went wrong. Please try again later." };
  }
}