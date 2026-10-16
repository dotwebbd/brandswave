import { z } from "zod";

export const modelSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  gender: z.enum(["MALE", "FEMALE"]),
  heightCm: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().int().min(50).max(250).nullable().optional()),
  chestBust: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().int().min(30).max(200).nullable().optional()),
  waist: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().int().min(30).max(200).nullable().optional()),
  hips: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().int().min(30).max(200).nullable().optional()),
  eyeColor: z.string().trim().max(50).nullable().optional(),
  hairColor: z.string().trim().max(50).nullable().optional(),
  bio: z.string().trim().max(2000).nullable().optional(),
  coverImageId: z.string().trim().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  // Private admin-only contact details
  phone: z.string().trim().max(30).nullable().optional(),
  email: z.string().trim().email("Please enter a valid email").or(z.literal("")).nullable().optional(),
});

export const modelPhotoItemSchema = z.object({
  imageId: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const modelVideoItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(1000).nullable().optional(),
  youtubeUrl: z.string().trim().min(1, "YouTube URL or ID is required"),
  sortOrder: z.number().int().default(0),
});

export type ModelFormData = z.infer<typeof modelSchema>;
