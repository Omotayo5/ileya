const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Change this if your MySQL root password is different
    multipleStatements: true
});

const setupSql = `CREATE DATABASE IF NOT EXISTS ileya;
USE ileya;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    rental_price DECIMAL(10,2) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    bedrooms INT DEFAULT 0,
    features JSON,
    photos JSON,
    contact_role VARCHAR(50) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive', 'rented') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_rentals_search ON rentals(
    state,
    city,
    property_type,
    bedrooms,
    status
);

INSERT INTO users (email, password, name) 
VALUES ('admin@ileya.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User');

INSERT INTO rentals (user_id, title, rental_price, state, city, property_type, bedrooms, features, photos, contact_role, contact_name, contact_phone, contact_email, status)
VALUES 
(1, 'Spacious 3-Bedroom Apartment', 1500000, 'Lagos', 'Ikeja', 'apartment', 3, 
    JSON_ARRAY('24/7 Power', 'Security', 'Tiled Floors', 'Parking Space'),
    JSON_ARRAY('uploads/rentals/1.jpg', 'uploads/rentals/2.jpg'),
    'Landlord', 'John Doe', '+2348012345678', 'john@example.com', 'active'),

(1, 'Modern 2-Bedroom House', 1200000, 'Abuja', 'Wuse', 'house', 2, 
    JSON_ARRAY('24/7 Power', 'Security', 'Tiled Floors', 'Running Water'),
    JSON_ARRAY('uploads/rentals/3.jpg', 'uploads/rentals/4.jpg'),
    'Landlord', 'Jane Smith', '+2348098765432', 'jane@example.com', 'active');`;

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL server');
    
    connection.query(setupSql, (err, results) => {
        if (err) {
            console.error('Error executing SQL:', err);
        } else {
            console.log('Database setup completed successfully');
        }
        connection.end();
    });
});
