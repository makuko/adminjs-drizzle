import { BaseProperty, type PropertyType } from 'adminjs';
import {
    type AnySQLiteColumn,
    SQLiteBigInt,
    SQLiteBlobBuffer,
    SQLiteBlobJson,
    SQLiteBoolean,
    SQLiteInteger,
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

        if (
            column instanceof SQLiteInteger
            || column instanceof SQLiteBigInt
        ) {
            return 'number';
        }

        if (column instanceof SQLiteReal) {
            return 'float';
        }

        if (column instanceof SQLiteText) {
            return 'string';
        }

        if (column instanceof SQLiteBoolean) {
            return 'boolean';
        }

        if (column instanceof SQLiteTimestamp) {
            return 'datetime';
        }

        if (
            column instanceof SQLiteTextJson
            || column instanceof SQLiteBlobBuffer
            || column instanceof SQLiteBlobJson
        ) {
            return 'mixed';
        }

        console.warn(`Unhandled type: ${ column.getSQLType() }`);

        return undefined as any;
    }

}
