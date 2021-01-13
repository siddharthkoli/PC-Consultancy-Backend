require('dotenv').config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectionString } = require('../dev-config');
const SQLServerConnectionString = 'Server=DESKTOP-VBR6T2V\\SQLEXPRESS;Database=testPCDB;User Id=sa;Password=Svk2432k01;';
// const SQLServerConnectionString = connectionString;

router.get('/getProfileData', async (req, res) => {
    // const { requiredEmail } = req.body;
    const requiredEmail = req.body.email;
    try {
        const query = `SELECT Email, Firstname, Lastname, Phone, Address
        FROM Users
        WHERE Email='${requiredEmail}'`;
        await sql.connect(SQLServerConnectionString);
        const response = await sql.query(query);
        sql.close();
        if (response.rowsAffected === 0)
            return res.sendStatus(404);
        const profileData = response.recordset[0];
        return res.status(200).send(profileData);
    } catch (e) {
        sql.close();
        console.log(`[getProfileData|userProfile.js] ${e}`);
        res.sendStatus(500);
    }
});

router.patch('/updateProfile', async (req, res) => {
    const { email, firstname, lastname, phone, address } = req.body;
    try {
        const query = `UPDATE Users
        SET Firstname='${firstname}', Lastname='${lastname}', Phone='${phone}', Address='${address}'
        WHERE Email='${email}'`;
        await sql.connect(SQLServerConnectionString);
        await sql.query(query);
        sql.close();
        res.sendStatus(200);
    } catch (e) {
        sql.close();
        console.log(`[updateProfile|userProfile.js] ${e}`);
        res.sendStatus(500);
    }
});

module.exports = router;