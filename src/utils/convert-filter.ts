import { BaseProperty, Filter } from 'adminjs';
import { and, AnyColumn, eq, gte, like, lte, SQL } from 'drizzle-orm';

function safeParseJSON(json: string): Record<string, any> | null {
    try {
        return JSON.parse(json);
    } catch (err) {
        return null;
    }
}

export function convertFilter(filter?: Filter): SQL | undefined {
    if (!filter) {
        return;
    }

    const { filters = {} } = filter;

    let where: SQL | undefined;

    for (const filter of Object.values(filters)) {
        const property = filter.property as Property;
        let condition: SQL | undefined;

        if (['boolean', 'number', 'float', 'object', 'array'].includes(property.type())) {
            condition = eq(property.column, safeParseJSON(filter.value as string));
        } else if (['date', 'datetime'].includes(property.type())) {
            if (typeof filter.value === 'string') {
                continue;
            }

            if (filter.value.from && filter.value.to) {
                condition = and(
                    gte(property.column, new Date(filter.value.from)),
                    lte(property.column, new Date(filter.value.to))
                );
            } else if (filter.value.from) {
                condition = gte(property.column, new Date(filter.value.from));
            } else if (filter.value.to) {
                condition = lte(property.column, new Date(filter.value.to));
            }
        } else if (property.isEnum() || property.type() === 'reference') {
            condition = eq(property.column, filter.value);
        } else {
            condition = like(property.column, `%${ filter.value }%`);
        }

        where = where ? and(where, condition) : condition;
    }

    return where;
}

interface Property extends BaseProperty {
    column: AnyColumn;
    isEnum(): boolean;
}
