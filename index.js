const express = require('express');
const nodemon = require('nodemon');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = new express;
const PORT = 3000;
const auth = require('./routes/auth');
const tickets = require('./routes/tickets');
const userProfile = require('./routes/userProfile');
const transactions = require('./routes/transactions');
const categories = require('./routes/categories');
const { verifyToken } = require('./Misc/utils');

const { DBName } = require('./dev-config');

app.use(bodyparser.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:8000'
}));

// UNCOMMENT BELOW app.listen code FOR PROJECT TO WORK IN BROWSER. COMMENT IT TO WORK WITH JEST.

app.listen(PORT, function () {
    console.log(`Server is running on ${PORT}`);
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use('/', auth);

var getCookies = function (request) {
    var cookies = {};
    request.headers && request.headers.cookie.split(';').forEach(function (cookie) {
        var parts = cookie.match(/(.*?)=(.*)$/)
        cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
    return cookies;
};

var verifyTokenMiddleware = function (req, res, next) {
    if (!req.headers.cookie)
        return res.sendStatus(401);
    const token = getCookies(req)['jwt'];
    const decoded = verifyToken(token);
    if (!decoded)
        return res.sendStatus(401);
    if (!req.body.email)
        req.body.email = decoded.email;
    next();
}

app.use(/\/((?!categories).)*/, verifyTokenMiddleware);
app.use('/', categories);
app.use('/', tickets);
app.use('/', userProfile);
app.use('/', transactions);

//#region sql example

// const sql = require('mssql');

// const config = {
//     user: 'sa',
//     password: 'Svk2432k01',
//     server: 'DESKTOP-VBR6T2V\\SQLEXPRESS',
//     database: 'PC_Consultancy',
//     port: 1433
// };

// sql.connect('Server=DESKTOP-VBR6T2V\\SQLEXPRESS;Database=PC_Consultancy;User Id=sa;Password=Svk2432k01;', function(err) {
//     if (err) console.log(`${err}`);

//     let sqlReq = new sql.Request();

//     let sqlQuery = `SELECT * FROM Profile`;
//     // let sqlQuery = `CREATE TABLE Profile (
//     //     firstName nvarchar(50) not null,
//     //     lastName nvarchar(50)
//     // )`;

//     sqlReq.query(sqlQuery, function(err, data) {
//         if (err) console.log(`${err}`);

//         console.log(`${data}`);
//         console.log(`${data.rowsAffected}`);
//         console.log(`${data.output}`);

//         sql.close();
//     })
// })

//#endregion sql example
module.exports = app;