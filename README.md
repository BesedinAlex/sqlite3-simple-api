# SQLite3 Simple API

Makes work with `sqlite3` in your project a bit simpler than it is by default.
All you need to do is decide where your database will be and what commands you want to pass there.

## Usage

This code specifies path of your database (you may skip it if you are fine with `/*your-project*/data/database.sqlite3`).

`changeData()` expects `CREATE`, `INSERT`, `UPDATE` or `DELETE` commands.

If you pass `INSERT` command, it will return `id` of inserted row. Else it returns number of made changes.

`selectData()` expects `SELECT` command and will return your requested data.

All requests return `Promise`, so you either need to use `async-await` or `.then()`. 

```javascript
import {selectData, changeData, setDatabaseFilePath} from 'sqlite3-simple-api';
import path from 'path';

async function exampleUsage() {
    const databasePath = path.join(process.cwd(), 'data', 'database.sqlite3');
    setDatabaseFilePath(databasePath); // You may remove it because this path is set by default

    const sqlCreate = `CREATE TABLE IF NOT EXISTS Test ('id' INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, 'name' TEXT);`;
    await changeData(sqlCreate); // Returns number of made changes (same for UPDATE or DELETE)

    const sqlInsert = `INSERT INTO Test (name) VALUES ('Alexey');`;
    const id = await changeData(sqlInsert); // Returns ID of inserted data

    const sqlSelect = `SELECT * FROM Test`;
    const allData = await selectData(sqlSelect); // Returns array of data
    const firstRowData = await selectData(sqlSelect, true); // Returns first row only
}
```

## Additional info

### TypeScript usage

This library supports types by default so you shouldn't be able to pass or get wrong data when you use [TypeScript](https://www.typescriptlang.org).

Also it lets you use generics for `SELECT` command:

```typescript
import {selectData} from 'sqlite3-simple-api';

interface TestData {
    id: number;
    name: string;
}

async function typeScriptExampleUsage() {
    const sqlSelect = `SELECT * FROM Test`;

    // Returns Promise<unknown> if you don't pass anything.
    const unknownDataArray = await selectData(sqlSelect);
    const unknownDataObject = await selectData(sqlSelect, true);

    // Returns Promise<TestData | TestData[]> if you pass TestData.
    const testDataArray = await selectData<TestData>(sqlSelect) as TestData[];
    const testDataObject = await selectData<TestData>(sqlSelect, true) as TestData;
}
```

### Specific builds

In some cases you might need to recompile your `sqlite3` to use it on another platform, for example.

*To do this run:*

`./node_modules/.bin/node-pre-gyp install --directory=./node_modules/sqlite3`.

***Options:***
- `--runtime=node-webkit`: customize the runtime: `node`, `electron` and `node-webkit` are the valid options.
- `--target=0.4.0`: Pass the target node or node-webkit version to compile against.
- `--target_arch=ia32`: Pass the target arch and override the host arch. Valid values are `ia32`,`x64`, or `arm`.
- `--target_platform=win32`: Pass the target platform and override the host platform. Valid values are `linux`, `darwin`, `win32`, `sunos`, `freebsd`, `openbsd`, and `aix`.

This info is taken from [node-pre-gyp README](https://github.com/mapbox/node-pre-gyp/blob/master/README.md).
