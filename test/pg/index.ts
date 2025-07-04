import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import Fastify from 'fastify';
import * as PgAdapter from '../../src/pg/index.js';
import * as schema from './schema.js';

AdminJS.registerAdapter(PgAdapter);

const PORT = 3000;

async function start() {
    const db = drizzle();

    await migrate(db, { migrationsFolder: './.drizzle/pg' });

    await db.insert(schema.typesTable).values({
        integer: 4711,
        smallint: 4711,
        bigint: 4711,

        boolean: true,

        text: 'foo',
        textEnum: 'foo',
        varchar: 'foo',
        varcharEnum: 'foo',
        char: 'foo',
        charEnum: 'foo',

        numeric: '47.11',
        numericNum: 47.11,
        numericBig: 4711n,
        real: 47.11,
        doublePrecision: 47.11,

        json: { foo: 'bar', baz: 0 },
        jsonb: { foo: 'bar', baz: 0 },

        time: '11:47:00',
        timestamp: new Date(),
        date: new Date(),
        dateStr: new Date().toISOString(),
        interval: '47 days 11 hours',

        point: [1, 2],
        pointObj: { x: 1, y: 2},
        line: [1, 2, 3],
        lineObj: { a: 1, b: 2, c: 3},

        enum: 'foo'
    });

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
