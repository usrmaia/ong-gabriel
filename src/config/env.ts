import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  AUTH_GOOGLE_ID: z.string().nonempty(),
  AUTH_GOOGLE_SECRET: z.string().nonempty(),
  AUTH_FACEBOOK_ID: z.string().nonempty(),
  AUTH_FACEBOOK_SECRET: z.string().nonempty(),

  SECURE_COOKIES_ENABLED: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),

  LOG_FILE_ENABLED: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),
  NEXT_PUBLIC_HOTJAR_ID: z.string().optional(),

  // Rate Limiting Configuration
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RATE_LIMIT_ENABLED: z
    .string()
    .optional()
    .default("true")
    .transform((val) => val?.trim().toLowerCase() === "true"),
  RATE_LIMIT_REQUESTS_PER_WINDOW: z
    .string()
    .optional()
    .default("100")
    .transform((val) => parseInt(val!, 10)),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .default("60000")
    .transform((val) => parseInt(val!, 10)),
});

const env = await envSchema.parseAsync(process.env);

export { env };
