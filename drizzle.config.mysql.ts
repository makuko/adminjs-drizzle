import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './test/mysql/schema.ts',
    out: './drizzle/mysql',
    driver: 'mysql2',
    dbCredentials: {
        connectionString: process.env.PG_CONNECTION ?? ''
    }
} satisfies Config;
