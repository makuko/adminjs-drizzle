import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import Fastify from 'fastify';
import * as MySqlAdapter from '../../src/mysql/index.js';
import * as schema from './schema.js';

AdminJS.registerAdapter(MySqlAdapter);

const PORT = 3000;

async function start() {
    const db = drizzle(process.env.MYSQL_URL!);

    await migrate(db, { migrationsFolder: './.drizzle/mysql' });

    await db.insert(schema.typesTable).values({
        int: 4711,
        tinyint: 47,
        smallint: 4711,
        mediumint: 4711,
        bigint: 4711,
        bigintBig: 4711n,
        
        real: 47.11,
        decimal: '4711',
        decimalNum: 4711,
        decimalBig: 4711n,
        double: 47.11,
        float: 47.11,

        binary: 'foo',
        varbinary: 'foo',

        char: 'foo',
        varchar: 'foo',
        varcharEnum: 'foo',
        text: 'foo',
        textEnum: 'foo',

        boolean: true,

        date: new Date(),
        datetime: new Date(),
        datetimeStr: new Date().toISOString().slice(0, 19).replace('T', ' '),
        time: '11:47:00',
        year: 2025,
        timestamp: new Date(),
        timestampStr: new Date().toISOString().slice(0, 19).replace('T', ' '),

        json: { foo: 'bar', baz: 0 },

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
