require('dotenv').config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectionString } = require('../dev-config');
const SQLServerConnectionString = 'Server=DESKTOP-VBR6T2V\\SQLEXPRESS;Database=testPCDB;User Id=sa;Password=Svk2432k01;';
// const SQLServerConnectionString = connectionString;

router.get('/categories', async (req, res) => {
    const Id = req.query.id || '';
    const CatType = req.query.type || '';
    const CatSubType = req.query.subtype || '';
    const Cost = req.query.cost || '';
    try {
        const query = `SELECT *
        FROM Categories
        WHERE Id LIKE '%${Id}%'
        AND CatType LIKE '%${CatType}%'
        AND CatSubType LIKE '%${CatSubType}%'
        AND Cost LIKE '%${Cost}%'
        `;
        await sql.connect(SQLServerConnectionString);
        const response = await sql.query(query);
        sql.close();
        if (response.rowsAffected != 0) {
            return res.send({ categories: response.recordset });
        }
        return res.sendStatus(500);
    } catch (e) {
        sql.close();
        console.log(`[categories|categories.js] ${e}`);
        res.sendStatus(500);
    }
});

router.post('/addCategory', async (req, res) => {
    try {
        const { CatType, CatSubType, Cost } = req.body;
        const query = `INSERT INTO Categories (CatType, CatSubType, Cost)
        VALUES ('${CatType}', '${CatSubType}', '${Cost}')`;
        await sql.connect(SQLServerConnectionString);
        const response = await sql.query(query);
        sql.close();
        if (response.rowsAffected != 0)
            return res.sendStatus(200);
        return res.sendStatus(400);
    } catch (e) {
        sql.close();
        console.log(`[addCategory|categories.js] ${e}`);
        return res.sendStatus(500);
    }
});

module.exports = router;