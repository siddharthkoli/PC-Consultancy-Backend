require('dotenv').config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcrypt');
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

router.patch('/updatePassword', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    try {
        let query = `SELECT Password FROM Users WHERE Email='${email}'`;
        await sql.connect(SQLServerConnectionString);
        let result = await sql.query(query);
        if (result.recordset.length === 0)
            return res.sendStatus(401);
        const match = await bcrypt.compare(oldPassword, result.recordset[0].Password);
        if (match) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log(`[userProfile|updatePassword (1st log)] ${err}`);
                    return res.sendStatus(500);
                }
                bcrypt.hash(newPassword, salt, async (err, hash) => {
                    if (err) {
                        console.log(`[userProfile|updatePassword (2st log)] ${err}`);
                        return res.sendStatus(500);
                    }
                    query = `UPDATE Users
                    SET Password='${hash}'
                    WHERE Email='${email}'`;
                    await sql.query(query);
                    sql.close();
                    return res.sendStatus(200);
                });
            });
        }
    } catch (e) {
        sql.close();
        console.log(`[userProfile.js|updatePassword (3rd log)] ${err}`);
        res.sendStatus(500);
    }
});

module.exports = router;