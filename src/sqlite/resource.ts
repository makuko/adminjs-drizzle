import { BaseRecord, BaseResource, Filter, flat } from 'adminjs';
import { desc, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import {
    AnySQLiteColumn,
    BaseSQLiteDatabase,
    getTableConfig,
    SQLiteBigInt,
    SQLiteBlobBuffer,
    SQLiteBlobJson,
    SQLiteNumericBigInt,
    SQLiteTable,
    SQLiteTableWithColumns,
    SQLiteTextJson,
    TableConfig
} from 'drizzle-orm/sqlite-core';
import { convertFilter } from '../utils/convert-filter.js';
import { Property } from './property.js';

export class Resource extends BaseResource {

    private db: BaseSQLiteDatabase<'async', any>;

    private table: SQLiteTableWithColumns<TableConfig>;

    private propertiesObject: Record<string, Property>;

    private get idColumn(): AnySQLiteColumn {
        const idProperty = this.properties().find(property => property.isId());

        return idProperty!.column;
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
        return 'sqlite';
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
            .where(convertFilter(filter))
            .get();

        return result?.count ?? 0;
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
            .limit(limit)
            .all();

        return results.map(
            result => new BaseRecord(this.prepareResult(result), this)
        );
    }

    public async findOne(id: string | number): Promise<BaseRecord | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.idColumn, id))
            .get();

        return result
            ? new BaseRecord(this.prepareResult(result), this)
            : null;
    }

    public async findMany(ids: Array<string | number>): Promise<BaseRecord[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(inArray(this.idColumn, ids))
            .all();

        return results.map(
            result => new BaseRecord(this.prepareResult(result), this)
        );
    }

    public async create(params: Record<string, any>): Promise<Record<string, any>> {
        const result = await this.db
            .insert(this.table)
            .values(this.prepareParams(params))
            .returning()
            .get();

        return this.prepareResult(result);
    }

    public async update(id: string | number, params: Record<string, any> = {}): Promise<Record<string, any>> {
        const result = await this.db.update(this.table)
            .set(this.prepareParams(params))
            .where(eq(this.idColumn, id))
            .returning()
            .get();

        return this.prepareResult(result);
    }

    public async delete(id: string | number): Promise<void> {
        await this.db
            .delete(this.table)
            .where(eq(this.idColumn, id))
            .run();
    }

    public static isAdapterFor(args?: Partial<ResourceConfig>): boolean {
        const { table, db } = args ?? {};

        return table instanceof SQLiteTable && db instanceof BaseSQLiteDatabase;
    }

    private prepareProperties(): { [propertyPath: string]: Property } {
        const properties: Record<string, Property> = {};
        const columns: Record<string, AnySQLiteColumn> = getTableColumns(this.table);
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

    protected prepareParams(params: Record<string, any>): Record<string, any> {
        const preparedParams: Record<string, any> = {};

        for (const property of this.properties()) {
            const key = property.path();
            const value = flat.get(params, key);

            if (typeof value === 'undefined') {
                continue;
            }

            if (
                property.column instanceof SQLiteBigInt
                || property.column instanceof SQLiteNumericBigInt
            ) {
                preparedParams[key] = BigInt(value);

                continue;
            }

            if (
                property.column instanceof SQLiteBlobJson
                || property.column instanceof SQLiteTextJson
            ) {
                preparedParams[key] = JSON.parse(value);

                continue;
            }

            if (property.column instanceof SQLiteBlobBuffer) {
                preparedParams[key] = Buffer.from(JSON.parse(value));

                continue;
            }

            preparedParams[key] = value;
        }

        return preparedParams;
    }

    protected prepareResult(result: Record<string, any>): Record<string, any> {
        const preparedResult: Record<string, any> = {};

        for (const property of this.properties()) {
            const key = property.path();
            const value = flat.get(result, key);

            if (
                property.column instanceof SQLiteBigInt
                || property.column instanceof SQLiteNumericBigInt
            ) {
                preparedResult[key] = value.toString();

                continue;
            }

            if (
                property.column instanceof SQLiteBlobJson
                || property.column instanceof SQLiteTextJson
            ) {
                preparedResult[key] = JSON.stringify(value);

                continue;
            }

            if (property.column instanceof SQLiteBlobBuffer) {
                preparedResult[key] = JSON.stringify(Array.from(value));

                continue;
            }

            preparedResult[key] = value;

        }

        return preparedResult;
    }
}

interface ResourceConfig {
    table: SQLiteTableWithColumns<TableConfig>;
    db: BaseSQLiteDatabase<'async', any>;
}
