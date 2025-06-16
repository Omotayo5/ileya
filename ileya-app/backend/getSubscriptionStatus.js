const db = require('./database/db');

async function getSubscriptionStatus(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'You must be logged in to view subscription status.' });
    }

    const userId = req.session.userId;

    try {
        // Check for an active subscription
        const [rows] = await db.query(
            'SELECT * FROM user_subscriptions WHERE user_id = ? AND status = ? AND end_date > NOW()',
            [userId, 'active']
        );

        const isActive = rows.length > 0;
        res.status(200).json({ success: true, isActive });
    } catch (error) {
        console.error('Error checking subscription status:', error);
        res.status(500).json({ success: false, message: 'An error occurred while checking subscription status.' });
    }
}

module.exports = getSubscriptionStatus;
