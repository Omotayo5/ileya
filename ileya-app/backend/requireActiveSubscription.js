const db = require('./database/db');

async function requireActiveSubscription(req, res, next) {
    // Ensure user is logged in first. A separate `requireLogin` middleware should ideally handle this.
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'You must be logged in.' });
    }

    const userId = req.session.userId;

    try {
        // Check for an active subscription using the same logic as getSubscriptionStatus
        const [rows] = await db.query(
            'SELECT 1 FROM user_subscriptions WHERE user_id = ? AND status = ? AND end_date > NOW()',
            [userId, 'active']
        );

        if (rows.length === 0) {
            // No active subscription found
            return res.status(403).json({ 
                success: false, 
                message: 'An active subscription is required to access this feature.' 
            });
        }

        // User has an active subscription, proceed to the requested route
        next();
    } catch (error) {
        console.error('Error in requireActiveSubscription middleware:', error);
        res.status(500).json({ success: false, message: 'An error occurred while verifying your subscription status.' });
    }
}

module.exports = requireActiveSubscription;
