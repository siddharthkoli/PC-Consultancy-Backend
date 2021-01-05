require('dotenv').config();
module.exports = {
    connectionString: process.env.DB_CONNECTION_STRING,
    DBName: process.env.DB_NAME
}