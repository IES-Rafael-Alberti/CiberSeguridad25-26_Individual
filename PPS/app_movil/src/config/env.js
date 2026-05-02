import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const emptyStringToUndefined = (value) => (value === "" ? undefined : value);

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET debe tener al menos 16 caracteres"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET debe tener al menos 16 caracteres").optional(),
  ACCESS_TOKEN_TTL: z.string().default("2h"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.preprocess(emptyStringToUndefined, z.string().url().optional()),
  SUPABASE_URL: z.preprocess(emptyStringToUndefined, z.string().url().optional()),
  SUPABASE_ANON_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),
  APP_ORIGIN: z.string().url().default("http://localhost:3000")
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variables de entorno invalidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  JWT_SECRET: parsed.data.JWT_SECRET || parsed.data.SESSION_SECRET
};
