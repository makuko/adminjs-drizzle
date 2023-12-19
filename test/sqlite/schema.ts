import { Relations, relations } from 'drizzle-orm';
import { blob, integer, real, sqliteTable, SQLiteTableWithColumns, text } from 'drizzle-orm/sqlite-core';

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
        real: real('real'),
        bigint: blob('bigint', { mode: 'bigint' }),

        text: text('text'),
        enum: text('enum', { enum: ['lorem', 'ispum', 'dolor'] }),

        boolean: integer('boolean', { mode: 'boolean' }),
        
        timestamp: integer('timestamp', { mode: 'timestamp' }),
        timestampMS: integer('timestamp_ms', { mode: 'timestamp_ms' }),

        buffer: blob('buffer', { mode: 'buffer' }),
        json: blob('json', { mode: 'json' })
    }
);
