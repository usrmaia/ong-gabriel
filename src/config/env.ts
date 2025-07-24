import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  AUTH_GOOGLE_ID: z.string().nonempty(),
  AUTH_GOOGLE_SECRET: z.string().nonempty(),
  AUTH_FACEBOOK_ID: z.string().nonempty(),
  AUTH_FACEBOOK_SECRET: z.string().nonempty(),

  LOG_FILE_ENABLED: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),
});

const env = await envSchema.parseAsync(process.env);

export { env };
