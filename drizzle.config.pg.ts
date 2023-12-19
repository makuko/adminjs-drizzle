import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './test/pg/schema.ts',
    out: './drizzle/pg',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.MYSQL_CONNECTION ?? ''
    }
} satisfies Config;
