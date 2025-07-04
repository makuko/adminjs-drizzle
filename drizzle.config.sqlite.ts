import type { Config } from 'drizzle-kit';

export default {
    schema: './test/sqlite/schema.ts',
    out: './.drizzle/sqlite',
    dialect: 'turso'
} satisfies Config;
