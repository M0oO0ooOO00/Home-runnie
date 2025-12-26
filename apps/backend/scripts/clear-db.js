"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const drizzle_orm_1 = require("drizzle-orm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: 'secret/.env' });
async function clearDatabase() {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const db = (0, node_postgres_1.drizzle)(pool, {
        logger: true,
    });
    try {
        console.log('🧹 Clearing database...');
        await db.execute((0, drizzle_orm_1.sql) `DELETE FROM warn`);
        console.log('✅ Cleared warns');
        await db.execute((0, drizzle_orm_1.sql) `DELETE FROM report`);
        console.log('✅ Cleared reports');
        await db.execute((0, drizzle_orm_1.sql) `DELETE FROM report_count`);
        console.log('✅ Cleared report_count');
        await db.execute((0, drizzle_orm_1.sql) `DELETE FROM profile`);
        console.log('✅ Cleared profiles');
        await db.execute((0, drizzle_orm_1.sql) `DELETE FROM member`);
        console.log('✅ Cleared members');
        await db.execute((0, drizzle_orm_1.sql) `ALTER SEQUENCE warn_id_seq RESTART WITH 1`);
        await db.execute((0, drizzle_orm_1.sql) `ALTER SEQUENCE report_id_seq RESTART WITH 1`);
        await db.execute((0, drizzle_orm_1.sql) `ALTER SEQUENCE report_count_id_seq RESTART WITH 1`);
        await db.execute((0, drizzle_orm_1.sql) `ALTER SEQUENCE profile_id_seq RESTART WITH 1`);
        await db.execute((0, drizzle_orm_1.sql) `ALTER SEQUENCE member_id_seq RESTART WITH 1`);
        console.log('✅ Reset ID sequences');
        console.log('🎉 Database cleared successfully!');
    }
    catch (error) {
        console.error('❌ Failed to clear database:', error);
        throw error;
    }
    finally {
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
//# sourceMappingURL=clear-db.js.map