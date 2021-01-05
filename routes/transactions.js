require('dotenv').config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectionString } = require('../dev-config');
const SQLServerConnectionString = 'Server=DESKTOP-VBR6T2V\\SQLEXPRESS;Database=testPCDB;User Id=sa;Password=Svk2432k01;';
// const SQLServerConnectionString = connectionString;

router.post('/createTransaction', async (req, res) => {

});

router.get('/transactions', async (req, res) => {
    const { email } = req.body;
    const id = req.query.id || '';
    const amount = req.query.amt || '';
    const status = req.query.status || '';
    // const time = 
    try {
        const query = `SELECT * FROM Transactions
        WHERE Email='${email}'
        AND TransactionId LIKE '%${id}%'
        AND Amount LIKE '%${amount}%'
        AND TransactionStatus LIKE '%${status}%'`;
        await sql.connect(SQLServerConnectionString);
        const response = await sql.query(query);
        sql.close();
        return res.send({ data: response.recordset });
    } catch (e) {
        sql.close();
        console.log(`[transactions|transactions.js] ${e}`);
        res.sendStatus(500);
    }
});

router.patch('/updateTransaction', async (req, res) => {
    const { requiredEmail, status } = req.body;
    // create time.now() in sql format
    try {
        const query = `UPDATE Transactions
        SET TransactionTime='$', TransactionStatus='${status}'
        WHERE Email='${requiredEmail}'`;
        await sql.connect(SQLServerConnectionString);
        await sql.query(query);
        sql.close();
        res.sendStatus(200);
    } catch (e) {
        sql.close();
        console.log(`[updateTransaction|transactions.js] ${e}`);
        res.sendStatus(500);
    }
});

module.exports = router;