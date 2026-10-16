import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  password: z.string().min(1, "Enter your password").max(200),
});
