import "server-only";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH_B64: z.string().min(40, "Run `npm run hash-password` and set ADMIN_PASSWORD_HASH_B64"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
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
  ADMIN_PASSWORD_HASH: Buffer.from(parsed.data.ADMIN_PASSWORD_HASH_B64, "base64").toString("utf8"),
  isProd: parsed.data.NODE_ENV === "production",
};
