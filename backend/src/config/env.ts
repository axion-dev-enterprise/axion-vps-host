import { z } from "zod";

const runtimeEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  CORS_ORIGIN: z.string().min(1),
  DATABASE_URL: z.string().min(1).optional(),
  APP_BASE_URL: z.string().url().default("https://pontotecc.axionenterprise.cloud"),
  CATALOG_SITE_URL: z.string().url().default("https://www.gsmarena.com"),
  CATALOG_SEARCH_TERMS: z.string().min(1).default(
    "apple,samsung,xiaomi,motorola,google,realme",
  ),
  ADMIN_EMAIL: z.string().email().default("admin@pontotecc.local"),
  ADMIN_PASSWORD: z.string().min(8).default("PontoTecc123!"),
  ADMIN_SESSION_HOURS: z.coerce.number().int().min(1).max(168).default(12),
  SERVERSPACE_WORKER_BASE_URL: z.string().url().optional(),
  SERVERSPACE_WORKER_TOKEN: z.string().min(1).optional(),
  CLOUDFLARE_API_BASE_URL: z.string().url().default("https://api.cloudflare.com/client/v4"),
  CLOUDFLARE_API_TOKEN: z.string().min(1).optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1).optional(),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASSWORD: z.string().min(1).optional(),
  SMTP_FROM: z.string().min(1).optional(),
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export function getRuntimeEnv(
  overrides: Partial<Record<keyof RuntimeEnv, string>> = {},
): RuntimeEnv {
  const raw = {
    NODE_ENV: overrides.NODE_ENV ?? process.env.NODE_ENV,
    PORT: overrides.PORT ?? process.env.PORT,
    CORS_ORIGIN: overrides.CORS_ORIGIN ?? process.env.CORS_ORIGIN,
    DATABASE_URL: overrides.DATABASE_URL ?? process.env.DATABASE_URL,
    APP_BASE_URL: overrides.APP_BASE_URL ?? process.env.APP_BASE_URL,
    CATALOG_SITE_URL: overrides.CATALOG_SITE_URL ?? process.env.CATALOG_SITE_URL,
    CATALOG_SEARCH_TERMS: overrides.CATALOG_SEARCH_TERMS ?? process.env.CATALOG_SEARCH_TERMS,
    ADMIN_EMAIL: overrides.ADMIN_EMAIL ?? process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: overrides.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_HOURS: overrides.ADMIN_SESSION_HOURS ?? process.env.ADMIN_SESSION_HOURS,
    SERVERSPACE_WORKER_BASE_URL: overrides.SERVERSPACE_WORKER_BASE_URL ?? process.env.SERVERSPACE_WORKER_BASE_URL,
    SERVERSPACE_WORKER_TOKEN: overrides.SERVERSPACE_WORKER_TOKEN ?? process.env.SERVERSPACE_WORKER_TOKEN,
    CLOUDFLARE_API_BASE_URL: overrides.CLOUDFLARE_API_BASE_URL ?? process.env.CLOUDFLARE_API_BASE_URL,
    CLOUDFLARE_API_TOKEN: overrides.CLOUDFLARE_API_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ACCOUNT_ID: overrides.CLOUDFLARE_ACCOUNT_ID ?? process.env.CLOUDFLARE_ACCOUNT_ID,
    SMTP_HOST: overrides.SMTP_HOST ?? process.env.SMTP_HOST,
    SMTP_PORT: overrides.SMTP_PORT ?? process.env.SMTP_PORT,
    SMTP_SECURE: overrides.SMTP_SECURE ?? process.env.SMTP_SECURE,
    SMTP_USER: overrides.SMTP_USER ?? process.env.SMTP_USER,
    SMTP_PASSWORD: overrides.SMTP_PASSWORD ?? process.env.SMTP_PASSWORD,
    SMTP_FROM: overrides.SMTP_FROM ?? process.env.SMTP_FROM,
  };

  const parsed = runtimeEnvSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Invalid runtime environment");
  }

  return parsed.data;
}

