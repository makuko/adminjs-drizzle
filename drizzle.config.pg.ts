import type { Config } from 'drizzle-kit';

export default {
    schema: './test/pg/schema.ts',
    out: './.drizzle/pg',
    dialect: 'postgresql'
} satisfies Config;
