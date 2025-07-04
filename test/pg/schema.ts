import { Relations, relations } from 'drizzle-orm';
import {
    bigint,
    bigserial,
    boolean,
    char,
    date,
    doublePrecision,
    integer,
    interval,
    json,
    jsonb,
    line,
    numeric,
    pgEnum,
    pgTable,
    point,
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

export const enumEnum = pgEnum('enum', ['foo', 'bar', 'baz']);

export const typesTable = pgTable(
    'types',
    {
        id: serial('id').primaryKey(),

        integer: integer('integer'),
        smallint: smallint('smallint'),
        bigint: bigint('bigint', { mode: 'number' }),

        serial: serial('serial'),
        smallserial: smallserial('smallserial'),
        bigserial: bigserial('bigserial', { mode: 'number' }),

        boolean: boolean('boolean'),

        text: text('text'),
        textEnum: text('text_enum', { enum: ['foo', 'bar', 'baz'] }),
        varchar: varchar('varchar'),
        varcharEnum: varchar('varchar_enum', { enum: ['foo', 'bar', 'baz'] }),
        char: char('char', { length: 3 }),
        charEnum: char('char_enum', { length: 3, enum: ['foo', 'bar', 'baz'] }),
        
        numeric: numeric('numeric'),
        numericNum: numeric('numeric_num', { mode: 'number' }),
        numericBig: numeric('numeric_big', { mode: 'bigint' }),
        real: real('real'),
        doublePrecision: doublePrecision('double_precision'),

        json: json('json'),
        jsonb: jsonb('jsonb'),

        time: time('time'),
        timestamp: timestamp('timestamp'),
        date: date('date', { mode: 'date' }),
        dateStr: date('date_str', { mode: 'string' }),
        interval: interval('interval'),

        point: point(),
        pointObj: point({ mode: 'xy' }),
        line: line(),
        lineObj: line({ mode: 'abc' }),

        enum: enumEnum('enum')
    }
);
