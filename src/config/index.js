import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  ADMIN_PASSWORD_HASH: z.string().optional(),
  NODE_ENV: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;
