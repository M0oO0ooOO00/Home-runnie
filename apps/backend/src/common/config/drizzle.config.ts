import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 여기 안걸어주면 서브모듈에서 env 불러오기 불가능...
config({ path: path.resolve(__dirname, '../../../secret/.env') });

export default {
    schema: './src/**/*.entity.ts',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        user: process.env.DB_USERNAME ?? '',
        password: String(process.env.DB_PASSWORD ?? ''),
        database: process.env.DB_NAME ?? '',
        ssl: false,
    },
} satisfies Config;
