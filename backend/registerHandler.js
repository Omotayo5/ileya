// c:\Users\USER\Documents\Ileya\ileya-app\backend\registerHandler.js
const bcrypt = require('bcrypt');
const pool = require('./database/db'); // Assuming db.js is in the same directory
const { sendEmail } = require('./mailer');

const SALT_ROUNDS = 10;

async function handleRegistration(req, res) {
    const { fullName, email, password, confirmPassword } = req.body;

    console.log('Registration attempt received for email:', email);

    // Basic validation (server-side)
    const errors = [];
    if (!fullName || fullName.trim() === '') {
        errors.push('Full name is required.');
    }
    if (!email || email.trim() === '') {
        errors.push('Email is required.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push('Email is invalid.');
    }
    if (!password) {
        errors.push('Password is required.');
    }
    if (password !== confirmPassword) {
        errors.push('Passwords do not match.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors: errors, message: 'Validation failed. Please check the errors.' });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                success: false, 
                errors: ['Email already registered.'], 
                message: 'This email address is already registered. Please login or use a different email.' 
            });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert new user into the database
        const insertQuery = 'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)';
        const [result] = await pool.execute(insertQuery, [fullName, email, passwordHash]);
        const newUserId = result.insertId;

        console.log('User registered successfully:', { id: newUserId, email: email });

        // Create a default inactive subscription
        try {
            const [plans] = await pool.execute('SELECT id, duration_days FROM subscription_plans WHERE name = "Premium Access" LIMIT 1');
            if (plans.length > 0) {
                const plan = plans[0];
                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(startDate.getDate() + plan.duration_days);

                await pool.execute(
                    'INSERT INTO user_subscriptions (user_id, plan_id, status, start_date, end_date) VALUES (?, ?, \'inactive\', ?, ?)',
                    [newUserId, plan.id, startDate, endDate]
                );
            }
        } catch (subError) {
            console.error('Failed to create default subscription for user:', newUserId, subError);
            // This is a non-critical error for the user's registration flow
        }

        // Send welcome email
        try {
            await sendEmail(
                email,
                'Welcome to Ileya!',
                'welcome-email.html',
                { '[User\'s Name]': fullName }
            );
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Non-critical error, so we don't block the user registration.
            // In a production environment, you might log this to a dedicated service.
        }

        // Respond with success
        res.status(201).json({
            success: true,
            message: 'Account created successfully! You can now login.',
            redirect: 'login.html' // Or wherever you want to redirect after successful registration
        });

    } catch (error) {
        console.error('Error during registration:', error);
        // Check for specific MySQL errors if needed, e.g., error.code === 'ER_DUP_ENTRY'
        res.status(500).json({ 
            success: false, 
            errors: ['An unexpected error occurred on the server.'], 
            message: 'Registration failed due to a server error. Please try again later.' 
        });
    }
}

module.exports = { handleRegistration };

