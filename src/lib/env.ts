import "server-only";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
  DIRECT_URL: z.string().url().optional(),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL is required and must be a valid email"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("https://brandswave.netlify.app"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\d{8,15}$/, "digits only, with country code"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`\n\nInvalid environment configuration:\n${issues}\n\nSee .env.example\n`);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === "production",
};
