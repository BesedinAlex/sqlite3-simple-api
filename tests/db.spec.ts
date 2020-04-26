import {expect} from 'chai';
import {changeData, selectData} from '../src';

it('changeData() should CREATE table', function () {
    const sql =
        `CREATE TABLE IF NOT EXISTS 'Test' (
        'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        'name' TEXT NOT NULL,
        'data' INTEGER
        );`;
    expect(changeData(sql)).not.throws;
});

it('changeData() should INSERT data', async function () {
    const sql1 = `INSERT INTO Test (name, data) VALUES ('test1', 1);`;
    const sql2 = `INSERT INTO Test (name, data) VALUES ('test2', 2);`;
    const id1 = await changeData(sql1);
    const id2 = await changeData(sql2);
    expect(id1 === 1 && id2 === 2).to.be.true;
});

it('selectData() should SELECT all data', async function () {
    const sql = `SELECT * FROM Test`;
    const expectedResult = [
        {id: 1, name: 'test1', data: 1},
        {id: 2, name: 'test2', data: 2}
    ];
    const realResult = await selectData(sql);
    expect(JSON.stringify(expectedResult)).to.be.equal(JSON.stringify(realResult));
});

it('selectData() should SELECT first value only', async function () {
    const sql = `SELECT * FROM Test`;
    const expectedResult = {id: 1, name: 'test1', data: 1};
    const realResult = await selectData(sql, true);
    expect(JSON.stringify(expectedResult)).to.be.equal(JSON.stringify(realResult));
});

it('changeData() should DELETE data', async function () {
    const sql = `DELETE FROM Test WHERE id=${1}`;
    expect(changeData(sql)).not.throws;
});
