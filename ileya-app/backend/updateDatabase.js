const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Change this if your MySQL root password is different
    database: 'ileya', // Assume database already exists
    multipleStatements: true
};

async function updateDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to `ileya` database for update.');

        const subSqlPath = path.join(__dirname, 'database', 'sub.sql');

        console.log('Executing sub.sql to apply subscription schema...');
        const subSql = await fs.readFile(subSqlPath, 'utf-8');
        await connection.query(subSql);
        console.log('Successfully executed sub.sql.');

        console.log('\nDatabase update complete!');

    } catch (error) {
        console.error('An error occurred during database update:', error);
        console.log('Please ensure your MySQL server is running and the `ileya` database has been created by running the original setup script first.');
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

updateDatabase();
