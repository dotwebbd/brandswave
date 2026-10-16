import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(3000),
  imageId: z.string().trim().nullable().optional(),
  priceMin: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().int().min(0).nullable().optional()),
  priceMax: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().int().min(0).nullable().optional()),
  hidePrice: z.boolean().default(false),
  sortOrder: z.preprocess((val) => (val === "" || val === null || val === undefined ? 0 : Number(val)), z.number().int().default(0)),
  isPublished: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
