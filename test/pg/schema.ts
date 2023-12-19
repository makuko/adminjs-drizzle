import { Relations, relations } from 'drizzle-orm';
import {
    bigint,
    bigserial,
    boolean,
    date,
    doublePrecision,
    integer,
    interval,
    json,
    jsonb,
    numeric,
    pgEnum,
    pgTable,
    PgTableWithColumns,
    real,
    serial,
    smallint,
    smallserial,
    text,
    time,
    timestamp,
    varchar
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull()
    }
);

export const userRelations: Relations = relations(
    usersTable,
    ({ many }) => ({
        posts: many(postsTable)
    })
);

export const postsTable = pgTable(
	'posts',
	{
		id: serial('id').primaryKey(),
		content: text('content').notNull(),
		authorId: integer('author_id').notNull().references(() => usersTable.id)
	}
);

export const postRelations: Relations = relations(
	postsTable,
	({ one }) => ({
		author: one(usersTable, { fields: [postsTable.authorId], references: [usersTable.id] })
	})
);

export const enumEnum = pgEnum('enum', ['lorem', 'ipsum', 'dolor']);

export const typesTable = pgTable(
    'types',
    {
        id: serial('id').primaryKey(),

        serial: serial('serial'),
        smallserial: smallserial('smallserial'),
        bigserial: bigserial('bigserial', { mode: 'number' }),
        integer: integer('integer'),
        smallint: smallint('smallint'),
        bigint: bigint('bigint', { mode: 'number' }),
        
        numeric: numeric('numeric'),
        real: real('real'),
        doublePrecision: doublePrecision('double_precision'),

        text: text('text'),
        varchar: varchar('varchar'),
        enum: enumEnum('enum'),
        textEnum: text('text_enum', { enum: ['lorem', 'ipsum', 'dolor'] }),
        varcharEnum: varchar('varchar_enum', { enum: ['lorem', 'ipsum', 'dolor'] }),

        boolean: boolean('boolean'),
        
        time: time('time'),
        timestamp: timestamp('timestamp'),
        date: date('date'),
        interval: interval('interval'),

        json: json('json'),
        jsonb: jsonb('jsonb')
    }
);
