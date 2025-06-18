const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('./database/db');
const { sendEmail } = require('./mailer');

const SALT_ROUNDS = 10;

async function handleForgotPassword(req, res) {
    const { email } = req.body;

    try {
        // Find user by email
        const [users] = await pool.execute('SELECT id, email, full_name FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            // Respond with a generic message to prevent email enumeration
            return res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        const user = users[0];

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // Store token and expiry in the database
        await pool.execute('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [token, expires, user.id]);

        // Create reset link
        const resetLink = `http://${req.headers.host}/reset-password.html?token=${token}`;

        // Send the password reset email
        await sendEmail(
            user.email,
            'Reset Your Ileya Password',
            'password-reset.html',
            {
                '[User\'s Name]': user.full_name,
                '[Password Reset Link]': resetLink
            }
        );

        res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('Error in forgot password handler:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}

async function handleResetPassword(req, res) {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    try {
        // Find user by token and check if it's not expired
        const [users] = await pool.execute('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
        }
        const user = users[0];

        // Hash the new password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Update the user's password and clear the reset token
        await pool.execute('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [passwordHash, user.id]);

        // Optionally, send a confirmation email
        // await sendEmail(user.email, 'Your Password Has Been Changed', ...);

        res.status(200).json({ success: true, message: 'Your password has been successfully reset. You can now login.' });

    } catch (error) {
        console.error('Error in reset password handler:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}

module.exports = { handleForgotPassword, handleResetPassword };
