import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DEBUG: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),

  AUTH_SECRET: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_FACEBOOK_ID: z.string().optional(),
  AUTH_FACEBOOK_SECRET: z.string().optional(),

  EMAIL_GOOGLE_USER: z.string().optional(),
  EMAIL_GOOGLE_ID: z.string().optional(),
  EMAIL_GOOGLE_SECRET: z.string().optional(),
  EMAIL_GOOGLE_REFRESH_TOKEN: z.string().optional(),
  EMAIL_GOOGLE_ACCESS_TOKEN: z.string().optional(),
  EMAIL_IMG_PUBLIC_URL: z.string().url(),

  SECURE_COOKIES_ENABLED: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),

  LOG_FILE_ENABLED: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),
  NEXT_PUBLIC_HOTJAR_ID: z.string().optional(),
  NEXT_PUBLIC_URL: z.string().optional(),

  FEEDBACK_FORM: z.string().url().optional(),
});

const env = envSchema.parse(process.env);

export { env };
