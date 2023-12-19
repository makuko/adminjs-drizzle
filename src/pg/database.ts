import { BaseDatabase } from 'adminjs';
import { PgDatabase, PgTable, PgTableWithColumns, QueryResultHKT, TableConfig } from 'drizzle-orm/pg-core';

import { Resource } from './resource.js';

export class Database extends BaseDatabase {

    private db: PgDatabase<QueryResultHKT>;

    private schema: Record<string, PgTableWithColumns<TableConfig>>;

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
            if (table instanceof PgTable) {
                res.push(new Resource({ table, db }));
            }
        }

        return res;
    }

    public static isAdapterFor(args?: Partial<DatabaseConfig>): boolean {
        const { db } = args ?? {};

        return db instanceof PgDatabase;
    }

}

interface DatabaseConfig {
    db: PgDatabase<QueryResultHKT>;
    schema: Record<string, PgTableWithColumns<TableConfig>>;
}
