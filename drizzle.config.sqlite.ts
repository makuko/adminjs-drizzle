import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './test/sqlite/schema.ts',
    out: process.env.SQLITE_MIGRATIONS,
    dialect: 'turso',
    // dbCredentials: {
    //     url: process.env.SQLITE_URL!
    // }
} satisfies Config;
