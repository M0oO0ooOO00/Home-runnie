import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
import * as path from 'path';

// 여기 안걸어주면 서브모듈에서 env 불러오기 불가능...
const envFile = process.env.NODE_ENV === 'production' ? 'prod.env' : '.env';
config({ path: path.resolve(__dirname, `../../../secret/${envFile}`) });

const databaseUrl = process.env.DATABASE_URL;
const useSsl =
  process.env.NODE_ENV === 'production' ||
  process.env.DB_SSL === 'true' ||
  databaseUrl?.includes('supabase.co') ||
  databaseUrl?.includes('pooler.supabase.com');
const databaseUrlWithSsl = (() => {
  if (!databaseUrl || !useSsl) return databaseUrl;

  const url = new URL(databaseUrl);
  if (!url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require');
  }
  return url.toString();
})();

export default {
  schema: './src/**/*.entity.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: databaseUrl
    ? {
        url: databaseUrlWithSsl ?? databaseUrl,
      }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        user: process.env.DB_USERNAME ?? '',
        password: String(process.env.DB_PASSWORD ?? ''),
        database: process.env.DB_NAME ?? '',
        ssl: useSsl ? { rejectUnauthorized: false } : (false as any),
      },
} satisfies Config;
