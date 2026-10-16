import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  designation: z.string().trim().max(100).optional().or(z.literal("")),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(10, "Review must be at least 10 characters").max(2000),
  // Honeypot: real users never fill this hidden field.
  website: z.string().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const adminUpdateReviewSchema = z.object({
  clientName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  designation: z.string().trim().max(100).nullable().optional(),
  company: z.string().trim().max(100).nullable().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(5, "Review must be at least 5 characters").max(2000),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export type AdminUpdateReviewInput = z.infer<typeof adminUpdateReviewSchema>;