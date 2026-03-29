import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const maskConnectionTarget = (connectionString: string): string => {
  try {
    const url = new URL(connectionString);
    const host = url.hostname || 'unknown-host';
    const port = url.port || '5432';
    const database = url.pathname.replace(/^\//, '') || 'unknown-db';
    return `${host}:${port}/${database}`;
  } catch {
    return 'invalid DATABASE_URL';
  }
};

const resolveMigrationsFolder = (): string => {
  const candidates = [
    resolve(__dirname, '../../drizzle/migrations'),
    resolve(process.cwd(), 'drizzle/migrations'),
    resolve(process.cwd(), 'apps/backend/drizzle/migrations'),
  ];

  for (const candidate of candidates) {
    const journalPath = join(candidate, 'meta', '_journal.json');
    if (existsSync(journalPath)) return candidate;
  }

  throw new Error(`Cannot find Drizzle migration meta file. Checked: ${candidates.join(', ')}`);
};

async function run(): Promise<void> {
  const isProd = process.env.NODE_ENV === 'production';
  const migrationsFolder = resolveMigrationsFolder();
  const connectionString = process.env.DATABASE_URL;

  const pool = connectionString
    ? new Pool({
        connectionString,
        ssl: isProd ? { rejectUnauthorized: false } : undefined,
      })
    : new Pool({
        host: process.env.DB_HOST ?? 'localhost',
        port: parsePort(process.env.DB_PORT, 5432),
        user: process.env.DB_USERNAME ?? '',
        password: String(process.env.DB_PASSWORD ?? ''),
        database: process.env.DB_NAME ?? '',
        ssl: isProd ? { rejectUnauthorized: false } : undefined,
      });

  try {
    if (connectionString) {
      console.log(`[Drizzle] Using DATABASE_URL target: ${maskConnectionTarget(connectionString)}`);
    } else {
      console.log(
        `[Drizzle] Using DB_* target: ${process.env.DB_HOST ?? 'localhost'}:${parsePort(process.env.DB_PORT, 5432)}/${process.env.DB_NAME ?? ''}`,
      );
    }

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
