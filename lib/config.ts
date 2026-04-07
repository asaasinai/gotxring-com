import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  RESEND_API_KEY: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  ADMIN_USERNAME: z.string().default('garye'),
  ADMIN_PASSWORD_HASH: z
    .string()
    .default('$2b$12$oulMcKFXOdB9MsLDIjoPqOwXCUSm7cVuE8iNyr20DKJs908m/P3de')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. Check required env vars.');
}

export const env = parsed.data;
