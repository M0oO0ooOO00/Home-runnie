import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';

dotenv.config({ path: 'secret/.env' });

async function manualMigrate(): Promise<void> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Running manual migration...');

    const sqlFile = fs.readFileSync('drizzle/migrations/0000_clean_richard_fisk.sql', 'utf-8');
    const statements = sqlFile.split('--> statement-breakpoint').filter((s) => s.trim());

    for (const statement of statements) {
      const sql = statement.trim();
      if (!sql) continue;

      try {
        await client.query(sql);
        console.log('Executed:', sql.split('\n')[0]);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log('Skipped statement due to error:', sql.split('\n')[0], message);
      }
    }

    console.log('Manual migration completed.');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void manualMigrate();
