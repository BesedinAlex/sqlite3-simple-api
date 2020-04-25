import {Database, verbose} from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs-extra';

let db: Database;
let databasePath = path.join(process.cwd(), 'data', 'database.sqlite3');
const sqlite3 = verbose();

function openDBConnection() {
    // Creates folder to store database if non already.
    const dir = path.parse(databasePath).dir;
    if (!fs.pathExistsSync(dir)) {
        fs.mkdirpSync(dir);
        console.log('Creating folder: ' + dir);
    }
    // Opens connection to database
    db = new sqlite3.Database(databasePath, err => {
        if (err) {
            console.error(err);
            throw Error('cannot connect to database');
        }
    });
}

function detectQueryType(sqlQuery: string): string {
    return sqlQuery.split(' ')[0].toLowerCase();
}

/**
 * Sets database file path.
 * @param path Full path of database file. Default is ./data/database.sqlite3 in project root.
 */
function setDatabaseFilePath(path: string) {
    databasePath = path;
}

/**
 * Selects data from database.
 * @param sqlQuery SQL query to execute. Expects SELECT query.
 * @param firstValueOnly By default returns array of objects. Pass 'true' to return first element only.
 * @returns Returns array of data or data object if you request for first value only.
 */
function selectData(sqlQuery: string, firstValueOnly = false): Promise<any> {
    if (detectQueryType(sqlQuery) !== 'select') {
        throw Error('selectData() expects sql SELECT query');
    }
    return new Promise((resolve, reject) => {
        openDBConnection();
        db.all(sqlQuery, [], function (err, rows) {
            if (err) {
                throw Error(String(err).replace('ERROR: ',''));
            } else {
                if (firstValueOnly) {
                    if (rows.length === 0) {
                        reject(err);
                    } else {
                        resolve(rows[0]);
                    }
                } else {
                    resolve(rows);
                }
            }
        });
    });
}

/**
 * Insert, update or delete data.
 * @param sqlQuery SQL query to execute. Expects INSERT, UPDATE or DELETE or CREATE query.
 * @returns Returns id of inserted item on SQL INSERT. Returns 1 on anything else.
 * Returns undefined if request is not expected by the function.
 */
function changeData(sqlQuery: string): Promise<number> {
    const queryType = detectQueryType(sqlQuery);
    if (queryType !== 'insert' && queryType !== 'update' && queryType !== 'delete' && queryType !== 'create') {
        throw Error('changeData() expects sql INSERT or UPDATE or DELETE or CREATE query');
    }
    return new Promise((resolve, reject) => {
        openDBConnection();
        db.run(sqlQuery, [], function (err) {
            if (err) {
                reject(err);
            } else if (queryType === 'insert') {
                resolve(this.lastID);
            } else { // update or delete
                resolve(this.changes);
            }
        })
    });
}

export {selectData, changeData, setDatabaseFilePath};
