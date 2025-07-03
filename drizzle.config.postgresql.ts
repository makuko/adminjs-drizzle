import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './test/postgresql/schema.ts',
    out: process.env.POSTGRESQL_MIGRATIONS,
    dialect: 'postgresql',
    // driver: 'pglite',
    // dbCredentials: {
    //     url: process.env.POSTGRESQL_URL!
    // }
} satisfies Config;
