import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  projectBrief: z.string().trim().min(10, "Brief must be at least 10 characters").max(3000),
  // Honeypot: real users never fill this hidden field.
  website: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;