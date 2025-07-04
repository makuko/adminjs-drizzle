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
    MySqlDateTimeString,
    MySqlDecimal,
    MySqlDecimalBigInt,
    MySqlDecimalNumber,
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
    MySqlTimestampString,
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
        return !this.isId();
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
        return this.isEnum() ? (this.column as MySqlEnumColumn<any> | MySqlText<any> | MySqlVarChar<any>).enumValues : null;
    }

    public position(): number {
        return this.columnPosition ?? 0;
    }

    public isEnum(): boolean {
        const column = this.column;

        return column instanceof MySqlEnumColumn
            || column instanceof MySqlText && column.enumValues?.length
            || column instanceof MySqlVarChar && column.enumValues?.length;
    }

    public type(): PropertyType {
        if (this.reference()) {
            return 'reference';
        }

        const column = this.column;

        if (
            column instanceof MySqlBigInt53
            || column instanceof MySqlInt
            || column instanceof MySqlMediumInt
            || column instanceof MySqlSerial
            || column instanceof MySqlSmallInt
            || column instanceof MySqlTinyInt
            || column instanceof MySqlYear
        ) {
            return 'number';
        }

        if (
            column instanceof MySqlDecimal
            || column instanceof MySqlDecimalNumber
            || column instanceof MySqlDouble
            || column instanceof MySqlFloat
            || column instanceof MySqlReal
        ) {
            return 'float';
        }

        if (
            column instanceof MySqlBinary
            || column instanceof MySqlBigInt64
            || column instanceof MySqlChar
            || column instanceof MySqlDecimalBigInt
            || column instanceof MySqlEnumColumn
            || column instanceof MySqlText
            || column instanceof MySqlTime
            || column instanceof MySqlVarBinary
            || column instanceof MySqlVarChar
        ) {
            return 'string';
        }

        if (column instanceof MySqlJson) {
            return 'textarea';
        }

        if (column instanceof MySqlBoolean) {
            return 'boolean';
        }

        if (column instanceof MySqlDate) {
            return 'date';
        }

        if (
            column instanceof MySqlDateTime
            || column instanceof MySqlDateTimeString
            || column instanceof MySqlTimestamp
            || column instanceof MySqlTimestampString
        ) {
            return 'datetime';
        }

        console.warn(`Unhandled type: ${ column.getSQLType() }`);

        return undefined as any;
    }

}
