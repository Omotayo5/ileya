const db = require('./database/db');
const sendEmail = require('../../mailer.js');

async function subscriptionHandler(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'You must be logged in to subscribe.' });
    }

    const userId = req.session.userId;

    try {
        // 1. Check for an existing active subscription
        const [existing] = await db.query(
            'SELECT * FROM user_subscriptions WHERE user_id = ? AND status = \'active\' AND end_date > NOW()',
            [userId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'You already have an active subscription.' });
        }

        // 2. Find the plan ID for the 'Premium Access' plan
        const [plans] = await db.query('SELECT id, duration_days FROM subscription_plans WHERE name = ?', ['Premium Access']);
        
        if (plans.length === 0) {
            return res.status(500).json({ success: false, message: 'Subscription plan not found.' });
        }
        const plan = plans[0];

        // 3. (Re)activate subscription record
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.duration_days);

        // Check for existing non-active subscription row for this user/plan
        const [inactiveRows] = await db.query(
            'SELECT id FROM user_subscriptions WHERE user_id = ? AND plan_id = ? AND status <> \"active\" ORDER BY id DESC LIMIT 1',
            [userId, plan.id]
        );

        if (inactiveRows.length > 0) {
            // Update the existing row to inactive
            await db.query(
                'UPDATE user_subscriptions SET start_date = ?, end_date = ? WHERE id = ?',
                [startDate, endDate, inactiveRows[0].id]
            );
        } else {
            // Insert a fresh subscription row
            await db.query(
                'INSERT INTO user_subscriptions (user_id, plan_id, status, start_date, end_date) VALUES (?, ?, \'inactive\', ?, ?)',
                [userId, plan.id, startDate, endDate]
            );
        }

        // 4. Update the user's subscription status
        await db.query('UPDATE users SET subscription_status = \'inactive\' WHERE id = ?', [userId]);

        // Send subscription initiated email
        const [userRows] = await db.query('SELECT full_name, email FROM users WHERE id = ?', [userId]);
        if (userRows.length > 0) {
            const user = userRows[0];
            const emailData = {
                "[User's Name]": user.full_name, // Add other placeholders like [Website URL] if needed
            };
            sendEmail(user.email, 'Subscription Initiated', 'subscription-initiated.html', emailData)
                .catch(err => console.error('Error sending subscription initiated email:', err)); // Log error but don't block response
        }

        res.status(201).json({ success: true, message: 'Subscription initiated. Please complete payment.' });

    } catch (error) {
        console.error('Subscription process failed:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred. Please try again later.' });
    }
}

module.exports = subscriptionHandler;
