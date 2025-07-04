## adminjs-drizzle

This is an [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) into AdminJS.

### Installation

pnpm
```bash
$ pnpm add adminjs-drizzle
```

yarn
```bash
$ yarn add adminjs-drizzle
```

npm
```bash
$ npm i adminjs-drizzle
```

## Usage

The plugin can be registered using the standard `AdminJS.registerAdapter` method. It provides specialized adapters for PostgreSQL, MySQL and SQLite.

```typescript
import AdminJS from 'adminjs';
import { Database, Resource } from 'adminjs-drizzle/pg';
// import { Database, Resource } from 'adminjs-drizzle/mysql';
// import { Database, Resource } from 'adminjs-drizzle/sqlite';
import { drizzle } from 'drizzle-orm/pglite';
import { users } from './schema/users.js';

async function setupAdminJs() {
    // For available database connections please refer to the Drizzle ORM documentation.
    // Here we just use PGLite in memory.
    const db = drizzle();

    AdminJS.registerAdapter({ Database, Resource });

    // You can instantiate AdminJS either by specifying all resources separately:
    const adminJs = new AdminJS({
        resources: [{ resource: { table: users, db }, options: {} }],
    });

    // Or by passing the database and schema into `databases` property.
    const adminJs = new AdminJS({
        databases: [{ db, schema: { users } }],
    });
    // You should choose to use either `resources` or `databases`
};
```

## Examples

Example projects for the different adapters can be found in the `test` directory of the repository.
