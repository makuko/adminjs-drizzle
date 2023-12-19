import type { Config } from 'drizzle-kit';

export default {
    schema: './test/sqlite/schema.ts',
    out: './drizzle/sqlite',
    driver: 'better-sqlite',
    dbCredentials: {
        url: './db.sqlite'
    }
} satisfies Config;
