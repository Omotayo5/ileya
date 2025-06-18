// c:\Users\USER\Documents\Ileya\ileya-app\backend\db.js
const mysql = require('mysql2');

// Create a connection pool
// IMPORTANT: In a production environment, use environment variables for these settings.
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '', // No password as specified
  database: 'ileya_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection (optional, but good for diagnostics)
/*
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
    return;
  }
  if (connection) {
    connection.release();
    console.log('Successfully connected to the MySQL database.');
  }
});
*/

// Promisify the pool query method
const promisePool = pool.promise();

// Export the promise-wrapped pool as the main export for handlers
module.exports = promisePool;

// Also export the raw pool for graceful shutdown in server.js
module.exports.pool = pool;
