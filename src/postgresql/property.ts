import { BaseProperty, type PropertyType } from 'adminjs';
import {
    type AnyPgColumn,
    // PgArray,
    PgBigInt53,
    PgBigInt64,
    PgBigSerial53,
    PgBigSerial64,
    // PgBinaryVector,
    PgBoolean,
    PgChar,
    // PgCidr,
    PgDate,
    PgDateString,
    PgDoublePrecision,
    PgEnumColumn,
    // PgGeometry,
    // PgHalfVector,
    // PgInet,
    PgInteger,
    PgInterval,
    PgJson,
    PgJsonb,
    PgLineABC,
    PgLineTuple,
    // PgMacaddr,
    // PgMacaddr8,
    PgNumeric,
    PgNumericBigInt,
    PgNumericNumber,
    PgPointObject,
    PgPointTuple,
    PgReal,
    PgSerial,
    PgSmallInt,
    PgSmallSerial,
    // PgSparseVector,
    PgText,
    PgTime,
    PgTimestamp,
    PgUUID,
    PgVarchar,
    // PgVector
} from 'drizzle-orm/pg-core';

export class Property extends BaseProperty {

    constructor(
        path: string,
        public column: AnyPgColumn,
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
        if (this.isEnum()) {
            return (this.column as PgEnumColumn<any> | PgText<any> | PgVarchar<any>).enumValues;
        }

        return null;
    }

    public position(): number {
        return this.columnPosition ?? 0;
    }

    public isEnum(): boolean {
        const column = this.column;

        return column instanceof PgEnumColumn
            || (column instanceof PgText && column.enumValues?.length)
            || (column instanceof PgChar && column.enumValues?.length)
            || (column instanceof PgVarchar && column.enumValues?.length);
    }

    public type(): PropertyType {
        if (this.reference()) {
            return 'reference';
        }

        const column = this.column;

        if (
            column instanceof PgSerial
            || column instanceof PgSmallSerial
            || column instanceof PgBigSerial53
            || column instanceof PgBigSerial64
            || column instanceof PgInteger
            || column instanceof PgSmallInt
            || column instanceof PgBigInt53
            || column instanceof PgBigInt64
        ) {
            return 'number';
        }

        if (
            column instanceof PgNumeric
            || column instanceof PgNumericNumber
            || column instanceof PgNumericBigInt
            || column instanceof PgReal
            || column instanceof PgDoublePrecision
        ) {
            return 'float';
        }

        if (
            column instanceof PgText
            || column instanceof PgChar
            || column instanceof PgVarchar
            || column instanceof PgEnumColumn
        ) {
            return 'string';
        }

        if (column instanceof PgBoolean) {
            return 'boolean';
        }

        if (
            column instanceof PgTime
            || column instanceof PgTimestamp
            || column instanceof PgDate
            || column instanceof PgDateString
        ) {
            return 'datetime';
        }

        if (
            column instanceof PgJson
            || column instanceof PgJsonb
            || column instanceof PgInterval
            || column instanceof PgPointObject
            || column instanceof PgPointTuple
            || column instanceof PgLineABC
            || column instanceof PgLineTuple
        ) {
            return 'mixed';
        }

        if (column instanceof PgUUID) {
            return 'uuid';
        }

        console.warn(`Unhandled type: ${ column.getSQLType() }`);

        return undefined as any;
    }

}
