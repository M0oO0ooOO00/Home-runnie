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
const fs = __importStar(require("fs"));
dotenv.config({ path: 'secret/.env' });
async function manualMigrate() {
    const client = new pg_1.Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        console.log('🚀 수동 마이그레이션 진행...');
        const sqlFile = fs.readFileSync('drizzle/migrations/0000_clean_richard_fisk.sql', 'utf-8');
        const statements = sqlFile.split('--> statement-breakpoint').filter(s => s.trim());
        for (const statement of statements) {
            const sql = statement.trim();
            if (sql) {
                try {
                    await client.query(sql);
                    console.log('✅ Executed:', sql.split('\n')[0]);
                }
                catch (error) {
                    console.log('⚠️  Skipped statement due to error:', sql.split('\n')[0], error.message);
                }
            }
        }
        console.log('🎉 수동 마이그레이션 성공!');
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
    finally {
        await client.end();
    }
}
void manualMigrate();
//# sourceMappingURL=manual-migrate.js.map