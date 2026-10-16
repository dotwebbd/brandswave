"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp, hashIp } from "@/lib/security/request";
import { reviewSchema } from "@/lib/validators/review";
import { CACHE_TAGS } from "@/lib/cache";

export type ReviewState = { error?: string; success?: boolean } | undefined;

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function submitReviewAction(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const ip = await getClientIp();
  const ipHash = hashIp(ip);

  // Rate limit by IP + honeypot key
  const key = `review:${ipHash}`;
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
    designation: formData.get("designation"),
    company: formData.get("company"),
    rating: formData.get("rating"),
    text: formData.get("text"),
    website: formData.get("website"),
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const { name, designation, company, rating, text } = parsed.data;

  try {
    await prisma.review.create({
      data: {
        clientName: name,
        designation: designation || null,
        company: company || null,
        rating,
        text,
        status: "PENDING",
      },
    });

    revalidateTag(CACHE_TAGS.reviews);
    return { success: true };
  } catch (e) {
    console.error("[submitReviewAction]", e);
    return { error: "Something went wrong. Please try again later." };
  }
}