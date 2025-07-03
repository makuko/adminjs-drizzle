import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './test/mysql/schema.ts',
    out: process.env.MYSQL_MIGRATIONS!,
    dialect: 'mysql',
    // dbCredentials: {
    //     url: process.env.MYSQL_URL!
    // }
} satisfies Config;
