const mysql = require('mysql2');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'login_db'
});

// Export the pool to be used in other files
module.exports = pool.promise();
