import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, cached } from "@/lib/cache";

export type Review = Prisma.ReviewGetPayload<{
  select: { id: true; clientName: true; designation: true; company: true; rating: true; text: true };
}>;

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photoId: string | null;
  phone: string | null;
  email: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
};

export const getApprovedReviews = cached(
  async () =>
    prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, clientName: true, designation: true, company: true, rating: true, text: true },
    }),
  ["approved-reviews"],
  [CACHE_TAGS.reviews],
);

// Phone/email are returned only when the admin switched the matching display flag on,
// so the frontend never receives (or renders) fields that should stay hidden.
export const getTeam = cached(
  async () => {
    const members = await prisma.teamMember.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
    return members.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      photoId: m.photoId,
      phone: m.showPhone ? m.phone : null,
      email: m.showEmail ? m.email : null,
      facebook: m.facebook,
      linkedin: m.linkedin,
      instagram: m.instagram,
    }));
  },
  ["team"],
  [CACHE_TAGS.team],
);

export const getAbout = cached(
  async () => prisma.aboutContent.findUnique({ where: { id: 1 }, select: { vision: true, mission: true } }),
  ["about"],
  [CACHE_TAGS.about],
);
