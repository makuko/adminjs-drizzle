import { BaseDatabase } from 'adminjs';
import { BaseSQLiteDatabase, SQLiteTable, SQLiteTableWithColumns, TableConfig } from 'drizzle-orm/sqlite-core';
import { Resource } from './resource.js';

export class Database extends BaseDatabase {

    private db: BaseSQLiteDatabase<'async', any>;

    private schema: Record<string, SQLiteTableWithColumns<TableConfig>>;

    constructor(args: DatabaseConfig) {
        super(args);

        const { db, schema } = args;

        this.db = db;
        this.schema = schema;
    }

    public resources(): Resource[] {
        const res: Resource[] = [];

        const { db, schema } = this;

        if (!schema) {
            return res;
        }

        for (const table of Object.values(schema)) {
            if (table instanceof SQLiteTable) {
                res.push(new Resource({ table, db }));
            }
        }

        return res;
    }

    public static isAdapterFor(args?: Partial<DatabaseConfig>): boolean {
        const { db } = args ?? {};

        return db instanceof BaseSQLiteDatabase;
    }

}

interface DatabaseConfig {
    db: BaseSQLiteDatabase<'async', any>;
    schema: Record<string, SQLiteTableWithColumns<TableConfig>>;
}
