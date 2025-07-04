import type { Config } from 'drizzle-kit';

export default {
    schema: './test/mysql/schema.ts',
    out: './.drizzle/mysql',
    dialect: 'mysql'
} satisfies Config;
