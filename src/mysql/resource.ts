import { BaseRecord, BaseResource, Filter, flat } from 'adminjs';

import { desc, eq, getTableColumns, inArray, sql } from 'drizzle-orm';

import {
    AnyMySqlColumn,
    getTableConfig,
    MySqlDatabase,
    MySqlTable,
    MySqlTableWithColumns,
    PreparedQueryHKTBase,
    QueryResultHKT,
    TableConfig
} from 'drizzle-orm/mysql-core';

import { Property } from './property.js';
import { convertFilter } from '../utils/convert-filter.js';

export class Resource extends BaseResource {

    private db: MySqlDatabase<QueryResultHKT, PreparedQueryHKTBase>;

    private table: MySqlTableWithColumns<TableConfig>;

    private propertiesObject: Record<string, Property>;

    private get idColumn(): AnyMySqlColumn | undefined {
        const idProperty = this.properties().find(property => property.isId());

        return idProperty && idProperty.column;
    }

    constructor(args: ResourceConfig) {
        super(args);

        const { table, db } = args;

        this.db = db;
        this.table = table;
        this.propertiesObject = this.prepareProperties();
    }

    public databaseName(): string {
        return 'Drizzle ORM';
    }

    public databaseType(): string {
        return 'postgres';
    }

    public name(): string {
        return getTableConfig(this.table).name;
    }

    public id(): string {
        return this.name();
    }

    public properties(): Property[] {
        return [...Object.values(this.propertiesObject)];
    }

    public property(path: string): Property {
        return this.propertiesObject[path];
    }

    public build(params: Record<string, any>): BaseRecord {
        return new BaseRecord(flat.unflatten(params), this);
    }

    public async count(filter: Filter): Promise<number> {
        const result = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(this.table)
            .where(convertFilter(filter));

        return result[0].count;
    }

    public async find(filter: Filter, params: Record<string, any> = {}): Promise<BaseRecord[]> {
        const { limit = 10, offset = 0, sort = {} } = params;
        const { direction, sortBy } = sort as { direction: 'asc' | 'desc', sortBy: string };

        const results = await this.db
            .select()
            .from(this.table)
            .where(convertFilter(filter))
            .orderBy(direction === 'asc' ? this.table[sortBy] : desc(this.table[sortBy]))
            .offset(offset)
            .limit(limit);

        return results.map(result => new BaseRecord(result, this));
    }

    public async findOne(id: string | number): Promise<BaseRecord | null> {
        const idColumn = this.idColumn;

        if (!idColumn) {
            return null;
        }

        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(idColumn, id));

        return result[0] ? new BaseRecord(result[0], this) : null;
    }

    public async findMany(ids: Array<string | number>): Promise<BaseRecord[]> {
        const idColumn = this.idColumn;

        if (!idColumn) {
            return [];
        }

        const results = await this.db
            .select()
            .from(this.table)
            .where(inArray(idColumn, ids));

        return results.map(result => new BaseRecord(result, this));
    }

    public async create(params: Record<string, any>): Promise<Record<string, any>> {
        const idColumn = this.idColumn;

        await this.db.insert(this.table).values(params);

        if (idColumn && idColumn['autoIncrement']) {
            const result = await this.db.select().from(this.table).where(eq(idColumn, sql`last_insert_id()`));

            return result[0];
        }

        return params;
    }

    public async update(id: string | number, params: Record<string, any> = {}): Promise<Record<string, any>> {
        const idColumn = this.idColumn;

        if (!idColumn) {
            return {};
        }

        await this.db.update(this.table)
            .set(params)
            .where(eq(idColumn, id));

        const result = await this.db.select()
            .from(this.table)
            .where(eq(idColumn, id));

        return result[0];
    }

    public async delete(id: string | number): Promise<void> {
        const idColumn = this.idColumn;

        if (!idColumn) {
            return;
        }

        await this.db.delete(this.table).where(eq(idColumn, id));
    }

    public static isAdapterFor(args?: Partial<ResourceConfig>): boolean {
        const { table, db } = args ?? {};

        return table instanceof MySqlTable && db instanceof MySqlDatabase;
    }

    private prepareProperties(): Record<string, Property> {
        const properties = {};
        const columns: Record<string, AnyMySqlColumn> = getTableColumns(this.table);
        const { foreignKeys } = getTableConfig(this.table);

        let index = 0;

        for (const [path, column] of Object.entries(columns)) {
            let reference: string | undefined;

            for (const foreignKey of foreignKeys) {
                const { columns: [ownColumn], foreignTable } = foreignKey.reference();

                if (ownColumn === column) {
                    reference = getTableConfig(foreignTable).name;
                }
            }

            properties[path] = new Property(path, column, index++, reference);
        }

        return properties;
    }

}

interface ResourceConfig {
    table: MySqlTableWithColumns<TableConfig>;
    db: MySqlDatabase<QueryResultHKT, PreparedQueryHKTBase>;
}
