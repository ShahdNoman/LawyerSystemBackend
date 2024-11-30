
const mysql = require('mysql2');
const hostname = 'localhost';
const username = 'root';
const password = '';
const database = 'lawyersystem'; // Replace with your actual database name

// Function to establish database connection
function dbConnection() {
    const con = mysql.createConnection({
        host: hostname,
        user: username,
        password: password,
        database: database
    });

    // Attempt to connect
    con.connect(function(err) {
        if (err) {
            // If the connection fails, stop execution and return an error message
            console.error('Database connection failed: ' + err.stack);
            return { success: 'false', message: 'Database connection failed: ' + err.stack };
        }
        console.log('Connected to the database');
    });

    return con; 
}

module.exports = dbConnection;