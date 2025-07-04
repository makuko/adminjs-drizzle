import { BaseRecord, BaseResource, Filter, flat } from 'adminjs';
import { desc, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import {
    AnyPgColumn,
    getTableConfig,
    PgBigInt64,
    PgDatabase,
    PgJson,
    PgJsonb,
    PgLineABC,
    PgLineTuple,
    PgNumericBigInt,
    PgPointObject,
    PgPointTuple,
    PgQueryResultHKT,
    PgTable,
    PgTableWithColumns,
    TableConfig
} from 'drizzle-orm/pg-core';
import { convertFilter } from '../utils/convert-filter.js';
import { Property } from './property.js';

export class Resource extends BaseResource {

    private db: PgDatabase<PgQueryResultHKT>;

    private table: PgTableWithColumns<TableConfig>;

    private propertiesObject: Record<string, Property>;

    private get idColumn(): AnyPgColumn {
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

        return result[0]?.count ?? 0;
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

        return results.map(
            result => new BaseRecord(this.prepareResult(result), this)
        );
    }

    public async findOne(id: string | number): Promise<BaseRecord | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.idColumn, id));

        return result[0]
            ? new BaseRecord(this.prepareResult(result[0]), this)
            : null;
    }

    public async findMany(ids: Array<string | number>): Promise<BaseRecord[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(inArray(this.idColumn, ids));

        return results.map(
            result => new BaseRecord(this.prepareResult(result), this)
        );
    }

    public async create(params: Record<string, any>): Promise<Record<string, any>> {
        const result = await this.db
            .insert(this.table)
            .values(this.prepareParams(params))
            .returning();

        return this.prepareResult(result[0]);
    }

    public async update(id: string | number, params: Record<string, any> = {}): Promise<Record<string, any>> {
        const result = await this.db
            .update(this.table)
            .set(this.prepareParams(params))
            .where(eq(this.idColumn, id))
            .returning();

        return this.prepareResult(result[0]);
    }

    public async delete(id: string | number): Promise<void> {
        await this.db
            .delete(this.table)
            .where(eq(this.idColumn, id));
    }

    public static isAdapterFor(args?: Partial<ResourceConfig>): boolean {
        const { table, db } = args ?? {};

        return table instanceof PgTable && db instanceof PgDatabase;
    }

    protected prepareProperties(): Record<string, Property> {
        const properties: Record<string, Property> = {};
        const columns: Record<string, AnyPgColumn> = getTableColumns(this.table);
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
                property.column instanceof PgBigInt64
                || property.column instanceof PgNumericBigInt
            ) {
                preparedParams[key] = BigInt(value);

                continue;
            }

            if (
                property.column instanceof PgJson
                || property.column instanceof PgJsonb
                || property.column instanceof PgLineABC
                || property.column instanceof PgLineTuple
                || property.column instanceof PgPointObject
                || property.column instanceof PgPointTuple
            ) {
                preparedParams[key] = JSON.parse(value);

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
                property.column instanceof PgBigInt64
                || property.column instanceof PgNumericBigInt
            ) {
                preparedResult[key] = value.toString();

                continue;
            }

            if (
                property.column instanceof PgJson
                || property.column instanceof PgJsonb
                || property.column instanceof PgLineABC
                || property.column instanceof PgLineTuple
                || property.column instanceof PgPointTuple
                || property.column instanceof PgPointObject
            ) {
                preparedResult[key] = JSON.stringify(value);

                continue;
            }

            preparedResult[key] = value;

        }

        return preparedResult;
    }

}

interface ResourceConfig {
    table: PgTableWithColumns<TableConfig>;
    db: PgDatabase<PgQueryResultHKT>;
}
