# SQLite3 Simple API

Makes work with `sqlite3` a bit simplier than it is by default.
All you need to do is decide where your database will be and what queries you want to pass there.

### Usage

This code specifies path of your database (you may skip it if you fine with `/your-project/data/database.sqlite3`).

`changeData()` excepts `CREATE` or `INSERT` or `UPDATE` or `DELETE` queries.

If you pass `INSERT` query, it will return `id` of inserted data. Else it returns nothing useful.

`selectData()` excepts `SELECT` query and will return your requested data.

All requests return Promise<...>, so you either need to use `async-await` or `.then()`. 

```javascript
import {selectData, changeData, setDatabaseFilePath} from 'sqlite3-simple-api';
import path from 'path';

async function exampleUsage() {
    const databasePath = path.join(process.cwd(), 'data', 'database.sqlite3');
    setDatabaseFilePath(databasePath); // You may remove it because this path is set by default

    const sqlCreate = `CREATE TABLE IF NOT EXISTS Test ('id' INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, 'name' TEXT);`;
    await changeData(sqlCreate); // Returns nothing useful

    const sqlInsert = `INSERT INTO Test (name) VALUES ('Any text you want');`;
    const id = await changeData(sqlInsert); // Returns ID of inserted data

    const sqlSelect = `SELECT * FROM Test`;
    const allData = await selectData(sqlSelect);
    // Returns array of data. selectData(sqlSelect, true) to return first value only
}
exampleUsage();
```
