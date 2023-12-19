import { BaseProperty, PropertyType } from 'adminjs';
import {
    AnyMySqlColumn,
    MySqlBigInt53,
    MySqlBigInt64,
    MySqlBinary,
    MySqlBoolean,
    MySqlChar,
    MySqlDate,
    MySqlDateTime,
    MySqlDecimal,
    MySqlDouble,
    MySqlEnumColumn,
    MySqlFloat,
    MySqlInt,
    MySqlJson,
    MySqlMediumInt,
    MySqlReal,
    MySqlSerial,
    MySqlSmallInt,
    MySqlText,
    MySqlTime,
    MySqlTimestamp,
    MySqlTinyInt,
    MySqlVarBinary,
    MySqlVarChar,
    MySqlYear
} from 'drizzle-orm/mysql-core';

export class Property extends BaseProperty {

    constructor(
        path: string,
        public column: AnyMySqlColumn,
        private columnPosition = 0,
        private _reference?: string
    ) {
        super({ path });
    }

    public isEditable(): boolean {
        return !this.isId() && this.column.name !== 'createdAt' && this.column.name !== 'updatedAt';
    }

    public isId(): boolean {
        return !!this.column.primary;
    }

    public isRequired(): boolean {
        return this.column.notNull;
    }

    public isSortable(): boolean {
        return this.type() !== 'reference';
    }

    public reference(): string | null {
        return this._reference ?? null;
    }

    public availableValues(): string[] | null {
        return this.isEnum() ? (this.column as MySqlEnumColumn<any> | MySqlText<any>).enumValues : null;
    }

    public position(): number {
        return this.columnPosition ?? 0;
    }

    public isEnum(): boolean {
        const column = this.column;

        return column instanceof MySqlEnumColumn
            || column instanceof MySqlText && column.enumValues.length;
    }

    public type(): PropertyType {
        if (this.reference()) {
            return 'reference';
        }

        const column = this.column;

        if (
            column instanceof MySqlSerial
            || column instanceof MySqlInt
            || column instanceof MySqlTinyInt
            || column instanceof MySqlSmallInt
            || column instanceof MySqlMediumInt
            || column instanceof MySqlBigInt53
            || column instanceof MySqlBigInt64
        ) {
            return 'number';
        }

        if (
            column instanceof MySqlReal
            || column instanceof MySqlDecimal
            || column instanceof MySqlDouble
            || column instanceof MySqlFloat
        ) {
            return 'float';
        }

        if (
            column instanceof MySqlChar
            || column instanceof MySqlVarChar
            || column instanceof MySqlText
            || column instanceof MySqlEnumColumn
        ) {
            return 'string';
        }

        if (column instanceof MySqlBoolean) {
            return 'boolean';
        }

        if (
            column instanceof MySqlDate
            || column instanceof MySqlDateTime
            || column instanceof MySqlTime
            || column instanceof MySqlYear
            || column instanceof MySqlTimestamp
        ) {
            return 'datetime';
        }

        if (
            column instanceof MySqlJson
            || column instanceof MySqlBinary
            || column instanceof MySqlVarBinary
        ) {
            return 'mixed';
        }

        console.warn(`Unhandled type: ${ column.getSQLType() }`);

        return undefined as any;
    }

}
