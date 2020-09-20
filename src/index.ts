import {Database, verbose} from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs-extra';

const sqlite3 = verbose();
let databasePath = path.join(process.cwd(), 'data', 'database.sqlite3');
let db: Database;

/**
 * Sets database file path.
 * @param path Full path of database file. Default is ./data/database.sqlite3 in project root.
 */
export function setDatabaseFilePath(path: string) {
    databasePath = path;
}

function openDBConnection() {
    // Creates folder to store database if non already.
    const dir = path.parse(databasePath).dir;
    if (!fs.pathExistsSync(dir)) {
        fs.mkdirpSync(dir);
    }
    // Opens connection to database
    db = new sqlite3.Database(databasePath, err => {
        if (err) {
            console.error(err);
            throw Error('cannot connect to database');
        }
    });
}

function detectCommandType(sqlCommand: string): string {
    return sqlCommand.split(' ')[0].toLowerCase();
}

/**
 * Selects data from database.
 * @template T Let's you specify type of data you expect to get.
 * @param sqlCommand SQL command to execute. Expects SELECT command.
 * @param firstRowOnly By default function returns array of objects. Pass 'true' to return first element only.
 * @returns Returns promise of array of data or data object if you request for first value only.
 */
export function selectData<T>(sqlCommand: string, firstRowOnly = false): Promise<T | T[]> {
    if (detectCommandType(sqlCommand) !== 'select') {
        throw Error('selectData() expects sql SELECT command');
    }
    return new Promise((resolve, reject) => {
        if (db === undefined) {
            openDBConnection();
        }
        db.all(sqlCommand, [], function (err, rows: any) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                if (firstRowOnly) {
                    if (rows.length === 0) {
                        reject(err);
                    } else {
                        resolve(rows[0] as T);
                    }
                } else {
                    resolve(rows as T[]);
                }
            }
        });
    });
}

/**
 * Create, insert, update or delete data.
 * @param sqlCommand SQL command to execute. Expects INSERT, UPDATE, DELETE or CREATE command.
 * @returns Returns id of inserted item on SQL INSERT. Returns number of made changes on anything else.
 */
export function changeData(sqlCommand: string): Promise<number> {
    const commandType = detectCommandType(sqlCommand);
    if (commandType !== 'insert' && commandType !== 'update' && commandType !== 'delete' && commandType !== 'create') {
        throw Error('changeData() expects sql INSERT or UPDATE or DELETE or CREATE command');
    }
    return new Promise((resolve, reject) => {
        if (db === undefined) {
            openDBConnection();
        }
        db.run(sqlCommand, [], function (err) {
            if (err) {
                console.error(err);
                reject(err);
            } else if (commandType === 'insert') {
                resolve(this.lastID);
            } else { // update or delete
                resolve(this.changes);
            }
        })
    });
}
