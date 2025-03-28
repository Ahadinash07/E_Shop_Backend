const mysql = require('mysql2');
const env = require('dotenv');

env.config();

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if(err) 
    console.log(err);
    else
    console.log("Database connected");
});

module.exports = db;