import AdminJSFastify from '@adminjs/fastify';
import { PGlite } from '@electric-sql/pglite';
import AdminJS from 'adminjs';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import Fastify from 'fastify';

import * as PgAdapter from '../../src/postgresql/index.js';
import * as schema from './schema.js';

AdminJS.registerAdapter(PgAdapter);

const PORT = 3000;

async function start() {
    const client = new PGlite(process.env.POSTGRESQL_URL);
    const db = drizzle({ client, schema, logger: true });

    await migrate(db, { migrationsFolder: process.env.POSTGRESQL_MIGRATIONS! });

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
