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
    MySqlTableWithColumns,
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
        
        real: real('real'),
        decimal: decimal('decimal'),
        double: double('double'),
        float: float('float'),

        char: char('char'),
        varchar: varchar('varchar', { length: 10 }),
        text: text('text'),
        textEnum: text('text_enum', { enum: ['lorem', 'ipsum', 'dolor'] }),
        enum: mysqlEnum('enum', ['lorem', 'ipsum', 'dolor']),

        boolean: boolean('boolean'),

        date: date('date'),
        datetime: datetime('datetime'),
        time: time('time'),
        year: year('year'),
        timestamp: timestamp('timestamp'),

        binary: binary('binary'),
        varbinary: varbinary('varbinary', { length: 2 }),
        json: json('json')
    }
);
