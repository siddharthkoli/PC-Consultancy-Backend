require('dotenv').config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectionString } = require('../dev-config');
const jwt = require('jsonwebtoken');
const { HandleEscapeCharacters, RandomIdGenerator, verifyToken } = require('../Misc/utils');
const SQLServerConnectionString = connectionString;

router.post('/createTicket', async (req, res) => {
    if (req.body.issueDesc === null
        || req.body.id === null
        || req.body.email === null)
        return res.sendStatus(500);
    try {
        const issueId = RandomIdGenerator();
        const issueDesc = HandleEscapeCharacters(req.body.issueDesc);
        let query = `SELECT Email
            FROM Users WHERE Email='${req.body.email}'`;
        await sql.connect(SQLServerConnectionString);
        const emailFound = await sql.query(query);
        if (emailFound.rowsAffected === 0)
            return res.sendStatus(500);
        query = `SELECT Id
        FROM Categories WHERE Id=${req.body.id}`;
        const idFound = await sql.query(query);
        if (idFound.rowsAffected === 0)
            return res.sendStatus(500);
        query = `
            INSERT INTO Tickets (IssueId, Email, IssueDesc, IssueType)
            VALUES ('${issueId}', '${req.body.email}', '${issueDesc}', '${req.body.id}')
            `;
        // await sql.connect(SQLServerConnectionString);
        const result = await sql.query(query);
        sql.close();
        if (result.rowsAffected === 0)
            return res.sendStatus(500);
        return res.status(201).send({ id: issueId });
    } catch (e) {
        sql.close();
        console.log(`[routes.js|createIssue] ${e}`);
        res.sendStatus(500);
    }
});

router.get('/tickets', async (req, res) => {
    const email = req.body.email;
    // const email='ssaa';
    const IssueId = req.query.id || '';        // use req.params for urls having ':' in them
    const IssueStatus = req.query.status || ''; // for urls with '?' use req.params
    const IssueType = req.query.type || '';
    // const IssueDate = req.query.date || '';
    try {
        const query = `SELECT IssueId, Email, IssueDesc, IssueDate, IssueStatus, ETA, IssueType, Rating, Review 
        FROM Tickets
        WHERE Email='${email}'
        AND IssueId like '%${IssueId}%'
        AND IssueStatus like '%${IssueStatus}%'
        AND IssueType like '%${IssueType}%'
        `;
        await sql.connect(SQLServerConnectionString);
        const response = await sql.query(query);
        sql.close();
        res.send({ tickets: response.recordset });
    } catch (e) {
        sql.close();
        console.log(`[tickets|tickets.js] ${e}`);
        res.sendStatus(400);
    }
});

router.post('/testverify', async (req, res) => {
    try {
        // const decoded = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY);
        const { email } = req.body;
        console.log(`em ${email}`);
        res.send({email});
    } catch (e) {
        res.status(401).send('Invalid Token');
    }
});

router.patch('/updateTicket', async (req, res) => {
    const { email, issueDesc, issueId } = req.body;
    try {
        const query = `UPDATE Tickets
        SET IssueDesc='${issueDesc}'
        WHERE Email='${email}' AND IssueId='${issueId}'`;
        await sql.connect(SQLServerConnectionString);
        await sql.query(query);
        sql.close();
        res.sendStatus(200);
    } catch (e) {
        console.log(`[updateTicket|tickets.js] ${e}`);
        sql.close();
        res.sendStatus(500);
    }
});

router.delete('/deleteTicket', async (req, res) => { // until approved
    const { email, issueId } = req.body;
    try {
        const query = `DELETE FROM Tickets WHERE Email='${email}' AND IssueId='${issueId}'`;
        await sql.connect(SQLServerConnectionString);
        const response = await sql.query(query);
        sql.close();
        if (response.rowsAffected === 0)
            return res.sendStatus(500);
        res.sendStatus(200);
    } catch (e) {
        console.log(`[deleteTicket|tickets.js] ${e}`);
        sql.close();
        res.sendStatus(500);
    }
});

module.exports = router;