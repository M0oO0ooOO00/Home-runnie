import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as fs from 'node:fs';
import * as path from 'node:path';

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const resolveMigrationsFolder = (): string => {
  const candidates = [
    path.resolve(__dirname, '../../drizzle/migrations'),
    path.resolve(process.cwd(), 'drizzle/migrations'),
    path.resolve(process.cwd(), 'apps/backend/drizzle/migrations'),
  ];

  for (const candidate of candidates) {
    const journalPath = path.join(candidate, 'meta', '_journal.json');
    if (fs.existsSync(journalPath)) return candidate;
  }

  throw new Error(`Cannot find Drizzle migration meta file. Checked: ${candidates.join(', ')}`);
};

async function run(): Promise<void> {
  const isProd = process.env.NODE_ENV === 'production';
  const migrationsFolder = resolveMigrationsFolder();

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
    await migrate(db, { migrationsFolder });

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
