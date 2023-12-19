import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import Fastify from 'fastify';
import mysql from 'mysql2/promise';

import * as MySqlAdapter from '../../src/mysql/index.js';
import * as schema from './schema.js';

AdminJS.registerAdapter(MySqlAdapter);

const PORT = 3000;

async function start() {
    const connection = await mysql.createConnection(process.env.MYSQL_CONNECTION ?? '');

    const db = drizzle(connection, { schema, logger: true });

    await migrate(db, { migrationsFolder: './drizzle/mysql' });

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
