
const mysql = require('mysql2');
const hostname = 'localhost';
const username = 'root';
const password = '';
const database = 'lawyersystemnew'; 

function dbConnection() {
    const con = mysql.createConnection({
        host: hostname,
        user: username,
        password: password,
        database: database
    });

    con.connect(function(err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return { success: 'false', message: 'Database connection failed: ' + err.stack };
        }
        console.log('Connected to the database');
    });

    return con; 
}

module.exports = dbConnection;
