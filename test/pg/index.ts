import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import Fastify from 'fastify';
import postgres from 'postgres';

import * as PgAdapter from '../../src/pg/index.js';
import * as schema from './schema.js';

AdminJS.registerAdapter(PgAdapter);

const PORT = 3000;

async function start() {
    const client = postgres(process.env.PG_CONNECTION ?? '');
    const db = drizzle(client, { schema, logger: true });

    await migrate(db, { migrationsFolder: './drizzle/pg' });

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
