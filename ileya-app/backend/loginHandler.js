// c:\Users\USER\Documents\Ileya\ileya-app\backend\loginHandler.js
const bcrypt = require('bcrypt');
const pool = require('./database/db'); // Your database connection pool
const { sendEmail } = require('../../mailer');

async function handleLogin(req, res) {
    const { email, password, rememberMe } = req.body;

    console.log('Login attempt received for email:', email);

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
        });
    }

    try {
        // Find the user by email
        const [users] = await pool.execute('SELECT id, email, password_hash, full_name FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.' // Generic message for security
            });
        }

        const user = users[0];

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.' // Generic message
            });
        }

        // Login successful
        // For now, just send a success message.
        // In a real app, you would typically create a session or JWT here.
        console.log('User logged in successfully:', { id: user.id, email: user.email });
        // On successful password verification, save user data to session
        req.session.user = {
            id: user.id,
            email: user.email,
            fullName: user.full_name
        };
                req.session.userId = user.id;

        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.expires = false;
        }

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ success: false, message: 'Failed to save session.' });
            }

            // Send login notification email asynchronously
            sendEmail(
                user.email,
                'Security Alert: New Login to Your Ileya Account',
                'login-notification.html',
                {
                    '[User\'s Name]': user.full_name,
                    '[Login Time]': new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }),
                    '[Login IP Address]': req.ip
                }
            ).catch(emailError => {
                // Log error but don't block login
                console.error('Failed to send login notification email:', emailError);
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful!',
                user: req.session.user,
                redirect: 'member-properties.html'
            });
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed due to a server error. Please try again later.'
        });
    }
}

module.exports = { handleLogin };
