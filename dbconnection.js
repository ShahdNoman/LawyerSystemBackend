
// const mysql = require('mysql2');
// const hostname = 'localhost';
// const username = 'root';
// const password = '';
// const database = 'lawyersystemnew';

// function dbConnection() {
//     const pool = mysql.createPool({
//         host: hostname,
//         user: username,
//         password: password,
//         database: database
//     });

//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Database connection failed: ' + err.stack);
//             return { success: 'false', message: 'Database connection failed: ' + err.stack };
//         }
//         if (connection) connection.release();
//         console.log('Connected to the database');
//     });

//     return pool;
// }

// module.exports = dbConnection;

const mysql = require('mysql2');
const hostname = 'localhost';
const username = 'root';
const password = '';
const database = 'lawyersystemnew';

function dbConnection() {
    const pool = mysql.createPool({
        host: hostname,
        user: username,
        password: password,
        database: database,
        waitForConnections: true, // Wait if all connections are in use
        connectionLimit: 10, // Limit the number of connections in the pool
        queueLimit: 0, // No limit on queued requests
    });

    console.log('Database connection pool created');

    return pool;
}

module.exports = dbConnection;

