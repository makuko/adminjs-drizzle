import { Relations, relations } from 'drizzle-orm';
import {
    bigint,
    binary,
    boolean,
    char,
    customType,
    date,
    datetime,
    decimal,
    double,
    float,
    int,
    json,
    mediumint,
    mysqlEnum,
    mysqlTable,
    real,
    serial,
    smallint,
    text,
    time,
    timestamp,
    tinyint,
    varbinary,
    varchar,
    year,
} from 'drizzle-orm/mysql-core';

const unsignedBigint = customType<{ data: number, driverData: number }>({
    dataType() {
        return 'bigint UNSIGNED';
    }
});

export const usersTable = mysqlTable(
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

export const postsTable = mysqlTable(
	'posts',
	{
		id: serial('id').primaryKey(),
		content: text('content').notNull(),
		authorId: unsignedBigint('author_id', { mode: 'number' }).notNull().references(() => usersTable.id)
	}
);

export const postRelations: Relations = relations(
	postsTable,
	({ one }) => ({
		author: one(usersTable, { fields: [postsTable.authorId], references: [usersTable.id] })
	})
);

export const typesTable = mysqlTable(
    'types',
    {
        id: serial('id').primaryKey(),

        int: int('int'),
        tinyint: tinyint('tinyint'),
        smallint: smallint('smallint'),
        mediumint: mediumint('mediumint'),
        bigint: bigint('bigint', { mode: 'number' }),
        bigintBig: bigint('bigint_big', { mode: 'bigint' }),
        
        real: real('real'),
        decimal: decimal('decimal'),
        decimalNum: decimal('decimal_num', { mode: 'number' }),
        decimalBig: decimal('decimal_big', { mode: 'bigint' }),
        double: double('double'),
        float: float('float'),

        binary: binary('binary', { length: 3 }),
        varbinary: varbinary('varbinary', { length: 3 }),

        char: char('char', { length: 3 }),
        varchar: varchar('varchar', { length: 3 }),
        varcharEnum: varchar('varchar_enum', { length: 3, enum: ['foo', 'bar', 'baz'] }),
        text: text('text'),
        textEnum: text('text_enum', { enum: ['foo', 'bar', 'baz'] }),

        boolean: boolean('boolean'),

        date: date('date'),
        datetime: datetime('datetime'),
        datetimeStr: datetime('datetime_str', { mode: 'string' }),
        time: time('time'),
        year: year('year'),
        timestamp: timestamp('timestamp'),
        timestampStr: timestamp('timestamp_str', { mode: 'string' }),

        json: json('json'),

        enum: mysqlEnum('enum', ['foo', 'bar', 'baz'])
    }
);
