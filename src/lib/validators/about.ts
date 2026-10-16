import { z } from "zod";

export const aboutSchema = z.object({
  vision: z.string().trim().min(10, "Vision must be at least 10 characters").max(3000),
  mission: z.string().trim().min(10, "Mission must be at least 10 characters").max(3000),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
