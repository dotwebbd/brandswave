import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().trim().min(2, "Role must be at least 2 characters").max(100),
  photoId: z.string().trim().nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  email: z.string().trim().email("Please enter a valid email").or(z.literal("")).nullable().optional(),
  facebook: z.string().trim().url("Please enter a valid URL").or(z.literal("")).nullable().optional(),
  linkedin: z.string().trim().url("Please enter a valid URL").or(z.literal("")).nullable().optional(),
  instagram: z.string().trim().url("Please enter a valid URL").or(z.literal("")).nullable().optional(),
  showPhone: z.boolean().default(false),
  showEmail: z.boolean().default(false),
  sortOrder: z.preprocess((val) => (val === "" || val === null || val === undefined ? 0 : Number(val)), z.number().int().default(0)),
  isPublished: z.boolean().default(true),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
