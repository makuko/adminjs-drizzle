import { BaseDatabase } from 'adminjs';
import {
    MySqlDatabase,
    MySqlTable,
    MySqlTableWithColumns,
    PreparedQueryHKTBase,
    QueryResultHKT,
    TableConfig
} from 'drizzle-orm/mysql-core';

import { Resource } from './resource.js';

export class Database extends BaseDatabase {

    private db: MySqlDatabase<QueryResultHKT, PreparedQueryHKTBase>;

    private schema: Record<string, MySqlTableWithColumns<TableConfig>>;

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
            if (table instanceof MySqlTable) {
                res.push(new Resource({ table, db }));
            }
        }

        return res;
    }

    public static isAdapterFor(args?: Partial<DatabaseConfig>): boolean {
        const { db } = args ?? {};

        return db instanceof MySqlDatabase;
    }

}

interface DatabaseConfig {
    db: MySqlDatabase<QueryResultHKT, PreparedQueryHKTBase>;
    schema: Record<string, MySqlTableWithColumns<TableConfig>>;
}
