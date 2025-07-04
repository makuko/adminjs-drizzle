import { Relations, relations } from 'drizzle-orm';
import { blob, integer, numeric, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable(
    'users',
    {
        id: integer('id').primaryKey(),
        name: text('name').notNull()
    }
);

export const userRelations: Relations = relations(
    usersTable,
    ({ many }) => ({
        posts: many(postsTable)
    })
);

export const postsTable = sqliteTable(
	'posts',
	{
		id: integer('id').primaryKey(),
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

export const typesTable = sqliteTable(
    'types',
    {
        id: integer('id').primaryKey(),

        integer: integer('integer'),
        integerBoolean: integer('integer_boolean', { mode: 'boolean' }),
        integerTimestampMs: integer('integer_timstamp_ms', { mode: 'timestamp_ms' }),
        integerTimestamp: integer('integer_timestamp', { mode: 'timestamp' }),

        real: real('real'),

        text: text('text'),
        textEnum: text('text_enum', { enum: ['foo', 'bar', 'baz'] }),
        textJson: text('text_json', { mode: 'json' }),

        blobBuffer: blob('blob_buffer', { mode: 'buffer' }),
        blobJson: blob('blob_json', { mode: 'json' }),
        blobBigint: blob('blob_bigint', { mode: 'bigint' }),

        numeric: numeric('numeric'),
        numericNum: numeric('numeric_num', { mode: 'number' }),
        numericBig: numeric('numeric_big', { mode: 'bigint' })
    }
);
