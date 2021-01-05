require('dotenv').config();
const sql = require('mssql');
const fs = require('fs');
// const { connectionString } = require('../../dev-config');
// const createTables = fs.readFileSync('../../scripts/create-test-db-tables.sql').toString();
const SQLServerConnectionString = 'Server=DESKTOP-VBR6T2V\\SQLEXPRESS;Database=testPCDB;User Id=sa;Password=Svk2432k01;';

module.exports = {
    setupDB() {
        beforeAll(async () => {
            try {
                const createTables = `
                --USE testPCDB

                IF NOT EXISTS (SELECT *
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Users')
                                BEGIN
                    CREATE TABLE Users
                    (
                        Email VARCHAR(50) PRIMARY KEY NOT NULL,
                        Password VARCHAR(100) NOT NULL,
                        Firstname VARCHAR(20) NOT NULL,
                        Lastname VARCHAR(20),
                        Phone VARCHAR(10) NOT NULL,
                        Address VARCHAR(255)
                    )
                END
                
                --IF NOT EXISTS (SELECT *
                --FROM INFORMATION_SCHEMA.TABLES
                --WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Categories')
                --                BEGIN
                --    CREATE TABLE Categories
                --    (
                --        Id INT PRIMARY KEY IDENTITY NOT NULL,
                --        CatType VARCHAR(8) NOT NULL,
                --        CatSubType VARCHAR(255) NOT NULL,
                --        Cost VARCHAR(8) NOT NULL
                --    )
                --END
                
                
                IF NOT EXISTS (SELECT *
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Transactions')
                                BEGIN
                    CREATE TABLE Transactions
                    (
                        TransactionId VARCHAR(20) PRIMARY KEY NOT NULL,
                        Email VARCHAR(50) FOREIGN KEY REFERENCES Users(Email),
                        TransactionTime DATETIME DEFAULT GETDATE(),
                        Amount VARCHAR(8) NOT NULL,
                        TransactionStatus VARCHAR(20) NOT NULL
                    )
                END
                
                IF NOT EXISTS (SELECT *
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Tickets')
                BEGIN
                    CREATE TABLE Tickets
                    (
                        IssueId VARCHAR(30) PRIMARY KEY NOT NULL,
                        Email VARCHAR(50) FOREIGN KEY REFERENCES Users(Email),
                        IssueDesc VARCHAR(255) NOT NULL,
                        IssueDate DATETIME NOT NULL DEFAULT GETDATE(),
                        IssueStatus VARCHAR(25) NOT NULL DEFAULT 'Issued. In Review',
                        ETA DATE DEFAULT NULL,
                        IssueType INT FOREIGN KEY REFERENCES Categories(Id),
                        Rating INT,
                        Review VARCHAR(255),
                        --TransactionId VARCHAR(20) FOREIGN KEY REFERENCES Transactions(TransactionId),
                        Comments VARCHAR(255)
                    )
                END             
                
                `
                await sql.connect(SQLServerConnectionString);
                await sql.query(createTables);
                sql.close();
            } catch (e) {
                sql.close();
                console.log(`[test-setup.js|beforeAll] ${e}`);
            }
        });

        afterEach(async () => {
            try {
                const query = `
                --USE testPCDB
                DELETE FROM Users
                --DELETE FROM Categories
                DELETE FROM Transactions
                DELETE FROM Tickets`
                await sql.connect(SQLServerConnectionString);
                await sql.query(query);
                sql.close();
            } catch (e) {
                sql.close();
                console.log(`[test-setup.js|afterEach] ${e}`);
            }
        });

        afterAll(async () => {
            try {
                const tables = ["Users", "Transactions", "Tickets"]
                // const tables = ["Users", "Transactions", "Categories", "Tickets"]
                for (var i = 0; i < tables.length; i++) {
                    const findFKConstraints = `
                    --USE testPCDB
                    select
                        'ALTER TABLE [' + OBJECT_SCHEMA_NAME(parent_object_id) +
                        '].[' + OBJECT_NAME(parent_object_id) + 
                        '] DROP CONSTRAINT [' + name + ']' as QueryString
                    from sys.foreign_keys
                    where referenced_object_id = object_id('${tables[i]}')
                    `;
                    await sql.connect(SQLServerConnectionString);
                    const findFKResult = await sql.query(findFKConstraints);
                    await sql.close();
                    if (findFKResult.recordset[0] == undefined) {
                        // console.log(`for table in if ${tables[i]}`);
                        await sql.connect(SQLServerConnectionString);
                        await sql.query(`DROP TABLE ${tables[i]}`);
                        continue;
                    }
                    // console.log(`for table ${tables[i]}`);
                    const queryString = findFKResult.recordset[0].QueryString;
                    const dropFKConstraints = `
                        USE testPCDB
                        ${queryString}
                        DROP TABLE ${tables[i]}
                        `;
                    // console.log(`query is ${dropFKConstraints}`);
                    // try {
                    await sql.connect(SQLServerConnectionString);
                    await sql.query(dropFKConstraints);
                    await sql.close();

                    // } catch (error) {
                    //     await sql.connect(SQLServerConnectionString);
                    //     await sql.query(`DROP TABLE ${tables[]}`);
                    //     await sql.close();

                    // }

                }
                // const query = `
                // USE testPCDB
                // DROP TABLE Users, Categories, Transactions, Tickets
                // `;
                await sql.connect(SQLServerConnectionString);
                // await sql.query(query);
                sql.close();
            } catch (e) {
                sql.close();
                console.log(`[test-setup.js|afterAll] ${e}`);
            }
        });
    }
}