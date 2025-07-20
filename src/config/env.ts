import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DEBUG: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),

  AUTH_SECRET: z.string().nonempty(),
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
});

const env = envSchema.parse(process.env);

export { env };
