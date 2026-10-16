import "server-only";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z
  .object({
    DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
    DIRECT_URL: z.string().url().optional(),
    ADMIN_EMAIL: z.string().email("ADMIN_EMAIL is required and must be a valid email"),
    ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters").optional(),
    ADMIN_PASSWORD_HASH_B64: z.string().optional(),
    ADMIN_PASSWORD_HASH: z.string().optional(),
    AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("https://brandswave.netlify.app"),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\d{8,15}$/, "digits only, with country code"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  })
  .refine(
    (data) => Boolean(data.ADMIN_PASSWORD || data.ADMIN_PASSWORD_HASH_B64 || data.ADMIN_PASSWORD_HASH),
    {
      message: "Provide ADMIN_PASSWORD or ADMIN_PASSWORD_HASH_B64 in environment variables",
      path: ["ADMIN_PASSWORD"],
    }
  );

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`\n\nInvalid environment configuration:\n${issues}\n\nSee .env.example\n`);
}

// Derive final bcrypt hash strictly from environment input
let resolvedPasswordHash = "";
const plainPassword = parsed.data.ADMIN_PASSWORD;
const rawHash = parsed.data.ADMIN_PASSWORD_HASH;
const b64Hash = parsed.data.ADMIN_PASSWORD_HASH_B64;

if (plainPassword) {
  resolvedPasswordHash = bcrypt.hashSync(plainPassword, 12);
} else if (b64Hash) {
  if (b64Hash.startsWith("$2a$") || b64Hash.startsWith("$2b$") || b64Hash.startsWith("$2y$")) {
    resolvedPasswordHash = b64Hash;
  } else {
    try {
      const decoded = Buffer.from(b64Hash, "base64").toString("utf8");
      resolvedPasswordHash = decoded.startsWith("$2") ? decoded : b64Hash;
    } catch {
      resolvedPasswordHash = b64Hash;
    }
  }
} else if (rawHash) {
  resolvedPasswordHash = rawHash;
}

export const env = {
  ...parsed.data,
  ADMIN_PASSWORD_HASH: resolvedPasswordHash,
  isProd: parsed.data.NODE_ENV === "production",
};
