
// const mysql = require('mysql2');
// const hostname = 'localhost';
// const username = 'root';
// const password = '';
// const database = 'lawyersystemnew'; 

// function dbConnection() {
//     const con = mysql.createConnection({
//         host: hostname,
//         user: username,
//         password: password,
//         database: database
//     });

//     con.connect(function(err) {
//         if (err) {
//             console.error('Database connection failed: ' + err.stack);
//             return { success: 'false', message: 'Database connection failed: ' + err.stack };
//         }
//         console.log('Connected to the database');
//     });

//     return con; 
// }

// module.exports = dbConnection;
const mysql = require('mysql2');

// Database credentials
const hostname = 'localhost';
const username = 'root';
const password = '';
const database = 'lawyersystemnew';

// Create a connection to the database using the mysql2 promise-based API
function dbConnection() {
    // Create a connection pool for better handling of connections
    const pool = mysql.createPool({
        host: hostname,
        user: username,
        password: password,
        database: database
    });

    // Return the promise-based version of the connection pool
   // const promisePool = pool.promise();

    // Test the connection
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return { success: 'false', message: 'Database connection failed: ' + err.stack };
        }
        if (connection) connection.release();
        console.log('Connected to the database');
    });

    return pool;
}

module.exports = dbConnection;


