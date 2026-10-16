# BrandsWave

Next.js 15 (App Router) + Prisma + Neon PostgreSQL + Framer Motion + Tailwind.
This is the **foundation (Prompt 1)**: schema, security, auth, image pipeline, caching helpers, app shell, loaders and motion primitives.

## Setup

```bash
npm install
# 1) set your admin password (prints ADMIN_PASSWORD_HASH_B64)
npm run hash-password -- "choose-a-strong-password"
# 2) paste that line into .env.local
# 3) create tables in Neon
npm run db:migrate -- --name init
# 4) run
npm run dev
```

Then open `/admin/login`.

> If Prisma rejects `channel_binding=require` in the connection strings, delete that parameter from both URLs.

## Environment

All secrets live in `.env.local` (git-ignored). `.env.example` lists every variable.
Only `NEXT_PUBLIC_*` values reach the browser (public contact info). `DATABASE_URL`, `DIRECT_URL`,
`ADMIN_*` and `AUTH_SECRET` are server-only; `src/lib/env.ts` validates them at startup.

## Structure

```
prisma/schema.prisma        data model
middleware.ts               /admin gate (+ noindex, no-store)
src/app/(site)/             public pages (navbar, footer, intro loader, page transitions)
src/app/admin/              login + protected area
src/app/api/images/[id]/    image delivery (immutable cache, ETag/304, ?wm=1 watermark)
src/actions/                server actions (auth, image upload)
src/components/{layout,motion,ui}
src/lib/{auth,data,images,security,validators}   server helpers
src/lib/cache.ts            cache tags + revalidateTags()
src/config/site.ts          public site config + nav
```

## Rules baked in

- Internal navigation uses `next/link`; external links open in a new tab with `rel="noopener noreferrer"`.
- Public queries use explicit `select`; `ModelPrivate` (phone/email) is never selected.
- Every admin action must call `requireAdmin()` first; every mutation must call `revalidateTags(...)`.
- Rate limiting is in-memory; swap `src/lib/security/rate-limit.ts` for Upstash/Redis on multi-instance hosting.
- Optional: put a transparent logo at `public/watermark.png` to replace the default wave watermark.

## Deploy (Vercel + Neon)

Set the same env vars in Vercel, use `npm run db:deploy` for migrations, and set
`NEXT_PUBLIC_SITE_URL` to the production URL.
