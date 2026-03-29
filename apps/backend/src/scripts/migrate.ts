import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

async function run(): Promise<void> {
  const isProd = process.env.NODE_ENV === 'production';

  const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: parsePort(process.env.DB_PORT, 5432),
    user: process.env.DB_USERNAME ?? '',
    password: String(process.env.DB_PASSWORD ?? ''),
    database: process.env.DB_NAME ?? '',
    ssl: isProd ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: './drizzle/migrations' });

    console.log('[Drizzle] Migration applied successfully.');
  } finally {
    await pool.end();
  }
}

void run().catch((error: unknown) => {
  console.error('[Drizzle] Migration failed.');

  console.error(error);
  process.exit(1);
});
