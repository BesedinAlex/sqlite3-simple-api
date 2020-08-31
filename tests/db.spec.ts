import {expect} from 'chai';
import {changeData, selectData} from '../src';

interface TestData {
    id: number;
    name: string;
    data: number;
}

it('changeData() should CREATE table', async function () {
    const sql =
        `CREATE TABLE IF NOT EXISTS 'Test' (
        'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        'name' TEXT NOT NULL,
        'data' INTEGER
        );`;
    expect(await changeData(sql)).not.throws;
});

it('changeData() should INSERT data', async function () {
    const sql1 = `INSERT INTO Test (name, data) VALUES ('test1', 1);`;
    const sql2 = `INSERT INTO Test (name, data) VALUES ('test2', 2);`;
    const id1 = await changeData(sql1);
    const id2 = await changeData(sql2);
    expect(id1 === 1 && id2 === 2).to.be.true;
});

it('changeData() should UPDATE data', async function () {
    const sql = `UPDATE Test SET data=42 WHERE id=2`;
    expect(await changeData(sql)).to.be.equal(1);
});

it('selectData() should SELECT all data', async function () {
    const sql = `SELECT * FROM Test`;
    const expectedResult = [
        {id: 1, name: 'test1', data: 1},
        {id: 2, name: 'test2', data: 42}
    ];
    const realResult = await selectData<TestData>(sql) as TestData[];
    expect(JSON.stringify(expectedResult)).to.be.equal(JSON.stringify(realResult));
});

it('selectData() should SELECT first value only', async function () {
    const sql = `SELECT * FROM Test`;
    const expectedResult = {id: 1, name: 'test1', data: 1};
    const realResult = await selectData<TestData>(sql, true) as TestData;
    expect(JSON.stringify(expectedResult)).to.be.equal(JSON.stringify(realResult));
});

it('changeData() should DELETE data', async function () {
    const sql = `DELETE FROM Test WHERE id=${1}`;
    expect(await changeData(sql)).not.throws;
});

it('selectData() should throw on wrong command', function () {
    const sql = `DELETE FROM Test WHERE id=${2}`;
    expect(() => selectData(sql)).throws('selectData() expects sql SELECT query');
});

it('changeData() should throw on wrong command', async function () {
    const sql = `SELECT * FROM Test`;
    expect(() => changeData(sql)).throws('changeData() expects sql INSERT or UPDATE or DELETE or CREATE query');
});
