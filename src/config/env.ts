import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

function validateEnv(_data:any) {
  const {success, data, error} = envSchema.safeParse(_data)

  if (!success)
    throw new Error(`❌ Invalid environment variables: ${error.message}`)

  return data
}

console.log(process.env)

export const env = validateEnv(process.env)