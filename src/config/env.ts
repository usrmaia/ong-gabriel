import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  AUTH_GOOGLE_ID: z.string().nonempty(),
  AUTH_GOOGLE_SECRET: z.string().nonempty(),
  AUTH_FACEBOOK_ID: z.string().nonempty(),
  AUTH_FACEBOOK_SECRET: z.string().nonempty(),
});

function validateEnv(_data: any) {
  const { success, data, error } = envSchema.safeParse(_data);

  if (!success)
    throw new Error(`❌ Invalid environment variables: ${error.message}`);

  return data;
}

export const env = validateEnv(process.env);
