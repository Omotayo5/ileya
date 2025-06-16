const pool = require('./database/db');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const upload = multer({ dest: 'uploads/rentals/' });
const sendEmail = require('../../mailer.js');
require('dotenv').config();

const createRental = async (req, res) => {
    try {
        console.log('--- Received request to create rental ---');
        console.log('Session User:', req.session.user);
        console.log('Request Body:', req.body);
        console.log('Uploaded Files:', req.files);


        const userId = req.session.user.id;

        // Fetch user details from the database
        const [users] = await pool.execute('SELECT full_name, email FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            console.error(`Authentication Error: User with ID ${userId} not found in database.`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const user = users[0];
        const contact_name = user.full_name;
        const contact_email = user.email;

        // Get remaining details from the form
        const {
            propertyTitle,
            rentalPrice,
            state,
            city,
            propertyType,
            bedrooms,
            'features[]': features,
            contact_role,
            contact_phone
        } = req.body;

        // Validate required fields from the form
        if (!propertyTitle || !rentalPrice || !state || !city || !propertyType || !contact_role || !contact_phone) {
            console.error('Validation Error: Missing required fields from form.');
            return res.status(400).json({ success: false, message: 'Please fill out all required fields.' });
        }

        // --- Additional Validations ---
        if (isNaN(rentalPrice) || rentalPrice <= 0) {
            console.error('Validation Error: Invalid rental price.');
            return res.status(400).json({ success: false, message: 'Please enter a valid rental price.' });
        }
        if (!/^\+?\d{10,}$/.test(contact_phone)) {
            console.error('Validation Error: Invalid phone number.');
            return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
        }

        // Handle photo uploads
        let photos = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                        photos = req.files.map(file => file.filename);
        }
        
                const photosJson = JSON.stringify(photos);
                const featuresJson = JSON.stringify(req.body.features || []);

        // --- Database Insertion ---
        const connection = await pool.getConnection();
        try {
            const sql = `
                INSERT INTO rentals (
                    user_id, title, rental_price, state, city, property_type, 
                    bedrooms, features, photos, contact_role, contact_name, 
                    contact_phone, contact_email, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                userId,
                propertyTitle,
                rentalPrice,
                state,
                city,
                propertyType,
                bedrooms || 0,
                featuresJson,
                photosJson,
                contact_role,
                contact_name, // From DB
                contact_phone,
                contact_email, // From DB
                'active'
            ];
            
            console.log('Executing SQL to insert rental...');
            const [result] = await connection.execute(sql, values);
            console.log('SQL query successful. Insert ID:', result.insertId);

                        // Send confirmation email
            const emailData = {
                "[User's Name]": contact_name,
                "[Property Title]": propertyTitle,
                "[Property Location]": `${city}, ${state}`,
                "[Dashboard URL]": `${process.env.BASE_URL}/dashboard.html`,
                "[Website URL]": process.env.BASE_URL
            };

            sendEmail(contact_email, 'Your Property Has Been Listed!', 'property-uploaded.html', emailData)
                .catch(err => console.error(`Error sending property upload email for user ${userId}:`, err)); // Log error, but don't block the user response

            res.status(201).json({ 
                success: true, 
                message: 'Rental property listed successfully!',
                propertyId: result.insertId,
                redirect: 'my-rentals.html' // Add redirect instruction
            });

        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error('--- DATABASE/SERVER ERROR ---');
        console.error('Error object:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    createRental
};
