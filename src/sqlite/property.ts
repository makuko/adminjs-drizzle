import { BaseProperty, type PropertyType } from 'adminjs';
import {
    type AnySQLiteColumn,
    SQLiteBigInt,
    SQLiteBlobBuffer,
    SQLiteBlobJson,
    SQLiteBoolean,
    SQLiteInteger,
    SQLiteNumeric,
    SQLiteNumericBigInt,
    SQLiteNumericNumber,
    SQLiteReal,
    SQLiteText,
    SQLiteTextJson,
    SQLiteTimestamp
} from 'drizzle-orm/sqlite-core';

export class Property extends BaseProperty {

    constructor(
        path: string,
        public column: AnySQLiteColumn,
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

    public availableValues(): Array<string> | null {
        return this.isEnum() ? (this.column as SQLiteText<any>).enumValues : null;
    }

    public position(): number {
        return this.columnPosition ?? 0;
    }

    public isEnum(): boolean {
        const column = this.column;

        return column instanceof SQLiteText && column.enumValues?.length;
    }

    public type(): PropertyType {
        if (this.reference()) {
            return 'reference';
        }

        const column = this.column;

        if (column instanceof SQLiteInteger) {
            return 'number';
        }

        if (
            column instanceof SQLiteReal
            || column instanceof SQLiteNumericNumber
        ) {
            return 'float';
        }

        if (
            column instanceof SQLiteBigInt
            || column instanceof SQLiteBlobBuffer
            || column instanceof SQLiteBlobJson
            || column instanceof SQLiteNumeric
            || column instanceof SQLiteNumericBigInt
            || column instanceof SQLiteText
            || column instanceof SQLiteTextJson
        ) {
            return 'string';
        }

        if (
            column instanceof SQLiteTextJson
            || column instanceof SQLiteBlobJson
        ) {
            return 'textarea';
        }

        if (column instanceof SQLiteBoolean) {
            return 'boolean';
        }

        if (column instanceof SQLiteTimestamp) {
            return 'datetime';
        }

        console.warn(`Unhandled type: ${ column.getSQLType() }`);

        return undefined as any;
    }

}
