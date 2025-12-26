"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: 'secret/.env' });
async function dropDatabase() {
    const client = new pg_1.Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        console.log('🗑️  Dropping all tables and types...');
        const tables = await client.query(`
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public'
        `);
        for (const table of tables.rows) {
            await client.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
            console.log(`📋 Dropped table: ${table.tablename}`);
        }
        const types = await client.query(`
            SELECT typname FROM pg_type 
            WHERE typtype = 'e' AND typnamespace = (
                SELECT oid FROM pg_namespace WHERE nspname = 'public'
            )
        `);
        for (const type of types.rows) {
            await client.query(`DROP TYPE IF EXISTS "${type.typname}" CASCADE`);
            console.log(`🏷️  Dropped type: ${type.typname}`);
        }
        console.log('✅ Database cleanup complete!');
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
    finally {
        await client.end();
    }
}
void dropDatabase();
//# sourceMappingURL=drop-db.js.map