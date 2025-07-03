import AdminJSFastify from '@adminjs/fastify';
import { createClient } from '@libsql/client';
import AdminJS from 'adminjs';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import Fastify from 'fastify';

import * as SQLiteAdapter from '../../src/sqlite/index.js';
import * as schema from './schema.js';

AdminJS.registerAdapter(SQLiteAdapter);

const PORT = 3000;

async function start() {
    const client = createClient({ url: process.env.SQLITE_URL! });
    const db = drizzle({ client, schema, logger: true });

    migrate(db, { migrationsFolder: process.env.SQLITE_MIGRATIONS! });

    const app = Fastify();
    const admin = new AdminJS({
        resources: [
            { table: schema.usersTable, db },
            { table: schema.postsTable, db },
            { table: schema.typesTable, db }
        ],
        // databases: [{ db, schema }],
        rootPath: '/admin'
    });

    await AdminJSFastify.buildRouter(admin, app);

    app.listen({ port: PORT }, err => {
        if (err) {
            console.error(err);
        } else {
            console.log(`AdminJS started on http://localhost:${ PORT }${ admin.options.rootPath }`);
        }
    })
}

start();
