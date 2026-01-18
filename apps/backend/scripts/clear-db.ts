import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import { config } from 'dotenv';

// Load environment variables
config({ path: 'secret/.env' });

async function clearDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, {
    logger: true,
  });

  try {
    console.log('🧹 Clearing database...');

    // Delete in reverse order of dependencies to avoid foreign key constraints

    // Most dependent tables first
    await db.execute(sql`DELETE FROM chat_message`);
    console.log('✅ Cleared chat_message');

    await db.execute(sql`DELETE FROM chat_room_member`);
    console.log('✅ Cleared chat_room_member');

    await db.execute(sql`DELETE FROM participation`);
    console.log('✅ Cleared participation');

    await db.execute(sql`DELETE FROM scrap`);
    console.log('✅ Cleared scrap');

    await db.execute(sql`DELETE FROM recruitment_detail`);
    console.log('✅ Cleared recruitment_detail');

    await db.execute(sql`DELETE FROM chat_room`);
    console.log('✅ Cleared chat_room');

    await db.execute(sql`DELETE FROM post`);
    console.log('✅ Cleared post');

    // Member-dependent tables
    await db.execute(sql`DELETE FROM warn`);
    console.log('✅ Cleared warns');

    await db.execute(sql`DELETE FROM report`);
    console.log('✅ Cleared reports');

    await db.execute(sql`DELETE FROM report_count`);
    console.log('✅ Cleared report_count');

    await db.execute(sql`DELETE FROM profile`);
    console.log('✅ Cleared profiles');

    // Base table
    await db.execute(sql`DELETE FROM member`);
    console.log('✅ Cleared members');

    // Reset sequences (optional, for clean ID numbering)
    await db.execute(sql`ALTER SEQUENCE chat_message_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE chat_room_member_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE chat_room_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE participation_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE scrap_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE recruitment_detail_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE post_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE warn_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE report_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE report_count_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE profile_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE member_id_seq RESTART WITH 1`);
    console.log('✅ Reset ID sequences');

    console.log('🎉 Database cleared successfully!');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

clearDatabase()
  .then(() => {
    console.log('Database clearing completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database clearing failed:', err);
    process.exit(1);
  });
