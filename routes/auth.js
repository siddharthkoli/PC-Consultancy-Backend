require('dotenv').config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcrypt')
const { connectionString } = require('../dev-config');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../Misc/utils');
const { sendSignupMail } = require('../Misc/Mail');
const SQLServerConnectionString = connectionString;

router.post('/signup', async (req, res) => {
    if (req.body.email == null
        || req.body.password == null
        || req.body.firstname == null
        || req.body.phone == null) { return res.sendStatus(500); }
    try {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(`[routes|signup] ${err}`);
                return res.sendStatus(500);
            }
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) {
                    console.log(`[routes|signup] ${err}`);
                    return res.sendStatus(500);
                }
                const query = `INSERT INTO Users (Firstname, Lastname, Phone, Password, Email, Address)
                VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.phone}', '${hash}', '${req.body.email}', '${req.body.address}')`
                await sql.connect(SQLServerConnectionString);
                await sql.query(query);
                sql.close();
                const token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.SECRET_KEY, { expiresIn: "30 days" });
                let future = new Date();
                future.setDate(future.getDate() + 30);
                res.cookie("jwt", token, { secure: true, httpOnly: true, sameSite: "none", expires: future }) // set secure to true when using https connection. Expires param is required so that cookie is saved even when the session is closed.
                sendSignupMail(req.body.email);
                return res.status(201).send();
            })
        });
    } catch (e) {
        sql.close();
        console.log(`[auth.js|signup] ${e}`);
        res.sendStatus(500);
    }
});

router.post('/testsign', async (req, res) => {
    const token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.SECRET_KEY, { expiresIn: "30 days" });
    res.cookie("jwt", token, { secure: true, httpOnly: true, sameSite: "none" }) // set secure to true when using https connection
    res.send();
    // res.status(200).send({ token: token });
});

router.get('/sendMail', async(req, res) => {
    // await sendMail();
    sendSignupMail(['siddharthkoli2401@gmail.com']);
    res.send();
});

router.post('/login', async (req, res) => {
    try {
        if (req.body.email == null || req.body.password == null)
            return res.sendStatus(500);
        const query = `SELECT Password FROM Users
        WHERE Email='${req.body.email}';`;
        await sql.connect(SQLServerConnectionString);
        const result = await sql.query(query);
        sql.close();
        if (result.recordset.length === 0)
            return res.sendStatus(401);
        const userPassword = result.recordset[0].Password;
        const match = await bcrypt.compare(req.body.password, userPassword);
        if (match) {
            const token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.SECRET_KEY, { expiresIn: "30 days" });
            let future = new Date();
            future.setDate(future.getDate() + 30); // 30 days later. Same as jwt expiry.
            res.cookie("jwt", token, { secure: true, httpOnly: true, sameSite: "none", expires: future }) // set secure to true when using https connection. Expires param is required so that cookie is saved even when the session is closed.
            return res.send();
        }
        res.sendStatus(401);
    } catch (e) {
        sql.close();
        console.log(`[routes.js|login] ${e}`);
        res.sendStatus(500);
    }
});

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('jwt', { secure: true, httpOnly: true, sameSite: "none" });
        return res.send();
    } catch (e) {
        console.log(`[logout|routes.js] ${e}`);
        res.sendStatus(500);
    }
});

module.exports = router;