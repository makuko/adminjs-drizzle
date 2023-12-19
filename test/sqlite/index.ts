import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Fastify from 'fastify';

import * as SQLiteAdapter from '../../src/sqlite/index.js';
import * as schema from './schema.js';

AdminJS.registerAdapter(SQLiteAdapter);

const PORT = 3000;

async function start() {
    const sqlite = new Database('db.sqlite');
    const db = drizzle(sqlite, { schema, logger: true });

    migrate(db, { migrationsFolder: './drizzle/sqlite' });

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
